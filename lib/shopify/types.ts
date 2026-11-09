/**
 * Raw Shopify Storefront API (GraphQL) response shapes. These mirror the
 * schema field-for-field; `lib/shopify/mappers.ts` converts them into this
 * project's existing `Product` / `Collection` / cart types so the rest of
 * the app never has to know Shopify's shape.
 */

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: ShopifySelectedOption[];
  image: ShopifyImage | null;
}

export interface ShopifyProductOption {
  name: string;
  values: string[];
}

export interface ShopifyMetafield {
  value: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  options: ShopifyProductOption[];
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage & { id: string } }[] };
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  } | null;
  variants: { edges: { node: ShopifyVariant }[] };
  ratingMetafield: ShopifyMetafield | null;
  ratingCountMetafield: ShopifyMetafield | null;
  featuresMetafield: ShopifyMetafield | null;
  benefitsMetafield: ShopifyMetafield | null;
  ingredientsMetafield: ShopifyMetafield | null;
  usageMetafield: ShopifyMetafield | null;
  precautionsMetafield: ShopifyMetafield | null;
  claimsMetafield: ShopifyMetafield | null;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { edges: { node: ShopifyProduct }[] };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyMoney };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: ShopifySelectedOption[];
    image: ShopifyImage | null;
    price: ShopifyMoney;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: { edges: { node: ShopifyCartLine }[] };
}

export interface ShopifyUserError {
  field: string[] | null;
  message: string;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}
