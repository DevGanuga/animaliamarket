import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { storefrontClient } from "@/lib/shopify/client";

export const metadata: Metadata = {
  title: "Shop by Brand | Animalia Pet Marketplace",
  description: "Discover premium pet products from trusted brands. Animalia brings together the best in pet wellness.",
};

interface BrandInfo {
  handle: string;
  name: string;
  tagline: string;
  color: string;
  categories: string[];
}

// Brand metadata - enriches Shopify vendor data
const BRAND_METADATA: Record<string, Omit<BrandInfo, 'handle' | 'name'>> = {
  "VetriScience": {
    tagline: "Science-based pet supplements since 1977",
    color: "#2D5A27",
    categories: ["Supplements", "Joint Health", "Calming"],
  },
  "Cosequin": {
    tagline: "#1 veterinarian recommended joint health brand",
    color: "#1E40AF",
    categories: ["Joint Health", "Supplements"],
  },
  "Grizzly Pet Products": {
    tagline: "Wild Alaskan salmon oil & natural nutrition",
    color: "#0369A1",
    categories: ["Supplements", "Skin & Coat"],
  },
  "Ark Naturals": {
    tagline: "Natural solutions for happy, healthy pets",
    color: "#059669",
    categories: ["Dental", "Supplements"],
  },
  "Tiki Pets": {
    tagline: "Island-inspired premium pet nutrition",
    color: "#EA580C",
    categories: ["Food", "Dental", "Digestion"],
  },
  "The Honest Kitchen": {
    tagline: "Human grade pet food",
    color: "#B45309",
    categories: ["Food", "Dehydrated"],
  },
  "Comfort Zone": {
    tagline: "Calming pheromone solutions for cats",
    color: "#6366F1",
    categories: ["Calming", "Cat"],
  },
  "Greenies": {
    tagline: "The #1 vet-recommended dental treat brand",
    color: "#16A34A",
    categories: ["Dental", "Treats"],
  },
  "Pet Naturals of Vermont": {
    tagline: "Functional supplements for pets",
    color: "#0D9488",
    categories: ["Supplements", "Wellness"],
  },
  "Nupro": {
    tagline: "All-natural pet supplements",
    color: "#7C3AED",
    categories: ["Supplements", "Joint Health"],
  },
  "Primal Pet Food": {
    tagline: "Raw food for pets",
    color: "#DC2626",
    categories: ["Food", "Raw", "Freeze-Dried"],
  },
  "Against the Grain": {
    tagline: "Single ingredient pet foods",
    color: "#854D0E",
    categories: ["Food", "Limited Ingredient"],
  },
  "Alaska Naturals": {
    tagline: "Wild Alaskan fish oils",
    color: "#0284C7",
    categories: ["Supplements", "Fish Oil"],
  },
  "BFF": {
    tagline: "Best Feline Friend premium cat food",
    color: "#EC4899",
    categories: ["Cat Food", "Wet Food"],
  },
  "Daves Pet Food": {
    tagline: "Quality pet nutrition",
    color: "#059669",
    categories: ["Food", "Dog", "Cat"],
  },
  "Nootie": {
    tagline: "Progressive pet care products",
    color: "#8B5CF6",
    categories: ["Supplements", "Grooming"],
  },
  "Pet Releaf": {
    tagline: "Plant-based pet wellness",
    color: "#22C55E",
    categories: ["CBD", "Supplements"],
  },
  "TropiClean": {
    tagline: "Natural pet grooming & dental care",
    color: "#14B8A6",
    categories: ["Dental", "Grooming"],
  },
  "Vetericyn": {
    tagline: "Wound & skin care for pets",
    color: "#3B82F6",
    categories: ["First Aid", "Skin Care"],
  },
  "Steves Real Food": {
    tagline: "Real food for real pets",
    color: "#F97316",
    categories: ["Food", "Raw", "Freeze-Dried"],
  },
  "SENTRY": {
    tagline: "Pet calming & behavior solutions",
    color: "#6366F1",
    categories: ["Calming", "Behavior"],
  },
  "ProDen Plaqueoff": {
    tagline: "Natural dental care",
    color: "#10B981",
    categories: ["Dental", "Supplements"],
  },
  "Four Paws": {
    tagline: "Pet care essentials",
    color: "#F59E0B",
    categories: ["Health", "Grooming"],
  },
  "K9 Naturals": {
    tagline: "Freeze-dried raw nutrition",
    color: "#EF4444",
    categories: ["Food", "Raw"],
  },
  "Sojos": {
    tagline: "Complete & balanced raw food",
    color: "#84CC16",
    categories: ["Food", "Dehydrated"],
  },
};

// Helper to create URL-safe handle
function vendorToHandle(vendor: string): string {
  return vendor.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Default metadata for brands without specific info
const DEFAULT_BRAND_META = {
  tagline: "Premium pet products",
  color: "#64748B",
  categories: ["Pet Products"],
};

// Type for API response
interface ProductsQueryResponse {
  products: {
    edges: Array<{ node: { vendor: string }; cursor: string }>;
    pageInfo: { hasNextPage: boolean };
  };
}

// Fetch all vendors with product counts from Shopify
async function getAllBrands(): Promise<{ vendor: string; productCount: number }[]> {
  try {
    const query = `
      query GetAllProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              vendor
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `;

    const vendorCounts: Record<string, number> = {};
    let hasNextPage = true;
    let cursor: string | null = null;

    // Fetch up to 3 pages (300 products) to get a representative sample
    let pageCount = 0;
    while (hasNextPage && pageCount < 3) {
      const response: { data: ProductsQueryResponse | null } = await storefrontClient<ProductsQueryResponse>(query, { first: 100, after: cursor });
      const data = response.data;

      if (!data?.products?.edges) break;

      for (const edge of data.products.edges) {
        const vendor = edge.node.vendor;
        if (vendor && vendor !== "Discontinued") {
          vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
        }
        cursor = edge.cursor;
      }

      hasNextPage = data.products.pageInfo.hasNextPage;
      pageCount++;
    }

    return Object.entries(vendorCounts)
      .map(([vendor, productCount]) => ({ vendor, productCount }))
      .sort((a, b) => b.productCount - a.productCount);
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

export default async function BrandsPage() {
  const brands = await getAllBrands();
  
  // Split into featured (with metadata) and others
  const featuredBrands = brands
    .filter(b => BRAND_METADATA[b.vendor])
    .slice(0, 12);
  
  const allBrandsSorted = brands
    .map(b => b.vendor)
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--stone-800)] to-[var(--stone-900)] text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6">
              <span className="w-2 h-2 bg-[var(--sage-400)] rounded-full" />
              {brands.length}+ Trusted Brands
            </span>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6">
              Shop by Brand
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed">
              Animalia curates products from the most trusted names in pet wellness. 
              Each brand is carefully selected for quality, safety, and effectiveness.
            </p>
          </div>
        </div>
      </section>

      {/* What is Animalia */}
      <section className="bg-white border-b border-[var(--stone-100)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-lg font-semibold text-[var(--stone-800)] mb-3">
              Your Pet Wellness Marketplace
            </h2>
            <p className="text-[var(--stone-600)]">
              We&apos;re not a brand — we&apos;re a marketplace. Animalia brings together premium pet products 
              from trusted manufacturers, making it easy to find everything your pet needs in one place. 
              Compare brands, read reviews, and shop with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Brand Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-12">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-2">Featured Brands</h2>
          <p className="text-[var(--stone-600)]">Our most popular partner brands</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBrands.map((brand) => {
            const meta = BRAND_METADATA[brand.vendor] || DEFAULT_BRAND_META;
            const handle = vendorToHandle(brand.vendor);
            
            return (
              <Link
                key={brand.vendor}
                href={`/brands/${handle}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--stone-200)]"
              >
                {/* Brand Header */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: meta.color }}
                  >
                    {brand.vendor.charAt(0)}
                  </div>
                  <span className="text-sm text-[var(--stone-500)]">
                    {brand.productCount} products
                  </span>
                </div>

                {/* Brand Info */}
                <h3 className="font-semibold text-xl text-[var(--stone-800)] mb-1 group-hover:text-[var(--sage-700)] transition-colors">
                  {brand.vendor}
                </h3>
                <p className="text-sm text-[var(--stone-600)] mb-4">
                  {meta.tagline}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {meta.categories.slice(0, 3).map((cat) => (
                    <span 
                      key={cat}
                      className="px-2.5 py-1 text-xs font-medium rounded-full"
                      style={{ 
                        backgroundColor: `${meta.color}10`,
                        color: meta.color 
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--stone-500)] group-hover:text-[var(--sage-600)] group-hover:gap-3 transition-all">
                  View Brand
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Brands List */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-8">All Brands A-Z</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
            {allBrandsSorted.map((vendor) => (
              <Link
                key={vendor}
                href={`/brands/${vendorToHandle(vendor)}`}
                className="text-[var(--stone-600)] hover:text-[var(--sage-600)] transition-colors py-1"
              >
                {vendor}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--sage-600)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-white mb-4">
            Can&apos;t Find Your Brand?
          </h2>
          <p className="text-white/80 mb-8">
            We&apos;re always adding new brands to our marketplace. Let us know what you&apos;d like to see!
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
          >
            Request a Brand
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
