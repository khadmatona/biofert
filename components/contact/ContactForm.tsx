"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const t = useTranslations("forms.contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-cream p-6 text-sm">
        <p className="font-medium text-ink">{t("successTitle")}</p>
        <p className="mt-1 text-ink/60">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium text-ink">
            {t("nameLabel")}
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder={t("namePlaceholder")}
            className="rounded-xl border border-ink/20 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-lime"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium text-ink">
            {t("emailLabel")}
          </label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder={t("emailPlaceholder")}
            className="rounded-xl border border-ink/20 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-lime"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-ink">
          {t("messageLabel")}
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          placeholder={t("messagePlaceholder")}
          className="resize-none rounded-xl border border-ink/20 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-lime"
        />
      </div>
      <Button type="submit" variant="primary" size="md" className="self-start">
        {t("submit")}
      </Button>
    </form>
  );
}
