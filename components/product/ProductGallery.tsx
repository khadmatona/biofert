"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

// These source photos have a dark, symmetric vignette baked into their top
// and bottom edges with generous headroom above the cap — cropping
// (object-cover) hides the vignette and shows just the clean, lit center.
// smokeclean-men.png has a similar vignette but far less headroom above the
// cap, so cropping cuts it off — it's better served by object-contain like
// every plain-background photo, which avoids cropping into the label.
const VIGNETTE_BACKGROUND_IMAGES = ["bellafert.png", "fertimen.png"];

function hasVignetteBackground(src: string) {
  return VIGNETTE_BACKGROUND_IMAGES.some((name) => src.endsWith(name));
}

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const t = useTranslations("product");
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const currentFit = hasVignetteBackground(current.src) ? "object-cover" : "object-contain";

  return (
    <div className="flex flex-col gap-4 sm:flex-row-reverse lg:sticky lg:top-24 lg:self-start">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-pink-pale">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 44vw, 100vw"
          className={`${currentFit} mix-blend-multiply ${currentFit === "object-contain" ? "p-10 sm:p-14" : ""}`}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((image, i) => {
            const fit = hasVignetteBackground(image.src) ? "object-cover" : "object-contain";
            return (
              <button
                key={image.id}
                onClick={() => setActive(i)}
                aria-label={t("viewImage", { index: i + 1 })}
                aria-current={i === active}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-pink-pale ring-1 transition-all ${
                  i === active ? "ring-2 ring-ink" : "ring-ink/10 hover:ring-ink/30"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="64px"
                  className={`${fit} mix-blend-multiply ${fit === "object-contain" ? "p-2" : ""}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
