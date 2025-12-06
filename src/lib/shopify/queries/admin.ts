/**
 * Admin API Queries
 * 
 * These queries require the Admin API access token and should
 * ONLY be used server-side (Server Components, Server Actions, API Routes)
 */

/**
 * Get all products with full details for management
 */
export const ADMIN_GET_PRODUCTS = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          handle
          description
          descriptionHtml
          status
          productType
          vendor
          tags
          totalInventory
          priceRangeV2 {
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
            url
            altText
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                sku
                price
                compareAtPrice
                inventoryQuantity
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
          seo {
            title
            description
          }
          createdAt
          updatedAt
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
 * Get all collections with product counts
 */
export const ADMIN_GET_COLLECTIONS = `
  query GetCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            url
            altText
          }
          productsCount {
            count
          }
          seo {
            title
            description
          }
          sortOrder
          ruleSet {
            rules {
              column
              condition
              relation
            }
          }
          updatedAt
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
 * Get a single product by ID for editing
 */
export const ADMIN_GET_PRODUCT = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      descriptionHtml
      status
      productType
      vendor
      tags
      options {
        id
        name
        position
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            sku
            price
            compareAtPrice
            inventoryQuantity
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
          }
        }
      }
      images(first: 20) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
      seo {
        title
        description
      }
      metafields(first: 20) {
        edges {
          node {
            id
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

/**
 * Update a product's basic info
 */
export const ADMIN_UPDATE_PRODUCT = `
  mutation UpdateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        description
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Update a collection
 */
export const ADMIN_UPDATE_COLLECTION = `
  mutation UpdateCollection($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        id
        title
        description
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;



