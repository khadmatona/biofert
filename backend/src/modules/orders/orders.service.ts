import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Prisma, Order as PrismaOrder } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { ShopifyService } from "../shopify/shopify.service";
import type { AdminProductVariant } from "../shopify/shopify.types";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { ALLOWED_STATUS_TRANSITIONS, OrderStatus } from "./enums/order-status.enum";
import { isValidPhone, normalizeMoroccanPhone } from "./phone.util";

const ORDER_TAGS = ["custom-checkout", "cash-on-delivery", "pending-confirmation"];

/** Unique constraint violation — see backend/prisma/schema.prisma. */
const PRISMA_UNIQUE_CONSTRAINT = "P2002";

export interface CreateOrderResult {
  id: string;
  shopifyOrderId: string | null;
  orderNumber: string | null;
  status: OrderStatus;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly shopify: ShopifyService
  ) {}

  async create(dto: CreateOrderDto): Promise<CreateOrderResult> {
    const existing = await this.prisma.order.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });
    if (existing) {
      this.logger.log(`Idempotent replay for key ${dto.idempotencyKey} -> order ${existing.id}`);
      return this.toCreateResult(existing);
    }

    // Shopify's orderCreate rejects non-E.164 phone numbers outright — catch
    // that here as a clean, actionable 400 instead of letting it surface as
    // an opaque "try again" from the Shopify call further down, which would
    // never actually succeed on retry since the input itself is the problem.
    const normalizedPhone = normalizeMoroccanPhone(dto.customer.phone);
    if (!isValidPhone(normalizedPhone)) {
      throw new BadRequestException("Please enter a valid phone number.");
    }

    // --- Authoritative Shopify lookup: never trust anything money-shaped
    // the client sent. ------------------------------------------------------
    const variantIds = [...new Set(dto.items.map((i) => i.variantId))];
    const variants = await this.shopify.getVariants(variantIds);

    const resolvedItems = dto.items.map((item) => {
      const variant = variants.get(item.variantId);
      if (!variant) {
        throw new BadRequestException(`Product variant ${item.variantId} does not exist.`);
      }
      this.assertPurchasable(variant, item.quantity);
      const unitPrice = new Prisma.Decimal(variant.price);
      return {
        item,
        variant,
        unitPrice,
        totalPrice: unitPrice.mul(item.quantity),
      };
    });

    const subtotal = resolvedItems.reduce(
      (sum, r) => sum.add(r.totalPrice),
      new Prisma.Decimal(0)
    );
    const shippingAmount = new Prisma.Decimal(0);
    const total = subtotal.add(shippingAmount);
    const currency = "MAD";

    // --- Persist locally first, as pending_confirmation. --------------------
    let order: PrismaOrder;
    try {
      order = await this.prisma.order.create({
        data: {
          idempotencyKey: dto.idempotencyKey,
          status: OrderStatus.PENDING_CONFIRMATION,
          customerFirstName: dto.customer.firstName,
          customerLastName: dto.customer.lastName,
          customerEmail: dto.customer.email,
          customerPhone: normalizedPhone,
          shippingAddress: dto.shippingAddress as unknown as Prisma.InputJsonValue,
          subtotal,
          shippingAmount,
          total,
          currency,
          notes: dto.notes,
          items: {
            create: resolvedItems.map((r) => ({
              shopifyProductId: r.variant.product.id,
              shopifyVariantId: r.variant.id,
              productTitle: r.variant.product.title,
              variantTitle: r.variant.title,
              sku: r.variant.sku,
              quantity: r.item.quantity,
              unitPrice: r.unitPrice,
              totalPrice: r.totalPrice,
            })),
          },
        },
      });
    } catch (err) {
      // Two double-clicks racing past the findUnique check above both try
      // to insert the same idempotencyKey — the DB's unique constraint is
      // the real guard; fall back to returning the winner's order.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === PRISMA_UNIQUE_CONSTRAINT) {
        const winner = await this.prisma.order.findUnique({
          where: { idempotencyKey: dto.idempotencyKey },
        });
        if (winner) return this.toCreateResult(winner);
      }
      throw err;
    }

    // --- Create the real Shopify order. On any failure, don't leave a
    // local order behind that was never actually placed. --------------------
    try {
      const shopifyOrder = await this.shopify.createOrder({
        lineItems: resolvedItems.map((r) => ({
          variantId: r.variant.id,
          quantity: r.item.quantity,
        })),
        customer: {
          email: dto.customer.email,
          phone: normalizedPhone,
          firstName: dto.customer.firstName,
          lastName: dto.customer.lastName,
        },
        shippingAddress: dto.shippingAddress,
        note: dto.notes,
        tags: ORDER_TAGS,
      });

      order = await this.prisma.order.update({
        where: { id: order.id },
        data: { shopifyOrderId: shopifyOrder.orderId, shopifyOrderName: shopifyOrder.orderName },
      });
    } catch (err) {
      this.logger.error(
        `Shopify order creation failed for local order ${order.id}: ${err instanceof Error ? err.message : err}`
      );
      await this.prisma.order.delete({ where: { id: order.id } }).catch((cleanupErr) => {
        this.logger.error(`Failed to roll back local order ${order.id}`, cleanupErr);
      });
      throw new ServiceUnavailableException(
        "We couldn't place your order right now. Please try again."
      );
    }

    return this.toCreateResult(order);
  }

  private assertPurchasable(variant: AdminProductVariant, quantity: number): void {
    if (variant.product.status !== "ACTIVE") {
      throw new BadRequestException(`Product "${variant.product.title}" is not available.`);
    }
    // availableForSale is Shopify's own authoritative "can this be sold"
    // signal — it already accounts for inventoryPolicy (DENY vs CONTINUE)
    // and whether the variant is inventory-tracked at all, so it's trusted
    // over re-deriving that from inventoryQuantity ourselves.
    if (!variant.availableForSale) {
      throw new BadRequestException(`"${variant.product.title}" (${variant.title}) is out of stock.`);
    }
    // Catches "ordering more units than are in stock" — availableForSale
    // alone is binary and doesn't consider the requested quantity. Only
    // enforced when Shopify reports a sane (non-negative) tracked quantity;
    // untracked variants report values like -1 and stay availableForSale.
    if (
      variant.inventoryPolicy === "DENY" &&
      variant.inventoryQuantity !== null &&
      variant.inventoryQuantity >= 0 &&
      variant.inventoryQuantity < quantity
    ) {
      throw new BadRequestException(
        `Only ${variant.inventoryQuantity} unit(s) of "${variant.product.title}" (${variant.title}) are available.`
      );
    }
  }

  private toCreateResult(order: PrismaOrder): CreateOrderResult {
    return {
      id: order.id,
      shopifyOrderId: order.shopifyOrderId,
      orderNumber: order.shopifyOrderName,
      status: order.status as OrderStatus,
    };
  }

  async findAll(): Promise<PrismaOrder[]> {
    return this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string): Promise<PrismaOrder> {
    const order = await this.prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) throw new NotFoundException("Order not found.");
    return order;
  }

  /** Minimal, non-sensitive fields for the public order-success page. */
  async findConfirmation(id: string): Promise<{ orderNumber: string | null; status: OrderStatus }> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { shopifyOrderName: true, status: true },
    });
    if (!order) throw new NotFoundException("Order not found.");
    return { orderNumber: order.shopifyOrderName, status: order.status as OrderStatus };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<PrismaOrder> {
    const order = await this.findOne(id);
    const current = order.status as OrderStatus;
    const allowed = ALLOWED_STATUS_TRANSITIONS[current];
    if (!allowed.includes(dto.status)) {
      throw new ConflictException(`Cannot move order from "${current}" to "${dto.status}".`);
    }
    return this.prisma.order.update({ where: { id }, data: { status: dto.status } });
  }
}
