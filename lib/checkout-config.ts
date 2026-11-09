import type { Locale } from "@/i18n/routing";

/**
 * Morocco's 12 administrative regions, sent to the backend as free-text
 * `province` (see backend/src/modules/shopify/shopify.service.ts — Shopify
 * has no controlled subdivision list for Morocco the way it does for US
 * states, so this is display/labeling only, not a coded enum).
 */
export const moroccanRegions: { value: string; label: Record<Locale, string> }[] = [
  { value: "Tanger-Tétouan-Al Hoceïma", label: { fr: "Tanger-Tétouan-Al Hoceïma", en: "Tanger-Tetouan-Al Hoceima", ar: "طنجة تطوان الحسيمة" } },
  { value: "Oriental", label: { fr: "Oriental", en: "Oriental", ar: "الشرق" } },
  { value: "Fès-Meknès", label: { fr: "Fès-Meknès", en: "Fes-Meknes", ar: "فاس مكناس" } },
  { value: "Rabat-Salé-Kénitra", label: { fr: "Rabat-Salé-Kénitra", en: "Rabat-Sale-Kenitra", ar: "الرباط سلا القنيطرة" } },
  { value: "Béni Mellal-Khénifra", label: { fr: "Béni Mellal-Khénifra", en: "Beni Mellal-Khenifra", ar: "بني ملال خنيفرة" } },
  { value: "Casablanca-Settat", label: { fr: "Casablanca-Settat", en: "Casablanca-Settat", ar: "الدار البيضاء سطات" } },
  { value: "Marrakech-Safi", label: { fr: "Marrakech-Safi", en: "Marrakech-Safi", ar: "مراكش آسفي" } },
  { value: "Drâa-Tafilalet", label: { fr: "Drâa-Tafilalet", en: "Draa-Tafilalet", ar: "درعة تافيلالت" } },
  { value: "Souss-Massa", label: { fr: "Souss-Massa", en: "Souss-Massa", ar: "سوس ماسة" } },
  { value: "Guelmim-Oued Noun", label: { fr: "Guelmim-Oued Noun", en: "Guelmim-Oued Noun", ar: "كلميم واد نون" } },
  { value: "Laâyoune-Sakia El Hamra", label: { fr: "Laâyoune-Sakia El Hamra", en: "Laayoune-Sakia El Hamra", ar: "العيون الساقية الحمراء" } },
  { value: "Dakhla-Oued Ed-Dahab", label: { fr: "Dakhla-Oued Ed-Dahab", en: "Dakhla-Oued Ed-Dahab", ar: "الداخلة وادي الذهب" } },
];

/** Base URL of the NestJS backend — browser-safe, no secrets. */
export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Add it to .env.local (see .env.local.example).");
  }
  return url;
}
