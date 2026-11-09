/**
 * Admin API client for the one-off migration script ONLY.
 *
 * This is deliberately kept out of `lib/shopify/` (the app's runtime
 * Storefront API layer). The Admin API is far more privileged than the
 * Storefront API — it can create, edit, and delete anything in the store —
 * so none of this must ever be imported by any file that ships in the
 * Next.js app (server or client). Run this script directly with
 * `npm run migrate:shopify`, never import it from `app/` or `components/`.
 *
 * Authentication: Dev Dashboard apps don't hand out a static Admin API
 * token to copy into an env var. Instead we authenticate with OAuth 2.0
 * Client Credentials Grant — SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET are
 * exchanged for a short-lived Admin API access token, which this module
 * caches in memory for the life of the migration run and transparently
 * refreshes if it expires mid-run.
 */
const ADMIN_API_VERSION = "2025-01";

// Refresh this many seconds before actual expiry, so a token never goes
// stale mid-request due to clock/latency slop.
const EXPIRY_SAFETY_MARGIN_SECONDS = 60;

function env(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Add it to .env.local (see .env.local.example) before running the migration.`
    );
  }
  return value;
}

export function getAdminEndpoint(): string {
  return `https://${env("SHOPIFY_STORE_DOMAIN")}/admin/api/${ADMIN_API_VERSION}/graphql.json`;
}

interface CachedToken {
  accessToken: string;
  /** Epoch ms after which the cached token is treated as expired. */
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;
// Deduplicates concurrent refreshes if multiple requests race past an
// expired cache at once (migrate.ts fires uploads sequentially today, but
// this keeps the client safe if that ever changes).
let pendingTokenRequest: Promise<CachedToken> | null = null;

interface ClientCredentialsResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
}

async function requestAccessToken(): Promise<CachedToken> {
  const domain = env("SHOPIFY_STORE_DOMAIN");
  const clientId = env("SHOPIFY_CLIENT_ID");
  const clientSecret = env("SHOPIFY_CLIENT_SECRET");

  const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
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
      `Failed to obtain an Admin API access token via client credentials grant (${response.status}): ${body}`
    );
  }

  const json = (await response.json()) as ClientCredentialsResponse;
  if (!json.access_token) {
    throw new Error("Client credentials grant response did not include an access_token.");
  }

  return {
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in - EXPIRY_SAFETY_MARGIN_SECONDS) * 1000,
  };
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }
  if (!pendingTokenRequest) {
    pendingTokenRequest = requestAccessToken().finally(() => {
      pendingTokenRequest = null;
    });
  }
  cachedToken = await pendingTokenRequest;
  return cachedToken.accessToken;
}

export async function adminFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const accessToken = await getAccessToken();

  const response = await fetch(getAdminEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Admin API request failed (${response.status}): ${body}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors && json.errors.length > 0) {
    throw new Error(`Admin API GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) {
    throw new Error("Admin API returned no data.");
  }
  return json.data;
}
