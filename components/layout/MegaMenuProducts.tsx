"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { productMegaMenu } from "@/lib/site-config";

export function MegaMenuProducts({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations("nav.megaMenu");
  const [active, setActive] = useState(productMegaMenu[0].key);
  const activeCategory =
    productMegaMenu.find((c) => c.key === active) ?? productMegaMenu[0];

  return (
    <div className="border-t border-ink/10 bg-white shadow-lg">
      <Container className="grid grid-cols-[220px_1fr] gap-10 py-8">
        <ul className="flex flex-col gap-1 border-e border-ink/10 pe-6">
          {productMegaMenu.map((category) => (
            <li key={category.key}>
              <button
                onMouseEnter={() => setActive(category.key)}
                onFocus={() => setActive(category.key)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  active === category.key
                    ? "bg-cream text-ink"
                    : "text-ink/70 hover:bg-cream/60"
                }`}
              >
                <Link href={category.href} onClick={onNavigate}>
                  {t(`${category.key}.label`)}
                </Link>
              </button>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-[1fr_auto] gap-10">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {t(`${activeCategory.key}.label`)}
            </p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {activeCategory.links.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="text-sm text-ink/80 hover:text-ink hover:underline underline-offset-4"
                  >
                    {t(`${activeCategory.key}.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            {activeCategory.images?.map(
              (src) => (
                <Link
                  key={src}
                  href={activeCategory.href}
                  onClick={onNavigate}
                  className="block h-40 w-32 shrink-0 overflow-hidden rounded-xl bg-cream"
                >
                  <Image
                    src={src}
                    alt=""
                    width={128}
                    height={160}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              )
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
