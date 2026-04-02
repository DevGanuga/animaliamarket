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
import {
  getCleanProductDescription,
  getProductConcernLabel,
  getProductIngredients,
  getProductOverviewParagraphs,
  getProductUsage,
} from "@/lib/merchandising";
import { getLocalPhotoshootImages } from "@/lib/photoshoot";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

interface ProductData {
  id: string;
  handle: string;
  title: string;
  description?: string;
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
  metafields?: Array<{
    key: string;
    namespace: string;
    value: string;
    type: string;
  }>;
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

  const cleanDescription = getCleanProductDescription({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });

  return {
    title: `${product.title} | Animalia`,
    description: cleanDescription.slice(0, 160) || `Shop ${product.title}`,
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

  const shopifyImages = product.images.edges.map((edge) => edge.node);
  const localPhotoshootImages = getLocalPhotoshootImages(product.handle, product.title);
  const images = localPhotoshootImages.length > 0 ? localPhotoshootImages : shopifyImages;
  const variants = product.variants.edges.map((edge) => edge.node);
  const concernLabel = getProductConcernLabel({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const cleanDescription = getCleanProductDescription({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const overviewParagraphs = getProductOverviewParagraphs({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const ingredients = getProductIngredients({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const usage = getProductUsage({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-[var(--stone-500)]">
          <Link href="/" className="hover:text-[var(--sage-600)] transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/collections" className="hover:text-[var(--sage-600)] transition-colors">
            Collections
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[var(--stone-500)]">{concernLabel}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[var(--stone-700)] truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-[var(--stone-100)] sm:p-5">
            <ProductGallery images={images} title={product.title} />
          </div>

          <ProductInfo
            product={{
              id: product.id,
              title: product.title,
              vendor: product.vendor,
              description: cleanDescription,
              options: product.options,
              variants: variants,
              priceRange: product.priceRange,
              compareAtPriceRange: product.compareAtPriceRange,
              availableForSale: product.availableForSale,
              tags: product.tags,
              metafields: product.metafields,
            }}
          />
        </div>

        {/* Product Tabs */}
        <ProductTabs
          vendor={product.vendor}
          overviewParagraphs={overviewParagraphs}
          ingredients={ingredients}
          usage={usage}
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
              { icon: "🎯", title: "Curated Selection", desc: "Every product is chosen to solve a real pet wellness need." },
              { icon: "📦", title: "In Stock & Ready", desc: "Everything you see is available and ready to ship today." },
              { icon: "🚚", title: "Free Shipping $50+", desc: "Free standard shipping on all orders over $50." },
              { icon: "💬", title: "Expert Support", desc: "Real pet people here to help you find the right product." },
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
          src="/images/animalia-routine-banner.png"
          alt="Happy pets with their family"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--stone-900)]/70 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-lg">
              <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
                Build a Better Wellness Routine
              </h2>
              <p className="text-white/90 mb-6">
                Start with the product that solves the clearest problem, then add the next most natural support item.
              </p>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all"
              >
                Shop More Concerns
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
          currentProductId={product.id}
        />
      </div>
      
      <Footer />
    </div>
  );
}
