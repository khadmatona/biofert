import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { LANDING_OFFER_IDS } from "../landing-offers";

/**
 * Short COD form used on ad landing pages: name, phone and city only (the
 * confirmation agent collects the full address on the call). The client
 * chooses an offer by id — never a price or quantity.
 */
export class CreateLandingOrderDto {
  @IsIn(LANDING_OFFER_IDS)
  offerId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsUUID()
  idempotencyKey!: string;

  // --- Ad attribution / Meta Conversions API (all optional) ---------------

  /** Browser pixel eventID of the Purchase, so Meta dedupes pixel + CAPI. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  eventId?: string;

  /** Page URL the order was placed from (carries utm_* / fbclid). */
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  pageUrl?: string;

  /** Meta _fbp cookie value. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fbp?: string;

  /** Meta _fbc cookie value (or one built from fbclid). */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  fbc?: string;
}
