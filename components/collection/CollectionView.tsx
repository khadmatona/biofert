"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FilterBar } from "./FilterBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/lib/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export function CollectionView({ products }: { products: Product[] }) {
  const t = useTranslations("collection");
  const [activeUseCase, setActiveUseCase] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");

  const useCases = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.useCases))),
    [products]
  );

  const filtered = useMemo(() => {
    let list = activeUseCase
      ? products.filter((p) => p.useCases.includes(activeUseCase))
      : products;

    list = [...list];
    if (sort === "price-asc") {
      list.sort((a, b) => a.priceRange.minVariantPrice.amount - b.priceRange.minVariantPrice.amount);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount);
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [products, activeUseCase, sort]);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <FilterBar
          useCases={useCases}
          activeUseCase={activeUseCase}
          onUseCaseChange={setActiveUseCase}
          sort={sort}
          onSortChange={setSort}
        />
      </aside>
      <div>
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <p className="py-16 text-center text-sm text-ink/60">
            {t("noResults")}
          </p>
        )}
      </div>
    </div>
  );
}
