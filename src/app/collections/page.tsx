import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { storefrontClient } from "@/lib/shopify/client";
import { Header, Footer } from "@/components/layout";
import {
  cleanCollectionTitle,
  getCollectionFallbackImage,
  getCollectionSpotlight,
  prioritizeCollectionHandles,
} from "@/lib/merchandising";

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

// Map collection titles to appropriate images
function getCollectionImage(title: string, image?: { url: string; altText?: string | null }) {
  if (image?.url) return image.url;
  return getCollectionFallbackImage(title);
}

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
  const prioritizedHandles = prioritizeCollectionHandles(collections.map((collection) => collection.handle));

  // Filter out empty collections
  const activeCollections = collections
    .filter((c) => c.products.edges.length > 0)
    .sort((a, b) => {
      const aIndex = prioritizedHandles.indexOf(a.handle);
      const bIndex = prioritizedHandles.indexOf(b.handle);

      if (aIndex !== -1 && bIndex !== -1 && aIndex !== bIndex) return aIndex - bIndex;
      return cleanCollectionTitle(a.title).localeCompare(cleanCollectionTitle(b.title));
    });

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/animalia-hero-editorial.png"
            alt="Animalia Collections"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-900)]/80 via-[var(--stone-900)]/40 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white">Collections</span>
          </nav>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white mb-4">
            Our Collections
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Start with the wellness concern that matters most, then compare the strongest in-stock options for that routine.
          </p>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Joint support */}
            <Link
              href="/collections/organic-canine-supplements-hip-and-joint"
              className="group relative overflow-hidden rounded-3xl aspect-[16/10]"
            >
              <Image
                src="/images/animalia-dog-joint-support.png"
                alt="Shop joint support"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-4xl mb-3 block">🦴</span>
                <h3 className="font-serif text-3xl text-white mb-2">Joint Support</h3>
                <p className="text-white/80 mb-4">The clearest high-intent collection for mobility, long-term support, and larger daily-use formats.</p>
                <span className="inline-flex items-center gap-2 text-white font-medium">
                  Shop Mobility →
                </span>
              </div>
            </Link>

            {/* Calming / dental */}
            <Link
              href="/collections/feline-dental-supplements"
              className="group relative overflow-hidden rounded-3xl aspect-[16/10]"
            >
              <Image
                src="/images/animalia-dental-routine.png"
                alt="Shop cat dental care"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-4xl mb-3 block">🪥</span>
                <h3 className="font-serif text-3xl text-white mb-2">Cat Dental Care</h3>
                <p className="text-white/80 mb-4">Low-friction daily care that pairs naturally with food, calming, and other repeat-order essentials.</p>
                <span className="inline-flex items-center gap-2 text-white font-medium">
                  Shop Dental →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* All Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="mb-12">
          <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-3">
            All Collections
          </h2>
          <p className="text-[var(--stone-600)]">
            Browse all {activeCollections.length} curated collections
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {activeCollections.map((collection) => {
            const spotlight = getCollectionSpotlight(collection.handle, collection.title);

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
              {/* Image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={collection.image?.url || spotlight.image || getCollectionImage(collection.title, collection.image)}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

              {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    {spotlight.label}
                  </p>
                  <h2 className="font-serif text-xl lg:text-2xl text-white mb-2 group-hover:text-[var(--sage-200)] transition-colors">
                    {spotlight.title || cleanCollectionTitle(collection.title)}
                  </h2>
                  <p className="text-white/80 text-sm line-clamp-3 mb-3">
                    {spotlight.description || collection.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90 group-hover:text-white group-hover:gap-3 transition-all">
                    Shop Collection
                    <svg
                      className="w-4 h-4"
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
            );
          })}
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--sage-500)] text-white font-medium rounded-full hover:bg-[var(--sage-600)] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="relative h-[40vh] min-h-[300px]">
        <Image
          src="/images/animalia-routine-banner.png"
          alt="Active pets"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4">
              Can&apos;t Find What You Need?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              If the right routine is not obvious yet, we can help narrow the best next purchase for your pet.
            </p>
            <Link
              href="/contact"
              className="inline-flex px-8 py-4 bg-white text-[var(--stone-800)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
