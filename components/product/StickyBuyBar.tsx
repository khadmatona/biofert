"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { AddToCartButton } from "./AddToCartButton";
import { formatMoney } from "./ProductPrice";
import type { Product } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

export function StickyBuyBar({ product }: { product: Product }) {
  const locale = useLocale() as Locale;
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const variant = product.variants[0];

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur transition-[transform,opacity] duration-300 sm:top-[var(--header-height,73px)] sm:bottom-auto sm:translate-y-0 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-100 sm:opacity-0 sm:pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3 sm:px-8 lg:px-12">
          <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream sm:block">
            <Image src={product.featuredImage.src} alt="" fill sizes="48px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.title}</p>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <span className="hidden text-sm font-semibold sm:block">
            <bdi>{formatMoney(variant.price, locale)}</bdi>
          </span>
          <div className="w-40 shrink-0">
            <AddToCartButton product={product} variant={variant} />
          </div>
        </div>
      </div>
    </>
  );
}
