import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {
  AdminProductVariant,
  CreateShopifyOrderInput,
  CreateShopifyOrderResult,
  ShopifyUserError,
} from "./shopify.types";

/**
 * Admin GraphQL API client. Authentication mirrors
 * ../../../scripts/shopify-migration/admin-client.ts: this store's Shopify
 * app is a Dev Dashboard custom app, which doesn't hand out a static Admin
 * API token — SHOPIFY_CLIENT_ID/SHOPIFY_CLIENT_SECRET are exchanged for a
 * short-lived offline access token via OAuth 2.0 Client Credentials Grant,
 * cached in memory and transparently refreshed.
 *
 * This is the only place in the backend allowed to hold Shopify Admin
 * credentials or call the Admin API.
 */
@Injectable()
export class ShopifyService {
  private readonly logger = new Logger(ShopifyService.name);

  private readonly EXPIRY_SAFETY_MARGIN_SECONDS = 60;
  private cachedToken: { accessToken: string; expiresAt: number } | null = null;
  private pendingTokenRequest: Promise<{ accessToken: string; expiresAt: number }> | null = null;

  constructor(private readonly config: ConfigService) {}

  private get storeDomain(): string {
    return this.config.getOrThrow<string>("SHOPIFY_STORE_DOMAIN");
  }

  private get apiVersion(): string {
    return this.config.getOrThrow<string>("SHOPIFY_ADMIN_API_VERSION");
  }

  private get adminEndpoint(): string {
    return `https://${this.storeDomain}/admin/api/${this.apiVersion}/graphql.json`;
  }

  private async requestAccessToken(): Promise<{ accessToken: string; expiresAt: number }> {
    const clientId = this.config.getOrThrow<string>("SHOPIFY_CLIENT_ID");
    const clientSecret = this.config.getOrThrow<string>("SHOPIFY_CLIENT_SECRET");

    const response = await fetch(`https://${this.storeDomain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Failed to obtain a Shopify Admin API access token (${response.status}): ${body}`
      );
    }

    const json = (await response.json()) as { access_token: string; expires_in: number };
    if (!json.access_token) {
      throw new Error("Client credentials grant response did not include an access_token.");
    }

    return {
      accessToken: json.access_token,
      expiresAt: Date.now() + (json.expires_in - this.EXPIRY_SAFETY_MARGIN_SECONDS) * 1000,
    };
  }

  private async getAccessToken(): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
      return this.cachedToken.accessToken;
    }
    if (!this.pendingTokenRequest) {
      this.pendingTokenRequest = this.requestAccessToken().finally(() => {
        this.pendingTokenRequest = null;
      });
    }
    this.cachedToken = await this.pendingTokenRequest;
    return this.cachedToken.accessToken;
  }

  private async adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const accessToken = await this.getAccessToken();

    let response: Response;
    try {
      response = await fetch(this.adminEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({ query, variables }),
      });
    } catch (err) {
      this.logger.error("Could not reach the Shopify Admin API", err instanceof Error ? err.stack : undefined);
      throw new Error("Could not reach the Shopify Admin API.");
    }

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`Admin API request failed (${response.status}): ${body}`);
      throw new Error(`Shopify Admin API request failed with status ${response.status}.`);
    }

    const json = (await response.json()) as { data?: T; errors?: { message: string }[] };

    if (json.errors && json.errors.length > 0) {
      const message = json.errors.map((e) => e.message).join("; ");
      this.logger.error(`Admin API GraphQL error: ${message}`);
      throw new Error(`Shopify Admin API GraphQL error: ${message}`);
    }
    if (!json.data) {
      throw new Error("Shopify Admin API returned no data.");
    }
    return json.data;
  }

  /**
   * Looks up the current, authoritative state of each variant. Missing ids
   * (deleted/invalid variant) simply won't appear in the result map — the
   * caller is responsible for treating an absent id as invalid.
   */
  async getVariants(variantIds: string[]): Promise<Map<string, AdminProductVariant>> {
    const query = /* GraphQL */ `
      query GetVariantsForOrder($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on ProductVariant {
            id
            title
            sku
            availableForSale
            inventoryPolicy
            inventoryQuantity
            price
            image {
              url
            }
            product {
              id
              title
              status
            }
          }
        }
      }
    `;

    const data = await this.adminFetch<{ nodes: (AdminProductVariant | null)[] }>(query, {
      ids: variantIds,
    });

    const result = new Map<string, AdminProductVariant>();
    for (const node of data.nodes) {
      if (node) result.set(node.id, node);
    }
    return result;
  }

  /**
   * Creates the order directly via orderCreate — never through checkout,
   * never marked as paid. financialStatus PENDING reflects an unpaid
   * Cash-on-Delivery order awaiting phone confirmation.
   */
  async createOrder(input: CreateShopifyOrderInput): Promise<CreateShopifyOrderResult> {
    const mutation = /* GraphQL */ `
      mutation OrderCreate($order: OrderCreateOrderInput!) {
        orderCreate(order: $order) {
          order {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const orderInput: Record<string, unknown> = {
      lineItems: input.lineItems.map((line) => ({
        variantId: line.variantId,
        quantity: line.quantity,
      })),
      // Top-level contact info on the order itself — set unconditionally so
      // the order always carries it, independent of whether a Customer
      // record gets created/linked below.
      email: input.customer.email,
      phone: input.customer.phone,
      shippingAddress: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        address1: input.shippingAddress.address1,
        city: input.shippingAddress.city,
        // Free-text `province`, not `provinceCode` — Morocco's regions
        // aren't in Shopify's controlled subdivision list the way US
        // states/CA provinces are, so a coded value could be rejected or
        // silently dropped.
        province: input.shippingAddress.province,
        countryCode: input.shippingAddress.country,
        zip: input.shippingAddress.zip,
        phone: input.customer.phone,
      },
      financialStatus: "PENDING",
      note: input.note,
      tags: input.tags,
    };

    // customer.toUpsert requires an email (or an existing customer id) to
    // identify/create the Customer record — phone alone isn't accepted.
    // Email is optional on this storefront (phone is the primary contact
    // for COD confirmation), so only attempt the upsert when we have one;
    // otherwise the order still carries the top-level email/phone above,
    // it just isn't linked to a Shopify Customer entity.
    if (input.customer.email) {
      orderInput.customer = {
        toUpsert: {
          email: input.customer.email,
          phone: input.customer.phone,
          firstName: input.customer.firstName,
          lastName: input.customer.lastName,
        },
      };
    }

    const variables = { order: orderInput };

    const data = await this.adminFetch<{
      orderCreate: { order: { id: string; name: string } | null; userErrors: ShopifyUserError[] };
    }>(mutation, variables);

    if (data.orderCreate.userErrors.length > 0) {
      const message = data.orderCreate.userErrors.map((e) => e.message).join("; ");
      this.logger.error(`orderCreate userErrors: ${message}`);
      throw new Error(`Shopify rejected the order: ${message}`);
    }
    if (!data.orderCreate.order) {
      throw new Error("Shopify orderCreate returned no order.");
    }

    return { orderId: data.orderCreate.order.id, orderName: data.orderCreate.order.name };
  }
}
