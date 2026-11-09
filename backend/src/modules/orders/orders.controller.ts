import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AdminApiKeyGuard } from "../../common/guards/admin-api-key.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
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
