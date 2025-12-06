/**
 * Product-related GraphQL queries for the Storefront API
 */

// Fragment for consistent product data structure
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    productType
    vendor
    tags
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
`;

const VARIANT_FRAGMENT = `
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    image {
      id
      url
      altText
      width
      height
    }
  }
`;

/**
 * Get all products with pagination
 */
export const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: TITLE) {
      edges {
        cursor
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/**
 * Get a single product by handle (URL slug)
 */
export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  ${VARIANT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
      images(first: 20) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            ...VariantFields
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "ingredients" },
        { namespace: "custom", key: "benefits" },
        { namespace: "custom", key: "usage" }
      ]) {
        key
        namespace
        value
        type
      }
    }
  }
`;

/**
 * Get a single product by ID
 */
export const GET_PRODUCT_BY_ID = `
  ${PRODUCT_FRAGMENT}
  ${VARIANT_FRAGMENT}
  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductFields
      images(first: 20) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            ...VariantFields
          }
        }
      }
    }
  }
`;

/**
 * Get product recommendations based on a product ID
 */
export const GET_PRODUCT_RECOMMENDATIONS = `
  ${PRODUCT_FRAGMENT}
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
`;

/**
 * Search products by query
 */
export const SEARCH_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            ...ProductFields
          }
        }
      }
      totalCount
    }
  }
`;

/**
 * Get products filtered by type (e.g., "Calming Chews", "Anxiety Relief")
 */
export const GET_PRODUCTS_BY_TYPE = `
  ${PRODUCT_FRAGMENT}
  query GetProductsByType($productType: String!, $first: Int!) {
    products(first: $first, query: $productType) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;



