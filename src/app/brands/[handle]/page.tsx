import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storefrontClient } from "@/lib/shopify/client";
import { Header, Footer } from "@/components/layout";
import { ProductGrid } from "@/components/product";

// Brand data - in a real app this would come from a CMS or database
const BRAND_DATA: Record<string, {
  name: string;
  tagline: string;
  description: string;
  story: string;
  founded?: string;
  headquarters?: string;
  highlights: string[];
  color: string;
  logo?: string;
}> = {
  vetriscience: {
    name: "VetriScience",
    tagline: "Science-Based Pet Supplements Since 1977",
    description: "VetriScience Laboratories has been a pioneer in pet supplements for over 45 years, creating veterinarian-formulated products backed by clinical research.",
    story: "Founded by a veterinarian who believed pets deserved the same quality supplements as humans, VetriScience has grown from a small Vermont laboratory to one of the most trusted names in pet wellness. Every formula is developed with input from veterinary professionals and backed by scientific research.",
    founded: "1977",
    headquarters: "Vermont, USA",
    highlights: [
      "Veterinarian formulated",
      "45+ years of expertise",
      "Clinical research backed",
      "Made in the USA",
      "No artificial preservatives",
      "Quality tested ingredients"
    ],
    color: "#2D5A27",
  },
  cosequin: {
    name: "Cosequin",
    tagline: "#1 Veterinarian Recommended Joint Health Brand",
    description: "Cosequin is the #1 veterinarian recommended retail joint health supplement brand. Trusted by pet owners for over 20 years.",
    story: "Cosequin was developed to help maintain joint health and support mobility in dogs and cats. The brand has become synonymous with quality joint care, earning the trust of veterinarians and pet parents worldwide.",
    founded: "1992",
    headquarters: "Maryland, USA",
    highlights: [
      "#1 vet recommended",
      "Clinically researched",
      "Manufactured in the USA",
      "NASC certified",
      "Multiple formulas available"
    ],
    color: "#1E40AF",
  },
  "grizzly-pet-products": {
    name: "Grizzly Pet Products",
    tagline: "Wild Alaskan Salmon Oil & Natural Pet Nutrition",
    description: "Grizzly sources premium wild-caught salmon from pristine Alaskan waters to create omega-rich supplements for pets.",
    story: "Born from a passion for pure, sustainable nutrition, Grizzly Pet Products brings the power of wild Alaskan salmon to pets everywhere. Their oils and supplements are sustainably sourced and processed to preserve maximum nutritional value.",
    founded: "2002",
    headquarters: "Alaska, USA",
    highlights: [
      "Wild-caught Alaskan salmon",
      "Sustainably sourced",
      "Rich in Omega-3s",
      "No artificial additives",
      "Supports skin & coat health"
    ],
    color: "#0369A1",
  },
  "ark-naturals": {
    name: "Ark Naturals",
    tagline: "Natural Solutions for Happy, Healthy Pets",
    description: "Ark Naturals creates premium dental chews and supplements using natural ingredients that pets love and pet parents trust.",
    story: "Ark Naturals believes in the power of nature to support pet health. Their products combine traditional wisdom with modern science to create effective, natural solutions for common pet health concerns.",
    founded: "1996",
    headquarters: "Florida, USA",
    highlights: [
      "Natural ingredients",
      "Vet recommended",
      "Award-winning dental chews",
      "No artificial colors",
      "Made in the USA"
    ],
    color: "#059669",
  },
  "tiki-pets": {
    name: "Tiki Pets",
    tagline: "Island-Inspired Premium Pet Nutrition",
    description: "Tiki Pets brings the aloha spirit to pet food with high-quality, protein-rich recipes inspired by island cuisine.",
    story: "Inspired by the fresh, wholesome foods of Hawaii, Tiki Pets creates recipes that prioritize real meat and fish as the first ingredient. Their commitment to quality means no grains, fillers, or artificial ingredients.",
    founded: "2005",
    headquarters: "California, USA",
    highlights: [
      "Real meat first ingredient",
      "Grain-free options",
      "No artificial preservatives",
      "High protein recipes",
      "Variety of flavors"
    ],
    color: "#EA580C",
  },
  "the-honest-kitchen": {
    name: "The Honest Kitchen",
    tagline: "Human Grade Pet Food",
    description: "The Honest Kitchen pioneered human-grade pet food, creating dehydrated whole food recipes that are 100% human edible.",
    story: "Founded by a pet parent who wanted better for her senior dog, The Honest Kitchen became the first pet food company to receive FDA approval for human-grade processing. Every ingredient is sourced and handled as if it were destined for your own plate.",
    founded: "2002",
    headquarters: "California, USA",
    highlights: [
      "100% human grade",
      "Dehydrated whole foods",
      "No feed-grade ingredients",
      "Gently processed",
      "Made in the USA"
    ],
    color: "#B45309",
  },
  "stella-chewys": {
    name: "Stella & Chewy's",
    tagline: "Raw Nutrition Made Easy",
    description: "Stella & Chewy's creates freeze-dried raw pet food that delivers the benefits of a raw diet in a convenient format.",
    story: "Named after founder Marie Moody's two rescue dogs, Stella & Chewy's was born from a desire to share the healing power of raw nutrition. The company pioneered freeze-dried raw pet food, making species-appropriate nutrition accessible to all pet parents.",
    founded: "2003",
    headquarters: "Wisconsin, USA",
    highlights: [
      "Freeze-dried raw nutrition",
      "Responsibly sourced",
      "No added hormones",
      "Made in the USA",
      "Complete & balanced"
    ],
    color: "#DC2626",
  },
  "vital-essentials": {
    name: "Vital Essentials",
    tagline: "Raw. Instinctual. Essential.",
    description: "Vital Essentials creates premium freeze-dried raw pet food using single-source proteins and vital organs.",
    story: "Vital Essentials believes in feeding pets the way nature intended. Their freeze-dried raw foods capture the nutrition of raw meat in a shelf-stable format, featuring whole prey ratios that mirror what pets would eat in the wild.",
    founded: "1968",
    headquarters: "Wisconsin, USA",
    highlights: [
      "Single-source proteins",
      "Vital organs included",
      "No synthetics",
      "Freeze-dried raw",
      "Family owned since 1968"
    ],
    color: "#7C3AED",
  },
};

// Normalize vendor name to handle
function vendorToHandle(vendor: string): string {
  return vendor.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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

async function getBrandProducts(vendor: string): Promise<ShopifyProduct[]> {
  try {
    const query = `
      query GetBrandProducts($query: String!, $first: Int!) {
        products(first: $first, query: $query, sortKey: BEST_SELLING) {
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
    }>(query, { query: `vendor:${vendor}`, first: 50 });

    return data?.products?.edges.map((e) => e.node) || [];
  } catch {
    console.error('Failed to fetch brand products');
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const brand = BRAND_DATA[handle];
  
  if (!brand) {
    return { title: "Brand Not Found | Animalia" };
  }

  return {
    title: `${brand.name} | Animalia Pet Marketplace`,
    description: brand.description,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const brand = BRAND_DATA[handle];
  
  if (!brand) {
    notFound();
  }

  // Map handle to vendor name for Shopify query
  const vendorMap: Record<string, string> = {
    vetriscience: "VetriScience",
    cosequin: "Cosequin",
    "grizzly-pet-products": "Grizzly Pet Products",
    "ark-naturals": "Ark Naturals",
    "tiki-pets": "Tiki Pets",
    "the-honest-kitchen": "The Honest Kitchen",
    "stella-chewys": "Stella & Chewys",
    "vital-essentials": "Vital Essentials",
  };

  const vendorName = vendorMap[handle] || brand.name;
  const products = await getBrandProducts(vendorName);

  // Group products by type
  const productsByType = products.reduce((acc, product) => {
    const type = product.tags[0] || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(product);
    return acc;
  }, {} as Record<string, ShopifyProduct[]>);

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Brand Hero */}
      <section 
        className="relative py-20 lg:py-28 overflow-hidden"
        style={{ backgroundColor: `${brand.color}15` }}
      >
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, ${brand.color} 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, ${brand.color} 0%, transparent 50%)`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-[var(--stone-500)] hover:text-[var(--stone-700)]">
              Home
            </Link>
            <span className="text-[var(--stone-400)]">/</span>
            <Link href="/brands" className="text-[var(--stone-500)] hover:text-[var(--stone-700)]">
              Brands
            </Link>
            <span className="text-[var(--stone-400)]">/</span>
            <span className="text-[var(--stone-700)]">{brand.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Brand Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: brand.color, color: 'white' }}
              >
                <span className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                Official Brand Partner
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--stone-800)] mb-4">
                {brand.name}
              </h1>
              
              <p className="text-xl lg:text-2xl text-[var(--stone-600)] mb-6 font-light">
                {brand.tagline}
              </p>
              
              <p className="text-[var(--stone-600)] leading-relaxed mb-8 max-w-xl">
                {brand.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="#products"
                  className="px-6 py-3 text-white font-medium rounded-full transition-all hover:opacity-90"
                  style={{ backgroundColor: brand.color }}
                >
                  Shop {brand.name}
                </a>
                <a 
                  href="#about"
                  className="px-6 py-3 bg-white text-[var(--stone-700)] font-medium rounded-full border border-[var(--stone-200)] hover:border-[var(--stone-300)] transition-colors"
                >
                  Brand Story
                </a>
              </div>
            </div>

            {/* Brand Stats */}
            <div className="grid grid-cols-2 gap-4">
              {brand.founded && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-3xl font-serif text-[var(--stone-800)]">{brand.founded}</p>
                  <p className="text-sm text-[var(--stone-500)]">Founded</p>
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-3xl font-serif text-[var(--stone-800)]">{products.length}+</p>
                <p className="text-sm text-[var(--stone-500)]">Products</p>
              </div>
              {brand.headquarters && (
                <div className="bg-white rounded-2xl p-6 shadow-sm col-span-2">
                  <p className="text-lg font-medium text-[var(--stone-800)]">{brand.headquarters}</p>
                  <p className="text-sm text-[var(--stone-500)]">Headquarters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-[var(--stone-100)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {brand.highlights.slice(0, 4).map((highlight, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
                <svg className="w-5 h-5" style={{ color: brand.color }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-2">
              {brand.name} Products
            </h2>
            <p className="text-[var(--stone-600)]">
              {products.length} products available on Animalia
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-[var(--stone-500)]">No products currently available from this brand.</p>
          </div>
        )}
      </section>

      {/* Brand Story */}
      <section id="about" className="bg-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-4">
              The {brand.name} Story
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-[var(--stone-600)]">
            <p className="text-xl leading-relaxed">{brand.story}</p>
          </div>

          {/* Highlights Grid */}
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brand.highlights.map((highlight, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--stone-100)]"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${brand.color}15` }}
                >
                  <svg className="w-5 h-5" style={{ color: brand.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[var(--stone-700)] font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Notice */}
      <section className="bg-[var(--stone-50)] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[var(--stone-500)]">
            <strong className="text-[var(--stone-600)]">About Animalia Marketplace:</strong>{" "}
            Animalia is an independent marketplace that curates premium pet products from trusted brands. 
            We are not affiliated with {brand.name} — we simply bring their products to you alongside other 
            top brands in one convenient place. All product claims and information are provided by the manufacturer.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

