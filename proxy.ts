import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes (incl. the Shopify webhook), Next internals, and any
  // request for a file with an extension (static assets, images, etc.).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
