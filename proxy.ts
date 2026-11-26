import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes (incl. the Shopify webhook), ad landing pages (/lp/*,
  // Arabic-only with their own root layout — no locale prefix), Next
  // internals, and any request for a file with an extension.
  matcher: ["/((?!api|lp(?:/|$)|_next|_vercel|.*\\..*).*)"],
};
