import { storefrontClient } from "@/lib/shopify/client";
import { ProductCard } from "@/components/product";
import Link from "next/link";

interface RelatedProductsProps {
  currentProductId: string;
}

const GET_RELATED_PRODUCTS = `
  query GetRelatedProducts($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      handle
      title
      vendor
      availableForSale
      tags
      options {
        name
        values
      }
      featuredImage {
        url
        altText
      }
      variants(first: 1) {
        edges {
          node {
            id
            title
            availableForSale
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export async function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const { data } = await storefrontClient<{
    productRecommendations: Array<{
      id: string;
      handle: string;
      title: string;
      vendor: string;
      availableForSale: boolean;
      tags: string[];
      options?: Array<{ name: string; values: string[] }>;
      featuredImage?: { url: string; altText?: string | null };
      variants?: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            availableForSale: boolean;
          };
        }>;
      };
      priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
      };
      compareAtPriceRange?: {
        minVariantPrice: { amount: string; currencyCode: string };
      };
    }>;
  }>(GET_RELATED_PRODUCTS, {
    productId: currentProductId,
  });

  const relatedProducts =
    data?.productRecommendations?.filter((product) => product.id !== currentProductId).slice(0, 4) || [];

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-[var(--stone-200)]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl text-[var(--stone-800)]">
          Build a better routine
        </h2>
        <Link
          href="/collections"
          className="text-sm font-medium text-[var(--sage-600)] hover:text-[var(--sage-700)] transition-colors flex items-center gap-1"
        >
          Shop more concerns
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </div>
    </div>
  );
}
