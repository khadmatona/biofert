"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { getBlogPosts } from "@/lib/mock-data";
import type { Locale } from "@/i18n/routing";

export function BlogGrid() {
  const t = useTranslations("home.blogGrid");
  const locale = useLocale() as Locale;
  const blogPosts = getBlogPosts(locale);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    const rtl = getComputedStyle(el).direction === "rtl";
    const sign = direction === "prev" ? -1 : 1;
    el.scrollBy({ left: (rtl ? -sign : sign) * amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-10 sm:py-20">
      <Container>
        <Heading size="section" className="mb-10 text-center">
          {t("title")}
        </Heading>
        <div className="relative">
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
          >
            {blogPosts.map((post) => (
              <div key={post.id} className="w-64 shrink-0 snap-start sm:w-72 lg:w-80">
                <BlogPostCard post={post} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollBy("prev")}
            aria-label={t("previous")}
            className="absolute start-0 top-[38%] z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white shadow-md hover:bg-ink hover:text-cream lg:flex rtl:translate-x-1/2"
            style={{ width: 44, height: 44 }}
          >
            <ArrowIcon direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("next")}
            aria-label={t("next")}
            className="absolute end-0 top-[38%] z-10 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-ink/10 bg-white shadow-md hover:bg-ink hover:text-cream lg:flex rtl:-translate-x-1/2"
            style={{ width: 44, height: 44 }}
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/blog" variant="outline">
            {t("viewAll")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
