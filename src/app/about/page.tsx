import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Animalia's mission to bring premium, curated pet wellness products to modern pet parents who treat their pets as family.",
};

const TEAM = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Former veterinary technician turned entrepreneur. Started Animalia after struggling to find quality products for her senior dog, Max.",
    image: "SC",
  },
  {
    name: "Michael Torres",
    role: "Head of Curation",
    bio: "15 years in pet nutrition. Leads our rigorous brand vetting process to ensure only the best makes it to our shelves.",
    image: "MT",
  },
  {
    name: "Dr. Emily Watkins",
    role: "Veterinary Advisor",
    bio: "Board-certified veterinary nutritionist. Ensures all our products meet the highest standards for pet health.",
    image: "EW",
  },
  {
    name: "James Park",
    role: "Head of Operations",
    bio: "Logistics expert with a passion for pets. Makes sure your orders arrive quickly and safely.",
    image: "JP",
  },
];

const VALUES = [
  {
    title: "Curated, Not Cluttered",
    description: "We're not a big-box retailer. We carefully select every product based on quality, ingredients, and brand ethics.",
    icon: "✨",
  },
  {
    title: "Transparency First",
    description: "We believe you should know exactly what you're feeding your pet. Full ingredient disclosure, always.",
    icon: "🔍",
  },
  {
    title: "Science-Backed",
    description: "Every product is reviewed by our veterinary advisory board before it reaches your doorstep.",
    icon: "🔬",
  },
  {
    title: "Pets Are Family",
    description: "We treat every order as if it's for our own furry family members, because we know how much they mean to you.",
    icon: "❤️",
  },
];

const STATS = [
  { value: "50+", label: "Trusted Brands" },
  { value: "230+", label: "Curated Products" },
  { value: "15K+", label: "Happy Customers" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Our Story
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            For Pets Who Are <span className="italic text-[var(--sage-400)]">Family</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            We&apos;re on a mission to make premium pet wellness accessible to every pet parent who believes their furry friends deserve the best.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-[var(--sage-600)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl lg:text-4xl text-white mb-1">{stat.value}</p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
                How It Started
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-6">
                Born From Frustration, Built With Love
              </h2>
              <div className="prose prose-stone">
                <p className="text-[var(--stone-600)] mb-4 text-lg leading-relaxed">
                  Animalia was born in 2022 when our founder, Sarah, spent countless hours researching joint supplements for her aging Golden Retriever, Max. She found herself drowning in options, unable to distinguish quality products from marketing hype.
                </p>
                <p className="text-[var(--stone-600)] mb-4 text-lg leading-relaxed">
                  After consulting with vets, reading research papers, and trying dozens of products, she realized there had to be a better way. Why wasn&apos;t there a marketplace that did the hard work of vetting products so pet parents could shop with confidence?
                </p>
                <p className="text-[var(--stone-600)] text-lg leading-relaxed">
                  Today, Animalia is that marketplace. We partner only with brands that meet our rigorous standards for quality, transparency, and efficacy. Every product on our site has been reviewed by our veterinary advisory board.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about-story.jpg"
                  alt="Our story"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-[var(--sage-500)] text-white p-6 rounded-2xl shadow-xl max-w-xs">
                <p className="font-serif text-2xl mb-2">&ldquo;Max deserved better.&rdquo;</p>
                <p className="text-white/70 text-sm">— Sarah Chen, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--stone-100)] text-[var(--stone-600)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              What We Believe
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value) => (
              <div key={value.title} className="text-center">
                <span className="text-5xl mb-4 block">{value.icon}</span>
                <h3 className="font-semibold text-[var(--stone-800)] text-xl mb-3">{value.title}</h3>
                <p className="text-[var(--stone-500)]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Standards */}
      <section className="py-24 bg-[var(--stone-900)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
                Our Process
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl mb-6">
                How We Choose Our Brands
              </h2>
              <p className="text-white/60 text-lg mb-8">
                Less than 10% of brands that apply are accepted. Here&apos;s what we look for:
              </p>
              <ul className="space-y-4">
                {[
                  "Full ingredient transparency and sourcing disclosure",
                  "Manufacturing in GMP-certified facilities",
                  "Third-party testing for quality and purity",
                  "No artificial fillers, colors, or preservatives",
                  "Positive track record and customer reviews",
                  "Commitment to sustainability and ethical practices",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[var(--sage-400)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "01", title: "Application", desc: "Brands submit detailed info" },
                { num: "02", title: "Review", desc: "Team evaluates credentials" },
                { num: "03", title: "Vet Approval", desc: "Advisory board signs off" },
                { num: "04", title: "Launch", desc: "Products go live" },
              ].map((step) => (
                <div key={step.num} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <span className="text-[var(--sage-400)] font-mono text-sm">{step.num}</span>
                  <h3 className="font-semibold text-white mt-2 mb-1">{step.title}</h3>
                  <p className="text-white/50 text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              The Humans
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">Meet Our Team</h2>
            <p className="text-[var(--stone-500)] mt-4 max-w-xl mx-auto">
              A passionate group of pet lovers, industry experts, and wellness advocates.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 border border-[var(--stone-200)] hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--sage-400)] to-[var(--sage-600)] flex items-center justify-center text-white font-bold text-xl mb-4">
                  {member.image}
                </div>
                <h3 className="font-semibold text-[var(--stone-800)] text-lg">{member.name}</h3>
                <p className="text-[var(--sage-600)] text-sm font-medium mb-3">{member.role}</p>
                <p className="text-[var(--stone-500)] text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-[var(--sage-500)] to-[var(--sage-700)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            Ready to Shop Better for Your Pet?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of pet parents who trust Animalia for premium pet wellness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/collections"
              className="px-8 py-4 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              href="/brands"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Explore Brands
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

