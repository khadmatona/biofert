"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

export function ProductCarousel({ products }: { products: Product[] }) {
  const t = useTranslations("common");
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
    <div className="relative">
      <div
        ref={scrollerRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBy("prev")}
        aria-label={t("previousProducts")}
        className="absolute start-0 top-[38%] z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white shadow-md hover:bg-ink hover:text-cream sm:flex"
        style={{ width: 44, height: 44 }}
      >
        <ArrowIcon direction="prev" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy("next")}
        aria-label={t("nextProducts")}
        className="absolute end-0 top-[38%] z-10 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-ink/10 bg-white shadow-md hover:bg-ink hover:text-cream sm:flex"
        style={{ width: 44, height: 44 }}
      >
        <ArrowIcon direction="next" />
      </button>
    </div>
  );
}
