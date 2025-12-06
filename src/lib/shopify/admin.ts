/**
 * Shopify Admin API Client
 *
 * This client handles private/admin operations:
 * - Inventory management
 * - Order processing
 * - Fulfillment triggers
 * - Store configuration
 *
 * ⚠️ IMPORTANT: This client should ONLY be used in Server Components,
 * Server Actions, or API routes. NEVER expose admin tokens to the client.
 */

import { ShopifyResponse } from './types';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

/**
 * Execute a GraphQL query against the Shopify Admin API
 *
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @returns The response data or throws an error
 *
 * @example
 * ```ts
 * // In a Server Action or API route
 * const { orders } = await adminFetch<OrdersQuery>({
 *   query: GET_ORDERS,
 *   variables: { first: 50 }
 * });
 * ```
 */
export async function adminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  // Runtime check to prevent client-side usage
  if (typeof window !== 'undefined') {
    throw new Error(
      'adminFetch cannot be used on the client. Use Server Components or Server Actions.'
    );
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    // Admin queries should not be cached by default
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Admin API error: ${response.status} - ${text}`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    const errorMessages = json.errors.map((e) => e.message).join(', ');
    throw new Error(`GraphQL Error: ${errorMessages}`);
  }

  if (!json.data) {
    throw new Error('No data returned from Shopify Admin API');
  }

  return json.data;
}

// ============================================================================
// Admin-specific Types
// ============================================================================

export interface AdminProduct {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalInventory: number;
  variants: {
    edges: {
      node: {
        id: string;
        inventoryQuantity: number;
        price: string;
        sku: string;
      };
    }[];
  };
}

export interface AdminOrder {
  id: string;
  name: string;
  createdAt: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  fulfillmentStatus: string;
  financialStatus: string;
  customer: {
    id: string;
    email: string;
    displayName: string;
  } | null;
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
        } | null;
      };
    }[];
  };
}

// ============================================================================
// Common Admin Queries
// ============================================================================

/**
 * Fetch products with inventory data (Admin API only)
 */
export async function getProductsWithInventory(first: number = 50) {
  const query = `
    query GetProductsWithInventory($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            status
            totalInventory
            variants(first: 100) {
              edges {
                node {
                  id
                  inventoryQuantity
                  price
                  sku
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await adminFetch<{
    products: { edges: { node: AdminProduct }[] };
  }>({
    query,
    variables: { first },
  });

  return data.products.edges.map((edge) => edge.node);
}

/**
 * Fetch recent orders (Admin API only)
 */
export async function getRecentOrders(first: number = 50) {
  const query = `
    query GetRecentOrders($first: Int!) {
      orders(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            fulfillmentStatus
            financialStatus
            customer {
              id
              email
              displayName
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await adminFetch<{
    orders: { edges: { node: AdminOrder }[] };
  }>({
    query,
    variables: { first },
  });

  return data.orders.edges.map((edge) => edge.node);
}

// ============================================================================
// Product & Collection Management
// ============================================================================

export interface AdminProductFull {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  productType: string;
  vendor: string;
  tags: string[];
  totalInventory: number;
  priceRangeV2: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: { node: { id: string; url: string; altText: string | null } }[] };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        sku: string;
        price: string;
        compareAtPrice: string | null;
        inventoryQuantity: number;
        selectedOptions: { name: string; value: string }[];
      };
    }[];
  };
  collections: { edges: { node: { id: string; title: string; handle: string } }[] };
  seo: { title: string | null; description: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface AdminCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image: { url: string; altText: string | null } | null;
  productsCount: { count: number };
  seo: { title: string | null; description: string | null };
  sortOrder: string;
  updatedAt: string;
}

/**
 * Fetch ALL products from Admin API (with pagination)
 */
export async function getAllProducts(): Promise<AdminProductFull[]> {
  const allProducts: AdminProductFull[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  const query = `
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
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            featuredImage { url altText }
            images(first: 10) {
              edges { node { id url altText } }
            }
            variants(first: 100) {
              edges {
                node {
                  id title sku price compareAtPrice inventoryQuantity
                  selectedOptions { name value }
                }
              }
            }
            collections(first: 10) {
              edges { node { id title handle } }
            }
            seo { title description }
            createdAt
            updatedAt
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  type ProductsResponse = {
    products: {
      edges: { node: AdminProductFull }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };

  while (hasNextPage) {
    const data: ProductsResponse = await adminFetch<ProductsResponse>({
      query,
      variables: { first: 50, after: cursor },
    });

    allProducts.push(...data.products.edges.map((e) => e.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

/**
 * Fetch ALL collections from Admin API (with pagination)
 */
export async function getAllCollections(): Promise<AdminCollection[]> {
  const allCollections: AdminCollection[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  const query = `
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
            image { url altText }
            productsCount { count }
            seo { title description }
            sortOrder
            updatedAt
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  type CollectionsResponse = {
    collections: {
      edges: { node: AdminCollection }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };

  while (hasNextPage) {
    const data: CollectionsResponse = await adminFetch<CollectionsResponse>({
      query,
      variables: { first: 50, after: cursor },
    });

    allCollections.push(...data.collections.edges.map((e) => e.node));
    hasNextPage = data.collections.pageInfo.hasNextPage;
    cursor = data.collections.pageInfo.endCursor;
  }

  return allCollections;
}

/**
 * Update a product's title, description, etc.
 */
export async function updateProduct(input: {
  id: string;
  title?: string;
  descriptionHtml?: string;
  handle?: string;
  productType?: string;
  vendor?: string;
  tags?: string[];
  seo?: { title?: string; description?: string };
}) {
  const query = `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id title handle }
        userErrors { field message }
      }
    }
  `;

  const data = await adminFetch<{
    productUpdate: {
      product: { id: string; title: string; handle: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({ query, variables: { input } });

  if (data.productUpdate.userErrors.length > 0) {
    throw new Error(data.productUpdate.userErrors.map((e) => e.message).join(', '));
  }

  return data.productUpdate.product;
}

/**
 * Update a collection's title, description, etc.
 */
export async function updateCollection(input: {
  id: string;
  title?: string;
  descriptionHtml?: string;
  handle?: string;
  seo?: { title?: string; description?: string };
}) {
  const query = `
    mutation UpdateCollection($input: CollectionInput!) {
      collectionUpdate(input: $input) {
        collection { id title handle }
        userErrors { field message }
      }
    }
  `;

  const data = await adminFetch<{
    collectionUpdate: {
      collection: { id: string; title: string; handle: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({ query, variables: { input } });

  if (data.collectionUpdate.userErrors.length > 0) {
    throw new Error(data.collectionUpdate.userErrors.map((e) => e.message).join(', '));
  }

  return data.collectionUpdate.collection;
}

