import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { storefrontClient } from "@/lib/shopify/client";
import { Header, Footer } from "@/components/layout";

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: { url: string; altText?: string | null };
  products: { edges: Array<{ node: { id: string } }> };
}

export const metadata: Metadata = {
  title: "Collections | Animalia",
  description: "Browse all our curated pet wellness collections",
};

async function getAllCollections(): Promise<ShopifyCollection[]> {
  try {
    const query = `
      query getCollections($first: Int!) {
        collections(first: $first) {
          edges {
            node {
              id
              handle
              title
              description
              image {
                url
                altText
              }
              products(first: 4) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `;

    const { data } = await storefrontClient<{
      collections: { edges: Array<{ node: ShopifyCollection }> };
    }>(query, { first: 50 });

    return data?.collections?.edges.map((e) => e.node) || [];
  } catch {
    console.error("Failed to fetch collections");
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  // Filter out empty collections
  const activeCollections = collections.filter(
    (c) => c.products.edges.length > 0
  );

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--sage-50)] to-[var(--cream)]">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, var(--sage-100) 0%, transparent 40%),
                               radial-gradient(circle at 70% 80%, var(--gold-100) 0%, transparent 40%)`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <nav className="flex items-center gap-2 text-sm text-[var(--stone-500)] mb-6">
            <Link href="/" className="hover:text-[var(--sage-600)] transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[var(--stone-700)]">Collections</span>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--stone-800)] mb-4">
            Our Collections
          </h1>
          <p className="text-lg text-[var(--stone-600)] max-w-2xl">
            Explore our carefully curated selections of premium pet wellness products.
            Each collection is designed to meet your pet&apos;s specific needs.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {activeCollections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className={`relative ${index === 0 ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--sage-100)] via-[var(--sage-50)] to-[var(--stone-100)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="font-serif text-xl lg:text-2xl text-white mb-2 group-hover:text-[var(--sage-200)] transition-colors">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="text-white/80 text-sm line-clamp-2 mb-3">
                    {collection.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  Shop Collection
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>

              {/* Product Count Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[var(--stone-700)]">
                {collection.products.edges.length}+ products
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {activeCollections.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📦</span>
            <h2 className="font-serif text-2xl text-[var(--stone-800)] mb-2">
              No Collections Yet
            </h2>
            <p className="text-[var(--stone-600)] mb-6">
              Collections are being curated. Check back soon!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--sage-500)] text-white font-medium rounded-xl hover:bg-[var(--sage-600)] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

