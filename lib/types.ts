/**
 * Commerce domain types, shaped to line up with Shopify Storefront API
 * conventions (Money, edges/handles, variants) so the mock data layer
 * can later be swapped for real Storefront API responses without
 * reworking components.
 */

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: Money;
  compareAtPrice?: Money;
  available: boolean;
  selectedOptions: { name: string; value: string }[];
}

export type ProductBadge = "best-seller" | "new" | string;

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  descriptionHtml: string;
  shortDescription?: string;
  productLine?: string;
  featuredImage: ProductImage;
  images: ProductImage[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange?: { minVariantPrice: Money; maxVariantPrice: Money };
  variants: ProductVariant[];
  tags: string[];
  useCases: string[];
  badges: ProductBadge[];
  rating: number;
  reviewCount: number;
  features: string[];
  benefits: string[];
  ingredients?: string[];
  usage?: string;
  precautions?: string;
  claims?: string[];
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: ProductImage;
  productIds: string[];
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  productHandle?: string;
  source: "Trustpilot" | "Judge.me" | "Google" | "Avis vérifié";
}

export interface BlogPost {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  image: ProductImage;
  date: string;
  author: string;
  content: string[];
}

export interface NavLink {
  key: string;
  href: string;
}

export interface NavCategory extends NavLink {
  links: NavLink[];
  images?: string[];
}

export interface MomentTile {
  key: string;
  href: string;
  image: string;
}
