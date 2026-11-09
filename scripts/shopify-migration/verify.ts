/**
 * Verifies that Shopify actually has what migrate.ts sent — read back
 * through the app's real Storefront API integration (lib/shopify/api.ts),
 * not the Admin API. This double-checks both the migration AND that the
 * Next.js app's read path sees the data correctly.
 *
 * Usage: npm run verify:shopify
 */
import { products, collections } from "../../lib/mock-data";
import { getProductByHandle, getCollectionByHandle } from "../../lib/shopify/api";

let failures = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function verifyProduct(local: (typeof products)[number]) {
  console.log(`\nProduct: ${local.handle}`);
  // Only a clean `null` (Shopify genuinely has no product at this handle)
  // means "not migrated yet" — a thrown error (bad credentials, network
  // failure, etc.) is a different problem and must not be reported the
  // same way, or a config mistake looks identical to a missing product.
  const remote = await getProductByHandle(local.handle);

  if (!remote) {
    check("exists in Shopify", false, "not found — run the migration first");
    return;
  }

  check("exists in Shopify", true);
  check("title matches", remote.title === local.title, `"${remote.title}" vs "${local.title}"`);
  check(
    "variant count matches",
    remote.variants.length === local.variants.length,
    `${remote.variants.length} vs ${local.variants.length}`
  );
  check(
    "image count matches",
    remote.images.length >= local.images.length,
    `${remote.images.length} vs ${local.images.length} expected`
  );
  check(
    "price matches",
    remote.priceRange.minVariantPrice.amount === local.priceRange.minVariantPrice.amount,
    `${remote.priceRange.minVariantPrice.amount} vs ${local.priceRange.minVariantPrice.amount}`
  );
  check("has at least one tag", remote.tags.length > 0);
}

async function verifyCollection(local: (typeof collections)[number]) {
  console.log(`\nCollection: ${local.handle}`);
  const result = await getCollectionByHandle(local.handle);

  if (!result) {
    check("exists in Shopify", false, "not found — run the migration first");
    return;
  }

  check("exists in Shopify", true);
  check("title matches", result.collection.title === local.title, `"${result.collection.title}" vs "${local.title}"`);
  check(
    "product count matches",
    result.products.length === local.productIds.length,
    `${result.products.length} vs ${local.productIds.length} expected`
  );
}

async function main() {
  console.log("Verifying Shopify data against lib/mock-data.ts...");

  for (const product of products) await verifyProduct(product);
  for (const collection of collections) await verifyCollection(collection);

  console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main().catch((err) => {
  console.error("\nVerification script crashed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
