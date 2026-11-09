const MOROCCO_COUNTRY_CODE = "212";

/** Loose E.164 shape check — Shopify itself is the final authority on validity. */
const E164_PATTERN = /^\+\d{8,15}$/;

/**
 * Shopify's orderCreate rejects phone numbers that aren't in international
 * (E.164) format — but customers naturally type local Moroccan numbers
 * like "0600000000" or "06 00 00 00 00". Rather than reject every real
 * customer's input, normalize the common local shapes to +212... before
 * sending anything to Shopify.
 */
export function normalizeMoroccanPhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+${MOROCCO_COUNTRY_CODE}${digits.slice(1)}`;
  if (digits.startsWith(MOROCCO_COUNTRY_CODE)) return `+${digits}`;
  return `+${MOROCCO_COUNTRY_CODE}${digits}`;
}

export function isValidPhone(normalized: string): boolean {
  return E164_PATTERN.test(normalized);
}
