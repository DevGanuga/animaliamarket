import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Learn about Animalia's shipping options, delivery times, costs, and policies. Free shipping on orders over $50.",
};

const SHIPPING_OPTIONS = [
  {
    name: "Standard Shipping",
    price: "Free over $50",
    time: "3-5 business days",
    description: "Our most popular option. Orders ship via USPS or UPS Ground.",
    highlight: true,
  },
  {
    name: "Express Shipping",
    price: "$12.99",
    time: "2-3 business days",
    description: "Need it faster? Express gets your order there quickly.",
    highlight: false,
  },
  {
    name: "Overnight Shipping",
    price: "$24.99",
    time: "1 business day",
    description: "Order by 12 PM PST for next business day delivery.",
    highlight: false,
  },
];

const SHIPPING_ZONES = [
  { zone: "West Coast", standard: "2-3 days", express: "1-2 days" },
  { zone: "Mountain", standard: "3-4 days", express: "2 days" },
  { zone: "Midwest", standard: "3-4 days", express: "2 days" },
  { zone: "South", standard: "3-5 days", express: "2-3 days" },
  { zone: "East Coast", standard: "4-5 days", express: "2-3 days" },
  { zone: "Alaska & Hawaii", standard: "5-7 days", express: "3-4 days" },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Shipping
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            Fast & Free Shipping
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Free standard shipping on orders over $50. We ship from our California warehouse to get your pet&apos;s favorites to you quickly.
          </p>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="py-8 bg-[var(--sage-500)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <span className="font-semibold">Free Shipping Over $50</span>
            </div>
            <div className="w-px h-6 bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span className="font-semibold">Same-Day Processing</span>
            </div>
            <div className="w-px h-6 bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <span className="font-semibold">Secure Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-4">Shipping Options</h2>
            <p className="text-[var(--stone-500)] max-w-2xl mx-auto">
              Choose the shipping speed that works for you. All orders include tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SHIPPING_OPTIONS.map((option) => (
              <div
                key={option.name}
                className={`relative rounded-2xl p-8 ${
                  option.highlight
                    ? "bg-[var(--sage-600)] text-white shadow-xl shadow-[var(--sage-600)]/20"
                    : "bg-white border border-[var(--stone-200)]"
                }`}
              >
                {option.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--gold-500)] text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${option.highlight ? "text-white" : "text-[var(--stone-800)]"}`}>
                  {option.name}
                </h3>
                <p className={`text-3xl font-bold mb-1 ${option.highlight ? "text-white" : "text-[var(--sage-600)]"}`}>
                  {option.price}
                </p>
                <p className={`text-sm mb-4 ${option.highlight ? "text-white/70" : "text-[var(--stone-500)]"}`}>
                  {option.time}
                </p>
                <p className={`text-sm ${option.highlight ? "text-white/80" : "text-[var(--stone-600)]"}`}>
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-[var(--stone-800)] mb-4">Estimated Delivery Times</h2>
            <p className="text-[var(--stone-500)] max-w-2xl mx-auto">
              Delivery times vary by location. Orders ship from our warehouse in California.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-[var(--stone-50)] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 bg-[var(--stone-800)] text-white text-sm font-semibold">
              <span>Region</span>
              <span className="text-center">Standard</span>
              <span className="text-center">Express</span>
            </div>
            {SHIPPING_ZONES.map((zone, i) => (
              <div
                key={zone.zone}
                className={`grid grid-cols-3 gap-4 p-4 ${i % 2 === 0 ? "bg-white" : "bg-[var(--stone-50)]"}`}
              >
                <span className="font-medium text-[var(--stone-800)]">{zone.zone}</span>
                <span className="text-center text-[var(--stone-600)]">{zone.standard}</span>
                <span className="text-center text-[var(--stone-600)]">{zone.express}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-8 text-center">Important Information</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Order Processing",
                content: "Orders placed before 2 PM PST on business days are processed and shipped the same day. Orders placed after 2 PM or on weekends will be processed the next business day.",
                icon: "⏰",
              },
              {
                title: "Tracking Your Order",
                content: "Once your order ships, you'll receive an email with tracking information. You can also track your order anytime on our Track Order page.",
                icon: "📍",
              },
              {
                title: "Signature Requirements",
                content: "Orders over $150 may require a signature upon delivery. You can add delivery instructions at checkout if you won't be available.",
                icon: "✍️",
              },
              {
                title: "Weather Delays",
                content: "During extreme weather conditions, deliveries may be delayed. We'll notify you of any significant delays affecting your order.",
                icon: "🌧️",
              },
              {
                title: "PO Boxes",
                content: "We ship to PO Boxes via USPS for standard shipping only. Express and overnight options require a physical address.",
                icon: "📬",
              },
              {
                title: "International Shipping",
                content: "We currently ship to the US and Canada. Canadian orders may have additional customs fees. More countries coming soon!",
                icon: "🌎",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[var(--stone-200)]">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--stone-800)] mb-2">{item.title}</h3>
                    <p className="text-[var(--stone-600)] text-sm leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--stone-100)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl text-[var(--stone-800)] mb-4">Have Questions About Your Shipment?</h2>
          <p className="text-[var(--stone-600)] mb-6">
            Track your order or reach out to our support team for help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/track-order"
              className="px-8 py-4 bg-[var(--sage-600)] text-white font-semibold rounded-full hover:bg-[var(--sage-700)] transition-colors"
            >
              Track Order
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-[var(--stone-700)] font-semibold rounded-full border border-[var(--stone-300)] hover:border-[var(--stone-400)] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

