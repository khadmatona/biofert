import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { CollectionView } from "@/components/collection/CollectionView";
import { Container } from "@/components/ui/Container";
import { getCollectionByHandle } from "@/lib/shopify/api";
import { toShopifyLanguage } from "@/lib/shopify/locale";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

// Rendered on-demand per request (no build-time Shopify calls), so a
// missing/invalid Storefront token never breaks `next build`.
export const dynamicParams = true;

function resolveHandle(slug: string[]) {
  return slug[slug.length - 1];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const handle = resolveHandle(slug);
  const result = await getCollectionByHandle(handle, 50, toShopifyLanguage(locale as Locale)).catch(
    () => null
  );
  if (!result) return {};
  return {
    title: result.collection.title,
    description: result.collection.description,
    alternates: buildAlternates(`/collections/${slug.join("/")}`, locale as Locale),
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const language = toShopifyLanguage(locale as Locale);
  const result = await getCollectionByHandle(resolveHandle(slug), 50, language);
  if (!result) notFound();

  const { collection, products } = result;

  return (
    <>
      <CollectionHeader
        title={collection.title}
        description={collection.description}
        count={products.length}
      />
      <Container className="py-12 sm:py-16">
        <CollectionView products={products} />
      </Container>
    </>
  );
}
