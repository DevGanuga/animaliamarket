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
  options?: Array<{ name: string; values: string[] }>;
  variants?: {
    edges: Array<{
      node: { id: string; title: string; availableForSale: boolean };
    }>;
  };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
}

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
              featuredImage { url altText }
              options { name values }
              variants(first: 1) { edges { node { id title availableForSale } } }
              priceRange { minVariantPrice { amount currencyCode } }
              compareAtPriceRange { minVariantPrice { amount currencyCode } }
            }
          }
        }
      }
    `;
    const { data } = await storefrontClient<{
      products: { edges: Array<{ node: ShopifyProduct }> };
    }>(query, { first: 100 });
    const allProducts = data?.products?.edges.map((e) => e.node) || [];
    const scoreProduct = (p: ShopifyProduct) => {
      const text =
        `${p.title} ${p.vendor} ${p.tags.join(" ")}`.toLowerCase();
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      let score = p.availableForSale ? 20 : -100;
      score += Math.min(price, 120) / 4;
      if (text.includes("joint") || text.includes("hip") || text.includes("mobility")) score += 28;
      if (text.includes("calm") || text.includes("stress") || text.includes("anxiety")) score += 22;
      if (text.includes("dental") || text.includes("plaque") || text.includes("breath")) score += 20;
      if (text.includes("salmon oil") || text.includes("pollock oil") || text.includes("omega")) score += 18;
      if (text.includes("digest") || text.includes("probiotic")) score += 14;
      if (p.tags.includes("bestseller")) score += 10;
      return score;
    };
    const ranked = [...allProducts].sort((a, b) => scoreProduct(b) - scoreProduct(a));
    const vendorCounts = new Map<string, number>();
    const featured: ShopifyProduct[] = [];
    for (const product of ranked) {
      if (!product.availableForSale || featured.length >= 8) continue;
      const v = product.vendor || "Other";
      const c = vendorCounts.get(v) || 0;
      if (c >= 2) continue;
      featured.push(product);
      vendorCounts.set(v, c + 1);
    }
    return featured.slice(0, 8);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

const BRANDS = [
  { handle: "vetriscience", name: "VetriScience", color: "#2D5A27", tagline: "Science-based supplements" },
  { handle: "cosequin", name: "Cosequin", color: "#1E40AF", tagline: "#1 vet recommended" },
  { handle: "the-honest-kitchen", name: "The Honest Kitchen", color: "#B45309", tagline: "Human grade food" },
  { handle: "stella-chewys", name: "Stella & Chewy's", color: "#DC2626", tagline: "Raw nutrition" },
  { handle: "vital-essentials", name: "Vital Essentials", color: "#7C3AED", tagline: "Freeze-dried raw" },
  { handle: "tiki-pets", name: "Tiki Pets", color: "#0891B2", tagline: "Premium nutrition" },
];

const REVIEWS = [
  { text: "My senior dog has been on GlycoFlex for 3 months and the difference is incredible. He\u2019s playing like a puppy again!", author: "Sarah M.", pet: "Golden Retriever, 11 yrs", rating: 5, verified: true },
  { text: "Finally found a store that cares about ingredient quality as much as I do. Every product is clearly labeled and honest.", author: "Michael T.", pet: "2 cats, 1 dog", rating: 5, verified: true },
  { text: "The calming supplements have been a game changer for our anxious rescue. Shipping was fast and customer service was excellent.", author: "Jennifer L.", pet: "Aussie Shepherd, 4 yrs", rating: 5, verified: true },
  { text: "We switched to Stella & Chewy\u2019s from here and our picky eater actually finishes her bowl now. Great selection of premium brands.", author: "David R.", pet: "French Bulldog, 3 yrs", rating: 5, verified: true },
];

const NEEDS = [
  { title: "Joint Support", href: "/collections/organic-canine-supplements-hip-and-joint", image: "/images/category-joint-support.jpg", desc: "Mobility care for active & senior pets", count: "25+" },
  { title: "Calming", href: "/collections/calm-feline-supplements", image: "/images/category-calming.jpg", desc: "Daily stress & anxiety relief", count: "20+" },
  { title: "Dental Care", href: "/collections/feline-dental-supplements", image: "/images/category-dental.jpg", desc: "Simple daily oral care routines", count: "15+" },
  { title: "Omega Oils", href: "/brands/alaska-naturals", image: "/images/category-omega.jpg", desc: "Coat health & overall wellness", count: "10+" },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-[65vh] lg:min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-main.jpg" alt="Premium pet wellness products in a beautiful home with a golden retriever and cat" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--stone-900)]/90 via-[var(--stone-900)]/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-5">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              4.8/5 from 2,000+ pet parents
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] text-white leading-[1.1] mb-5">
              Premium Wellness<br />
              <span className="italic text-[var(--sage-400)]">Your Pet Deserves</span>
            </h1>
            <p className="text-lg text-white/70 mb-7 max-w-md leading-relaxed">
              50+ vet-approved brands for joint support, calming, dental care, and daily nutrition.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/collections" className="group px-7 py-3.5 bg-[var(--sage-500)] text-white font-semibold rounded-full hover:bg-[var(--sage-600)] transition-all shadow-lg hover:-translate-y-0.5">
                Shop Bestsellers <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
              <Link href="/brands" className="px-7 py-3.5 bg-white/95 text-[var(--stone-800)] font-semibold rounded-full hover:bg-white transition-all shadow-lg">
                Explore Brands
              </Link>
            </div>
            <div className="flex items-center gap-5 text-sm text-white/60">
              {["Free shipping $50+", "30-day returns", "Vet-approved"].map((t, i) => (
                <span key={t} className={`flex items-center gap-1.5${i === 2 ? " hidden sm:flex" : ""}`}>
                  <svg className="w-4 h-4 text-[var(--sage-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-b border-[var(--stone-100)] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏥", label: "Vet-Approved Brands" },
              { icon: "🚚", label: "Free Shipping $50+" },
              { icon: "↩️", label: "30-Day Easy Returns" },
              { icon: "🔒", label: "Secure Checkout" },
            ].map((x) => (
              <div key={x.label} className="flex items-center justify-center gap-2 py-1">
                <span className="text-lg">{x.icon}</span>
                <p className="font-medium text-[var(--stone-700)] text-sm">{x.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY PET ── */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-2">Shop by Pet</h2>
            <p className="text-[var(--stone-500)]">Everything organized by your pet&apos;s specific needs.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "For Dogs", href: "/collections/canine", img: "/images/shop-dogs.jpg", alt: "Happy golden retriever running through a sunny park", desc: "Joint support, calming, nutrition & everyday wellness." },
              { title: "For Cats", href: "/collections/calm-feline-supplements", img: "/images/shop-cats.jpg", alt: "Beautiful British Shorthair cat lounging on a cozy sofa", desc: "Calming, dental care, digestion & premium nutrition." },
            ].map((pet) => (
              <Link key={pet.title} href={pet.href} className="group relative overflow-hidden rounded-2xl aspect-[16/10] shadow-lg hover:shadow-xl transition-all">
                <Image src={pet.img} alt={pet.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-8">
                  <h3 className="font-serif text-3xl text-white mb-2">{pet.title}</h3>
                  <p className="text-white/80 mb-4 max-w-xs">{pet.desc}</p>
                  <span className="inline-flex items-center gap-2 text-white font-medium bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full group-hover:bg-white/25 transition-colors">
                    Shop {pet.title.replace("For ", "")} Products &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY NEED ── */}
      <section className="py-14 lg:py-20 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">Shop by Need</h2>
              <p className="mt-2 text-[var(--stone-500)]">Our most popular wellness categories</p>
            </div>
            <Link href="/collections" className="hidden sm:flex items-center gap-1 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)] transition-colors">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {NEEDS.map((n) => (
              <Link key={n.title} href={n.href} className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <Image src={n.image} alt={n.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs uppercase tracking-wider text-white/60 mb-1">{n.count} products</p>
                  <h3 className="font-semibold text-white text-lg mb-0.5">{n.title}</h3>
                  <p className="text-white/70 text-sm">{n.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      {products.length > 0 && (
        <section className="py-14 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">Bestsellers</h2>
                <p className="mt-2 text-[var(--stone-500)]">Our most popular products chosen by thousands of pet parents.</p>
              </div>
              <Link href="/collections" className="flex items-center gap-1 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)] transition-colors">Browse All &rarr;</Link>
            </div>
            <ProductGrid products={products} columns={4} />
          </div>
        </section>
      )}

      {/* ── SOCIAL PROOF ── */}
      <section className="py-14 lg:py-20 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
              <span className="ml-2 font-semibold text-[var(--stone-800)]">4.8/5</span>
              <span className="text-[var(--stone-500)] text-sm ml-1">from 2,000+ reviews</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">Loved by Pet Parents</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  {r.verified && (
                    <span className="text-xs text-[var(--sage-600)] font-medium flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-[var(--stone-700)] text-sm leading-relaxed mb-4 line-clamp-4">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--stone-100)]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--sage-400)] to-[var(--sage-600)] flex items-center justify-center text-white font-semibold text-sm">{r.author.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--stone-800)]">{r.author}</p>
                    <p className="text-xs text-[var(--stone-500)]">{r.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-2">Trusted Brands</h2>
            <p className="text-[var(--stone-500)]">Every brand is vetted for quality, safety, and transparency</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {BRANDS.map((b) => (
              <Link key={b.handle} href={`/brands/${b.handle}`} className="group bg-[var(--stone-50)] hover:bg-white rounded-xl p-5 text-center transition-all hover:shadow-lg border border-transparent hover:border-[var(--stone-200)]">
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ backgroundColor: b.color }}>{b.name.charAt(0)}</div>
                <h3 className="font-semibold text-sm text-[var(--stone-800)] mb-0.5">{b.name}</h3>
                <p className="text-xs text-[var(--stone-400)]">{b.tagline}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/brands" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--stone-800)] text-white font-semibold rounded-full hover:bg-[var(--stone-900)] transition-colors text-sm">View All 50+ Brands &rarr;</Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-14 lg:py-20 bg-[var(--stone-900)] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[var(--sage-500)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--sage-600)]/5 rounded-full blur-3xl" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-3">Get 15% Off Your First Order</h2>
          <p className="text-white/60 mb-8">Plus exclusive access to new brands, products, and pet wellness tips.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3.5 bg-white/10 border border-white/15 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)]/50" />
            <button type="submit" className="px-7 py-3.5 bg-[var(--sage-500)] text-white font-semibold rounded-full hover:bg-[var(--sage-600)] transition-colors whitespace-nowrap">Subscribe</button>
          </form>
          <p className="text-xs text-white/30 mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
