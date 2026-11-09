import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Builds `alternates.canonical` + `alternates.languages` (hreflang, incl.
 * `x-default`) for a locale-agnostic pathname (e.g. `/products/bellafert`).
 */
export function buildAlternates(pathname: string, currentLocale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}${getPathname({ locale, href: pathname })}`;
  }
  languages["x-default"] = `${SITE_URL}${getPathname({ locale: routing.defaultLocale, href: pathname })}`;

  return {
    canonical: `${SITE_URL}${getPathname({ locale: currentLocale, href: pathname })}`,
    languages,
  };
}
