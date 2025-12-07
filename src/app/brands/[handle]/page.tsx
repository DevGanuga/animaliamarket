import { Metadata } from "next";
import Link from "next/link";
import { storefrontClient } from "@/lib/shopify/client";
import { Header, Footer } from "@/components/layout";
import { ProductGrid } from "@/components/product";

// Brand metadata - enriches Shopify vendor data with descriptions
const BRAND_DATA: Record<string, {
  name: string;
  tagline: string;
  description: string;
  story: string;
  founded?: string;
  headquarters?: string;
  highlights: string[];
  color: string;
}> = {
  vetriscience: {
    name: "VetriScience",
    tagline: "Science-Based Pet Supplements Since 1977",
    description: "VetriScience Laboratories has been a pioneer in pet supplements for over 45 years, creating veterinarian-formulated products backed by clinical research.",
    story: "Founded by a veterinarian who believed pets deserved the same quality supplements as humans, VetriScience has grown from a small Vermont laboratory to one of the most trusted names in pet wellness. Every formula is developed with input from veterinary professionals and backed by scientific research.",
    founded: "1977",
    headquarters: "Vermont, USA",
    highlights: ["Veterinarian formulated", "45+ years of expertise", "Clinical research backed", "Made in the USA", "No artificial preservatives", "Quality tested ingredients"],
    color: "#2D5A27",
  },
  cosequin: {
    name: "Cosequin",
    tagline: "#1 Veterinarian Recommended Joint Health Brand",
    description: "Cosequin is the #1 veterinarian recommended retail joint health supplement brand. Trusted by pet owners for over 20 years.",
    story: "Cosequin was developed to help maintain joint health and support mobility in dogs and cats. The brand has become synonymous with quality joint care, earning the trust of veterinarians and pet parents worldwide.",
    founded: "1992",
    headquarters: "Maryland, USA",
    highlights: ["#1 vet recommended", "Clinically researched", "Manufactured in the USA", "NASC certified", "Multiple formulas available"],
    color: "#1E40AF",
  },
  "grizzly-pet-products": {
    name: "Grizzly Pet Products",
    tagline: "Wild Alaskan Salmon Oil & Natural Pet Nutrition",
    description: "Grizzly sources premium wild-caught salmon from pristine Alaskan waters to create omega-rich supplements for pets.",
    story: "Born from a passion for pure, sustainable nutrition, Grizzly Pet Products brings the power of wild Alaskan salmon to pets everywhere. Their oils and supplements are sustainably sourced and processed to preserve maximum nutritional value.",
    founded: "2002",
    headquarters: "Alaska, USA",
    highlights: ["Wild-caught Alaskan salmon", "Sustainably sourced", "Rich in Omega-3s", "No artificial additives", "Supports skin & coat health"],
    color: "#0369A1",
  },
  "ark-naturals": {
    name: "Ark Naturals",
    tagline: "Natural Solutions for Happy, Healthy Pets",
    description: "Ark Naturals creates premium dental chews and supplements using natural ingredients that pets love and pet parents trust.",
    story: "Ark Naturals believes in the power of nature to support pet health. Their products combine traditional wisdom with modern science to create effective, natural solutions for common pet health concerns.",
    founded: "1996",
    headquarters: "Florida, USA",
    highlights: ["Natural ingredients", "Vet recommended", "Award-winning dental chews", "No artificial colors", "Made in the USA"],
    color: "#059669",
  },
  "tiki-pets": {
    name: "Tiki Pets",
    tagline: "Island-Inspired Premium Pet Nutrition",
    description: "Tiki Pets brings the aloha spirit to pet food with high-quality, protein-rich recipes inspired by island cuisine.",
    story: "Inspired by the fresh, wholesome foods of Hawaii, Tiki Pets creates recipes that prioritize real meat and fish as the first ingredient. Their commitment to quality means no grains, fillers, or artificial ingredients.",
    founded: "2005",
    headquarters: "California, USA",
    highlights: ["Real meat first ingredient", "Grain-free options", "No artificial preservatives", "High protein recipes", "Variety of flavors"],
    color: "#EA580C",
  },
  "the-honest-kitchen": {
    name: "The Honest Kitchen",
    tagline: "Human Grade Pet Food",
    description: "The Honest Kitchen pioneered human-grade pet food, creating dehydrated whole food recipes that are 100% human edible.",
    story: "Founded by a pet parent who wanted better for her senior dog, The Honest Kitchen became the first pet food company to receive FDA approval for human-grade processing. Every ingredient is sourced and handled as if it were destined for your own plate.",
    founded: "2002",
    headquarters: "California, USA",
    highlights: ["100% human grade", "Dehydrated whole foods", "No feed-grade ingredients", "Gently processed", "Made in the USA"],
    color: "#B45309",
  },
  "comfort-zone": {
    name: "Comfort Zone",
    tagline: "Calming Pheromone Solutions for Cats",
    description: "Comfort Zone creates drug-free calming solutions using pheromone technology to help reduce stress-related behaviors in cats.",
    story: "Comfort Zone products are designed by behaviorists and veterinarians to help cats feel safe and secure in their environment. Their pheromone-based solutions mimic the natural calming signals that cats produce.",
    headquarters: "USA",
    highlights: ["Drug-free calming", "Pheromone technology", "Vet recommended", "Reduces stress behaviors", "Multiple delivery formats"],
    color: "#6366F1",
  },
  greenies: {
    name: "Greenies",
    tagline: "The #1 Vet-Recommended Dental Treat Brand",
    description: "Greenies dental treats are designed to clean teeth and freshen breath while providing a delicious, nutritious treat.",
    story: "Greenies revolutionized pet dental care by creating a treat that cleans teeth while pets enjoy chewing. Their unique texture is proven to clean down to the gumline.",
    headquarters: "Tennessee, USA",
    highlights: ["#1 vet recommended", "VOHC accepted", "Cleans teeth", "Fresh breath", "Nutritious treat"],
    color: "#16A34A",
  },
  "pet-naturals-of-vermont": {
    name: "Pet Naturals of Vermont",
    tagline: "Functional Supplements for Pets",
    description: "Pet Naturals creates effective, tasty supplements that address specific health concerns in dogs and cats.",
    story: "Pet Naturals of Vermont is dedicated to creating supplements that work and that pets actually enjoy taking. Their products are formulated with clinically studied ingredients for real results.",
    founded: "2001",
    headquarters: "Vermont, USA",
    highlights: ["Clinically studied ingredients", "Tasty formulas", "No wheat or corn", "Veterinarian recommended", "Made in the USA"],
    color: "#0D9488",
  },
  nupro: {
    name: "Nupro",
    tagline: "All-Natural Pet Supplements",
    description: "Nupro creates all-natural supplements that support joint health, digestion, and overall wellness in pets.",
    story: "Nupro believes in the power of natural nutrition. Their products use only the finest ingredients to support pet health without artificial additives.",
    headquarters: "USA",
    highlights: ["All natural ingredients", "Joint support", "Digestive health", "No artificial additives", "Veterinarian approved"],
    color: "#7C3AED",
  },
  "primal-pet-food": {
    name: "Primal Pet Foods",
    tagline: "Raw Food for Pets",
    description: "Primal Pet Foods creates raw, freeze-dried, and frozen pet foods using responsibly sourced ingredients.",
    story: "Primal is committed to providing pets with the nutrition nature intended. Their raw foods are made with human-grade ingredients and produced in USDA-inspected facilities.",
    founded: "2001",
    headquarters: "California, USA",
    highlights: ["Human-grade ingredients", "USDA inspected", "Responsibly sourced", "No antibiotics or hormones", "Complete & balanced"],
    color: "#DC2626",
  },
  "against-the-grain": {
    name: "Against the Grain",
    tagline: "Single Ingredient Pet Foods",
    description: "Against the Grain offers simple, limited ingredient pet foods for pets with sensitivities.",
    story: "Against the Grain believes less is more. Their single-ingredient and limited-ingredient formulas provide quality nutrition without unnecessary additives.",
    headquarters: "USA",
    highlights: ["Single ingredient options", "Limited ingredient formulas", "No fillers", "High protein", "Grain free"],
    color: "#854D0E",
  },
  "alaska-naturals": {
    name: "Alaska Naturals",
    tagline: "Wild Alaskan Fish Oils",
    description: "Alaska Naturals provides premium fish oil supplements sourced from wild Alaskan waters.",
    story: "Alaska Naturals brings the pristine nutrition of wild Alaskan fish to pets. Their oils are rich in omega fatty acids for skin, coat, and joint health.",
    headquarters: "Alaska, USA",
    highlights: ["Wild caught", "Rich in Omega-3s", "Sustainably sourced", "Supports skin & coat", "Joint health"],
    color: "#0284C7",
  },
  bff: {
    name: "BFF",
    tagline: "Best Feline Friend Premium Cat Food",
    description: "BFF creates grain-free, high-moisture cat foods made with quality proteins and no carrageenan.",
    story: "BFF - Best Feline Friend - is dedicated to creating cat food that cats love and cat parents feel good about. Their recipes focus on quality protein and hydration.",
    headquarters: "USA",
    highlights: ["Grain free", "High moisture", "No carrageenan", "Quality proteins", "Multiple flavors"],
    color: "#EC4899",
  },
  "daves-pet-food": {
    name: "Dave's Pet Food",
    tagline: "Quality Pet Nutrition",
    description: "Dave's Pet Food offers naturally healthy pet food options for dogs and cats.",
    story: "Dave's Pet Food is committed to providing quality nutrition at affordable prices. Their foods are made with wholesome ingredients pets love.",
    headquarters: "USA",
    highlights: ["Naturally healthy", "Quality ingredients", "Affordable", "Multiple formulas", "USA sourced"],
    color: "#059669",
  },
  tropicclean: {
    name: "TropiClean",
    tagline: "Natural Pet Grooming & Dental Care",
    description: "TropiClean creates natural grooming and dental care products for pets.",
    story: "TropiClean harnesses the power of natural ingredients to keep pets clean and healthy. Their products are free from harsh chemicals and artificial fragrances.",
    headquarters: "USA",
    highlights: ["Natural ingredients", "Dental care", "Grooming products", "Fresh breath", "Soap free options"],
    color: "#14B8A6",
  },
  vetericyn: {
    name: "Vetericyn",
    tagline: "Wound & Skin Care for Pets",
    description: "Vetericyn creates advanced wound and skin care products for pets using patented technology.",
    story: "Vetericyn was developed using patented Hypochlorous technology to safely and effectively clean and protect wounds and skin conditions in pets.",
    headquarters: "USA",
    highlights: ["Advanced technology", "Safe for all animals", "Non-toxic", "Veterinarian recommended", "Fast acting"],
    color: "#3B82F6",
  },
  "steves-real-food": {
    name: "Steve's Real Food",
    tagline: "Real Food for Real Pets",
    description: "Steve's Real Food creates raw and freeze-dried pet foods using quality, sustainable ingredients.",
    story: "Steve's Real Food believes pets deserve real, whole food nutrition. Their products are made in small batches with responsibly sourced ingredients.",
    founded: "1998",
    headquarters: "Utah, USA",
    highlights: ["Small batch made", "Responsibly sourced", "Raw nutrition", "Freeze-dried options", "Quest cat food line"],
    color: "#F97316",
  },
  sentry: {
    name: "SENTRY",
    tagline: "Pet Calming & Behavior Solutions",
    description: "SENTRY offers calming products and behavior solutions for dogs and cats.",
    story: "SENTRY products are designed to help pets cope with stressful situations using proven calming ingredients and pheromone technology.",
    headquarters: "USA",
    highlights: ["Calming solutions", "Pheromone technology", "Behavior support", "Multiple formats", "Veterinarian recommended"],
    color: "#6366F1",
  },
  "proden-plaqueoff": {
    name: "ProDen PlaqueOff",
    tagline: "Natural Dental Care",
    description: "ProDen PlaqueOff offers natural dental care supplements that help reduce plaque and tartar.",
    story: "ProDen PlaqueOff uses a special seaweed extract that has been scientifically proven to help reduce plaque and tartar buildup in pets.",
    headquarters: "Sweden",
    highlights: ["Natural seaweed", "Clinically proven", "Easy to use", "Reduces plaque", "Freshens breath"],
    color: "#10B981",
  },
};

// Map handle to vendor name
function handleToVendor(handle: string): string {
  const vendorMap: Record<string, string> = {
    vetriscience: "VetriScience",
    cosequin: "Cosequin",
    "grizzly-pet-products": "Grizzly Pet Products",
    "ark-naturals": "Ark Naturals",
    "tiki-pets": "Tiki Pets",
    "the-honest-kitchen": "The Honest Kitchen",
    "comfort-zone": "Comfort Zone",
    greenies: "Greenies",
    "pet-naturals-of-vermont": "Pet Naturals of Vermont",
    nupro: "Nupro",
    "primal-pet-food": "Primal Pet Food",
    "against-the-grain": "Against the Grain",
    "alaska-naturals": "Alaska Naturals",
    bff: "BFF",
    "daves-pet-food": "Daves Pet Food",
    tropicclean: "TropiClean",
    vetericyn: "Vetericyn",
    "steves-real-food": "Steves Real Food",
    sentry: "SENTRY",
    "proden-plaqueoff": "ProDen Plaqueoff",
    "pet-releaf": "Pet Releaf",
    "four-paws": "Four Paws",
    "k9-naturals": "K9 Naturals",
    sojos: "Sojos",
    "buttons-bows": "Buttons & Bows",
    nootie: "Nootie",
    nylabone: "Nylabone",
    petrodex: "Petrodex",
    "pets-prefer": "Pets Prefer",
    "synergy-labs": "Synergy Labs",
    esbilac: "Esbilac",
    kmr: "KMR",
    petlac: "PetLac",
    "earth-animal": "Earth Animal",
    "a-pup-above": "A Pup Above",
    merrick: "Merrick",
    kong: "Kong",
    "feline-natural": "Feline Natural",
    "flexadine-advanced": "Flexadine Advanced",
  };
  
  return vendorMap[handle] || handle.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
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
    }>(query, { query: `vendor:"${vendor}"`, first: 100 });

    return data?.products?.edges.map((e) => e.node) || [];
  } catch (error) {
    console.error('Failed to fetch brand products:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const brand = BRAND_DATA[handle];
  const vendorName = handleToVendor(handle);
  
  return {
    title: `${brand?.name || vendorName} | Animalia Pet Marketplace`,
    description: brand?.description || `Shop ${vendorName} products at Animalia Pet Marketplace.`,
  };
}

export default async function BrandPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const brand = BRAND_DATA[handle];
  const vendorName = handleToVendor(handle);
  const products = await getBrandProducts(vendorName);
  
  // Use brand data if available, otherwise generate from vendor name
  const displayName = brand?.name || vendorName;
  const tagline = brand?.tagline || "Premium pet products";
  const description = brand?.description || `Discover quality ${vendorName} products for your pets.`;
  const story = brand?.story || `${vendorName} is committed to providing quality products for pets. Shop their full range at Animalia.`;
  const highlights = brand?.highlights || ["Quality products", "Trusted brand", "Pet wellness"];
  const color = brand?.color || "#64748B";

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Brand Hero */}
      <section 
        className="relative py-20 lg:py-28 overflow-hidden"
        style={{ backgroundColor: `${color}15` }}
      >
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, ${color} 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, ${color} 0%, transparent 50%)`
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
            <span className="text-[var(--stone-700)]">{displayName}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Brand Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: color, color: 'white' }}
              >
                <span className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                Official Brand Partner
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[var(--stone-800)] mb-4">
                {displayName}
              </h1>
              
              <p className="text-xl lg:text-2xl text-[var(--stone-600)] mb-6 font-light">
                {tagline}
              </p>
              
              <p className="text-[var(--stone-600)] leading-relaxed mb-8 max-w-xl">
                {description}
              </p>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="#products"
                  className="px-6 py-3 text-white font-medium rounded-full transition-all hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  Shop {displayName}
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
              {brand?.founded && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-3xl font-serif text-[var(--stone-800)]">{brand.founded}</p>
                  <p className="text-sm text-[var(--stone-500)]">Founded</p>
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-3xl font-serif text-[var(--stone-800)]">{products.length}</p>
                <p className="text-sm text-[var(--stone-500)]">Products</p>
              </div>
              {brand?.headquarters && (
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
            {highlights.slice(0, 4).map((highlight, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
                <svg className="w-5 h-5" style={{ color }} fill="currentColor" viewBox="0 0 20 20">
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
              {displayName} Products
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
            <span className="text-5xl mb-4 block">📦</span>
            <p className="text-[var(--stone-600)] mb-4">No products currently available from this brand.</p>
            <Link 
              href="/brands"
              className="text-[var(--sage-600)] hover:text-[var(--sage-700)] font-medium"
            >
              ← Browse other brands
            </Link>
          </div>
        )}
      </section>

      {/* Brand Story */}
      <section id="about" className="bg-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-4">
              The {displayName} Story
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-[var(--stone-600)]">
            <p className="text-xl leading-relaxed">{story}</p>
          </div>

          {/* Highlights Grid */}
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlights.map((highlight, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--stone-100)]"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <svg className="w-5 h-5" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            We are not affiliated with {displayName} — we simply bring their products to you alongside other 
            top brands in one convenient place. All product claims and information are provided by the manufacturer.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
