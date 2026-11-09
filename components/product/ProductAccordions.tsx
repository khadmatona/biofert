import { useTranslations } from "next-intl";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import type { Product } from "@/lib/types";

export function ProductAccordions({ product }: { product: Product }) {
  const t = useTranslations("product.accordions");

  const items: AccordionItem[] = [
    {
      question: t("benefits"),
      answer: product.benefits.join(" · ") || t("benefitsFallback"),
    },
    {
      question: t("ingredients"),
      answer: product.ingredients?.join(", ") || t("ingredientsFallback"),
    },
    {
      question: t("usage"),
      answer: product.usage || t("usageFallback"),
    },
    {
      question: t("precautions"),
      answer: product.precautions || t("precautionsFallback"),
    },
    {
      question: t("description"),
      answer: product.shortDescription || "",
    },
  ];

  return <Accordion items={items} />;
}
