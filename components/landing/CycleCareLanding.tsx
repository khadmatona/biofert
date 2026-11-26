"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  cyclecareHeaderPrice,
  cyclecareImages,
  cyclecareOffers,
  formatMad,
  type CyclecareOffer,
} from "@/lib/landing/cyclecare";
import { getMetaClickIds, trackPixel } from "@/lib/landing/pixel";
import styles from "./CycleCareLanding.module.css";

const SUCCESS_MESSAGE = "تم استلام طلبك، سنتواصل معك قريباً ✅";
const NETWORK_ERROR = "وقع مشكل في الاتصال، المرجو المحاولة مرة أخرى.";
const GENERIC_ERROR = "لم نتمكن من تسجيل طلبك، المرجو المحاولة مرة أخرى.";

const IMAGE_SIZES = "(max-width: 480px) 100vw, 480px";

function pixelParams(offer: CyclecareOffer) {
  return {
    content_name: "Biofert CycleCare",
    content_ids: ["cyclecare"],
    content_type: "product",
    value: offer.price,
    currency: "MAD",
    num_items: offer.quantity,
  };
}

export function CycleCareLanding() {
  const [offerId, setOfferId] = useState<CyclecareOffer["id"]>(cyclecareOffers[0].id);
  const offer = cyclecareOffers.find((o) => o.id === offerId) ?? cyclecareOffers[0];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const checkoutRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    trackPixel("ViewContent", pixelParams(cyclecareOffers[0]));
  }, []);

  function scrollToCheckout() {
    checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onFormStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackPixel("InitiateCheckout", pixelParams(offer));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("submitting");
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // One event id per order: shared by the browser pixel and the backend's
    // Conversions API call, so Meta counts this purchase once, not twice.
    const eventId = `lp-cyclecare-${idempotencyKey}`;

    try {
      if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not set");
      const response = await fetch(`${apiUrl}/api/orders/landing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          fullName: fullName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          idempotencyKey,
          eventId,
          pageUrl: window.location.href.slice(0, 1000),
          ...getMetaClickIds(),
        }),
      });

      if (!response.ok) {
        let message = GENERIC_ERROR;
        if (response.status < 500) {
          try {
            const body = (await response.json()) as { message?: string | string[] };
            const m = Array.isArray(body.message) ? body.message[0] : body.message;
            // Only surface the Arabic messages meant for customers.
            if (m && /[؀-ۿ]/.test(m)) message = m;
          } catch {
            // not JSON — keep generic
          }
        }
        setError(message);
        setStatus("idle");
        return;
      }

      trackPixel("Purchase", pixelParams(offer), eventId);
      setStatus("done");
      setToastVisible(true);
      window.setTimeout(() => setToastVisible(false), 6000);
    } catch {
      setError(NETWORK_ERROR);
      setStatus("idle");
    }
  }

  const ctaButton = (key: string) => (
    <button key={key} type="button" className={styles.ctaBtn} onClick={scrollToCheckout}>
      اطلبي الآن
    </button>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Image
          src={cyclecareImages.hero}
          alt="Biofert CycleCare"
          width={1024}
          height={1536}
          sizes={IMAGE_SIZES}
          priority
          className={styles.lpImg}
        />

        <section id="checkout" ref={checkoutRef} className={styles.checkout}>
          <div className={styles.checkoutHeader}>
            <span className={styles.stars}>★★★★★</span>
            <div className={styles.avatars} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={styles.avatar}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/placeholders/avatar-${n}.svg`} alt="" />
                </span>
              ))}
            </div>
            <span className={styles.ratingText}>آراء أكثر من 5.000 تقييم إيجابي</span>
          </div>

          <div className={styles.productSummary}>
            <div className={styles.productName}>Biofert CycleCare</div>
            <div className={styles.priceRow}>
              <span className={styles.discountTag} dir="ltr">
                {cyclecareHeaderPrice.discountLabel}
              </span>
              <span className={styles.oldPrice}>{formatMad(cyclecareHeaderPrice.compareAt)}</span>
              <span className={styles.newPrice}>{formatMad(cyclecareHeaderPrice.price)}</span>
            </div>
          </div>

          <div className={styles.stepLine}>
            <span className={styles.stepNum}>01</span>
            <span className={styles.stepText}>اختاري العرض المناسب لك:</span>
            <hr />
          </div>

          <div className={styles.packageList} role="radiogroup" aria-label="اختاري العرض">
            {cyclecareOffers.map((o) => {
              const selected = o.id === offerId;
              return (
                <label
                  key={o.id}
                  className={`${styles.packageOption} ${selected ? styles.selected : ""}`}
                >
                  <span className={styles.badge}>{o.badge}</span>
                  <input
                    type="radio"
                    name="pkg"
                    value={o.id}
                    checked={selected}
                    onChange={() => setOfferId(o.id)}
                    aria-label={o.badge}
                  />
                  <div className={styles.packageContent}>
                    <div className={styles.productMini} aria-hidden="true">
                      <Image src={cyclecareImages.bottle} alt="" width={96} height={144} sizes="48px" />
                      <span className={styles.qtyBadge}>{o.quantity}</span>
                    </div>
                    <div className={styles.descCol}>
                      <div className={styles.desc}>
                        {o.title}
                        {o.subtitle && (
                          <>
                            <br />
                            {o.subtitle}
                          </>
                        )}
                      </div>
                      <span className={styles.freeDeliveryTag}>التوصيل بالمجان</span>
                    </div>
                  </div>
                  <div className={styles.pricesLeft}>
                    <div className={styles.now}>{formatMad(o.price)}</div>
                    <div className={styles.was}>{formatMad(o.compareAt)}</div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className={styles.stepLine}>
            <span className={styles.stepNum}>02</span>
            <span className={styles.stepText}>للطلب، يرجى إدخال معلوماتك هنا</span>
            <hr />
          </div>

          {status === "done" ? (
            <div className={styles.successBox} role="status">
              <strong>شكراً لك! {SUCCESS_MESSAGE}</strong>
              <span>
                {offer.title} — {formatMad(offer.price)}
              </span>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} onFocus={onFormStart}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  autoComplete="name"
                  required
                  maxLength={150}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <span className={styles.fieldIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </span>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <span className={styles.fieldIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  </svg>
                </span>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="المدينة"
                  autoComplete="address-level2"
                  required
                  maxLength={100}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <span className={styles.fieldIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                    <circle cx="12" cy="10" r="2.2" />
                  </svg>
                </span>
              </div>

              <div className={styles.totalRow}>
                <span>إجمالي المبلغ:</span>
                <span>{formatMad(offer.price)}</span>
              </div>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className={styles.buyBtn} disabled={status === "submitting"}>
                {status === "submitting" ? "جاري إرسال الطلب..." : "اشتري الآن"}
              </button>
            </form>
          )}

          <div className={styles.stockBarWrap}>
            <div className={styles.stockBar}>
              <div className={styles.stockBarFill} />
            </div>
            <div className={styles.stockText}>الكمية محدودة حسب الطلبات اليومية</div>
          </div>

          <div className={styles.trustRow}>
            <TrustItem label={["الدفع عند", "الاستلام"]} path="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3zm-3 9l2 2 4-4" />
            <TrustItem label={["توصيل", "مجاني"]} path="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zm0-9.3a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z" />
            <TrustItem label={["مواكبة", "مستمرة"]} path="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            <TrustItem label={["جودة مضمونة", "100%"]} path="M5 12.5l4.5 4.5L19 7.5" />
          </div>
        </section>

        {ctaButton("cta-0")}
        {cyclecareImages.sections.map((src, i) => (
          <div key={src}>
            <Image
              src={src}
              alt=""
              width={1024}
              height={1536}
              sizes={IMAGE_SIZES}
              className={styles.lpImg}
            />
            {/* Original layout: a CTA after every image except between 5 and 6. */}
            {i !== 3 && ctaButton(`cta-${i + 1}`)}
          </div>
        ))}
      </div>

      <div className={`${styles.toast} ${toastVisible ? styles.toastShow : ""}`} role="status" aria-live="polite">
        {SUCCESS_MESSAGE}
      </div>
    </div>
  );
}

function TrustItem({ label, path }: { label: [string, string]; path: string }) {
  return (
    <div className={styles.trustItem}>
      <div className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d={path} />
        </svg>
      </div>
      <p>
        {label[0]}
        <br />
        {label[1]}
      </p>
    </div>
  );
}
