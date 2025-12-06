import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "Learn about Animalia's 30-day return policy. Easy returns, hassle-free refunds, and our satisfaction guarantee.",
};

const RETURN_STEPS = [
  {
    step: 1,
    title: "Start Your Return",
    description: "Fill out our return request form below or contact our support team. Include your order number and reason for return.",
  },
  {
    step: 2,
    title: "Receive Shipping Label",
    description: "We'll email you a prepaid return shipping label within 24 hours of your request approval.",
  },
  {
    step: 3,
    title: "Pack & Ship",
    description: "Pack your items securely in the original packaging if possible. Attach the label and drop off at any carrier location.",
  },
  {
    step: 4,
    title: "Get Your Refund",
    description: "Once we receive and inspect your return, your refund will be processed within 3-5 business days.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Returns Policy
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            Hassle-Free Returns
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            We want you and your pet to be completely happy. If something isn&apos;t right, we&apos;ll make it right.
          </p>
        </div>
      </section>

      {/* Guarantee Banner */}
      <section className="py-12 bg-[var(--sage-500)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">🛡️</span>
            <div className="text-white text-left">
              <h3 className="font-bold text-xl">30-Day Satisfaction Guarantee</h3>
              <p className="text-white/80">Not happy? Return it for a full refund, no questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Return Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-4">How Returns Work</h2>
            <p className="text-[var(--stone-500)]">Simple, straightforward, and stress-free.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {RETURN_STEPS.map((step, i) => (
              <div key={step.step} className="relative">
                {i < RETURN_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-[var(--stone-300)]" />
                )}
                <div className="relative bg-white rounded-2xl p-6 border border-[var(--stone-200)] hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[var(--sage-500)] text-white font-bold text-lg flex items-center justify-center mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-[var(--stone-800)] mb-2">{step.title}</h3>
                  <p className="text-[var(--stone-500)] text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-8 text-center">Return Policy Details</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Eligible */}
            <div className="bg-[var(--sage-50)] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-[var(--sage-500)] flex items-center justify-center text-white">✓</span>
                <h3 className="font-semibold text-[var(--stone-800)] text-xl">Eligible for Returns</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Unopened products in original packaging",
                  "Items returned within 30 days of delivery",
                  "Products with manufacturing defects",
                  "Wrong items received",
                  "Damaged items (reported within 48 hours)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[var(--stone-600)]">
                    <svg className="w-5 h-5 text-[var(--sage-500)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="bg-[var(--stone-100)] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-[var(--stone-500)] flex items-center justify-center text-white">✕</span>
                <h3 className="font-semibold text-[var(--stone-800)] text-xl">Not Eligible</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Opened food products (for safety reasons)",
                  "Items returned after 30 days",
                  "Products without proof of purchase",
                  "Items damaged by misuse",
                  "Final sale or clearance items",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[var(--stone-600)]">
                    <svg className="w-5 h-5 text-[var(--stone-400)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-8 text-center">Refund Information</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Full Refund",
                description: "Unopened items returned within 30 days receive a full refund to your original payment method.",
                icon: "💵",
              },
              {
                title: "Store Credit",
                description: "Opened items may be eligible for store credit at our discretion. Contact us to discuss your situation.",
                icon: "🎁",
              },
              {
                title: "Processing Time",
                description: "Refunds are processed within 3-5 business days of receiving your return. Bank processing may take additional 5-10 days.",
                icon: "⏱️",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[var(--stone-200)] text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-semibold text-[var(--stone-800)] mb-2">{item.title}</h3>
                <p className="text-[var(--stone-500)] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-8 text-center">Special Situations</h2>
          
          <div className="space-y-6">
            {[
              {
                title: "Damaged or Defective Items",
                content: "If your item arrives damaged or has a manufacturing defect, contact us within 48 hours with photos. We'll send a replacement immediately at no additional cost and provide a prepaid return label for the damaged item.",
              },
              {
                title: "Wrong Item Received",
                content: "Mistakes happen! If you received the wrong item, contact us immediately. We'll ship the correct item right away and provide a prepaid return label for the incorrect one.",
              },
              {
                title: "My Pet Doesn't Like It",
                content: "We understand pets can be picky! If you've opened a product and your pet won't eat it, contact us. We may be able to offer store credit or exchange for a different product.",
              },
              {
                title: "Subscription Orders",
                content: "Subscription orders follow the same return policy. You can also pause, skip, or cancel subscriptions anytime from your account dashboard.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[var(--stone-50)] rounded-2xl p-6">
                <h3 className="font-semibold text-[var(--stone-800)] mb-2">{item.title}</h3>
                <p className="text-[var(--stone-600)]">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Form CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--sage-500)] to-[var(--sage-700)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">Ready to Start a Return?</h2>
          <p className="text-white/70 text-lg mb-8">
            Get started by contacting our support team with your order details.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
            >
              Start Return Request
            </Link>
            <Link
              href="/faq"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

