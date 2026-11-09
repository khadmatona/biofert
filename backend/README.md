# biofertmaroc backend

NestJS API behind the storefront's custom Cash-on-Delivery checkout. It
validates every order against live Shopify data (never the browser's
numbers) and creates the order directly via the Shopify Admin GraphQL API —
the storefront never redirects to Shopify's hosted checkout.

```
Next.js /checkout → POST /api/orders → validate against Shopify → local
Order (pending_confirmation) → Shopify orderCreate (unpaid, tagged) →
business calls the customer → PATCH /api/orders/:id/status → confirmed/rejected
```

## Requirements

- Node 20+, PostgreSQL 14+
- A Shopify **Dev Dashboard custom app** on the target store, with a Client
  ID/Secret (Dev Dashboard → your app → Client credentials). This store
  doesn't use a static Admin API token — see
  `src/modules/shopify/shopify.service.ts`, which mirrors the OAuth 2.0
  Client Credentials Grant already used by
  `../scripts/shopify-migration/admin-client.ts`.

### Required Admin API scopes

Configure these in the Dev Dashboard app's Admin API scope settings before
installing/reinstalling on the store:

- `write_orders` — required by the `orderCreate` mutation
- `read_orders` — needed for the admin order-listing endpoints
- `read_products` — variant price/availability/inventory lookups
- `read_customers`, `write_customers` — `orderCreate`'s `customer.toUpsert`

## Local setup

```bash
cd backend
npm install
cp .env.example .env    # fill in real values
npx prisma migrate dev  # creates the database schema
npm run start:dev       # http://localhost:4000
```

`CORS_ORIGIN` must exactly match the Next.js dev/prod origin (e.g.
`http://localhost:3000`, then the real production domain) — requests from
any other origin are rejected. `ADMIN_API_KEY` protects the order-management
endpoints (see below); generate one with `openssl rand -hex 32`.

## API

| Method | Path                        | Auth              | Notes |
| ------ | --------------------------- | ----------------- | ----- |
| POST   | `/api/orders`                | none (rate-limited) | Creates the order. Body: `{ items: [{variantId, quantity}], customer, shippingAddress, notes?, idempotencyKey }`. Returns `{ success, order: { id, shopifyOrderId, orderNumber, status } }`. |
| GET    | `/api/orders/:id/confirmation` | none             | Minimal, non-sensitive fields (`orderNumber`, `status`) for the order-success page. |
| GET    | `/api/orders`                | `x-api-key`        | Full order list, newest first. |
| GET    | `/api/orders/:id`            | `x-api-key`        | Full order detail incl. line items. |
| PATCH  | `/api/orders/:id/status`     | `x-api-key`        | Body: `{ status }`. Enforces the allowed transitions in `src/modules/orders/enums/order-status.enum.ts` (e.g. `pending_confirmation → confirmed/rejected`). |

`idempotencyKey` is generated once per checkout attempt on the frontend
(`crypto.randomUUID()`) and reused across retries — resubmitting the same
key returns the original order instead of creating a second Shopify order.

## How COD confirmation works

Every order is created in Shopify with `financialStatus: PENDING` (never
`PAID` — this is Cash on Delivery) and tagged `custom-checkout`,
`cash-on-delivery`, `pending-confirmation`. The local order starts as
`pending_confirmation`. When the business calls the customer, whoever's
handling that calls `PATCH /api/orders/:id/status` with `confirmed` or
`rejected` — this only updates the local record; it never creates a second
Shopify order for the same purchase.

## Testing an order

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"variantId": "gid://shopify/ProductVariant/123", "quantity": 1}],
    "customer": {"firstName": "Test", "lastName": "User", "phone": "+212600000000"},
    "shippingAddress": {"address1": "1 Rue Test", "city": "Marrakech", "country": "MA"},
    "idempotencyKey": "'"$(node -e 'console.log(require("crypto").randomUUID())')"'"
  }'
```

Use a real variant GID from the connected dev store. Run `npm test` for the
unit test suite (valid order, invalid variant, tampered price ignored,
duplicate idempotency key, Shopify failure, insufficient inventory — see
`src/modules/orders/orders.service.spec.ts`).

## Deploying

Not done as part of this change — see the root `README.md`'s "Custom
checkout / backend" section for what a Coolify deployment of this service
needs (a second app pointing at this repo with `backend/` as the build
context, plus a managed Postgres resource and a subdomain such as
`api.biofertmaroc.com`).
