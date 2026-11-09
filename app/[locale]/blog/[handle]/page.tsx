import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { getBlogPosts, getBlogPostByHandle } from "@/lib/mock-data";
import { buildAlternates } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({ locale, handle: post.handle }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale, handle } = await params;
  const post = getBlogPostByHandle(handle, locale as Locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: buildAlternates(`/blog/${handle}`, locale as Locale),
    openGraph: {
      images: [{ url: post.image.src }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale, handle } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const format = await getFormatter();
  const post = getBlogPostByHandle(handle, locale as Locale);
  if (!post) notFound();

  const allPosts = getBlogPosts(locale as Locale);
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const formattedDate = format.dateTime(new Date(post.date), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            href="/blog"
            className="mb-6 inline-block text-xs font-medium uppercase tracking-wide text-ink/50 hover:text-ink"
          >
            {t("backToGuides")}
          </Link>
          <span className="mb-4 inline-block rounded-full bg-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">
            {post.category}
          </span>
          <Heading as="h1" size="section" className="mb-4">
            {post.title}
          </Heading>
          <p className="text-sm text-ink/60">
            {post.author} · {formattedDate} · {post.readingTime} {t("readingTimeSuffix")}
          </p>
        </div>

        <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-3xl">
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-5">
          {post.content.map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed text-ink/80">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>

      {related.length > 0 && (
        <Container className="border-t border-ink/10 py-14 sm:py-20">
          <Heading size="sub" className="mb-8 text-center">
            {t("relatedReading")}
          </Heading>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((relatedPost) => (
              <BlogPostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
