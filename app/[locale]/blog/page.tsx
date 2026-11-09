import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { getBlogPosts } from "@/lib/mock-data";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.blog" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/blog", locale as Locale),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const blogPosts = getBlogPosts(locale as Locale);

  return (
    <>
      <div className="bg-pale-yellow py-12 sm:py-16">
        <Container className="flex flex-col items-center gap-3 text-center">
          <Heading as="h1" size="section">
            {t("listTitle")}
          </Heading>
          <p className="max-w-lg text-sm text-ink/70">{t("listDescription")}</p>
          <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
            {t("guidesCount", { count: blogPosts.length })}
          </span>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </>
  );
}
