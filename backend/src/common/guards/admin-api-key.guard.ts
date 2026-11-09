import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { timingSafeEqual } from "crypto";

/**
 * Guards the admin order-management endpoints (list/detail/status update).
 * There's no broader auth system in this project yet — this is the minimum
 * necessary to keep customer PII from being publicly readable, not a
 * general-purpose auth framework.
 */
@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header("x-api-key");
    const expected = this.config.getOrThrow<string>("ADMIN_API_KEY");

    if (!provided || !timingSafeEqualStrings(provided, expected)) {
      throw new UnauthorizedException("Invalid or missing API key.");
    }
    return true;
  }
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
