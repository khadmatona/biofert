import { createHash } from "node:crypto";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface CapiPurchaseInput {
  eventId: string;
  pageUrl?: string;
  value: string;
  currency: string;
  contentIds: string[];
  numItems: number;
  phone: string; // E.164
  firstName: string;
  lastName: string;
  city: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

const GRAPH_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * Server-side Meta Conversions API Purchase for landing-page orders.
 * Disabled (no-op) unless META_PIXEL_ID and META_CAPI_ACCESS_TOKEN are set.
 * Sends the SAME event_id as the browser pixel's Purchase, so Meta counts
 * one purchase per order instead of two. Never throws: tracking must not
 * break order placement.
 */
@Injectable()
export class MetaCapiService {
  private readonly logger = new Logger(MetaCapiService.name);

  constructor(private readonly config: ConfigService) {}

  async sendPurchase(input: CapiPurchaseInput): Promise<void> {
    const pixelId = this.config.get<string>("META_PIXEL_ID");
    const token = this.config.get<string>("META_CAPI_ACCESS_TOKEN");
    if (!pixelId || !token) return;

    const testEventCode = this.config.get<string>("META_TEST_EVENT_CODE");
    const phoneDigits = input.phone.replace(/\D/g, "");

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          action_source: "website",
          event_source_url: input.pageUrl,
          user_data: {
            ph: [sha256(phoneDigits)],
            fn: [sha256(input.firstName)],
            ...(input.lastName ? { ln: [sha256(input.lastName)] } : {}),
            ct: [sha256(input.city.replace(/\s+/g, ""))],
            country: [sha256("ma")],
            ...(input.clientIp ? { client_ip_address: input.clientIp } : {}),
            ...(input.userAgent ? { client_user_agent: input.userAgent } : {}),
            ...(input.fbp ? { fbp: input.fbp } : {}),
            ...(input.fbc ? { fbc: input.fbc } : {}),
          },
          custom_data: {
            currency: input.currency,
            value: Number(input.value),
            content_ids: input.contentIds,
            content_type: "product",
            num_items: input.numItems,
          },
        },
      ],
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
    };

    try {
      const res = await fetch(
        `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        this.logger.warn(`CAPI Purchase rejected (${res.status}): ${await res.text()}`);
      }
    } catch (err) {
      this.logger.warn(`CAPI Purchase failed: ${err instanceof Error ? err.message : err}`);
    }
  }
}
