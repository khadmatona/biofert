import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Pill } from "@/components/ui/Pill";
import { StarRating } from "@/components/ui/StarRating";
import { CheckIcon } from "@/components/ui/Icons";
import { QuickAddButton } from "./QuickAddButton";
import { ProductPrice } from "./ProductPrice";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("product.badges");

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex w-full flex-col rounded-lg bg-pink-pale p-4 sm:p-6 lg:p-8"
    >
      <div className="relative aspect-square overflow-hidden">
        {product.badges.length > 0 && (
          <div className="absolute end-0 top-0 z-10 flex flex-col items-end gap-1.5">
            {product.badges.map((badge) => (
              <Badge key={badge}>{t.has(badge) ? t(badge) : badge}</Badge>
            ))}
          </div>
        )}

        <Image
          src={product.featuredImage.src}
          alt={product.featuredImage.alt}
          fill
          sizes="(min-width: 640px) 288px, 256px"
          className="object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <StarRating rating={product.rating} reviewCount={product.reviewCount} variant="single" />
        <QuickAddButton product={product} />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {product.productLine && (
          <p className="text-xs uppercase tracking-wide text-ink/50">{product.productLine}</p>
        )}
        <h3 className="font-display text-xl font-medium text-ink">
          {product.subtitle ?? product.title}
        </h3>

        <ul className="flex flex-col gap-1">
          {product.features.slice(0, 2).map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 text-sm text-ink/70">
              <CheckIcon className="shrink-0 text-lime-dark" />
              {feature}
            </li>
          ))}
        </ul>

        {product.useCases.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.useCases.map((useCase) => (
              <Pill key={useCase}>{useCase}</Pill>
            ))}
          </div>
        )}

        <ProductPrice
          price={product.priceRange.minVariantPrice}
          compareAtPrice={product.compareAtPriceRange?.minVariantPrice}
          from
          size="lg"
        />
      </div>
    </Link>
  );
}
