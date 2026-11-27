export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

/** Admin API's `ProductVariant` node, trimmed to what order validation needs. */
export interface AdminProductVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  inventoryPolicy: "DENY" | "CONTINUE";
  inventoryQuantity: number | null;
  /** false = Shopify does not count stock for this variant (quantity is meaningless). */
  inventoryItem?: { tracked: boolean } | null;
  price: string;
  image: { url: string } | null;
  product: {
    id: string;
    title: string;
    status: "ACTIVE" | "ARCHIVED" | "DRAFT";
  };
}

export interface ShopifyUserError {
  field: string[] | null;
  message: string;
}

export interface ShippingAddressInput {
  address1: string;
  city: string;
  province?: string;
  country: string;
  zip?: string;
}

export interface CreateShopifyOrderInput {
  /**
   * `unitPrice` is only ever set by the server itself (landing-page bundle
   * offers in ../orders/landing-offers.ts) — never from client input.
   * When present it overrides the variant's catalog price on this line.
   */
  lineItems: { variantId: string; quantity: number; unitPrice?: string }[];
  customer: {
    email?: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  shippingAddress: ShippingAddressInput;
  note?: string;
  tags: string[];
  /** Order "source" shown in Shopify admin (e.g. "lp-cyclecare"). */
  sourceName?: string;
}

export interface CreateShopifyOrderResult {
  orderId: string;
  orderName: string;
}
