/**
 * GraphQL documents for the Shopify Storefront API.
 *
 * `rating` is read from `custom.rating` (a merchant-owned decimal
 * metafield) rather than `reviews.rating` — the latter is a
 * Shopify-reserved standard metafield expecting the structured `rating`
 * type ({ value, scale_min, scale_max }), not a bare decimal, so writing
 * or defining a plain-decimal metafield there risks a type conflict.
 * `reviewCount` has no such reserved structured type, so it stays under
 * `reviews.rating_count` as originally set up. If your store uses a
 * different reviews app/namespace for either, update the aliases below —
 * fields simply come back null if the metafield doesn't exist, which the
 * mapper already handles.
 *
 * `features`/`benefits`/`ingredients`/`claims` are `custom` namespace
 * metafields written by `scripts/shopify-migration/migrate.ts` as JSON
 * arrays (`list.single_line_text_field`); `usage`/`precautions` are plain
 * strings (`multi_line_text_field`). Each metafield only resolves here if
 * it also has a metafield **definition** granting Storefront API read
 * access — a value can exist via the Admin API yet still come back `null`
 * from this query without one.
 */

const MONEY_FIELDS = `amount currencyCode`;

const IMAGE_FIELDS = `url altText width height`;

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    options {
      name
      values
    }
    featuredImage {
      ${IMAGE_FIELDS}
    }
    images(first: 10) {
      edges {
        node {
          id
          ${IMAGE_FIELDS}
        }
      }
    }
    priceRange {
      minVariantPrice { ${MONEY_FIELDS} }
      maxVariantPrice { ${MONEY_FIELDS} }
    }
    compareAtPriceRange {
      minVariantPrice { ${MONEY_FIELDS} }
      maxVariantPrice { ${MONEY_FIELDS} }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          price { ${MONEY_FIELDS} }
          compareAtPrice { ${MONEY_FIELDS} }
          selectedOptions { name value }
          image { ${IMAGE_FIELDS} }
        }
      }
    }
    ratingMetafield: metafield(namespace: "custom", key: "rating") {
      value
    }
    ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") {
      value
    }
    featuresMetafield: metafield(namespace: "custom", key: "features") {
      value
    }
    benefitsMetafield: metafield(namespace: "custom", key: "benefits") {
      value
    }
    ingredientsMetafield: metafield(namespace: "custom", key: "ingredients") {
      value
    }
    usageMetafield: metafield(namespace: "custom", key: "usage") {
      value
    }
    precautionsMetafield: metafield(namespace: "custom", key: "precautions") {
      value
    }
    claimsMetafield: metafield(namespace: "custom", key: "claims") {
      value
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ${MONEY_FIELDS} }
      totalAmount { ${MONEY_FIELDS} }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { ${MONEY_FIELDS} }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              image { ${IMAGE_FIELDS} }
              price { ${MONEY_FIELDS} }
              product {
                id
                handle
                title
                featuredImage { ${IMAGE_FIELDS} }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int = 50, $query: String, $language: LanguageCode)
  @inContext(language: $language) {
    products(first: $first, query: $query) {
      edges {
        node { ...ProductFragment }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!, $language: LanguageCode)
  @inContext(language: $language) {
    product(handle: $handle) { ...ProductFragment }
  }
`;

export const GET_PRODUCT_RECOMMENDATIONS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductRecommendations($productId: ID!, $language: LanguageCode)
  @inContext(language: $language) {
    productRecommendations(productId: $productId) { ...ProductFragment }
  }
`;

export const SEARCH_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query SearchProducts($query: String!, $first: Int = 8, $language: LanguageCode)
  @inContext(language: $language) {
    products(first: $first, query: $query) {
      edges {
        node { ...ProductFragment }
      }
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int = 50, $language: LanguageCode)
  @inContext(language: $language) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image { ${IMAGE_FIELDS} }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionByHandle($handle: String!, $first: Int = 50, $language: LanguageCode)
  @inContext(language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { ${IMAGE_FIELDS} }
      products(first: $first) {
        edges {
          node { ...ProductFragment }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!], $language: LanguageCode)
  @inContext(language: $language) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;

export const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!, $language: LanguageCode) @inContext(language: $language) {
    cart(id: $cartId) { ...CartFragment }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
`;
