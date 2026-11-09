"use client";

import { FormEvent, ReactNode, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/components/product/ProductPrice";
import { getApiUrl, moroccanRegions } from "@/lib/checkout-config";
import type { Locale } from "@/i18n/routing";

const inputClasses =
  "rounded-xl border border-ink/20 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-lime";

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tf = useTranslations("forms.checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { lines, subtotal, clearCartLocal } = useCart();

  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${getApiUrl()}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({ variantId: line.variantId, quantity: line.quantity })),
          customer: { firstName, lastName, phone, email: email || undefined },
          shippingAddress: { address1, city, province, country: "MA", zip: zip || undefined },
          notes: notes || undefined,
          idempotencyKey,
        }),
      });

      if (!response.ok) {
        // The backend already sanitizes what ends up in `message` — client
        // errors (4xx) get a specific, actionable reason (e.g. "Please
        // enter a valid phone number"), server errors (5xx) get a generic
        // one. Surfacing it directly beats a one-size-fits-all message.
        let message = t("errors.generic");
        try {
          const body = (await response.json()) as { message?: string | string[] };
          if (typeof body.message === "string") message = body.message;
          else if (Array.isArray(body.message) && body.message.length > 0) message = body.message[0];
        } catch {
          // Response body wasn't JSON — fall back to the generic message.
        }
        setErrorMessage(message);
        setIsSubmitting(false);
        return;
      }

      const data = (await response.json()) as { success: boolean; order: { id: string } };
      clearCartLocal();
      router.push(`/order-success/${data.order.id}`);
    } catch {
      setErrorMessage(t("errors.network"));
      setIsSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink/10 bg-cream p-10 text-center">
        <p className="font-display text-xl font-medium text-ink">{t("emptyTitle")}</p>
        <p className="text-sm text-ink/60">{t("emptyBody")}</p>
        <Button href="/collections/best-sellers" variant="primary" size="md">
          {t("emptyCta")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
      <div className="order-2 flex flex-col gap-6 lg:order-1">
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("contactTitle")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tf("firstNameLabel")} htmlFor="checkout-firstName">
              <input
                id="checkout-firstName"
                type="text"
                required
                maxLength={100}
                placeholder={tf("firstNamePlaceholder")}
                className={inputClasses}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field label={tf("lastNameLabel")} htmlFor="checkout-lastName">
              <input
                id="checkout-lastName"
                type="text"
                required
                maxLength={100}
                placeholder={tf("lastNamePlaceholder")}
                className={inputClasses}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
            <Field label={tf("phoneLabel")} htmlFor="checkout-phone">
              <input
                id="checkout-phone"
                type="tel"
                required
                maxLength={30}
                placeholder={tf("phonePlaceholder")}
                className={inputClasses}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field label={tf("emailLabel")} htmlFor="checkout-email">
              <input
                id="checkout-email"
                type="email"
                maxLength={255}
                placeholder={tf("emailPlaceholder")}
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("shippingTitle")}
          </h2>
          <div className="grid gap-4">
            <Field label={tf("addressLabel")} htmlFor="checkout-address1">
              <input
                id="checkout-address1"
                type="text"
                required
                maxLength={255}
                placeholder={tf("addressPlaceholder")}
                className={inputClasses}
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={tf("cityLabel")} htmlFor="checkout-city">
                <input
                  id="checkout-city"
                  type="text"
                  required
                  maxLength={100}
                  placeholder={tf("cityPlaceholder")}
                  className={inputClasses}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Field>
              <Field label={tf("provinceLabel")} htmlFor="checkout-province">
                <select
                  id="checkout-province"
                  required
                  className={inputClasses}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option value="" disabled>
                    {tf("provincePlaceholder")}
                  </option>
                  {moroccanRegions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label[locale]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label={tf("zipLabel")} htmlFor="checkout-zip">
              <input
                id="checkout-zip"
                type="text"
                maxLength={20}
                placeholder={tf("zipPlaceholder")}
                className={`${inputClasses} sm:max-w-[200px]`}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <Field label={t("notesLabel")} htmlFor="checkout-notes">
          <textarea
            id="checkout-notes"
            rows={3}
            maxLength={1000}
            placeholder={tf("notesPlaceholder")}
            className={`resize-none ${inputClasses}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
      </div>

      <div className="order-1 lg:order-2">
        <div className="rounded-2xl border border-ink/10 bg-cream p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("summaryTitle")}
          </h2>
          <ul className="flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.lineId} className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={line.image}
                    alt={line.productTitle}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-ink">{line.productTitle}</p>
                    <p className="text-xs text-ink/60">
                      {line.variantTitle} · ×{line.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink">
                    <bdi>
                      {formatMoney(
                        { amount: line.price.amount * line.quantity, currencyCode: line.price.currencyCode },
                        locale
                      )}
                    </bdi>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink/60">{t("subtotal")}</span>
              <span className="font-medium text-ink">
                <bdi>{formatMoney({ amount: subtotal, currencyCode: "MAD" }, locale)}</bdi>
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="text-ink">{t("total")}</span>
              <span className="text-ink">
                <bdi>{formatMoney({ amount: subtotal, currencyCode: "MAD" }, locale)}</bdi>
              </span>
            </div>
            <p className="text-xs text-ink/50">{t("shippingNote")}</p>
          </div>

          {errorMessage && (
            <p className="mt-4 text-center text-xs text-terracotta">{errorMessage}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-4 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
          <p className="mt-3 text-center text-xs text-ink/50">{t("codNote")}</p>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
