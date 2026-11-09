"use server";

import { searchProducts } from "./api";
import type { ShopifyLanguageCode } from "./locale";
import type { Product } from "@/lib/types";

export async function searchProductsAction(
  query: string,
  language?: ShopifyLanguageCode
): Promise<Product[]> {
  try {
    return await searchProducts(query, 8, language);
  } catch {
    // Search is a progressive enhancement — fail quietly to an empty
    // result set rather than breaking the search UI.
    return [];
  }
}
