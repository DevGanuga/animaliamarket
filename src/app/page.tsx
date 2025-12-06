import { storefrontClient } from "@/lib/shopify/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/product";
import Link from "next/link";
import Image from "next/image";

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  availableForSale: boolean;
  tags: string[];
  featuredImage?: { url: string; altText?: string | null };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
}

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: { url: string; altText?: string | null };
  products: { edges: Array<{ node: { id: string } }> };
}

// Fetch featured products
async function getFeaturedProducts(): Promise<ShopifyProduct[]> {
  try {
    const query = `
      query getProducts($first: Int!) {
        products(first: $first, sortKey: BEST_SELLING) {
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

    const { data } = await storefrontClient<{
      products: { edges: Array<{ node: ShopifyProduct }> };
    }>(query, { first: 8 });

    return data?.products?.edges.map((e) => e.node) || [];
  } catch {
    console.error('Failed to fetch products');
    return [];
  }
}

// Fetch collections
async function getCollections(): Promise<ShopifyCollection[]> {
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
              products(first: 1) {
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
    }>(query, { first: 24 });

    return data?.collections?.edges.map((e) => e.node) || [];
  } catch {
    console.error('Failed to fetch collections');
    return [];
  }
}

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getFeaturedProducts(),
    getCollections(),
  ]);

  // Get featured collections (with products)
  const featuredCollections = collections
    .filter((c) => c.products.edges.length > 0)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--sage-50)] via-[var(--cream)] to-[var(--gold-50)]" />
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, var(--sage-100) 0%, transparent 40%),
                           radial-gradient(circle at 70% 80%, var(--gold-100) 0%, transparent 40%)`
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-sm font-medium rounded-full mb-6">
              Premium Pet Wellness
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--stone-800)] leading-tight mb-6">
              Everything Your Pet Needs to{" "}
              <span className="text-[var(--sage-600)]">Thrive</span>
            </h1>
            <p className="text-lg text-[var(--stone-600)] mb-8 max-w-xl">
              Curated, premium products for pets who are family. From supplements to nutrition, 
              we only carry what we trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/collections/all"
                className="px-8 py-4 bg-[var(--stone-800)] text-white font-semibold rounded-xl hover:bg-[var(--stone-900)] transition-all shadow-lg hover:shadow-xl"
              >
                Shop All Products
              </Link>
              <Link
                href="/collections/organic-canine-supplements-hip-and-joint"
                className="px-8 py-4 bg-white text-[var(--stone-800)] font-semibold rounded-xl border border-[var(--stone-200)] hover:border-[var(--stone-300)] hover:shadow-md transition-all"
              >
                Shop Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y border-[var(--stone-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🚚", title: "Free Shipping", subtitle: "Orders over $50" },
              { icon: "🩺", title: "Vet Approved", subtitle: "Quality assured" },
              { icon: "🔄", title: "Easy Returns", subtitle: "30-day policy" },
              { icon: "💬", title: "Expert Support", subtitle: "Here to help" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-[var(--stone-800)]">{item.title}</p>
                  <p className="text-sm text-[var(--stone-500)]">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-4">
              Shop by Category
            </h2>
            <p className="text-[var(--stone-600)] max-w-xl mx-auto">
              Find exactly what you need for your furry family members
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { title: "Dog Supplements", href: "/collections/organic-canine-supplements-hip-and-joint", color: "from-amber-100 to-amber-50", emoji: "🐕" },
              { title: "Cat Supplements", href: "/collections/calm-feline-supplements", color: "from-violet-100 to-violet-50", emoji: "🐱" },
              { title: "Dog Food", href: "/collections/canine-dry-foods", color: "from-emerald-100 to-emerald-50", emoji: "🥩" },
              { title: "Cat Food", href: "/collections/feline-dry-foods", color: "from-rose-100 to-rose-50", emoji: "🐟" },
            ].map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.color} p-6 lg:p-8 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                <span className="text-5xl lg:text-6xl mb-4 block">{cat.emoji}</span>
                <h3 className="font-semibold text-[var(--stone-800)] text-lg">
                  {cat.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm text-[var(--stone-600)] mt-2 group-hover:text-[var(--stone-800)]">
                  Shop Now
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-2">
                  Featured Collections
                </h2>
                <p className="text-[var(--stone-600)]">
                  Explore our curated selections
                </p>
              </div>
              <Link
                href="/collections"
                className="hidden sm:flex items-center gap-2 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)]"
              >
                View All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {featuredCollections.map((collection, index) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className={`group relative overflow-hidden rounded-2xl bg-[var(--stone-100)] ${
                    index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                  }`}
                >
                  <div className={`relative ${index === 0 ? "aspect-[2/1] lg:aspect-square" : "aspect-[4/3]"}`}>
                    {collection.image ? (
                      <Image
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--sage-100)] to-[var(--stone-100)]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className={`font-serif text-white ${index === 0 ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl"}`}>
                        {collection.title}
                      </h3>
                      {collection.description && index === 0 && (
                        <p className="text-white/80 mt-2 line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {products.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-sm font-medium text-[var(--sage-600)] uppercase tracking-wider mb-2 block">
                  Best Sellers
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">
                  Our Most Loved Products
                </h2>
              </div>
              <Link
                href="/collections/all"
                className="hidden sm:flex items-center gap-2 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)]"
              >
                Shop All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <ProductGrid products={products} columns={4} />
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="py-16 lg:py-24 bg-[var(--sage-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-medium text-[var(--sage-600)] uppercase tracking-wider mb-4 block">
                Our Promise
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-6">
                For Pets Who Are Family
              </h2>
              <p className="text-[var(--stone-600)] leading-relaxed mb-6">
                At Animalia, we believe your pets deserve the very best. That's why we 
                carefully curate every product in our store, ensuring it meets our strict 
                standards for quality, safety, and efficacy.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Premium, vet-approved products only",
                  "Transparent ingredients & sourcing",
                  "No artificial fillers or harmful additives",
                  "30-day satisfaction guarantee",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[var(--stone-700)]">
                    <svg className="w-5 h-5 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)]"
              >
                Learn More About Us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "230+", label: "Premium Products" },
                { number: "24", label: "Curated Collections" },
                { number: "50+", label: "Trusted Brands" },
                { number: "100%", label: "Satisfaction" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white p-6 rounded-2xl shadow-sm text-center"
                >
                  <p className="font-serif text-3xl lg:text-4xl text-[var(--sage-600)] mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm text-[var(--stone-600)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24 bg-[var(--stone-800)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[var(--sage-400)] text-sm font-medium uppercase tracking-wider mb-4 block">
            Stay in the Loop
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            Join the Animalia Family
          </h2>
          <p className="text-[var(--stone-400)] mb-8">
            Get 15% off your first order plus exclusive tips, new arrivals, and special offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-[var(--stone-500)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[var(--sage-500)] text-white font-semibold rounded-xl hover:bg-[var(--sage-600)] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-[var(--stone-500)] mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
