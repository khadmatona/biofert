"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ArrowIcon, GoogleIcon } from "@/components/ui/Icons";
import { getReviews } from "@/lib/mock-data";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/types";

const GOOGLE_RATING = 4.8;

export function Reviews({ products }: { products: Product[] }) {
  const t = useTranslations("home.reviews");
  const locale = useLocale() as Locale;
  const reviews = getReviews(locale);
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
    <section id="avis" className="overflow-hidden bg-white py-10 sm:py-20">
      <Container className="mb-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-4">
          <Heading as="h2" size="section" className="whitespace-pre-line">
            {t("title")}
          </Heading>
          <Button href="/faq" variant="outline" size="sm">
            {t("readAll")}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-2xl bg-pink-pale px-8 py-6">
          <span className="flex items-center gap-2 text-sm font-medium text-ink/70">
            <GoogleIcon />
            {t("google")}
          </span>
          <span className="font-display text-4xl font-medium text-ink">{GOOGLE_RATING}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">{t("outOf5")}</span>
        </div>
      </Container>

      <Container className="relative">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {reviews.map((review) => {
            const product = products.find((p) => p.handle === review.productHandle);
            return (
              <div
                key={review.id}
                className="flex w-96 shrink-0 snap-start flex-col gap-3 rounded-2xl bg-pink-pale p-5 sm:w-[28rem]"
              >
                <StarRating rating={review.rating} />
                <h3 className="font-display text-base font-medium">{review.title}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{review.body}</p>
                <p className="text-sm font-medium text-ink">{review.author}</p>

                {product && (
                  <Link
                    href={`/products/${product.handle}`}
                    className="mt-1 flex items-center gap-3 rounded-xl bg-white p-3"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cream">
                      <Image
                        src={product.featuredImage.src}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{product.title}</p>
                      <p className="truncate text-xs text-ink/60">{product.subtitle}</p>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollBy("prev")}
          aria-label={t("previous")}
          className="absolute start-6 top-[38%] z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white shadow-md hover:bg-ink hover:text-cream sm:flex"
          style={{ width: 44, height: 44 }}
        >
          <ArrowIcon direction="prev" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy("next")}
          aria-label={t("next")}
          className="absolute end-6 top-[38%] z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white shadow-md hover:bg-ink hover:text-cream sm:flex"
          style={{ width: 44, height: 44 }}
        >
          <ArrowIcon direction="next" />
        </button>

        <div className="mt-6 flex justify-end gap-2 px-5 sm:hidden">
          <button
            type="button"
            onClick={() => scrollBy("prev")}
            aria-label={t("previous")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-white hover:bg-ink hover:text-cream"
          >
            <ArrowIcon direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy("next")}
            aria-label={t("next")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 bg-white hover:bg-ink hover:text-cream"
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </Container>
    </section>
  );
}
