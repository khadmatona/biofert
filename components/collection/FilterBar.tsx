"use client";

import { useTranslations } from "next-intl";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export function FilterBar({
  useCases,
  activeUseCase,
  onUseCaseChange,
  sort,
  onSortChange,
}: {
  useCases: string[];
  activeUseCase: string | null;
  onUseCaseChange: (useCase: string | null) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}) {
  const t = useTranslations("collection");

  return (
    <>
      {/* Mobile: everything in one horizontally-scrolling row */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 lg:hidden">
        <button
          onClick={() => onUseCaseChange(null)}
          className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${
            activeUseCase === null
              ? "border-ink bg-ink text-cream"
              : "border-ink/15 bg-white text-ink/70"
          }`}
        >
          {t("filterAll")}
        </button>
        {useCases.map((useCase) => (
          <button
            key={useCase}
            onClick={() => onUseCaseChange(useCase)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${
              activeUseCase === useCase
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 bg-white text-ink/70"
            }`}
          >
            {useCase}
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="ms-auto shrink-0 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm"
        >
          <option value="featured">{t("sort.featured")}</option>
          <option value="price-asc">{t("sort.priceAsc")}</option>
          <option value="price-desc">{t("sort.priceDesc")}</option>
          <option value="rating">{t("sort.rating")}</option>
        </select>
      </div>

      {/* Desktop: vertical sidebar */}
      <div className="hidden flex-col gap-6 lg:flex">
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("filterNeed")}
          </h2>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                onClick={() => onUseCaseChange(null)}
                className={`w-full rounded-lg px-2 py-1.5 text-start text-sm ${
                  activeUseCase === null ? "bg-cream font-medium text-ink" : "text-ink/70 hover:bg-cream/60"
                }`}
              >
                {t("filterAll")}
              </button>
            </li>
            {useCases.map((useCase) => (
              <li key={useCase}>
                <button
                  onClick={() => onUseCaseChange(useCase)}
                  className={`w-full rounded-lg px-2 py-1.5 text-start text-sm ${
                    activeUseCase === useCase
                      ? "bg-cream font-medium text-ink"
                      : "text-ink/70 hover:bg-cream/60"
                  }`}
                >
                  {useCase}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
            {t("sortBy")}
          </h2>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm"
          >
            <option value="featured">{t("sort.featured")}</option>
            <option value="price-asc">{t("sort.priceAsc")}</option>
            <option value="price-desc">{t("sort.priceDesc")}</option>
            <option value="rating">{t("sort.rating")}</option>
          </select>
        </div>
      </div>
    </>
  );
}
