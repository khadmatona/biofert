import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsOptional, IsString, validateSync } from "class-validator";

/**
 * Fails fast at boot if a required env var is missing, instead of surfacing
 * as an obscure runtime error the first time an order comes in.
 */
class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  SHOPIFY_STORE_DOMAIN!: string;

  @IsString()
  @IsNotEmpty()
  SHOPIFY_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  SHOPIFY_CLIENT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  SHOPIFY_ADMIN_API_VERSION!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN!: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_API_KEY!: string;

  @IsOptional()
  @IsNumberString()
  PORT?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(
      `Invalid/missing environment variables:\n${errors
        .map((e) => `  ${e.property}: ${Object.values(e.constraints ?? {}).join(", ")}`)
        .join("\n")}`
    );
  }
  return validated;
}
