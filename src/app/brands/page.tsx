import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Shop by Brand | Animalia Pet Marketplace",
  description: "Discover premium pet products from trusted brands. Animalia brings together the best in pet nutrition and wellness.",
};

interface Brand {
  handle: string;
  name: string;
  tagline: string;
  productCount: string;
  color: string;
  categories: string[];
}

const FEATURED_BRANDS: Brand[] = [
  {
    handle: "vetriscience",
    name: "VetriScience",
    tagline: "Science-based pet supplements since 1977",
    productCount: "20+",
    color: "#2D5A27",
    categories: ["Supplements", "Joint Health", "Calming"],
  },
  {
    handle: "cosequin",
    name: "Cosequin",
    tagline: "#1 veterinarian recommended joint health brand",
    productCount: "8+",
    color: "#1E40AF",
    categories: ["Joint Health", "Supplements"],
  },
  {
    handle: "grizzly-pet-products",
    name: "Grizzly Pet Products",
    tagline: "Wild Alaskan salmon oil & natural nutrition",
    productCount: "8+",
    color: "#0369A1",
    categories: ["Supplements", "Skin & Coat"],
  },
  {
    handle: "ark-naturals",
    name: "Ark Naturals",
    tagline: "Natural solutions for happy, healthy pets",
    productCount: "14+",
    color: "#059669",
    categories: ["Dental", "Supplements"],
  },
  {
    handle: "tiki-pets",
    name: "Tiki Pets",
    tagline: "Island-inspired premium pet nutrition",
    productCount: "18+",
    color: "#EA580C",
    categories: ["Food", "Dental", "Digestion"],
  },
  {
    handle: "the-honest-kitchen",
    name: "The Honest Kitchen",
    tagline: "Human grade pet food",
    productCount: "14+",
    color: "#B45309",
    categories: ["Food", "Dehydrated"],
  },
  {
    handle: "stella-chewys",
    name: "Stella & Chewy's",
    tagline: "Raw nutrition made easy",
    productCount: "12+",
    color: "#DC2626",
    categories: ["Food", "Freeze-Dried", "Raw"],
  },
  {
    handle: "vital-essentials",
    name: "Vital Essentials",
    tagline: "Raw. Instinctual. Essential.",
    productCount: "24+",
    color: "#7C3AED",
    categories: ["Food", "Freeze-Dried", "Raw"],
  },
  {
    handle: "comfort-zone",
    name: "Comfort Zone",
    tagline: "Calming pheromone solutions for cats",
    productCount: "13+",
    color: "#6366F1",
    categories: ["Calming", "Cat"],
  },
  {
    handle: "greenies",
    name: "Greenies",
    tagline: "The #1 vet-recommended dental treat brand",
    productCount: "4+",
    color: "#16A34A",
    categories: ["Dental", "Treats"],
  },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--stone-800)] to-[var(--stone-900)] text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6">
              <span className="w-2 h-2 bg-[var(--sage-400)] rounded-full" />
              50+ Trusted Brands
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

      {/* Brand Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-12">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-2">Featured Brands</h2>
          <p className="text-[var(--stone-600)]">Explore our partner brands</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_BRANDS.map((brand) => (
            <Link
              key={brand.handle}
              href={`/brands/${brand.handle}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[var(--stone-200)]"
            >
              {/* Brand Header */}
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.name.charAt(0)}
                </div>
                <span className="text-sm text-[var(--stone-500)]">
                  {brand.productCount} products
                </span>
              </div>

              {/* Brand Info */}
              <h3 className="font-semibold text-xl text-[var(--stone-800)] mb-1 group-hover:text-[var(--sage-700)] transition-colors">
                {brand.name}
              </h3>
              <p className="text-sm text-[var(--stone-600)] mb-4">
                {brand.tagline}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {brand.categories.map((cat) => (
                  <span 
                    key={cat}
                    className="px-2.5 py-1 text-xs font-medium rounded-full"
                    style={{ 
                      backgroundColor: `${brand.color}10`,
                      color: brand.color 
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
          ))}
        </div>
      </section>

      {/* All Brands List */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-8">All Brands A-Z</h2>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
            {[
              "A Pup Above",
              "Against the Grain",
              "Alaska Naturals",
              "Ark Naturals",
              "BFF",
              "Bocce's Bakery",
              "Buttons & Bows",
              "Calm Paws",
              "Cat Person",
              "Comfort Zone",
              "Cosequin",
              "Dave's Pet Food",
              "Earth Animal",
              "Earthborn Holistic",
              "Esbilac",
              "Evanger's",
              "Feline Natural",
              "Flexadin",
              "Four Paws",
              "Greenies",
              "Grizzly Pet Products",
              "K9 Naturals",
              "KMR",
              "Kong",
              "Merrick",
              "Nootie",
              "Nupro",
              "Nylabone",
              "Pet Naturals of Vermont",
              "Pet Releaf",
              "Petrodex",
              "Primal Pet Foods",
              "ProDen PlaqueOff",
              "Prospect Pet Wellness",
              "Purina Pro Plan",
              "SENTRY",
              "Sojos",
              "Stella & Chewy's",
              "Steve's Real Food",
              "The Honest Kitchen",
              "Tiki Pets",
              "TropiClean",
              "Vetericyn",
              "VetriScience",
              "Vital Essentials",
              "Weruva",
            ].sort().map((brand) => (
              <Link
                key={brand}
                href={`/brands/${brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
                className="text-[var(--stone-600)] hover:text-[var(--sage-600)] transition-colors py-1"
              >
                {brand}
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

