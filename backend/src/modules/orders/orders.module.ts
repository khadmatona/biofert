import { Module } from "@nestjs/common";
import { ShopifyModule } from "../shopify/shopify.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";

@Module({
  imports: [ShopifyModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
