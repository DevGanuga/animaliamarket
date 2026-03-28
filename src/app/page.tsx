import { storefrontClient } from "@/lib/shopify/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/product";
import {
  cleanCollectionTitle,
  getCollectionSpotlight,
  prioritizeCollectionHandles,
} from "@/lib/merchandising";
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
  options?: Array<{ name: string; values: string[] }>;
  variants?: {
    edges: Array<{
      node: { id: string; title: string; availableForSale: boolean };
    }>;
  };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
}

interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: { url: string; altText?: string | null };
  products: { edges: Array<{ node: { id: string; vendor: string } }> };
}

// Fetch featured products with VARIETY (different vendors)
async function getFeaturedProducts(): Promise<ShopifyProduct[]> {
  try {
    const query = `
      query getProducts($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
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
              options {
                name
                values
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
        }
      }
    `;

    const { data } = await storefrontClient<{
      products: { edges: Array<{ node: ShopifyProduct }> };
    }>(query, { first: 100 });

    const allProducts = data?.products?.edges.map((e) => e.node) || [];

    const scoreProduct = (product: ShopifyProduct) => {
      const text = `${product.title} ${product.vendor} ${product.tags.join(" ")}`.toLowerCase();
      const price = parseFloat(product.priceRange.minVariantPrice.amount);

      let score = product.availableForSale ? 20 : -100;
      score += Math.min(price, 120) / 4;

      if (text.includes("joint") || text.includes("hip") || text.includes("mobility")) score += 28;
      if (text.includes("calm") || text.includes("stress") || text.includes("anxiety")) score += 22;
      if (text.includes("dental") || text.includes("plaque") || text.includes("breath")) score += 20;
      if (text.includes("salmon oil") || text.includes("pollock oil") || text.includes("omega")) score += 18;
      if (text.includes("digest") || text.includes("probiotic")) score += 14;
      if (product.tags.includes("bestseller")) score += 10;

      return score;
    };

    const rankedProducts = [...allProducts].sort((a, b) => scoreProduct(b) - scoreProduct(a));
    const vendorCounts = new Map<string, number>();
    const featuredProducts: ShopifyProduct[] = [];

    for (const product of rankedProducts) {
      if (!product.availableForSale || featuredProducts.length >= 8) continue;

      const vendor = product.vendor || "Other";
      const currentVendorCount = vendorCounts.get(vendor) || 0;

      if (currentVendorCount >= 2) continue;

      featuredProducts.push(product);
      vendorCounts.set(vendor, currentVendorCount + 1);
    }

    return featuredProducts.slice(0, 8);
  } catch (error) {
    console.error('Failed to fetch products:', error);
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
              products(first: 10) {
                edges {
                  node {
                    id
                    vendor
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
    }>(query, { first: 30 });

    return data?.collections?.edges.map((e) => e.node) || [];
  } catch {
    console.error('Failed to fetch collections');
    return [];
  }
}

// Featured brands
const FEATURED_BRANDS = [
  { handle: "vetriscience", name: "VetriScience", color: "#2D5A27", tagline: "Science-based supplements" },
  { handle: "cosequin", name: "Cosequin", color: "#1E40AF", tagline: "#1 vet recommended" },
  { handle: "the-honest-kitchen", name: "The Honest Kitchen", color: "#B45309", tagline: "Human grade food" },
  { handle: "stella-chewys", name: "Stella & Chewy's", color: "#DC2626", tagline: "Raw nutrition" },
  { handle: "vital-essentials", name: "Vital Essentials", color: "#7C3AED", tagline: "Freeze-dried raw" },
  { handle: "tiki-pets", name: "Tiki Pets", color: "#0891B2", tagline: "Premium nutrition" },
];

// Testimonials
const TESTIMONIALS = [
  { 
    text: "My senior dog has been on GlycoFlex for 3 months and the difference is incredible. He's playing like a puppy again!", 
    author: "Sarah M.", 
    pet: "Golden Retriever, 11 years",
    rating: 5 
  },
  { 
    text: "Finally found a marketplace that cares about ingredient quality as much as I do. The transparency here is unmatched.", 
    author: "Michael T.", 
    pet: "2 cats, 1 dog",
    rating: 5 
  },
  { 
    text: "The calming supplements have been a game changer for our anxious rescue. Shipping was fast and customer service excellent.", 
    author: "Jennifer L.", 
    pet: "Australian Shepherd, 4 years",
    rating: 5 
  },
];

const TOP_NEEDS = [
  {
    title: "Joint Support",
    href: "/collections/organic-canine-supplements-hip-and-joint",
    image: "/images/animalia-dog-joint-support.png",
    emoji: "🦴",
    desc: "High-intent mobility care",
  },
  {
    title: "Calming",
    href: "/collections/calm-feline-supplements",
    image: "/images/animalia-cat-calming.png",
    emoji: "😌",
    desc: "Daily stress and anxiety support",
  },
  {
    title: "Dental Care",
    href: "/collections/feline-dental-supplements",
    image: "/images/animalia-dental-routine.png",
    emoji: "🪥",
    desc: "Low-friction oral care",
  },
  {
    title: "Omega Oils",
    href: "/brands/alaska-naturals",
    image: "/images/animalia-omega-wellness.png",
    emoji: "🐟",
    desc: "Easy add-on wellness value",
  },
];

const START_HERE_STEPS = [
  {
    step: "01",
    title: "Choose the pet",
    copy: "Start with dogs or cats so the catalog immediately narrows to the right routine.",
  },
  {
    step: "02",
    title: "Shop the need",
    copy: "Move into joint support, calming, dental care, or daily wellness instead of browsing aimlessly.",
  },
  {
    step: "03",
    title: "Build the basket",
    copy: "Use larger formats and natural add-ons to cross the shipping threshold and improve reorder value.",
  },
];

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getFeaturedProducts(),
    getCollections(),
  ]);

  const priorityCollections = prioritizeCollectionHandles([
    "organic-canine-supplements-hip-and-joint",
    "calm-feline-supplements",
    "feline-dental-supplements",
    "organic-supplements",
    "organic-canine-food",
    "feline-dry-foods",
    "feline-digestive-supplements",
  ]);
  const featuredCollections = collections
    .filter((c) => c.products.edges.length > 0)
    .sort((a, b) => {
      const aIndex = priorityCollections.indexOf(a.handle);
      const bIndex = priorityCollections.indexOf(b.handle);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION - Premium Split Design
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[var(--stone-900)]">
        {/* Split Hero Design */}
        <div className="absolute inset-0 grid lg:grid-cols-2">
          {/* Left - Image Collage */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 grid grid-cols-2 gap-3 p-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/lifestyle-outdoor.jpg"
                  alt="Adventure with pets"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-900)]/50 to-transparent" />
              </div>
              <div className="relative rounded-3xl overflow-hidden mt-16 shadow-2xl">
                <Image
                  src="/images/collection-cat-calming.jpg"
                  alt="Calm and content cat"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-900)]/50 to-transparent" />
              </div>
              <div className="relative rounded-3xl overflow-hidden -mt-10 shadow-2xl">
                <Image
                  src="/images/feature-ingredients.jpg"
                  alt="Natural ingredients"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-900)]/50 to-transparent" />
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/category-treats.jpg"
                  alt="Healthy pet treats"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-900)]/50 to-transparent" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--stone-900)]/20 to-[var(--stone-900)]" />
          </div>
          
          {/* Right - Content Background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--stone-900)] via-[var(--stone-800)] to-[var(--stone-900)]" />
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>
        </div>
        
        {/* Mobile Background */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/hero-main.jpg"
            alt="Pets"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--stone-900)]/90 to-[var(--stone-900)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 w-full">
          <div className="lg:ml-auto lg:w-1/2 lg:pl-16">
            {/* Brand Mark */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--sage-400)] to-[var(--sage-600)] flex items-center justify-center shadow-lg shadow-[var(--sage-500)]/30">
                <span className="text-2xl">🐾</span>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-[var(--sage-500)]/60 to-transparent max-w-24" />
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.5rem] text-white leading-[1.05] mb-8 tracking-tight">
              For Pets Who Are{" "}
              <span className="italic text-[var(--sage-400)] block sm:inline">Family</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/60 mb-5 max-w-lg leading-relaxed font-light">
              Curated wellness picks for joint support, calming, dental care, and everyday nutrition.
            </p>
            
            <p className="text-base text-white/40 mb-10 max-w-lg">
              Start with the concern that matters most, then build a better routine.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-14">
              <Link
                href="/collections"
                className="group px-8 py-4 bg-gradient-to-r from-[var(--sage-500)] to-[var(--sage-600)] text-white font-semibold rounded-full hover:from-[var(--sage-600)] hover:to-[var(--sage-700)] transition-all shadow-lg shadow-[var(--sage-600)]/30 hover:shadow-xl hover:shadow-[var(--sage-600)]/40 hover:-translate-y-0.5"
              >
                Shop Top Needs
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/brands"
                className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                Explore Brands
              </Link>
            </div>
            
            {/* Trust Signals - More refined */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              {[
                { icon: "✓", text: "Need-Based Shopping" },
                { icon: "✓", text: "50+ Curated Brands" },
                { icon: "✓", text: "Free Shipping $50+" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/40">
                  <span className="w-5 h-5 rounded-full bg-[var(--sage-500)]/20 flex items-center justify-center text-[var(--sage-400)] text-xs">
                    {item.icon}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {TOP_NEEDS.slice(0, 4).map((need) => (
                <Link
                  key={need.title}
                  href={need.href}
                  className="group rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xl">{need.emoji}</span>
                    <span className="text-xs uppercase tracking-[0.16em] text-white/45">Top Need</span>
                  </div>
                  <p className="font-semibold text-white">{need.title}</p>
                  <p className="mt-1 text-sm text-white/55">{need.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VALUE PROPOSITIONS - More refined
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--sage-600)] text-white py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-2 text-center">
            {[
              "Shop by concern, not by clutter",
              "Bigger routines, clearer choices",
              "Curated brands already in stock",
              "Free shipping over $50",
            ].map((item, i) => (
              <p key={item} className="text-sm font-medium tracking-wide flex items-center gap-3">
                {i > 0 && <span className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />}
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {START_HERE_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-[var(--stone-200)] bg-[var(--cream)] px-6 py-6 shadow-sm"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sage-700)]">
                  Step {item.step}
                </p>
                <h3 className="mb-2 font-serif text-2xl text-[var(--stone-800)]">{item.title}</h3>
                <p className="text-[var(--stone-600)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SHOP BY PET
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--sage-50)] text-[var(--sage-700)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Shop by Pet
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-[var(--stone-800)] mb-5">
              Find What They Need
            </h2>
            <p className="text-[var(--stone-500)] max-w-lg mx-auto text-lg">
              Choose the aisle that matches the pet you are shopping for, then follow the strongest need.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Dogs Card */}
            <Link
              href="/collections/canine"
              className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] lg:aspect-[16/11] shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
              <Image
                src="/images/animalia-dog-joint-support.png"
                alt="Shop for dogs"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-12">
                <span className="text-5xl mb-5 block drop-shadow-lg">🐕</span>
                <h3 className="font-serif text-3xl lg:text-4xl text-white mb-3">For Dogs</h3>
                <p className="text-white/70 mb-5 max-w-sm text-lg">
                  Joint support, oils, calming support, and everyday nutrition with repeat-purchase potential.
                </p>
                <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full">
                  Shop Dog Products
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Cats Card */}
            <Link
              href="/collections/calm-feline-supplements"
              className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] lg:aspect-[16/11] shadow-xl hover:shadow-2xl transition-shadow duration-500"
            >
              <Image
                src="/images/animalia-cat-calming.png"
                alt="Shop for cats"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-12">
                <span className="text-5xl mb-5 block drop-shadow-lg">🐱</span>
                <h3 className="font-serif text-3xl lg:text-4xl text-white mb-3">For Cats</h3>
                <p className="text-white/70 mb-5 max-w-sm text-lg">
                  Calming, dental, digestion, and pantry staples for cat households.
                </p>
                <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full">
                  Shop Cat Products
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SHOP BY NEED - Category Cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-medium text-[var(--sage-600)] uppercase tracking-wider mb-2 block">
                Revenue Drivers
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">Shop by Need</h2>
            </div>
            <Link
              href="/collections"
              className="hidden sm:flex items-center gap-2 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)] hover:gap-3 transition-all"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[
              { title: "Joint Support", href: "/collections/organic-canine-supplements-hip-and-joint", image: "/images/collection-dog-joint.jpg", emoji: "🦴", desc: "High-intent mobility care" },
              { title: "Calming", href: "/collections/calm-feline-supplements", image: "/images/collection-dog-calming.jpg", emoji: "😌", desc: "Daily stress and anxiety support" },
              { title: "Dental Care", href: "/collections/feline-dental-supplements", image: "/images/collection-cats.jpg", emoji: "🪥", desc: "Low-friction oral care" },
              { title: "Omega Oils", href: "/brands/alaska-naturals", image: "/images/collection-dog-supplements.jpg", emoji: "🐟", desc: "Easy add-on wellness value" },
            ].map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-3xl mb-3 block drop-shadow-lg">{cat.emoji}</span>
                  <h3 className="font-semibold text-white text-xl mb-1">{cat.title}</h3>
                  <p className="text-white/60 text-sm">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURED BRANDS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--sage-50)]/30 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-[var(--stone-100)] text-[var(--stone-600)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Trusted Partners
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-[var(--stone-800)] mb-5">
              Brands We Believe In
            </h2>
            <p className="text-[var(--stone-500)] max-w-xl mx-auto text-lg">
              Every brand is vetted for quality, safety, and transparency
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {FEATURED_BRANDS.map((brand) => (
              <Link
                key={brand.handle}
                href={`/brands/${brand.handle}`}
                className="group bg-white hover:bg-[var(--stone-50)] rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl border border-[var(--stone-100)] hover:border-[var(--stone-200)] hover:-translate-y-1"
              >
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-[var(--stone-800)] mb-1 group-hover:text-[var(--sage-700)] transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-[var(--stone-400)]">{brand.tagline}</p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--stone-800)] text-white font-semibold rounded-full hover:bg-[var(--stone-900)] transition-all hover:shadow-lg"
            >
              View All 50+ Brands
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ═══════════════════════════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-24 lg:py-32 bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
              <div>
                <span className="inline-block px-4 py-1.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                  Built to Convert
                </span>
                <h2 className="font-serif text-4xl lg:text-5xl text-[var(--stone-800)]">
                  High-Impact Wellness Picks
                </h2>
                <p className="mt-4 max-w-2xl text-[var(--stone-500)]">
                  These are the products most likely to turn current stock into stronger baskets: daily-use wellness, higher-value formats, and clear problem-solution fits.
                </p>
              </div>
              <Link
                href="/collections"
                className="flex items-center gap-2 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)] hover:gap-3 transition-all"
              >
                Browse All
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <ProductGrid products={products} columns={4} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS - NEW SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative quote marks */}
        <div className="absolute top-20 left-10 text-[12rem] font-serif text-[var(--sage-100)] leading-none select-none">&ldquo;</div>
        <div className="absolute bottom-20 right-10 text-[12rem] font-serif text-[var(--sage-100)] leading-none select-none rotate-180">&ldquo;</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--sage-50)] text-[var(--sage-700)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Happy Pet Parents
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-[var(--stone-800)]">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[var(--cream)] rounded-3xl p-8 relative"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-[var(--stone-700)] mb-6 leading-relaxed text-lg">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--sage-400)] to-[var(--sage-600)] flex items-center justify-center text-white font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--stone-800)]">{testimonial.author}</p>
                    <p className="text-sm text-[var(--stone-500)]">{testimonial.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COLLECTIONS
      ═══════════════════════════════════════════════════════════════════ */}
      {featuredCollections.length > 0 && (
        <section className="py-24 lg:py-32 bg-[var(--cream)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-[var(--stone-200)] text-[var(--stone-600)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                Browse
              </span>
              <h2 className="font-serif text-4xl lg:text-5xl text-[var(--stone-800)] mb-5">
                Our Collections
              </h2>
              <p className="text-[var(--stone-500)] max-w-xl mx-auto text-lg">
                Start with the clearest need, then move shoppers toward stronger formats and better routines.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCollections.map((collection, index) => {
                const colors = [
                  { bg: "from-emerald-500 to-teal-700" },
                  { bg: "from-violet-500 to-purple-700" },
                  { bg: "from-amber-500 to-orange-700" },
                  { bg: "from-rose-500 to-pink-700" },
                  { bg: "from-sky-500 to-blue-700" },
                  { bg: "from-lime-500 to-green-700" },
                ];
                const colorScheme = colors[index % colors.length];
                const productCount = collection.products.edges.length;
                const spotlight = getCollectionSpotlight(collection.handle, collection.title);
                const cleanTitle = cleanCollectionTitle(collection.title);
                
                return (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.handle}`}
                    className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${colorScheme.bg}`}
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={spotlight.image}
                        alt={spotlight.title || cleanTitle}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                    </div>

                    <div className="relative flex min-h-[340px] flex-col justify-end p-8 lg:p-10">
                      <span className="mb-3 inline-flex w-fit rounded-full border border-white/15 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/75 backdrop-blur-sm">
                        {spotlight.label}
                      </span>
                      <h3 className="font-serif text-2xl lg:text-3xl text-white mt-1 mb-4">
                        {spotlight.title || cleanTitle}
                      </h3>
                      <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/80">
                        {spotlight.description}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                          {productCount}+ products
                        </p>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-white/95 font-medium backdrop-blur-sm group-hover:gap-3 transition-all">
                          Shop Now
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)] hover:gap-3 transition-all"
              >
                View All Collections
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          WHY ANIMALIA - The Difference
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[var(--stone-900)] text-white relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--sage-600)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--sage-500)]/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
                The Animalia Difference
              </span>
              <h2 className="font-serif text-4xl lg:text-5xl mb-8 leading-tight">
                Your Pet Store, <span className="text-[var(--sage-400)]">Reimagined</span>
              </h2>
              <p className="text-xl text-white/60 leading-relaxed mb-10">
                We help pet parents shop by real problems instead of endless catalog pages. Start with the need, find the best-fit product, and build a routine worth reordering.
              </p>
              <ul className="space-y-5 mb-12">
                {[
                  "Higher-intent categories surfaced first",
                  "Curated formats that reward stock-up behavior",
                  "Cleaner discovery for joint, calming, dental, and wellness",
                  "Store-level promises that stay accurate",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-white/80">
                    <span className="w-6 h-6 rounded-full bg-[var(--sage-500)]/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--sage-400)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/brands"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--sage-500)] text-white font-semibold rounded-full hover:bg-[var(--sage-600)] transition-all hover:shadow-lg hover:shadow-[var(--sage-500)]/30"
              >
                Meet Our Brands
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "50+", label: "Trusted Brands" },
                { value: "370+", label: "Products Available" },
                { value: "100%", label: "Quality Guarantee" },
                { value: "$50+", label: "Free Shipping" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                  <p className="font-serif text-5xl lg:text-6xl text-[var(--sage-400)] mb-2">{stat.value}</p>
                  <p className="text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MARKETPLACE DISCLAIMER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-[var(--stone-100)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--stone-400)]">
            Animalia is built to help shoppers solve one clear wellness need at a time, then build a stronger cart around it.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          NEWSLETTER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-[var(--sage-500)] via-[var(--sage-600)] to-[var(--sage-700)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Join the Family
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-5">
            Get 15% Off Your First Order
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto">
            Plus exclusive access to new brands, products, and pet wellness tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-white/40 mt-6">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
