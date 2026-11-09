import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StarRating } from "@/components/ui/StarRating";
import { CheckIcon } from "@/components/ui/Icons";
import { PurchaseOptions } from "./PurchaseOptions";
import type { Product } from "@/lib/types";

export function ProductInfo({ product }: { product: Product }) {
  const t = useTranslations("product");

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label={t("breadcrumbAriaLabel")} className="text-xs text-ink/50">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:underline">
              {t("breadcrumbHome")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/collections/best-sellers" className="hover:underline">
              {product.productLine ?? t("breadcrumbShop")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink/70">
            {product.title}
          </li>
        </ol>
      </nav>

      <div>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />
        <h1 className="mt-2 font-display text-3xl font-medium sm:text-4xl">
          {product.title}
        </h1>
        {product.subtitle && (
          <p className="mt-1 text-lg text-terracotta">{product.subtitle}</p>
        )}
      </div>

      {product.shortDescription && (
        <p className="text-sm leading-relaxed text-ink/70">{product.shortDescription}</p>
      )}

      {product.benefits.length > 0 && (
        <ul className="flex flex-col gap-2">
          {product.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm text-ink/80">
              <CheckIcon className="mt-0.5 shrink-0 text-lime-dark" />
              {benefit}
            </li>
          ))}
        </ul>
      )}

      {product.claims && product.claims.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.claims.map((claim) => (
            <span
              key={claim}
              className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70"
            >
              {claim}
            </span>
          ))}
        </div>
      )}

      <PurchaseOptions product={product} />
    </div>
  );
}
