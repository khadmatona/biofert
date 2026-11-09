"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { VariantSelector } from "./VariantSelector";
import { AddToCartButton } from "./AddToCartButton";
import type { Product } from "@/lib/types";

export function PurchaseOptions({ product }: { product: Product }) {
  const t = useTranslations("product");
  const [selectedId, setSelectedId] = useState(product.variants[0].id);
  const selectedVariant =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  return (
    <div className="flex flex-col gap-4">
      <VariantSelector
        variants={product.variants}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <AddToCartButton product={product} variant={selectedVariant} />
      <p className="text-center text-xs text-ink/50">{t("freeShippingNote")}</p>
    </div>
  );
}
