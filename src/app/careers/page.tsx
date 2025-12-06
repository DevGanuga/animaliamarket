import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Animalia team! We're looking for passionate pet lovers to help us build the future of pet wellness.",
};

const BENEFITS = [
  { icon: "🏥", title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage for you and your family." },
  { icon: "🐕", title: "Pet-Friendly Office", description: "Bring your furry friend to work! Plus free products for your pets." },
  { icon: "🏠", title: "Remote Flexibility", description: "Work from anywhere with our hybrid-first approach." },
  { icon: "📚", title: "Learning Budget", description: "$2,000 annual stipend for professional development." },
  { icon: "🏖️", title: "Unlimited PTO", description: "Take the time you need to recharge and come back refreshed." },
  { icon: "💰", title: "Equity", description: "Share in Animalia's success with competitive equity packages." },
];

const JOB_OPENINGS = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    description: "Build and scale our e-commerce platform using Next.js, TypeScript, and Shopify APIs.",
  },
  {
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Lead go-to-market strategies for new brand partnerships and product launches.",
  },
  {
    title: "Brand Partnerships Lead",
    department: "Business Development",
    location: "Remote (US)",
    type: "Full-time",
    description: "Source and onboard premium pet wellness brands that align with our curation standards.",
  },
  {
    title: "Customer Experience Specialist",
    department: "Support",
    location: "Remote (US)",
    type: "Full-time",
    description: "Provide world-class support to our community of pet parents via chat, email, and phone.",
  },
  {
    title: "Content Writer",
    department: "Marketing",
    location: "Remote (US)",
    type: "Part-time",
    description: "Create engaging blog content, product descriptions, and educational resources.",
  },
  {
    title: "Veterinary Consultant",
    department: "Product",
    location: "Remote",
    type: "Contract",
    description: "Review and approve products for our marketplace as part of our veterinary advisory board.",
  },
];

const VALUES = [
  { 
    title: "Pets First, Always",
    description: "Every decision we make starts with one question: is this good for pets? If yes, we move forward.",
  },
  { 
    title: "Radical Transparency",
    description: "We share information openly—with customers, partners, and each other. No hidden agendas.",
  },
  { 
    title: "Continuous Learning",
    description: "Pet wellness is evolving. We stay curious, embrace new research, and never stop growing.",
  },
  { 
    title: "Own Your Impact",
    description: "We trust you to make decisions. Take initiative, own outcomes, and make things happen.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Join Our Team
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            Build the Future of Pet Wellness
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            We&apos;re looking for passionate pet lovers to help us make premium pet wellness accessible to everyone.
          </p>
          <a
            href="#openings"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--sage-500)] text-white font-semibold rounded-full hover:bg-[var(--sage-600)] transition-colors"
          >
            View Open Positions
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Why Animalia?
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-4">
              More Than Just a Job
            </h2>
            <p className="text-[var(--stone-500)] max-w-2xl mx-auto">
              Join a team that genuinely cares about making a difference in the lives of pets and their humans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-2xl p-6 border border-[var(--stone-200)] hover:shadow-lg transition-shadow">
                <span className="text-3xl mb-4 block">{benefit.icon}</span>
                <h3 className="font-semibold text-[var(--stone-800)] mb-2">{benefit.title}</h3>
                <p className="text-[var(--stone-500)] text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[var(--stone-100)] text-[var(--stone-600)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
                Our Values
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-6">
                What We Stand For
              </h2>
              <p className="text-[var(--stone-600)] text-lg mb-8">
                These aren&apos;t just words on a wall. They&apos;re how we make decisions, treat each other, and build our company.
              </p>
            </div>
            <div className="space-y-6">
              {VALUES.map((value, i) => (
                <div key={value.title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--sage-100)] text-[var(--sage-700)] flex items-center justify-center font-bold flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--stone-800)] mb-1">{value.title}</h3>
                    <p className="text-[var(--stone-500)] text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              Open Positions
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)]">
              Current Openings
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {JOB_OPENINGS.map((job) => (
              <div
                key={job.title}
                className="bg-white rounded-2xl p-6 border border-[var(--stone-200)] hover:border-[var(--sage-300)] hover:shadow-lg transition-all group"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--stone-800)] text-lg group-hover:text-[var(--sage-700)] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-[var(--stone-500)] text-sm mt-1">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="px-3 py-1 bg-[var(--stone-100)] text-[var(--stone-600)] text-xs rounded-full">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 bg-[var(--stone-100)] text-[var(--stone-600)] text-xs rounded-full">
                        {job.location}
                      </span>
                      <span className="px-3 py-1 bg-[var(--sage-100)] text-[var(--sage-700)] text-xs rounded-full">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-[var(--sage-600)] text-white text-sm font-medium rounded-full hover:bg-[var(--sage-700)] transition-colors flex-shrink-0">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't See a Fit */}
      <section className="py-20 bg-[var(--sage-600)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-4xl mb-4 block">✉️</span>
          <h2 className="font-serif text-3xl text-white mb-4">Don&apos;t See the Right Role?</h2>
          <p className="text-white/70 text-lg mb-8">
            We&apos;re always looking for talented people. Send us your resume and tell us how you&apos;d contribute to our mission.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
          >
            Get in Touch
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

