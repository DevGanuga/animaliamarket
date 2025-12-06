import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "Pet care tips, wellness guides, product insights, and expert advice for modern pet parents.",
};

const CATEGORIES = [
  { name: "All", slug: "all" },
  { name: "Dog Care", slug: "dog-care" },
  { name: "Cat Care", slug: "cat-care" },
  { name: "Nutrition", slug: "nutrition" },
  { name: "Wellness", slug: "wellness" },
  { name: "Training", slug: "training" },
];

const FEATURED_POST = {
  title: "The Complete Guide to Joint Health for Senior Dogs",
  excerpt: "As our furry companions age, joint health becomes increasingly important. Learn about the best supplements, exercises, and lifestyle changes to keep your senior dog comfortable and active.",
  category: "Dog Care",
  date: "December 5, 2024",
  readTime: "8 min read",
  image: "/images/collection-dog-joint.jpg",
  slug: "joint-health-senior-dogs",
};

const BLOG_POSTS = [
  {
    title: "5 Signs Your Cat Might Be Stressed (And How to Help)",
    excerpt: "Cats are masters at hiding discomfort. Here are the subtle signs of feline stress and natural solutions to help them relax.",
    category: "Cat Care",
    date: "December 3, 2024",
    readTime: "5 min read",
    image: "/images/collection-cat-calming.jpg",
    slug: "cat-stress-signs",
  },
  {
    title: "Understanding Pet Food Labels: What to Look For",
    excerpt: "Decoding pet food labels can be confusing. We break down the key things to look for and red flags to avoid.",
    category: "Nutrition",
    date: "November 28, 2024",
    readTime: "6 min read",
    image: "/images/category-food.jpg",
    slug: "pet-food-labels-guide",
  },
  {
    title: "Natural Anxiety Remedies for Dogs During Fireworks",
    excerpt: "With holiday season approaching, here's how to keep your pup calm during fireworks and loud celebrations.",
    category: "Wellness",
    date: "November 25, 2024",
    readTime: "4 min read",
    image: "/images/collection-dog-calming.jpg",
    slug: "dog-anxiety-fireworks",
  },
  {
    title: "The Benefits of Freeze-Dried Raw Food for Cats",
    excerpt: "Freeze-dried raw food is growing in popularity. Here's why it might be a great option for your feline friend.",
    category: "Nutrition",
    date: "November 20, 2024",
    readTime: "5 min read",
    image: "/images/collection-cats.jpg",
    slug: "freeze-dried-raw-cats",
  },
  {
    title: "Building a Daily Supplement Routine for Your Dog",
    excerpt: "From morning to night, here's how to incorporate supplements into your dog's daily routine for optimal health.",
    category: "Wellness",
    date: "November 15, 2024",
    readTime: "7 min read",
    image: "/images/collection-dog-supplements.jpg",
    slug: "dog-supplement-routine",
  },
  {
    title: "Why Quality Treats Matter for Training",
    excerpt: "Not all treats are created equal. Learn how choosing the right training treats can improve results and your pet's health.",
    category: "Training",
    date: "November 10, 2024",
    readTime: "4 min read",
    image: "/images/category-treats.jpg",
    slug: "quality-training-treats",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            The Animalia Blog
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            Pet Care Insights
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Expert tips, wellness guides, and everything you need to keep your furry family members happy and healthy.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-[var(--stone-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category, i) => (
              <button
                key={category.slug}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-[var(--sage-600)] text-white"
                    : "bg-[var(--stone-100)] text-[var(--stone-600)] hover:bg-[var(--sage-100)] hover:text-[var(--sage-700)]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/blog/${FEATURED_POST.slug}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
              <div className="relative aspect-[16/10] lg:aspect-auto">
                <Image
                  src={FEATURED_POST.image}
                  alt={FEATURED_POST.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[var(--sage-500)] text-white text-xs font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-semibold rounded-full">
                    {FEATURED_POST.category}
                  </span>
                  <span className="text-[var(--stone-400)] text-sm">{FEATURED_POST.date}</span>
                </div>
                <h2 className="font-serif text-2xl lg:text-3xl text-[var(--stone-800)] mb-4 group-hover:text-[var(--sage-700)] transition-colors">
                  {FEATURED_POST.title}
                </h2>
                <p className="text-[var(--stone-600)] mb-6">{FEATURED_POST.excerpt}</p>
                <div className="flex items-center gap-2 text-[var(--sage-600)] font-medium">
                  Read Article
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="text-[var(--stone-400)] text-sm ml-auto">{FEATURED_POST.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-[var(--stone-800)] mb-8">Latest Articles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-0.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-medium rounded">
                      {post.category}
                    </span>
                    <span className="text-[var(--stone-400)] text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-[var(--stone-800)] mb-2 group-hover:text-[var(--sage-700)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[var(--stone-500)] text-sm line-clamp-2">{post.excerpt}</p>
                  <p className="text-[var(--stone-400)] text-xs mt-4">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-[var(--stone-800)] text-white font-semibold rounded-full hover:bg-[var(--stone-900)] transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[var(--sage-600)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">📬</span>
          <h2 className="font-serif text-3xl text-white mb-4">Get Pet Care Tips in Your Inbox</h2>
          <p className="text-white/70 mb-8">
            Subscribe to our newsletter for weekly articles, product recommendations, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

