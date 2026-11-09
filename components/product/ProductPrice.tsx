import { useLocale, useTranslations } from "next-intl";
import type { Money } from "@/lib/types";
import type { Locale } from "@/i18n/routing";

const CURRENCY_LOCALE_TAG: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  ar: "ar-MA",
};

export function formatMoney(money: Money, locale: Locale = "fr") {
  const tag = CURRENCY_LOCALE_TAG[locale];
  if (money.currencyCode === "MAD") {
    const amount = new Intl.NumberFormat(tag, {
      minimumFractionDigits: money.amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(money.amount);
    return `${amount} DH`;
  }
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: money.amount % 1 === 0 ? 0 : 2,
  }).format(money.amount);
}

export function ProductPrice({
  price,
  compareAtPrice,
  from = false,
  size = "md",
}: {
  price: Money;
  compareAtPrice?: Money;
  from?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  }[size];

  return (
    <div className={`flex items-baseline gap-2 ${sizeStyles}`}>
      <span className="font-semibold text-ink">
        {from && <span className="me-1 font-sans text-xs font-normal text-ink/60">{t("from")}</span>}
        <bdi>{formatMoney(price, locale)}</bdi>
      </span>
      {compareAtPrice && compareAtPrice.amount > price.amount && (
        <span className="text-ink/40 line-through">
          <bdi>{formatMoney(compareAtPrice, locale)}</bdi>
        </span>
      )}
    </div>
  );
}
