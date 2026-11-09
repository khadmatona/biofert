This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Custom checkout / backend

This is a Cash-on-Delivery store: customers never reach Shopify's hosted
checkout. `/checkout` (`app/[locale]/checkout/page.tsx` +
`components/checkout/CheckoutForm.tsx`) is a page in this Next.js app that
posts straight to a separate NestJS API in [`backend/`](backend/), which
re-validates every price/variant against live Shopify data (never trusting
the browser) and creates the order via the Shopify Admin GraphQL API
(`orderCreate`, `financialStatus: PENDING` — never marked paid). The order
starts as `pending_confirmation`; the business calls the customer and moves
it to `confirmed` or `rejected` via the backend's admin endpoints.

- Run the backend: see [`backend/README.md`](backend/README.md) — local
  setup, required Shopify Admin API scopes, the API surface, and how COD
  confirmation works.
- Wire the frontend to it: set `NEXT_PUBLIC_API_URL` in `.env.local` to the
  backend's URL (see `.env.local.example`).
- Deploying the backend (a second Coolify app + a Postgres resource +
  a subdomain such as `api.biofertmaroc.com`) is a deliberate follow-up, not
  covered by the existing single-service `docker-compose.yml` in this repo.

## Shopify webhook cache invalidation

Product/collection data is fetched from Shopify's Storefront API with a
60-second Next.js fetch cache (`lib/shopify/client.ts`). Without more, an
edit made in Shopify can take up to ~60s (longer under low traffic, since
revalidation is lazy) to appear on the site. `app/api/webhooks/shopify/route.ts`
closes that gap: Shopify calls this endpoint the moment a product/collection
changes, and it invalidates the matching cache tag immediately, so the very
next request gets fresh data — no redeploy or restart needed.

### How it works

- `lib/shopify/api.ts` tags every product read (`getProducts`,
  `getProductByHandle`, `getProductRecommendations`, `searchProducts`) with
  `shopify-products`, and every collection read (`getCollections`,
  `getCollectionByHandle`) with `shopify-collections`.
  `getCollectionByHandle` carries **both** tags, since it embeds full
  product data alongside the collection.
- `app/api/webhooks/shopify/route.ts` receives Shopify's webhook POST,
  verifies its `X-Shopify-Hmac-Sha256` signature against
  `SHOPIFY_WEBHOOK_SECRET`, confirms `X-Shopify-Shop-Domain` matches
  `SHOPIFY_STORE_DOMAIN`, and calls `revalidateTag()` for the tag matching
  `X-Shopify-Topic`.

### Configure in Shopify Admin

1. Go to **Settings → Notifications**, scroll to the **Webhooks** section.
2. If it's your first webhook here, Shopify generates a **webhook signing
   secret** on this page — copy it into `SHOPIFY_WEBHOOK_SECRET` (see
   `.env.local.example`). This secret is shared by all webhooks configured
   from this page; you don't get one per topic.
3. Click **Create webhook** once for each topic below, all pointing at the
   same URL:
   - `products/create`
   - `products/update`
   - `products/delete`
   - `collections/create`
   - `collections/update`
   - `collections/delete`
   - URL: `https://biofertmaroc.com/api/webhooks/shopify`
   - Format: JSON
   - API version: `2025-01` (matches `lib/shopify/client.ts` /
     `scripts/shopify-migration/admin-client.ts`)

### Configure in Coolify

Add `SHOPIFY_WEBHOOK_SECRET` as an environment variable on the biofertmaroc
application (same place `SHOPIFY_STORE_DOMAIN` /
`SHOPIFY_STOREFRONT_ACCESS_TOKEN` are already set), then redeploy so the
running container picks it up. Without it, the route fails closed — every
webhook request gets rejected with `401` rather than skipping verification.

### Testing locally

Run `npm run dev`, set `SHOPIFY_WEBHOOK_SECRET` in `.env.local` to any
value, then POST to `http://localhost:3000/api/webhooks/shopify` with a
body HMAC-signed using that same secret (`crypto.createHmac("sha256",
secret).update(rawBody).digest("base64")`) and the headers
`X-Shopify-Hmac-Sha256`, `X-Shopify-Topic`, `X-Shopify-Shop-Domain` (must
match `SHOPIFY_STORE_DOMAIN`). Never weaken or bypass HMAC verification to
make local testing easier — sign real test payloads instead.
