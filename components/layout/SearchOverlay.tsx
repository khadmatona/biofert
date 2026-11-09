"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SearchIcon, CloseXIcon } from "@/components/ui/Icons";
import { getBlogPosts } from "@/lib/mock-data";
import { searchProductsAction } from "@/lib/shopify/search-action";
import { toShopifyLanguage } from "@/lib/shopify/locale";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/types";

export function SearchOverlay({
  onClose,
  featuredProducts,
}: {
  onClose: () => void;
  featuredProducts: Product[];
}) {
  const t = useTranslations("search");
  const locale = useLocale() as Locale;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  // Tags each result set with the query it answers, so a query that's been
  // cleared (or changed again) never renders another query's stale results
  // — the render below only trusts `searchResults` when it matches `query`.
  const [searchResults, setSearchResults] = useState<{ query: string; products: Product[] } | null>(
    null
  );

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const trimmedQuery = query.trim();
  const isShowingSearch = trimmedQuery.length > 0;
  // No matching result yet for the current query means a search is either
  // about to start (debounce) or already in flight — either way, loading.
  const isSearching = isShowingSearch && searchResults?.query !== trimmedQuery;

  // Live product search against Shopify, debounced while typing. The only
  // setState call happens inside the promise callback, once the debounce
  // timer and the request both complete — never synchronously in the
  // effect body.
  useEffect(() => {
    if (!trimmedQuery) return;
    const timer = setTimeout(() => {
      searchProductsAction(trimmedQuery, toShopifyLanguage(locale)).then((products) =>
        setSearchResults({ query: trimmedQuery, products })
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [trimmedQuery, locale]);

  const articles = getBlogPosts(locale).slice(0, 2);
  const currentResults =
    isShowingSearch && searchResults?.query === trimmedQuery ? searchResults.products : null;
  const shownProducts = isShowingSearch ? currentResults ?? [] : featuredProducts.slice(0, 4);

  return (
    <div className="absolute inset-x-0 top-full z-40 border-t border-ink/10 bg-white shadow-lg">
      <Container className="py-6">
        <div className="mb-6 flex items-center gap-3 border-b border-ink/15 pb-3">
          <SearchIcon className="text-ink/50" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-ink/40"
          />
          <button onClick={onClose} aria-label={t("close")} className="rounded-full p-2 hover:bg-cream">
            <CloseXIcon />
          </button>
        </div>

        <div className="grid gap-8 sm:grid-cols-[2fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {isShowingSearch ? t("results") : t("featured")}
            </p>
            {isShowingSearch && isSearching ? (
              <p className="text-sm text-ink/50">{t("searching")}</p>
            ) : isShowingSearch && currentResults?.length === 0 ? (
              <p className="text-sm text-ink/50">{t("noResults", { query })}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {shownProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    onClick={onClose}
                    className="group"
                  >
                    <div className="aspect-square overflow-hidden rounded-xl bg-cream">
                      <Image
                        src={product.featuredImage.src}
                        alt={product.featuredImage.alt}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-ink/80">{product.title}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
              {t("relatedArticles")}
            </p>
            <ul className="flex flex-col gap-3">
              {articles.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.handle}`}
                    onClick={onClose}
                    className="text-sm text-ink/80 hover:text-ink hover:underline underline-offset-4"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
