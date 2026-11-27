/**
 * Display data for the CycleCare ad landing page (/lp/cyclecare).
 *
 * Prices here are DISPLAY ONLY. What the customer is actually charged is
 * decided server-side by backend/src/modules/orders/landing-offers.ts —
 * keep `price` below in sync with `total` there when changing an offer.
 */

/**
 * Landing visuals. Currently served from the original Vercel build of this
 * page (and optimized/cached by next/image). To self-host, drop the files
 * in public/lp/cyclecare/ and set this to "/lp/cyclecare".
 */
export const CYCLECARE_IMAGE_BASE = "https://biodfert.vercel.app/images";

export const cyclecareImages = {
  hero: `${CYCLECARE_IMAGE_BASE}/1.webp`,
  bottle: `${CYCLECARE_IMAGE_BASE}/biofert-cyclecare.jpeg`,
  sections: [2, 3, 4, 5, 6].map((n) => `${CYCLECARE_IMAGE_BASE}/${n}.webp`),
};

export interface CyclecareOffer {
  /** Must match a key of LANDING_OFFERS in the backend. */
  id: "cyclecare-1" | "cyclecare-3" | "cyclecare-5";
  badge: string;
  quantity: number;
  title: string;
  subtitle?: string;
  price: number;
  compareAt: number;
}

export const cyclecareOffers: CyclecareOffer[] = [
  {
    id: "cyclecare-1",
    badge: "العرض التجريبي",
    quantity: 1,
    title: "قَرعة واحدة (30 حبة)",
    price: 199,
    compareAt: 299,
  },
  {
    id: "cyclecare-3",
    badge: "الأكثر طلباً",
    quantity: 3,
    title: "شري 2 قراعي وخذي قَرعة مجاناً",
    subtitle: "(المجموع: 3 قراعي)",
    price: 399,
    compareAt: 597,
  },
  {
    id: "cyclecare-5",
    badge: "الأكثر توفيراً",
    quantity: 5,
    title: "شري 3 قراعي وخذي جوج قراعي مجاناً",
    subtitle: "(المجموع: 5 قراعي)",
    price: 549,
    compareAt: 995,
  },
];

export const cyclecareHeaderPrice = { price: 199, compareAt: 349, discountLabel: "-43%" };

export function formatMad(amount: number): string {
  return `MAD${amount.toFixed(2)}`;
}
