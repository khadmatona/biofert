"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export interface QuizUserInfo {
  fullName: string;
  phone: string;
  email: string;
}

export function UserInfoStep({ onSubmit }: { onSubmit: (info: QuizUserInfo) => void }) {
  const t = useTranslations("quiz.userInfo");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ fullName: fullName.trim(), phone: phone.trim(), email: email.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="font-display text-xl font-medium text-ink sm:text-2xl">{t("title")}</h2>
        <p className="text-sm text-ink/60">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quiz-full-name" className="text-sm font-medium text-ink">
            {t("fullNameLabel")}
          </label>
          <input
            id="quiz-full-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            className="rounded-xl border border-ink/20 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-lime"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quiz-phone" className="text-sm font-medium text-ink">
            {t("phoneLabel")}
          </label>
          <input
            id="quiz-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
            className="rounded-xl border border-ink/20 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-lime"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="quiz-email" className="text-sm font-medium text-ink">
            {t("emailLabel")}
          </label>
          <input
            id="quiz-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="rounded-xl border border-ink/20 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-lime"
          />
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg">
        {t("continue")}
      </Button>
    </form>
  );
}
