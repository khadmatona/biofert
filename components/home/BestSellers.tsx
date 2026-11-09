"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import type { Product } from "@/lib/types";

const tabs = ["populaire", "femme", "homme", "duo", "essentiels"] as const;
const tabTags: Record<(typeof tabs)[number], string | null> = {
  populaire: null,
  femme: "femme",
  homme: "homme",
  duo: "duo",
  essentiels: "essentiels",
};

export function BestSellers({ products }: { products: Product[] }) {
  const t = useTranslations("home.bestSellers");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const filtered = useMemo(() => {
    const tag = tabTags[activeTab];
    if (!tag) return products;
    return products.filter((p) => p.tags.includes(tag));
  }, [activeTab, products]);

  return (
    <section className="bg-white py-10 sm:py-20">
      <Container>
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Heading size="section">{t("title")}</Heading>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-blue-light bg-blue-light text-ink"
                    : "border-ink/20 bg-white text-ink/70 hover:bg-cream-dark"
                }`}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        <ProductCarousel products={filtered} />
      </Container>
    </section>
  );
}
