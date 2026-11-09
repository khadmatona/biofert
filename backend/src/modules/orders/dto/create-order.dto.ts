import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

/**
 * Deliberately accepts ONLY variantId + quantity per line — no price,
 * title, or sku. class-validator's global whitelist (main.ts) strips any
 * extra field a tampered client sends, and orders.service.ts re-fetches
 * everything else from Shopify.
 */
export class OrderLineItemDto {
  @IsString()
  @IsNotEmpty()
  variantId!: string;

  @IsInt()
  @Min(1)
  @Max(50)
  quantity!: number;
}

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  // Loose on purpose (accepts local Moroccan formats like "0600000000" and
  // international "+212600000000") — normalized/validated more strictly
  // isn't worth it for a phone-confirmation business; Shopify itself
  // validates the phone shape when the order is created.
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;
}

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address1!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  // Morocco-only storefront today (see lib/shopify/locale.ts / messages
  // shipping copy) — fixed rather than a free-text field.
  @IsIn(["MA"])
  country!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  zip?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderLineItemDto)
  items!: OrderLineItemDto[];

  @ValidateNested()
  @Type(() => CustomerDto)
  customer!: CustomerDto;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  // Frontend-generated (crypto.randomUUID()) once per checkout attempt and
  // reused across retries/double-clicks so this backend can de-duplicate.
  @IsUUID()
  idempotencyKey!: string;
}
