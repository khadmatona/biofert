/**
 * Bundle offers sold on standalone ad landing pages (e.g. /lp/cyclecare on
 * the storefront). The landing page only ever sends an `offerId` — the
 * product, quantity and price all live HERE, server-side, so a tampered
 * client can't change what it pays.
 *
 * `total` is the price for the whole bundle (delivery included, COD). It is
 * spread evenly over the units as a per-line price override on the Shopify
 * order, so the order in Shopify shows exactly what the customer was quoted.
 *
 * To change a price: edit `total` here and the matching `price` in the
 * storefront's lib/landing/cyclecare.ts (display only), then redeploy both.
 */
export interface LandingOffer {
  /** Shopify product handle; its first variant is ordered. */
  productHandle: string;
  quantity: number;
  /** Bundle total in MAD, as a decimal string. */
  total: string;
  /** Human label stored in the order note for the confirmation agents. */
  label: string;
  /** Shopify order source + tag, used to filter landing-page orders. */
  source: string;
}

export const LANDING_OFFERS: Record<string, LandingOffer> = {
  "cyclecare-1": {
    productHandle: "cyclecare",
    quantity: 1,
    total: "199.00",
    label: "CycleCare — العرض التجريبي: قرعة واحدة (199 درهم)",
    source: "lp-cyclecare",
  },
  "cyclecare-3": {
    productHandle: "cyclecare",
    quantity: 3,
    total: "399.00",
    label: "CycleCare — الأكثر طلباً: 2 + 1 مجاناً = 3 قراعي (399 درهم)",
    source: "lp-cyclecare",
  },
  "cyclecare-5": {
    productHandle: "cyclecare",
    quantity: 5,
    total: "549.00",
    label: "CycleCare — الأكثر توفيراً: 3 + 2 مجاناً = 5 قراعي (549 درهم)",
    source: "lp-cyclecare",
  },
};

export const LANDING_OFFER_IDS = Object.keys(LANDING_OFFERS);
