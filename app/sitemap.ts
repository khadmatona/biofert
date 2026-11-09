import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getProducts, getCollections } from "@/lib/shopify/api";
import { getBlogPosts } from "@/lib/mock-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const staticPaths = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/faq",
  "/guides",
  "/privacy",
  "/quiz",
  "/terms",
];

function entry(pathname: string): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}${getPathname({ locale, href: pathname })}`;
  }
  return {
    url: `${SITE_URL}${getPathname({ locale: routing.defaultLocale, href: pathname })}`,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = staticPaths.map(entry);

  const products = await getProducts({ first: 100 }).catch(() => []);
  for (const product of products) {
    entries.push(entry(`/products/${product.handle}`));
  }

  const collections = await getCollections(50).catch(() => []);
  for (const collection of collections) {
    entries.push(entry(`/collections/${collection.handle}`));
  }

  for (const post of getBlogPosts(routing.defaultLocale as Locale)) {
    entries.push(entry(`/blog/${post.handle}`));
  }

  return entries;
}
