/**
 * Migrates the local mock catalog (lib/mock-data.ts: products + collections)
 * into Shopify via the Admin API.
 *
 * IDEMPOTENCY: every product is upserted by its `handle` (via `productSet`'s
 * `identifier` argument) and every variant is matched by SKU (set to the
 * variant's local id, e.g. "var-bellafert-1"). Collections are looked up by
 * handle before creating. Running this script twice updates the same
 * records in place — it never creates duplicates.
 *
 * Usage (from the project root):
 *   npm run migrate:shopify:dry-run   # prints what would happen, no writes
 *   npm run migrate:shopify           # runs for real
 *
 * Requires SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, and
 * SHOPIFY_CLIENT_SECRET in .env.local (see .env.local.example and this
 * folder's README for where to find these in the Shopify Dev Dashboard).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adminFetch } from "./admin-client";
import { products, collections } from "../../lib/mock-data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const DRY_RUN = process.argv.includes("--dry-run");

function log(...args: unknown[]) {
  console.log(...args);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const PRODUCT_SET_MUTATION = `
  mutation ProductSet($identifier: ProductSetIdentifiers, $input: ProductSetInput!) {
    productSet(identifier: $identifier, input: $input, synchronous: true) {
      product {
        id
        handle
        variants(first: 10) {
          nodes { id sku }
        }
      }
      userErrors { field message }
    }
  }
`;

interface ProductSetResult {
  productSet: {
    product: { id: string; handle: string; variants: { nodes: { id: string; sku: string | null }[] } } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
}

/** Product fields with no native Shopify equivalent — stored as metafields. */
function buildMetafields(product: (typeof products)[number]) {
  const fields: { namespace: string; key: string; type: string; value: string }[] = [];
  if (product.ingredients?.length) {
    fields.push({
      namespace: "custom",
      key: "ingredients",
      type: "list.single_line_text_field",
      value: JSON.stringify(product.ingredients),
    });
  }
  if (product.usage) {
    fields.push({ namespace: "custom", key: "usage", type: "multi_line_text_field", value: product.usage });
  }
  if (product.precautions) {
    fields.push({
      namespace: "custom",
      key: "precautions",
      type: "multi_line_text_field",
      value: product.precautions,
    });
  }
  if (product.claims?.length) {
    fields.push({
      namespace: "custom",
      key: "claims",
      type: "list.single_line_text_field",
      value: JSON.stringify(product.claims),
    });
  }
  if (product.features.length) {
    fields.push({
      namespace: "custom",
      key: "features",
      type: "list.single_line_text_field",
      value: JSON.stringify(product.features),
    });
  }
  if (product.benefits.length) {
    fields.push({
      namespace: "custom",
      key: "benefits",
      type: "list.single_line_text_field",
      value: JSON.stringify(product.benefits),
    });
  }
  // The app reads ratings from `custom.rating` (a namespace we fully own),
  // NOT `reviews.rating` — the latter is a Shopify-reserved standard
  // metafield expecting the structured `rating` type ({ value, scale_min,
  // scale_max }), not a bare decimal, so writing a plain number there risks
  // a type conflict with Shopify's own standard definition.
  fields.push({ namespace: "custom", key: "rating", type: "number_decimal", value: String(product.rating) });
  // IMPORTANT: `productSet`'s `metafields` input is a full-replace list —
  // any existing metafield whose namespace/key isn't included here gets
  // DELETED, not left alone (confirmed against Shopify's own docs). So
  // `reviews.rating` — pre-existing on every product from before this field
  // was renamed — MUST stay listed here (with its original, unchanged
  // value) or the next `productSet` run would silently wipe it out even
  // though nothing in the app reads it anymore.
  fields.push({ namespace: "reviews", key: "rating", type: "number_decimal", value: String(product.rating) });
  // `rating_count` has no such reserved structured type — the plain
  // decimal/integer form is what Shopify's own standard definition expects
  // here, so this one stays under `reviews` as before.
  fields.push({
    namespace: "reviews",
    key: "rating_count",
    type: "number_integer",
    value: String(product.reviewCount),
  });
  return fields;
}

async function upsertProduct(product: (typeof products)[number]): Promise<string | null> {
  const optionName = product.variants[0]?.selectedOptions[0]?.name ?? "Format";

  const input = {
    title: product.title,
    handle: product.handle,
    descriptionHtml: product.descriptionHtml,
    tags: [...product.tags, ...product.badges, ...product.useCases],
    status: "ACTIVE",
    productOptions: [
      {
        name: optionName,
        values: product.variants.map((v) => ({
          name: v.selectedOptions[0]?.value ?? v.title,
        })),
      },
    ],
    variants: product.variants.map((v) => ({
      sku: v.id,
      price: v.price.amount.toFixed(2),
      compareAtPrice: v.compareAtPrice ? v.compareAtPrice.amount.toFixed(2) : null,
      optionValues: [
        { optionName, name: v.selectedOptions[0]?.value ?? v.title },
      ],
    })),
    metafields: buildMetafields(product),
  };

  if (DRY_RUN) {
    log(`  [dry-run] would upsert product "${product.handle}" with ${product.variants.length} variant(s)`);
    return null;
  }

  const data = await adminFetch<ProductSetResult>(PRODUCT_SET_MUTATION, {
    identifier: { handle: product.handle },
    input,
  });

  const { product: created, userErrors } = data.productSet;
  if (userErrors.length > 0) {
    log(`  ✗ ${product.handle}: ${userErrors.map((e) => e.message).join("; ")}`);
    return null;
  }
  if (!created) {
    log(`  ✗ ${product.handle}: Shopify returned no product.`);
    return null;
  }
  log(`  ✓ ${product.handle} -> ${created.id}`);
  return created.id;
}

// ---------------------------------------------------------------------------
// Product images (staged upload -> attach as media)
// ---------------------------------------------------------------------------

const STAGED_UPLOADS_CREATE = `
  mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { field message }
    }
  }
`;

const PRODUCT_CREATE_MEDIA = `
  mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { alt }
      mediaUserErrors { field message }
    }
  }
`;

const PRODUCT_MEDIA_QUERY = `
  query ProductMedia($id: ID!) {
    product(id: $id) {
      media(first: 20) {
        nodes { alt }
      }
    }
  }
`;

async function uploadProductImages(productId: string, product: (typeof products)[number]) {
  const existing = DRY_RUN
    ? { product: { media: { nodes: [] as { alt: string | null }[] } } }
    : await adminFetch<{ product: { media: { nodes: { alt: string | null }[] } } }>(PRODUCT_MEDIA_QUERY, {
        id: productId,
      });
  const existingAlts = new Set(existing.product.media.nodes.map((n) => n.alt));

  for (const image of product.images) {
    if (existingAlts.has(image.alt)) {
      log(`    - image "${image.alt}" already attached, skipping`);
      continue;
    }

    const localPath = path.join(PROJECT_ROOT, "public", image.src);
    let fileBuffer: Buffer;
    try {
      fileBuffer = await readFile(localPath);
    } catch {
      log(`    ✗ could not read local image at ${localPath}, skipping`);
      continue;
    }

    if (DRY_RUN) {
      log(`    [dry-run] would upload ${image.src} (${fileBuffer.byteLength} bytes)`);
      continue;
    }

    const filename = path.basename(image.src);
    const staged = await adminFetch<{
      stagedUploadsCreate: {
        stagedTargets: { url: string; resourceUrl: string; parameters: { name: string; value: string }[] }[];
        userErrors: { field: string[] | null; message: string }[];
      };
    }>(STAGED_UPLOADS_CREATE, {
      input: [
        {
          resource: "IMAGE",
          filename,
          mimeType: "image/png",
          httpMethod: "POST",
          fileSize: String(fileBuffer.byteLength),
        },
      ],
    });

    if (staged.stagedUploadsCreate.userErrors.length > 0) {
      log(`    ✗ staged upload failed: ${staged.stagedUploadsCreate.userErrors.map((e) => e.message).join("; ")}`);
      continue;
    }
    const target = staged.stagedUploadsCreate.stagedTargets[0];

    const form = new FormData();
    for (const { name, value } of target.parameters) form.append(name, value);
    form.append("file", new Blob([Uint8Array.from(fileBuffer)]), filename);

    const uploadResponse = await fetch(target.url, { method: "POST", body: form });
    if (!uploadResponse.ok) {
      log(`    ✗ file upload to staged target failed (${uploadResponse.status})`);
      continue;
    }

    const media = await adminFetch<{
      productCreateMedia: {
        media: { alt: string | null }[];
        mediaUserErrors: { field: string[] | null; message: string }[];
      };
    }>(PRODUCT_CREATE_MEDIA, {
      productId,
      media: [{ originalSource: target.resourceUrl, alt: image.alt, mediaContentType: "IMAGE" }],
    });

    if (media.productCreateMedia.mediaUserErrors.length > 0) {
      log(
        `    ✗ attaching media failed: ${media.productCreateMedia.mediaUserErrors.map((e) => e.message).join("; ")}`
      );
    } else {
      log(`    ✓ uploaded ${filename}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) { id }
  }
`;

const COLLECTION_CREATE_MUTATION = `
  mutation CollectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection { id }
      userErrors { field message }
    }
  }
`;

const COLLECTION_ADD_PRODUCTS_MUTATION = `
  mutation CollectionAddProductsV2($id: ID!, $productIds: [ID!]!) {
    collectionAddProductsV2(id: $id, productIds: $productIds) {
      job { id }
      userErrors { field message }
    }
  }
`;

async function upsertCollection(
  collection: (typeof collections)[number],
  handleToShopifyId: Map<string, string>
) {
  const memberIds = collection.productIds
    .map((localId) => {
      const handle = products.find((p) => p.id === localId)?.handle;
      return handle ? handleToShopifyId.get(handle) : undefined;
    })
    .filter((id): id is string => Boolean(id));

  if (DRY_RUN) {
    log(`  [dry-run] would upsert collection "${collection.handle}" with ${memberIds.length} product(s)`);
    return;
  }

  const existing = await adminFetch<{ collectionByHandle: { id: string } | null }>(
    COLLECTION_BY_HANDLE_QUERY,
    { handle: collection.handle }
  );

  let collectionId = existing.collectionByHandle?.id;

  if (!collectionId) {
    const created = await adminFetch<{
      collectionCreate: {
        collection: { id: string } | null;
        userErrors: { field: string[] | null; message: string }[];
      };
    }>(COLLECTION_CREATE_MUTATION, {
      input: {
        title: collection.title,
        handle: collection.handle,
        descriptionHtml: collection.description ?? "",
      },
    });
    if (created.collectionCreate.userErrors.length > 0) {
      log(`  ✗ ${collection.handle}: ${created.collectionCreate.userErrors.map((e) => e.message).join("; ")}`);
      return;
    }
    collectionId = created.collectionCreate.collection?.id;
  }

  if (!collectionId) {
    log(`  ✗ ${collection.handle}: no collection id available.`);
    return;
  }

  if (memberIds.length > 0) {
    const added = await adminFetch<{
      collectionAddProductsV2: { userErrors: { field: string[] | null; message: string }[] };
    }>(COLLECTION_ADD_PRODUCTS_MUTATION, { id: collectionId, productIds: memberIds });
    if (added.collectionAddProductsV2.userErrors.length > 0) {
      log(
        `  ✗ ${collection.handle} (adding products): ${added.collectionAddProductsV2.userErrors
          .map((e) => e.message)
          .join("; ")}`
      );
      return;
    }
  }

  log(`  ✓ ${collection.handle} -> ${collectionId} (${memberIds.length} product(s))`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  log(`Shopify migration ${DRY_RUN ? "(DRY RUN — no writes will be made)" : ""}`);
  log(`\nProducts (${products.length}):`);

  const handleToShopifyId = new Map<string, string>();

  for (const product of products) {
    const id = await upsertProduct(product);
    if (id) {
      handleToShopifyId.set(product.handle, id);
      await uploadProductImages(id, product);
    } else if (DRY_RUN) {
      // No real product id exists yet in a dry run — preview the image
      // step anyway using a placeholder id (uploadProductImages never
      // sends a network request while DRY_RUN is set).
      await uploadProductImages("dry-run-placeholder-id", product);
    }
  }

  log(`\nCollections (${collections.length}):`);
  for (const collection of collections) {
    await upsertCollection(collection, handleToShopifyId);
  }

  log("\nDone.");
  if (!DRY_RUN) {
    log("Next: run `npm run verify:shopify` to confirm everything migrated correctly.");
  }
}

main().catch((err) => {
  console.error("\nMigration failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
