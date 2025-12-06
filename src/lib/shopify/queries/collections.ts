/**
 * Collection-related GraphQL queries for the Storefront API
 */

const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
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

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFields on Product {
    id
    handle
    title
    description
    availableForSale
    vendor
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
    variants(first: 1) {
      edges {
        node {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

/**
 * Get all collections
 */
export const GET_COLLECTIONS = `
  ${COLLECTION_FRAGMENT}
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        cursor
        node {
          ...CollectionFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Get a single collection by handle with its products
 */
export const GET_COLLECTION_BY_HANDLE = `
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query GetCollectionByHandle(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          cursor
          node {
            ...ProductCardFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
          }
        }
      }
    }
  }
`;

/**
 * Get collection by handle with filtered products
 */
export const GET_COLLECTION_WITH_FILTERS = `
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
  query GetCollectionWithFilters(
    $handle: String!
    $first: Int!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: $first, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductCardFields
          }
        }
        filters {
          id
          label
          type
          values {
            id
            label
            count
          }
        }
      }
    }
  }
`;

/**
 * Get featured collection for homepage (e.g., "calm-canine" launch collection)
 */
export const GET_FEATURED_COLLECTION = `
  ${PRODUCT_CARD_FRAGMENT}
  query GetFeaturedCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, sortKey: BEST_SELLING) {
        edges {
          node {
            ...ProductCardFields
          }
        }
      }
    }
  }
`;

/**
 * Alias for GET_COLLECTION_BY_HANDLE
 */
export const GET_COLLECTION_WITH_PRODUCTS = GET_COLLECTION_BY_HANDLE;

