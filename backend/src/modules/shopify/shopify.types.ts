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
  lineItems: { variantId: string; quantity: number }[];
  customer: {
    email?: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  shippingAddress: ShippingAddressInput;
  note?: string;
  tags: string[];
}

export interface CreateShopifyOrderResult {
  orderId: string;
  orderName: string;
}
