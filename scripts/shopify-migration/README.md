# Shopify migration

One-time (but safely re-runnable) tooling to move `lib/mock-data.ts`'s
`products` and `collections` into a real Shopify store.

## Prerequisites

1. In the Shopify **Dev Dashboard**, open your app and configure Admin API
   scopes with at least `write_products`, `read_products`,
   `write_product_listings`. Dev Dashboard apps don't hand out a static
   Admin API token to copy — instead, note the app's **Client ID** and
   **Client Secret** (Dev Dashboard → your app → Client credentials).
   `scripts/shopify-migration/admin-client.ts` exchanges these for a
   short-lived Admin API access token itself, via OAuth 2.0 Client
   Credentials Grant — you never handle the token directly.
2. Also generate a **Storefront API access token** for the same app
   (Configuration → Storefront API) — this is what the Next.js app itself
   uses at runtime, and is unrelated to the Admin credentials above.
3. Copy `.env.local.example` to `.env.local` and fill in all five values
   (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`,
   `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `SHOPIFY_CLIENT_ID`,
   `SHOPIFY_CLIENT_SECRET`). `SHOPIFY_CLIENT_SECRET` is as sensitive as a
   password and, like the other server-only values, must never be
   prefixed with `NEXT_PUBLIC_` or referenced from `app/`/`components/`.

## Run it

```bash
npm install                     # installs tsx, used to run these .ts scripts directly
npm run migrate:shopify:dry-run # prints what would happen — no writes
npm run migrate:shopify         # does it for real
npm run verify:shopify          # reads the data back and diffs it against lib/mock-data.ts
```

Safe to run `migrate:shopify` more than once: products are upserted by
`handle`, variants are matched by SKU (the local variant id, e.g.
`var-bellafert-1`), collections are looked up by `handle` before creating,
and product images are skipped if an image with the same alt text is
already attached. Re-running updates existing records instead of
duplicating them.

## What gets migrated

- **Products** → Shopify Product + Variant (title, description, price,
  compare-at price, tags, one option/variant per product line)
- **Product images** → uploaded from `public/products/*.png` via staged
  upload, attached as product media
- **Ingredients / usage / precautions / claims / features / benefits** →
  Product metafields (namespace `custom`) — these have no native Shopify
  product field
- **Rating / review count** → Product metafields (namespace `reviews`,
  keys `rating` / `rating_count`) — matches exactly what
  `lib/shopify/queries.ts` reads back for star ratings
- **Collections** → Shopify Collection (manual membership, products added
  by their now-known Shopify id)

## What does NOT get migrated

`reviews` and `blogPosts` in `lib/mock-data.ts` stay as local Next.js
content by design (per project decision) — neither touches cart/checkout,
and Shopify's Storefront API has no first-party equivalent for either
without introducing Metaobjects and new query surface. `lib/mock-data.ts`
keeps exporting them after the products/collections cutover.
