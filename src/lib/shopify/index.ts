/**
 * Shopify Integration for Animalia
 *
 * This module provides a clean interface to interact with Shopify's APIs.
 *
 * ARCHITECTURE:
 * - Storefront API (client.ts): Public queries - products, collections, cart
 * - Admin API (admin.ts): Private queries - inventory, orders, fulfillment
 *
 * USAGE:
 * ```ts
 * import { shopify } from '@/lib/shopify';
 *
 * // Fetch products
 * const products = await shopify.getProducts();
 *
 * // Get a single product
 * const product = await shopify.getProductByHandle('calming-chews');
 *
 * // Create a cart
 * const cart = await shopify.createCart();
 * ```
 */

import { storefrontFetch, fetchProducts, fetchCollections, fetchCart } from './client';
import { 
  adminFetch, 
  getProductsWithInventory, 
  getRecentOrders,
  getAllProducts as adminGetAllProducts,
  getAllCollections as adminGetAllCollections,
  updateProduct as adminUpdateProduct,
  updateCollection as adminUpdateCollection,
} from './admin';
import { Product, Collection, Cart, Connection, getNodes } from './types';

// Queries
import { GET_PRODUCTS, GET_PRODUCT_BY_HANDLE, GET_PRODUCT_RECOMMENDATIONS, SEARCH_PRODUCTS } from './queries/products';
import { GET_COLLECTIONS, GET_COLLECTION_BY_HANDLE, GET_FEATURED_COLLECTION } from './queries/collections';
import { GET_SHOP, GET_MENU, GET_PAGE } from './queries/shop';
import { CREATE_CART, GET_CART, ADD_TO_CART, UPDATE_CART_LINES, REMOVE_FROM_CART, APPLY_DISCOUNT_CODE } from './mutations/cart';

// ============================================================================
// Product Operations
// ============================================================================

export async function getProducts(first: number = 20, after?: string) {
  const data = await fetchProducts<{ products: Connection<Product> }>(
    GET_PRODUCTS,
    { first, after }
  );
  return {
    products: getNodes(data.products),
    pageInfo: data.products.pageInfo,
  };
}

export async function getProductByHandle(handle: string) {
  const data = await fetchProducts<{ product: Product | null }>(
    GET_PRODUCT_BY_HANDLE,
    { handle }
  );
  return data.product;
}

export async function getProductRecommendations(productId: string) {
  const data = await fetchProducts<{ productRecommendations: Product[] }>(
    GET_PRODUCT_RECOMMENDATIONS,
    { productId }
  );
  return data.productRecommendations;
}

export async function searchProducts(query: string, first: number = 20) {
  const data = await fetchProducts<{
    search: { edges: { node: Product }[]; totalCount: number };
  }>(SEARCH_PRODUCTS, { query, first });
  return {
    products: data.search.edges.map((edge) => edge.node),
    totalCount: data.search.totalCount,
  };
}

// ============================================================================
// Collection Operations
// ============================================================================

export async function getCollections(first: number = 20) {
  const data = await fetchCollections<{ collections: Connection<Collection> }>(
    GET_COLLECTIONS,
    { first }
  );
  return getNodes(data.collections);
}

export async function getCollectionByHandle(
  handle: string,
  options: {
    first?: number;
    after?: string;
    sortKey?: 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'CREATED' | 'MANUAL';
    reverse?: boolean;
  } = {}
) {
  const { first = 20, after, sortKey = 'BEST_SELLING', reverse = false } = options;
  const data = await fetchCollections<{ collection: Collection | null }>(
    GET_COLLECTION_BY_HANDLE,
    { handle, first, after, sortKey, reverse }
  );
  return data.collection;
}

export async function getFeaturedCollection(handle: string, first: number = 8) {
  const data = await fetchCollections<{
    collection: {
      id: string;
      handle: string;
      title: string;
      description: string;
      products: Connection<Product>;
    } | null;
  }>(GET_FEATURED_COLLECTION, { handle, first });

  if (!data.collection) return null;

  return {
    ...data.collection,
    products: getNodes(data.collection.products),
  };
}

// ============================================================================
// Shop Operations
// ============================================================================

export async function getShop() {
  const data = await storefrontFetch<{ shop: Record<string, unknown> }>({
    query: GET_SHOP,
  });
  return data.shop;
}

export async function getMenu(handle: string) {
  const data = await storefrontFetch<{
    menu: { id: string; handle: string; title: string; items: unknown[] } | null;
  }>({ query: GET_MENU, variables: { handle } });
  return data.menu;
}

export async function getPage(handle: string) {
  const data = await storefrontFetch<{
    page: {
      id: string;
      handle: string;
      title: string;
      body: string;
      bodySummary: string;
    } | null;
  }>({ query: GET_PAGE, variables: { handle } });
  return data.page;
}

// ============================================================================
// Cart Operations
// ============================================================================

export async function createCart(input: {
  lines?: { merchandiseId: string; quantity: number }[];
  buyerIdentity?: { email?: string; countryCode?: string };
} = {}) {
  const data = await fetchCart<{
    cartCreate: { cart: Cart; userErrors: { field: string; message: string }[] };
  }>(CREATE_CART, { input });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartCreate.cart;
}

export async function getCart(cartId: string) {
  const data = await fetchCart<{ cart: Cart | null }>(GET_CART, { cartId });
  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
) {
  const data = await fetchCart<{
    cartLinesAdd: { cart: Cart; userErrors: { field: string; message: string }[] };
  }>(ADD_TO_CART, { cartId, lines });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
) {
  const data = await fetchCart<{
    cartLinesUpdate: { cart: Cart; userErrors: { field: string; message: string }[] };
  }>(UPDATE_CART_LINES, { cartId, lines });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await fetchCart<{
    cartLinesRemove: { cart: Cart; userErrors: { field: string; message: string }[] };
  }>(REMOVE_FROM_CART, { cartId, lineIds });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartLinesRemove.cart;
}

export async function applyDiscountCode(cartId: string, discountCodes: string[]) {
  const data = await fetchCart<{
    cartDiscountCodesUpdate: {
      cart: Cart & { discountCodes: { code: string; applicable: boolean }[] };
      userErrors: { field: string; message: string }[];
    };
  }>(APPLY_DISCOUNT_CODE, { cartId, discountCodes });

  if (data.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(data.cartDiscountCodesUpdate.userErrors.map((e) => e.message).join(', '));
  }

  return data.cartDiscountCodesUpdate.cart;
}

// ============================================================================
// Unified Export
// ============================================================================

export const shopify = {
  // Products
  getProducts,
  getProductByHandle,
  getProductRecommendations,
  searchProducts,

  // Collections
  getCollections,
  getCollectionByHandle,
  getFeaturedCollection,

  // Shop
  getShop,
  getMenu,
  getPage,

  // Cart
  createCart,
  getCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  applyDiscountCode,

  // Admin (server-only)
  admin: {
    fetch: adminFetch,
    getProductsWithInventory,
    getRecentOrders,
    getAllProducts: adminGetAllProducts,
    getAllCollections: adminGetAllCollections,
    updateProduct: adminUpdateProduct,
    updateCollection: adminUpdateCollection,
  },
};

// Re-export types
export * from './types';

