import type { Locale } from "@/i18n/routing";

/** Shopify Storefront API `LanguageCode` enum values used by `@inContext`. */
export type ShopifyLanguageCode = "FR" | "EN" | "AR";

const LOCALE_TO_SHOPIFY_LANGUAGE: Record<Locale, ShopifyLanguageCode> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
};

export function toShopifyLanguage(locale: Locale): ShopifyLanguageCode {
  return LOCALE_TO_SHOPIFY_LANGUAGE[locale];
}
