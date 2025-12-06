/**
 * Shop-related GraphQL queries for the Storefront API
 */

/**
 * Get basic shop information
 */
export const GET_SHOP = `
  query GetShop {
    shop {
      name
      description
      brand {
        logo {
          image {
            url
          }
        }
        colors {
          primary {
            background
            foreground
          }
          secondary {
            background
            foreground
          }
        }
      }
      primaryDomain {
        url
        host
      }
    }
  }
`;

/**
 * Get navigation menu by handle
 */
export const GET_MENU = `
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      id
      handle
      title
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
        }
      }
    }
  }
`;

/**
 * Get a page by handle (for About, Contact, etc.)
 */
export const GET_PAGE = `
  query GetPage($handle: String!) {
    page(handle: $handle) {
      id
      handle
      title
      body
      bodySummary
      seo {
        title
        description
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get all pages
 */
export const GET_PAGES = `
  query GetPages($first: Int!) {
    pages(first: $first) {
      edges {
        node {
          id
          handle
          title
          bodySummary
        }
      }
    }
  }
`;



