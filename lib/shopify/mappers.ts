import type { Collection, Money, Product, ProductImage, ProductVariant } from "@/lib/types";
import type { CartLine } from "@/context/CartContext";
import type {
  ShopifyCart,
  ShopifyCollection,
  ShopifyImage,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyVariant,
} from "./types";

/** Tags that drive UI badges instead of being shown as filterable "Besoin" values. */
const BADGE_TAGS = new Set(["best-seller", "new", "sans-iode"]);

function toMoney(money: ShopifyMoney): Money {
  return { amount: Number(money.amount), currencyCode: money.currencyCode };
}

function toImage(image: ShopifyImage, id: string): ProductImage {
  return {
    id,
    src: image.url,
    alt: image.altText ?? "",
    width: image.width ?? 800,
    height: image.height ?? 800,
  };
}

/** Parses a `list.single_line_text_field` metafield's JSON-array value; missing/invalid input yields []. */
function parseListMetafield(metafield: { value: string } | null): string[] {
  if (!metafield) return [];
  try {
    const parsed = JSON.parse(metafield.value);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function toVariant(variant: ShopifyVariant): ProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    price: toMoney(variant.price),
    compareAtPrice: variant.compareAtPrice ? toMoney(variant.compareAtPrice) : undefined,
    available: variant.availableForSale,
    selectedOptions: variant.selectedOptions,
  };
}

export function mapShopifyProduct(product: ShopifyProduct): Product {
  const images = product.images.edges.map(({ node }) => toImage(node, node.id));
  const featuredImage = product.featuredImage
    ? toImage(product.featuredImage, `${product.id}-featured`)
    : images[0];

  const rating = product.ratingMetafield ? Number(product.ratingMetafield.value) : 0;
  const reviewCount = product.ratingCountMetafield
    ? Number(product.ratingCountMetafield.value)
    : 0;

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    descriptionHtml: product.descriptionHtml,
    shortDescription: product.description,
    featuredImage,
    images: images.length > 0 ? images : [featuredImage],
    priceRange: {
      minVariantPrice: toMoney(product.priceRange.minVariantPrice),
      maxVariantPrice: toMoney(product.priceRange.maxVariantPrice),
    },
    compareAtPriceRange: product.compareAtPriceRange
      ? {
          minVariantPrice: toMoney(product.compareAtPriceRange.minVariantPrice),
          maxVariantPrice: toMoney(product.compareAtPriceRange.maxVariantPrice),
        }
      : undefined,
    variants: product.variants.edges.map(({ node }) => toVariant(node)),
    tags: product.tags,
    useCases: product.tags.filter((tag) => !BADGE_TAGS.has(tag.toLowerCase())),
    badges: product.tags.filter((tag) => BADGE_TAGS.has(tag.toLowerCase())),
    rating: Number.isFinite(rating) ? rating : 0,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
    features: parseListMetafield(product.featuresMetafield),
    benefits: parseListMetafield(product.benefitsMetafield),
    ingredients: parseListMetafield(product.ingredientsMetafield),
    usage: product.usageMetafield?.value,
    precautions: product.precautionsMetafield?.value,
    claims: parseListMetafield(product.claimsMetafield),
  };
}

export function mapShopifyCollection(collection: ShopifyCollection): {
  collection: Collection;
  products: Product[];
} {
  const products = collection.products.edges.map(({ node }) => mapShopifyProduct(node));
  return {
    collection: {
      id: collection.id,
      handle: collection.handle,
      title: collection.title,
      description: collection.description || undefined,
      image: collection.image ? toImage(collection.image, `${collection.id}-image`) : undefined,
      productIds: products.map((p) => p.id),
    },
    products,
  };
}

export function mapShopifyCart(cart: ShopifyCart): {
  id: string;
  checkoutUrl: string;
  subtotal: number;
  itemCount: number;
  lines: CartLine[];
} {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    subtotal: Number(cart.cost.subtotalAmount.amount),
    itemCount: cart.totalQuantity,
    lines: cart.lines.edges.map(({ node }) => ({
      lineId: node.id,
      productHandle: node.merchandise.product.handle,
      productTitle: node.merchandise.product.title,
      variantId: node.merchandise.id,
      variantTitle: node.merchandise.title,
      image:
        node.merchandise.image?.url ?? node.merchandise.product.featuredImage?.url ?? "",
      price: toMoney(node.merchandise.price),
      quantity: node.quantity,
    })),
  };
}
