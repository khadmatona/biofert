"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowIcon } from "@/components/ui/Icons";

interface HeroSlide {
  id: string;
  messageKey: "slide1" | "slide2";
  primaryCtaHref: string;
  secondaryCtaHref: string;
  image: string;
  mobileImage: string;
  /** Mobile-only text theme, chosen per slide to match how light/dark its mobileImage is. */
  mobileTextTheme: "dark" | "light";
  badge?: string;
}

const slides: HeroSlide[] = [
  {
    id: "slide-1",
    messageKey: "slide1",
    primaryCtaHref: "/products/bellafert",
    secondaryCtaHref: "/products/fertimen",
    image: "/header/ChatGPT Image 13 أغسطس 2026، 01_35_55 م (3).png",
    mobileImage: "/placeholders/IMG_6764.PNG",
    mobileTextTheme: "dark",
    badge: "-50%",
  },
  {
    id: "slide-2",
    messageKey: "slide2",
    primaryCtaHref: "/products/pack-couple",
    secondaryCtaHref: "/products/pack-couple",
    image: "/header/ChatGPT Image 13 أغسطس 2026، 01_47_10 م.png",
    mobileImage: "/placeholders/IMG_6761 (2).PNG",
    mobileTextTheme: "light",
  },
];

function HeroPillButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "accent" | "outline";
  children: React.ReactNode;
}) {
  const styles =
    variant === "accent"
      ? "bg-blue-light text-ink hover:bg-blue-light/70"
      : "bg-white text-ink hover:bg-cream";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-4 rounded-full py-1.5 ps-6 pe-1.5 text-sm font-semibold transition-colors ${styles}`}
    >
      {children}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white">
        <ArrowIcon size={14} />
      </span>
    </Link>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goTo(index + 1), 6000);
    return () => clearInterval(timer);
  }, [index, goTo]);

  const slide = slides[index];

  return (
    <section className="relative h-[calc(100dvh-7.5rem)] w-full overflow-hidden">
      {slides.map((s, i) => (
        <Image
          key={`${s.id}-mobile`}
          src={s.mobileImage}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ease-in-out motion-reduce:transition-none sm:hidden ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {slides.map((s, i) => (
        <Image
          key={s.id}
          src={s.image}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`hidden object-cover transition-opacity duration-700 ease-in-out motion-reduce:transition-none sm:block ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Darkens the left side for the always-left-anchored text above —
          deliberately not RTL-flipped (no rtl:bg-gradient-to-l), since it
          has to stay under the text regardless of locale. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/25 via-ink/5 to-transparent"
      />

      {slide.badge && (
        <span className="absolute end-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white sm:end-10 sm:top-10">
          {slide.badge}
        </span>
      )}

      {/* dir="ltr" here (not just physical ml-/mr- on the child) because the
          row's own `justify-content: flex-start` default is itself
          direction-aware — under the page's rtl, flex-start resolves to the
          right edge no matter what margins the child carries. Forcing this
          row to ltr pins the child to the left unconditionally, matching
          the fixed left/right composition of the source images in every
          locale. */}
      <div dir="ltr" className="relative flex h-full items-start pt-24 sm:items-center sm:pt-0">
        <div className="ml-20 mr-5 flex max-w-lg flex-col items-start gap-5 sm:ml-24 sm:mr-10 lg:ml-28 lg:mr-16">
          <h1
            className={`font-display text-[2.25rem] font-medium leading-[1.08] sm:text-[3rem] sm:text-white lg:text-[3.5rem] ${
              slide.mobileTextTheme === "dark" ? "text-ink" : "text-white"
            }`}
          >
            {t(`${slide.messageKey}.title`)}
          </h1>
          <p
            className={`text-base sm:text-white/90 ${
              slide.mobileTextTheme === "dark" ? "text-ink/80" : "text-white/90"
            }`}
          >
            {t(`${slide.messageKey}.description`)}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <HeroPillButton href={slide.primaryCtaHref} variant="accent">
              {t(`${slide.messageKey}.primaryCta`)}
            </HeroPillButton>
            <HeroPillButton href={slide.secondaryCtaHref} variant="outline">
              {t(`${slide.messageKey}.secondaryCta`)}
            </HeroPillButton>
          </div>
        </div>
      </div>

      <button
        onClick={() => goTo(index - 1)}
        aria-label={t("previousSlide")}
        className="absolute start-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 sm:start-6"
      >
        <ArrowIcon direction="prev" size={20} />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        aria-label={t("nextSlide")}
        className="absolute end-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 sm:end-6"
      >
        <ArrowIcon direction="next" size={20} />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-8">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={t("goToSlide", { index: i + 1 })}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
