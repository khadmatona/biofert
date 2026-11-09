import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { getBlogPosts, getBlogPostByHandle } from "@/lib/mock-data";
import { buildAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.guides" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/guides", locale as Locale),
  };
}

const guideSections = [
  { key: "elle", handles: ["comprendre-cycle-ovulation", "sopk-fertilite-solutions"] },
  { key: "lui", handles: ["fertilite-masculine-guide"] },
  { key: "deux", handles: ["10-conseils-naturels-fertilite", "complements-preconception", "protocole-3-mois"] },
];

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guides");
  const blogT = await getTranslations("blog");
  const blogPosts = getBlogPosts(locale as Locale);

  return (
    <>
      <div className="bg-pale-yellow py-12 sm:py-16">
        <Container className="flex flex-col items-center gap-3 text-center">
          <Heading as="h1" size="section">
            {t("title")}
          </Heading>
          <p className="max-w-lg text-sm text-ink/70">{t("description")}</p>
          <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
            {blogT("guidesCount", { count: blogPosts.length })}
          </span>
        </Container>
      </div>

      <Container className="flex flex-col gap-12 py-12 sm:gap-16 sm:py-16">
        {guideSections.map((section) => {
          const posts = section.handles
            .map((handle) => getBlogPostByHandle(handle, locale as Locale))
            .filter((post): post is NonNullable<typeof post> => Boolean(post));
          if (posts.length === 0) return null;
          return (
            <div key={section.key}>
              <div className="mb-6 flex flex-col gap-1 sm:mb-8">
                <Heading as="h2" size="sub">
                  {t(`sections.${section.key}.label`)}
                </Heading>
                <p className="text-sm text-ink/60">{t(`sections.${section.key}.description`)}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          );
        })}
      </Container>
    </>
  );
}
