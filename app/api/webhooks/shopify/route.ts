/**
 * Shopify webhook receiver: invalidates the Next.js fetch cache the moment
 * a product or collection changes in Shopify, instead of waiting out the
 * 60s `revalidate` window in `lib/shopify/client.ts`.
 *
 * Flow: Shopify edit -> webhook POST here -> verify HMAC -> revalidateTag()
 * -> the next request to any page re-fetches from Shopify instead of
 * serving the cached copy.
 *
 * Runs on the Node.js runtime (not Edge) because HMAC verification needs
 * `node:crypto`, and the signature must be computed over the exact raw
 * request body, read once via `request.text()` before any JSON parsing.
 */
import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { SHOPIFY_COLLECTION_TAG, SHOPIFY_PRODUCT_TAG } from "@/lib/shopify/api";

export const runtime = "nodejs";

const PRODUCT_TOPICS = new Set(["products/create", "products/update", "products/delete"]);
const COLLECTION_TOPICS = new Set(["collections/create", "collections/update", "collections/delete"]);

function verifyHmac(rawBody: string, hmacHeader: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  const expectedBuffer = Buffer.from(expected, "base64");
  const receivedBuffer = Buffer.from(hmacHeader, "base64");
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[shopify-webhook] SHOPIFY_WEBHOOK_SECRET is not configured");
    return new Response("Unauthorized", { status: 401 });
  }

  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic");
  const shopDomain = request.headers.get("x-shopify-shop-domain");

  // Must be read exactly once, before any parsing, since HMAC is computed
  // over the raw bytes Shopify sent — re-serializing parsed JSON would not
  // reliably reproduce the same bytes.
  const rawBody = await request.text();

  if (!hmacHeader || !verifyHmac(rawBody, hmacHeader, secret)) {
    console.warn("[shopify-webhook] rejected: invalid or missing HMAC signature");
    return new Response("Unauthorized", { status: 401 });
  }

  const configuredDomain = process.env.SHOPIFY_STORE_DOMAIN?.toLowerCase().trim();
  if (!shopDomain || shopDomain.toLowerCase().trim() !== configuredDomain) {
    console.warn(`[shopify-webhook] rejected: unexpected shop domain "${shopDomain ?? "(missing)"}"`);
    return new Response("Forbidden", { status: 403 });
  }

  if (!topic) {
    console.warn("[shopify-webhook] rejected: missing X-Shopify-Topic header");
    return new Response("Bad Request", { status: 400 });
  }

  if (PRODUCT_TOPICS.has(topic)) {
    revalidateTag(SHOPIFY_PRODUCT_TAG, { expire: 0 });
    console.log(`[shopify-webhook] topic="${topic}" shop="${shopDomain}" invalidated tag="${SHOPIFY_PRODUCT_TAG}"`);
  } else if (COLLECTION_TOPICS.has(topic)) {
    revalidateTag(SHOPIFY_COLLECTION_TAG, { expire: 0 });
    console.log(`[shopify-webhook] topic="${topic}" shop="${shopDomain}" invalidated tag="${SHOPIFY_COLLECTION_TAG}"`);
  } else {
    // Unrecognized topic: acknowledge with 200 so Shopify doesn't retry or
    // eventually disable the subscription, just skip invalidation.
    console.log(`[shopify-webhook] topic="${topic}" shop="${shopDomain}" ignored (no matching cache tag)`);
  }

  return new Response("OK", { status: 200 });
}
