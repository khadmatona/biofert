import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { MetaPixel } from "@/components/landing/MetaPixel";

/**
 * Separate root layout for ad landing pages (/lp/*): Arabic, RTL, no store
 * header/footer/cart — a single-product COD funnel, like the original
 * standalone page. /lp is excluded from the next-intl locale proxy
 * (see proxy.ts), so these URLs have no /fr|/ar prefix.
 */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  // Paid-traffic pages: keep them out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7d4f9e",
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body style={{ margin: 0, background: "#f1f1f1", fontFamily: "var(--font-cairo), Cairo, sans-serif" }}>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
