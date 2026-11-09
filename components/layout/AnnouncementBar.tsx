"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function AnnouncementBar() {
  const t = useTranslations("header.announcements");
  const [index, setIndex] = useState(0);
  const messageKeys = ["shipping", "promo"] as const;

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messageKeys.length);
    }, 5000);
    return () => clearInterval(id);
  }, [messageKeys.length]);

  return (
    <div className="bg-pale-yellow py-2.5 text-ink">
      <p className="px-4 text-center text-[11px] font-normal tracking-wide sm:text-xs">
        {t.rich(messageKeys[index], {
          strong: (chunks) => <strong className="font-semibold">{chunks}</strong>,
        })}
      </p>
    </div>
  );
}
