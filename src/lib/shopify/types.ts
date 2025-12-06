/**
 * Shopify API Types for Animalia
 * These types represent the data structures returned by Shopify's GraphQL APIs
 */

// ============================================================================
// Core Types
// ============================================================================

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SEO {
  title: string | null;
  description: string | null;
}

// ============================================================================
// Product Types
// ============================================================================

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  productType: string;
  vendor: string;
  tags: string[];
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: Image | null;
  images: Connection<Image>;
  variants: Connection<ProductVariant>;
  seo: SEO;
  metafields: Metafield[];
}

export interface Metafield {
  key: string;
  namespace: string;
  value: string;
  type: string;
}

// ============================================================================
// Collection Types
// ============================================================================

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  products: Connection<Product>;
  seo: SEO;
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartLineItem {
  id: string;
  quantity: number;
  merchandise: ProductVariant & {
    product: Pick<Product, 'id' | 'handle' | 'title' | 'featuredImage'>;
  };
  attributes: {
    key: string;
    value: string;
  }[];
  cost: {
    totalAmount: Money;
    amountPerQuantity: Money;
    compareAtAmountPerQuantity: Money | null;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
  lines: Connection<CartLineItem>;
  attributes: {
    key: string;
    value: string;
  }[];
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
    totalTaxAmount: Money | null;
    totalDutyAmount: Money | null;
  };
  buyerIdentity: {
    email: string | null;
    phone: string | null;
    countryCode: string | null;
  };
  totalQuantity: number;
}

export interface CartInput {
  lines?: {
    merchandiseId: string;
    quantity: number;
    attributes?: {
      key: string;
      value: string;
    }[];
  }[];
  attributes?: {
    key: string;
    value: string;
  }[];
  buyerIdentity?: {
    email?: string;
    phone?: string;
    countryCode?: string;
  };
}

// ============================================================================
// Shop Types
// ============================================================================

export interface Shop {
  name: string;
  description: string | null;
  brand: {
    logo: Image | null;
    colors: {
      primary: { background: string; foreground: string }[];
      secondary: { background: string; foreground: string }[];
    };
  } | null;
  primaryDomain: {
    url: string;
    host: string;
  };
}

// ============================================================================
// Connection Types (Shopify's pagination pattern)
// ============================================================================

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ShopifyError {
  message: string;
  extensions?: {
    code: string;
    requestId: string;
  };
}

export interface ShopifyResponse<T> {
  data?: T;
  errors?: ShopifyError[];
}

// ============================================================================
// Menu/Navigation Types
// ============================================================================

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: string;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  handle: string;
  title: string;
  items: MenuItem[];
}

// ============================================================================
// Helper type to extract nodes from connections
// ============================================================================

export type ConnectionNodes<T> = T extends Connection<infer U> ? U[] : never;

/**
 * Utility function to extract nodes from a Shopify connection
 */
export function getNodes<T>(connection: Connection<T>): T[] {
  return connection.edges.map((edge) => edge.node);
}



