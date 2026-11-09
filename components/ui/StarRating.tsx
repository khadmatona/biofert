import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";

function Star({ fill, id }: { fill: number; id: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={20 * fill} height="20" />
        </clipPath>
      </defs>
      <path
        d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.7l-5.18 2.72.99-5.77L1.62 7.6l5.79-.84L10 1.5z"
        fill="none"
        stroke="var(--rose)"
        strokeWidth="1"
      />
      <path
        d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.7l-5.18 2.72.99-5.77L1.62 7.6l5.79-.84L10 1.5z"
        fill="var(--rose)"
        clipPath={`url(#${id})`}
      />
    </svg>
  );
}

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
  variant = "row",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  variant?: "row" | "single";
}) {
  const t = useTranslations("common");
  const locale = useLocale();
  const uid = useId();
  const formattedRating = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
  const stars = [0, 1, 2, 3, 4].map((i) => Math.min(1, Math.max(0, rating - i)));
  const ariaLabel =
    reviewCount !== undefined
      ? t("ratingOutOf5WithCount", { rating, count: reviewCount })
      : t("ratingOutOf5", { rating });

  if (variant === "single") {
    return (
      <div
        className={`inline-flex items-center gap-1 font-bold ${size === "md" ? "text-base" : "text-sm"}`}
        aria-label={ariaLabel}
      >
        <span className="text-rose" aria-hidden="true">
          ★
        </span>
        <span className="text-ink">
          <bdi>{formattedRating}</bdi>/5
        </span>
        {reviewCount !== undefined && (
          <span className="text-ink/60">({reviewCount})</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${size === "md" ? "text-sm" : "text-xs"}`}
      aria-label={ariaLabel}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} id={`star-clip-${uid}-${i}`} />
        ))}
      </span>
      {reviewCount !== undefined && (
        <span className="text-ink/60">({reviewCount})</span>
      )}
    </div>
  );
}
