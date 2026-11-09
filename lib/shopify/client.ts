/**
 * Server-only Shopify Storefront API client. This file must never be
 * imported from a "use client" component — only from Server Components,
 * Route Handlers, or files marked "use server" (see cart-actions.ts). That
 * boundary is what keeps SHOPIFY_STOREFRONT_ACCESS_TOKEN out of the browser
 * bundle; Next.js only ships code reachable from client entry points.
 */
import type { GraphQLResponse } from "./types";

const API_VERSION = "2025-01";

function getEndpoint(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  return `https://${domain}/api/${API_VERSION}/graphql.json`;
}

function getToken(): string {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  return token;
}

export class ShopifyApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

/**
 * `revalidate`: seconds to cache the response for (Next.js ISR-style fetch
 * cache). Pass `false` to disable caching entirely (used for cart reads,
 * which must always be fresh).
 *
 * `tags`: Next.js cache tags attached to this fetch (`next.tags`), so
 * `revalidateTag()` can invalidate it on demand — see
 * `app/api/webhooks/shopify/route.ts`. Ignored when `revalidate` is `false`,
 * since uncached requests have nothing to tag.
 */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate: number | false = 60,
  tags?: string[]
): Promise<T> {
  // Resolved outside the try/catch below so a missing env var throws its
  // own specific message instead of being masked by the generic
  // network-failure error that block reports.
  const endpoint = getEndpoint();
  const token = getToken();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      ...(revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate, ...(tags && tags.length > 0 ? { tags } : {}) } }),
    });
  } catch {
    throw new ShopifyApiError(
      "Could not reach the Shopify Storefront API. Check SHOPIFY_STORE_DOMAIN and your network connection."
    );
  }

  if (!response.ok) {
    throw new ShopifyApiError(
      `Shopify Storefront API request failed with status ${response.status}.`
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    throw new ShopifyApiError(json.errors.map((e) => e.message).join("; "));
  }

  if (!json.data) {
    throw new ShopifyApiError("Shopify Storefront API returned no data.");
  }

  return json.data;
}
