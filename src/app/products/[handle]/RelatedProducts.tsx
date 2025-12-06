import { storefrontClient } from "@/lib/shopify/client";
import { ProductCard } from "@/components/product";

interface RelatedProductsProps {
  productType: string;
  currentProductId: string;
}

const GET_RELATED_PRODUCTS = `
  query getRelatedProducts($productType: String!, $first: Int!) {
    products(first: $first, query: $productType) {
      edges {
        node {
          id
          handle
          title
          vendor
          availableForSale
          tags
          featuredImage {
            url
            altText
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
    }
  }
`;

export async function RelatedProducts({ productType, currentProductId }: RelatedProductsProps) {
  const { data } = await storefrontClient<{
    products: {
      edges: Array<{
        node: {
          id: string;
          handle: string;
          title: string;
          vendor: string;
          availableForSale: boolean;
          tags: string[];
          featuredImage?: { url: string; altText?: string | null };
          priceRange: {
            minVariantPrice: { amount: string; currencyCode: string };
          };
          compareAtPriceRange?: {
            minVariantPrice: { amount: string; currencyCode: string };
          };
        };
      }>;
    };
  }>(GET_RELATED_PRODUCTS, {
    productType: productType ? `product_type:${productType}` : "",
    first: 5,
  });

  const relatedProducts =
    data?.products?.edges
      .map((edge) => edge.node)
      .filter((product) => product.id !== currentProductId)
      .slice(0, 4) || [];

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-[var(--stone-200)]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl text-[var(--stone-800)]">
          You Might Also Like
        </h2>
        <a
          href={`/collections/${productType?.toLowerCase().replace(/\s+/g, "-") || "all"}`}
          className="text-sm font-medium text-[var(--sage-600)] hover:text-[var(--sage-700)] transition-colors flex items-center gap-1"
        >
          View All
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {relatedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 2} />
        ))}
      </div>
    </div>
  );
}



