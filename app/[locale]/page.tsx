import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { TrustpilotStrip } from "@/components/home/TrustpilotStrip";
import { VosMoments } from "@/components/home/VosMoments";
import { BestSellers } from "@/components/home/BestSellers";
import { Subscription } from "@/components/home/Subscription";
import { Values } from "@/components/home/Values";
import { BrandStoryFaq } from "@/components/home/BrandStoryFaq";
import { Reviews } from "@/components/home/Reviews";
import { QuizCta } from "@/components/home/QuizCta";
import { BlogGrid } from "@/components/home/BlogGrid";
import { TrustBadges } from "@/components/home/TrustBadges";
import { getProducts } from "@/lib/shopify/api";
import { toShopifyLanguage } from "@/lib/shopify/locale";
import type { Locale } from "@/i18n/routing";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetched once and threaded to every homepage section that needs
  // products, rather than each section fetching from Shopify separately.
  const products = await getProducts({ first: 50, language: toShopifyLanguage(locale as Locale) }).catch(
    () => []
  );

  return (
    <>
      <Hero />
      <TrustpilotStrip />
      <BestSellers products={products} />
      <VosMoments products={products} />
      <Subscription />
      <Values />
      <BrandStoryFaq />
      <Reviews products={products} />
      <QuizCta />
      <BlogGrid />
      <TrustBadges />
    </>
  );
}
