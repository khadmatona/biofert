import { BadRequestException, ServiceUnavailableException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { AdminProductVariant } from "../shopify/shopify.types";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderStatus } from "./enums/order-status.enum";
import { OrdersService } from "./orders.service";

function makeVariant(overrides: Partial<AdminProductVariant> = {}): AdminProductVariant {
  return {
    id: "gid://shopify/ProductVariant/1",
    title: "1L",
    sku: "BFM-1L",
    availableForSale: true,
    inventoryPolicy: "DENY",
    inventoryQuantity: 10,
    price: "199.00",
    image: null,
    product: { id: "gid://shopify/Product/1", title: "Biofertilizer", status: "ACTIVE" },
    ...overrides,
  };
}

function makeDto(overrides: Partial<CreateOrderDto> = {}): CreateOrderDto {
  return {
    items: [{ variantId: "gid://shopify/ProductVariant/1", quantity: 2 }],
    customer: { firstName: "John", lastName: "Doe", phone: "+212600000000", email: "john@example.com" },
    shippingAddress: { address1: "123 Example Street", city: "Marrakech", province: "MA-MAR", country: "MA" },
    idempotencyKey: "11111111-1111-1111-1111-111111111111",
    ...overrides,
  } as CreateOrderDto;
}

describe("OrdersService", () => {
  let prisma: {
    order: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      findMany: jest.Mock;
    };
  };
  let shopify: { getVariants: jest.Mock; createOrder: jest.Mock };
  let service: OrdersService;

  beforeEach(() => {
    prisma = {
      order: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
      },
    };
    shopify = { getVariants: jest.fn(), createOrder: jest.fn() };
    service = new OrdersService(prisma as any, shopify as any);
  });

  it("creates a local order and a Shopify order for a valid cart", async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    shopify.getVariants.mockResolvedValue(new Map([["gid://shopify/ProductVariant/1", makeVariant()]]));
    const createdOrder = {
      id: "order-1",
      status: OrderStatus.PENDING_CONFIRMATION,
      shopifyOrderId: null,
      shopifyOrderName: null,
    };
    prisma.order.create.mockResolvedValue(createdOrder);
    shopify.createOrder.mockResolvedValue({ orderId: "gid://shopify/Order/1", orderName: "#1001" });
    prisma.order.update.mockResolvedValue({
      ...createdOrder,
      shopifyOrderId: "gid://shopify/Order/1",
      shopifyOrderName: "#1001",
    });

    const result = await service.create(makeDto());

    expect(shopify.createOrder).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(OrderStatus.PENDING_CONFIRMATION);
    expect(result.orderNumber).toBe("#1001");
  });

  it("rejects an order that references an unknown variant, without touching Shopify order creation", async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    shopify.getVariants.mockResolvedValue(new Map());

    await expect(service.create(makeDto())).rejects.toBeInstanceOf(BadRequestException);
    expect(shopify.createOrder).not.toHaveBeenCalled();
    expect(prisma.order.create).not.toHaveBeenCalled();
  });

  it("rejects a local-format phone number before ever calling Shopify, and normalizes valid ones", async () => {
    prisma.order.findUnique.mockResolvedValue(null);

    await expect(
      service.create(makeDto({ customer: { firstName: "John", lastName: "Doe", phone: "abc" } }))
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(shopify.getVariants).not.toHaveBeenCalled();

    shopify.getVariants.mockResolvedValue(new Map([["gid://shopify/ProductVariant/1", makeVariant()]]));
    prisma.order.create.mockImplementation(({ data }: { data: Prisma.OrderCreateInput }) =>
      Promise.resolve({ id: "order-1", ...data })
    );
    shopify.createOrder.mockResolvedValue({ orderId: "gid://shopify/Order/1", orderName: "#1001" });
    prisma.order.update.mockImplementation(({ data }) =>
      Promise.resolve({ id: "order-1", status: OrderStatus.PENDING_CONFIRMATION, ...data })
    );

    await service.create(
      makeDto({
        idempotencyKey: "22222222-2222-2222-2222-222222222222",
        customer: { firstName: "John", lastName: "Doe", phone: "06 00 00 00 00" },
      })
    );
    expect(shopify.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({ customer: expect.objectContaining({ phone: "+212600000000" }) })
    );
  });

  it("ignores any client-sent price and computes the total from Shopify's price", async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    // Shopify says 199.00, regardless of whatever the (nonexistent) price
    // field on the DTO would have said — the DTO doesn't even have one.
    shopify.getVariants.mockResolvedValue(
      new Map([["gid://shopify/ProductVariant/1", makeVariant({ price: "199.00" })]])
    );
    prisma.order.create.mockImplementation(({ data }: { data: Prisma.OrderCreateInput }) =>
      Promise.resolve({ id: "order-1", ...data })
    );
    shopify.createOrder.mockResolvedValue({ orderId: "gid://shopify/Order/1", orderName: "#1001" });
    prisma.order.update.mockImplementation(({ data }) =>
      Promise.resolve({ id: "order-1", status: OrderStatus.PENDING_CONFIRMATION, ...data })
    );

    await service.create(makeDto({ items: [{ variantId: "gid://shopify/ProductVariant/1", quantity: 2 }] }));

    const createCallData = prisma.order.create.mock.calls[0][0].data;
    expect(createCallData.total.toString()).toBe("398"); // 199.00 * 2, never client-supplied
  });

  it("returns the existing order instead of creating a second Shopify order for a repeated idempotency key", async () => {
    const existing = {
      id: "order-1",
      status: OrderStatus.PENDING_CONFIRMATION,
      shopifyOrderId: "gid://shopify/Order/1",
      shopifyOrderName: "#1001",
    };
    prisma.order.findUnique.mockResolvedValue(existing);

    const result = await service.create(makeDto());

    expect(shopify.getVariants).not.toHaveBeenCalled();
    expect(shopify.createOrder).not.toHaveBeenCalled();
    expect(result.orderNumber).toBe("#1001");
  });

  it("does not leave a local order behind if Shopify order creation fails", async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    shopify.getVariants.mockResolvedValue(new Map([["gid://shopify/ProductVariant/1", makeVariant()]]));
    prisma.order.create.mockResolvedValue({ id: "order-1", status: OrderStatus.PENDING_CONFIRMATION });
    shopify.createOrder.mockRejectedValue(new Error("Shopify is down"));
    prisma.order.delete.mockResolvedValue({});

    await expect(service.create(makeDto())).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id: "order-1" } });
  });

  it("rejects an order when the variant doesn't have enough inventory", async () => {
    prisma.order.findUnique.mockResolvedValue(null);
    shopify.getVariants.mockResolvedValue(
      new Map([
        [
          "gid://shopify/ProductVariant/1",
          makeVariant({ inventoryPolicy: "DENY", inventoryQuantity: 1 }),
        ],
      ])
    );

    await expect(
      service.create(makeDto({ items: [{ variantId: "gid://shopify/ProductVariant/1", quantity: 2 }] }))
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(shopify.createOrder).not.toHaveBeenCalled();
    expect(prisma.order.create).not.toHaveBeenCalled();
  });
});
