import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AdminApiKeyGuard } from "../../common/guards/admin-api-key.guard";
import type { Request } from "express";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CreateLandingOrderDto } from "./dto/create-landing-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@Controller("api/orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Tighter limit than the global default — this is the one endpoint that
  // triggers a real Shopify order.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.ordersService.create(dto);
    return { success: true, order };
  }

  // Ad landing pages (storefront /lp/*): offer id + name/phone/city only.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("landing")
  async createLanding(@Body() dto: CreateLandingOrderDto, @Req() req: Request) {
    const forwarded = req.headers["x-forwarded-for"];
    const clientIp =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim() || req.ip;
    const order = await this.ordersService.createLanding(dto, {
      clientIp,
      userAgent: req.headers["user-agent"],
    });
    return { success: true, order };
  }

  @Get(":id/confirmation")
  async getConfirmation(@Param("id", ParseUUIDPipe) id: string) {
    return this.ordersService.findConfirmation(id);
  }

  @UseGuards(AdminApiKeyGuard)
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AdminApiKeyGuard)
  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(AdminApiKeyGuard)
  @Patch(":id/status")
  async updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
