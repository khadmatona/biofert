"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { ChevronDownIcon } from "@/components/ui/Icons";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("languages");
  const headerT = useTranslations("header");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function switchTo(nextLocale: Locale) {
    setOpen(false);
    const query = searchParams.toString();
    const target = query ? `${pathname}?${query}` : pathname;
    router.replace(target, { locale: nextLocale });
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={headerT("language")}
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink/70 hover:bg-cream"
      >
        {locale}
        <ChevronDownIcon className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="absolute end-0 top-full z-40 mt-1 w-40 rounded-2xl border border-ink/10 bg-white p-1 shadow-lg">
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                onClick={() => switchTo(l)}
                aria-current={l === locale}
                className={`block w-full rounded-lg px-3 py-2 text-start text-sm ${
                  l === locale ? "bg-cream font-medium text-ink" : "text-ink/70 hover:bg-cream/60"
                }`}
              >
                {t(l)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
