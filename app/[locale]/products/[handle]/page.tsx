import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductAccordions } from "@/components/product/ProductAccordions";
import { AskAboutProduct } from "@/components/product/AskAboutProduct";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { TrustBadges } from "@/components/home/TrustBadges";
import { getProductByHandle, getProductRecommendations } from "@/lib/shopify/api";
import { toShopifyLanguage } from "@/lib/shopify/locale";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

// Rendered on-demand per request (no build-time Shopify calls), so a
// missing/invalid Storefront token never breaks `next build`.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const product = await getProductByHandle(handle, toShopifyLanguage(locale as Locale)).catch(() => null);
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: buildAlternates(`/products/${handle}`, locale as Locale),
    openGraph: {
      images: [{ url: product.featuredImage.src }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");
  const language = toShopifyLanguage(locale as Locale);
  const product = await getProductByHandle(handle, language);
  if (!product) notFound();

  const related = await getProductRecommendations(product.id, language).catch(() => []);

  return (
    <div className="bg-pink-pale">
      <StickyBuyBar product={product} />

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
      </Container>

      <Container className="pb-10 sm:pb-14">
        <AskAboutProduct productTitle={product.title} />
      </Container>

      {related.length > 0 && (
        <Container className="pb-10 sm:pb-14">
          <Heading size="sub" className="mb-6">
            {t("completeRoutine")}
          </Heading>
          <ProductCarousel products={related.slice(0, 4)} />
        </Container>
      )}

      <Container className="pb-14 sm:pb-20">
        <Heading size="sub" className="mb-6">
          {t("goodToKnow")}
        </Heading>
        <ProductAccordions product={product} />
      </Container>

      <TrustBadges />
    </div>
  );
}
