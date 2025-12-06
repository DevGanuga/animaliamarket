import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { storefrontClient } from "@/lib/shopify/client";
import { GET_COLLECTION_WITH_PRODUCTS } from "@/lib/shopify/queries/collections";
import { Header, Footer } from "@/components/layout";
import { ProductGrid } from "@/components/product";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionFilters } from "./CollectionFilters";

interface CollectionProduct {
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
}

interface CollectionData {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: { url: string; altText?: string | null };
  products: {
    edges: Array<{ node: CollectionProduct }>;
  };
}

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string; availability?: string }>;
}

interface FetchResult {
  collection: CollectionData | null;
  error: boolean;
}

async function getCollectionData(handle: string): Promise<FetchResult> {
  try {
    const { data, errors } = await storefrontClient<{ collection: CollectionData | null }>(
      GET_COLLECTION_WITH_PRODUCTS,
      { handle, first: 100 }
    );
    
    if (errors && errors.length > 0) {
      return { collection: null, error: true };
    }
    
    return { collection: data?.collection || null, error: false };
  } catch {
    console.error(`Failed to fetch collection: ${handle}`);
    return { collection: null, error: true };
  }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { collection } = await getCollectionData(resolvedParams.handle);

  if (!collection) {
    return { title: "Collection | Animalia" };
  }

  return {
    title: `${collection.title} | Animalia`,
    description: collection.description || `Shop our ${collection.title} collection`,
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { collection, error } = await getCollectionData(resolvedParams.handle);

  // Show error state if API failed
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--cream)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <span className="text-6xl mb-6 block">🔌</span>
            <h1 className="font-serif text-3xl text-[var(--stone-800)] mb-4">
              Unable to Load Collection
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
                href={`/collections/${resolvedParams.handle}`}
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

  // 404 if collection genuinely doesn't exist
  if (!collection) {
    notFound();
  }

  let products = collection.products.edges.map((edge) => edge.node);

  // Apply filters
  if (resolvedSearchParams.availability === "in-stock") {
    products = products.filter((p) => p.availableForSale);
  }

  // Apply sorting
  if (resolvedSearchParams.sort) {
    switch (resolvedSearchParams.sort) {
      case "price-asc":
        products.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-desc":
        products.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
        );
        break;
      case "title-asc":
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        products.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
  }

  // Get unique vendors for filters
  const vendors = [...new Set(products.map((p) => p.vendor).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />
      
      {/* Collection Header */}
      <CollectionHeader
        title={collection.title}
        description={collection.description}
        image={collection.image}
        productCount={products.length}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Filters Bar */}
        <Suspense fallback={<div className="h-12 bg-[var(--stone-100)] rounded-lg animate-pulse mb-8" />}>
          <CollectionFilters
            totalProducts={products.length}
            vendors={vendors}
            currentSort={resolvedSearchParams.sort}
            currentAvailability={resolvedSearchParams.availability}
          />
        </Suspense>

        {/* Products Grid */}
        <ProductGrid products={products} columns={4} />
      </div>
      
      <Footer />
    </div>
  );
}
