"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function NewsletterForm() {
  const t = useTranslations("forms.newsletter");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm font-medium text-lime-dark">{t("success")}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        {t("emailLabel")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={t("placeholder")}
        className="w-full flex-1 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-pink"
      />
      <Button type="submit" variant="primary" size="sm" className="bg-pink text-white hover:bg-pink-dark">
        {t("submit")}
      </Button>
    </form>
  );
}
