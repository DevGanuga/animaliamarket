import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { storefrontClient } from "@/lib/shopify/client";
import { GET_PRODUCT_BY_HANDLE } from "@/lib/shopify/queries/products";
import { Header, Footer } from "@/components/layout";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

interface ProductData {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{
      node: { url: string; altText?: string | null };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
        price: { amount: string; currencyCode: string };
        compareAtPrice?: { amount: string; currencyCode: string } | null;
        image?: { url: string; altText?: string | null } | null;
      };
    }>;
  };
}

interface FetchResult {
  product: ProductData | null;
  error: boolean;
}

async function getProductData(handle: string): Promise<FetchResult> {
  try {
    const { data, errors } = await storefrontClient<{ product: ProductData | null }>(
      GET_PRODUCT_BY_HANDLE,
      { handle }
    );
    
    // Only treat as error if we have no data at all
    // GraphQL can return partial data with some errors (e.g., missing metafields)
    if (!data?.product && errors && errors.length > 0) {
      console.error(`Product fetch errors for ${handle}:`, errors);
      return { product: null, error: true };
    }
    
    return { product: data?.product || null, error: false };
  } catch {
    console.error(`Failed to fetch product: ${handle}`);
    return { product: null, error: true };
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { product } = await getProductData(resolvedParams.handle);

  if (!product) {
    return { title: "Product | Animalia" };
  }

  return {
    title: `${product.title} | Animalia`,
    description: product.description?.slice(0, 160) || `Shop ${product.title}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  const { product, error } = await getProductData(resolvedParams.handle);

  // Show error state if API failed
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <span className="text-6xl mb-6 block">🔌</span>
            <h1 className="font-serif text-3xl text-[var(--stone-800)] mb-4">
              Unable to Load Product
            </h1>
            <p className="text-[var(--stone-600)] mb-8 max-w-md mx-auto">
              We&apos;re having trouble connecting to our store. Please check back in a moment.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-[var(--sage-500)] text-white font-medium rounded-xl hover:bg-[var(--sage-600)] transition-colors"
              >
                Go Home
              </Link>
              <Link
                href={`/products/${resolvedParams.handle}`}
                className="px-6 py-3 border border-[var(--stone-300)] text-[var(--stone-700)] font-medium rounded-xl hover:bg-[var(--stone-100)] transition-colors"
              >
                Try Again
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 404 if product genuinely doesn't exist
  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((edge) => edge.node);
  const variants = product.variants.edges.map((edge) => edge.node);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-[var(--stone-500)]">
          <a href="/" className="hover:text-[var(--sage-600)] transition-colors">
            Home
          </a>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {product.productType && (
            <>
              <a
                href={`/collections/${product.productType.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-[var(--sage-600)] transition-colors"
              >
                {product.productType}
              </a>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-[var(--stone-700)] truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Gallery */}
          <ProductGallery images={images} title={product.title} />

          {/* Right: Info */}
          <ProductInfo
            product={{
              id: product.id,
              title: product.title,
              vendor: product.vendor,
              description: product.description,
              options: product.options,
              variants: variants,
              priceRange: product.priceRange,
              compareAtPriceRange: product.compareAtPriceRange,
              availableForSale: product.availableForSale,
              tags: product.tags,
            }}
          />
        </div>

        {/* Product Tabs */}
        <ProductTabs
          description={product.descriptionHtml}
          vendor={product.vendor}
        />
      </div>

      {/* Trust Section */}
      <section className="bg-white py-16 border-y border-[var(--stone-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl lg:text-3xl text-[var(--stone-800)] mb-3">
              Why Pet Parents Trust Animalia
            </h2>
            <p className="text-[var(--stone-600)]">Quality you can count on</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "🩺", title: "Vet Formulated", desc: "Developed with veterinary experts" },
              { icon: "🌿", title: "Natural Ingredients", desc: "No artificial fillers or additives" },
              { icon: "✅", title: "Quality Tested", desc: "Third-party verified for purity" },
              { icon: "🇺🇸", title: "Made in USA", desc: "Manufactured in certified facilities" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-semibold text-[var(--stone-800)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--stone-600)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Banner */}
      <section className="relative h-[40vh] min-h-[300px]">
        <Image
          src="/images/lifestyle-family.jpg"
          alt="Happy pets with their family"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--stone-900)]/70 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg">
              <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
                For Pets Who Are Family
              </h2>
              <p className="text-white/90 mb-6">
                Every product we carry is one we&apos;d give our own pets. That&apos;s our promise.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
              >
                Learn About Our Mission
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <RelatedProducts
          productType={product.productType}
          currentProductId={product.id}
        />
      </div>
      
      <Footer />
    </div>
  );
}
