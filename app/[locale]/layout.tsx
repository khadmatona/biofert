import type { Metadata } from "next";
import { Fraunces, Montserrat } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { siteConfig } from "@/lib/site-config";
import { getProducts } from "@/lib/shopify/api";
import { toShopifyLanguage } from "@/lib/shopify/locale";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const frauncesLogo = Fraunces({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: `${siteConfig.name} — ${t("title")}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: t("description"),
    alternates: buildAlternates("/", locale as Locale),
    openGraph: {
      title: siteConfig.name,
      description: t("description"),
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const language = toShopifyLanguage(locale as Locale);
  // Small, cheap fetch reused for the search overlay's default "featured
  // products" view. Falls back to an empty list if Shopify is unreachable
  // so a Storefront API outage never takes down the whole site's chrome.
  const featuredProducts = await getProducts({ first: 4, language }).catch(() => []);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${montserrat.variable} ${frauncesLogo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <NextIntlClientProvider>
          <CartProvider>
            <SkipLink />
            <AnnouncementBar />
            <Header featuredProducts={featuredProducts} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function SkipLink() {
  const t = await getTranslations("common");
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:rounded-full"
    >
      {t("skipToContent")}
    </a>
  );
}
