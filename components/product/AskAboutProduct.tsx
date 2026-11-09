"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SearchIcon } from "@/components/ui/Icons";

export function AskAboutProduct({ productTitle }: { productTitle: string }) {
  const t = useTranslations("product");
  const [question, setQuestion] = useState("");
  const suggestedQuestions = t.raw("suggestedQuestions") as string[];

  return (
    <div className="rounded-3xl bg-pink-pale p-6 sm:p-8">
      <h2 className="font-display text-lg font-medium">{t("askTitle", { product: productTitle })}</h2>
      <p className="mt-1 text-sm text-ink/60">{t("askBody")}</p>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-4 flex items-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2.5"
      >
        <SearchIcon className="text-ink/40" />
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("askPlaceholder")}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink/40"
        />
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => setQuestion(q)}
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs text-ink/70 hover:border-ink/40"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
