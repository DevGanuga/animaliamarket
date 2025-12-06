/**
 * Shopify Storefront API Client
 *
 * This client handles all public-facing Shopify operations:
 * - Fetching products and collections
 * - Cart management
 * - Customer-facing data
 *
 * Uses the Storefront API which is designed for headless storefronts.
 */

import { ShopifyResponse } from './types';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

/**
 * Execute a GraphQL query against the Shopify Storefront API
 *
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @param cache - Next.js cache strategy (default: force-cache)
 * @param tags - Cache tags for on-demand revalidation
 * @returns The response data or throws an error
 *
 * @example
 * ```ts
 * const { products } = await storefrontFetch<ProductsQuery>({
 *   query: GET_PRODUCTS,
 *   variables: { first: 10 }
 * });
 * ```
 */
export async function storefrontFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache,
    next: tags ? { tags } : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify Storefront API error: ${response.status} - ${text}`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    const errorMessages = json.errors.map((e) => e.message).join(', ');
    throw new Error(`GraphQL Error: ${errorMessages}`);
  }

  if (!json.data) {
    throw new Error('No data returned from Shopify');
  }

  return json.data;
}

/**
 * Pre-configured fetch for product-related queries
 * Includes 'products' cache tag for easy revalidation
 */
export async function fetchProducts<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return storefrontFetch<T>({
    query,
    variables,
    tags: ['products'],
  });
}

/**
 * Pre-configured fetch for collection-related queries
 * Includes 'collections' cache tag for easy revalidation
 */
export async function fetchCollections<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return storefrontFetch<T>({
    query,
    variables,
    tags: ['collections'],
  });
}

/**
 * Pre-configured fetch for cart operations
 * Uses no-store cache since cart data should always be fresh
 */
export async function fetchCart<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return storefrontFetch<T>({
    query,
    variables,
    cache: 'no-store',
  });
}

/**
 * Simple client for storefront queries
 * Usage: storefrontClient<ResponseType>(query, variables)
 */
export async function storefrontClient<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data: T | null; errors?: Array<{ message: string }> }> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    return { data: json.data, errors: json.errors };
  } catch (error) {
    console.error('Storefront API error:', error);
    return { data: null, errors: [{ message: String(error) }] };
  }
}

