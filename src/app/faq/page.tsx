import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Find answers to frequently asked questions about Animalia products, orders, shipping, returns, and more.",
};

const FAQ_CATEGORIES = [
  {
    title: "Orders & Shipping",
    icon: "📦",
    faqs: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3-5 business days within the contiguous US. Express shipping (1-2 business days) is available at checkout for an additional fee. Orders placed before 2 PM PST on business days typically ship the same day.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders over $50. This applies to the contiguous United States. Alaska, Hawaii, and international orders may have additional shipping costs.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with a tracking number. You can also track your order anytime by visiting our Track Order page and entering your order number and email address.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "We process orders quickly! If you need to make changes, please contact us within 1 hour of placing your order. After that, we may not be able to modify it before shipment.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship to all 50 US states and Canada. We're working on expanding to more countries soon. Sign up for our newsletter to be notified when we launch international shipping.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    icon: "↩️",
    faqs: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day satisfaction guarantee on all products. If you're not completely satisfied, you can return unopened items for a full refund. Opened items may be eligible for store credit on a case-by-case basis.",
      },
      {
        q: "How do I start a return?",
        a: "Visit our Returns page and fill out the return request form. You'll receive a prepaid shipping label via email within 24 hours. Pack the items securely and drop off at any carrier location.",
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and inspect your return, refunds are processed within 3-5 business days. The refund will appear on your original payment method within 5-10 business days depending on your bank.",
      },
      {
        q: "What if I received a damaged or wrong item?",
        a: "We're so sorry! Please contact us within 48 hours with photos of the damage or incorrect item. We'll send a replacement immediately and cover all return shipping costs.",
      },
    ],
  },
  {
    title: "Products & Quality",
    icon: "✨",
    faqs: [
      {
        q: "Are your products vet-approved?",
        a: "Yes! Every product on Animalia is reviewed by our veterinary advisory board before being added to our marketplace. We also work directly with brands to verify quality standards and ingredient sourcing.",
      },
      {
        q: "Where are your products made?",
        a: "We partner with brands that manufacture in the USA, Canada, and select international facilities that meet our strict quality standards. Each product page includes country of origin information.",
      },
      {
        q: "Do you test on animals?",
        a: "Absolutely not. None of our products are tested on animals. We only carry brands that share our commitment to cruelty-free practices.",
      },
      {
        q: "How do you select which brands to carry?",
        a: "We have a rigorous vetting process that evaluates ingredient quality, manufacturing practices, brand transparency, and customer feedback. Less than 10% of brands that apply are accepted.",
      },
      {
        q: "Are the ingredients organic?",
        a: "Many of our products feature organic ingredients, and we clearly label these on each product page. Use our filters to shop specifically for organic or natural products.",
      },
    ],
  },
  {
    title: "Account & Payment",
    icon: "💳",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption.",
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and never store your full credit card information. We're PCI DSS compliant and partner with trusted payment processors.",
      },
      {
        q: "Do I need an account to place an order?",
        a: "No, you can checkout as a guest. However, creating an account allows you to track orders, save favorites, earn rewards, and checkout faster on future orders.",
      },
      {
        q: "Do you offer any discounts or rewards?",
        a: "Yes! Sign up for our newsletter to get 15% off your first order. We also offer a loyalty program where you earn points on every purchase that can be redeemed for discounts.",
      },
    ],
  },
  {
    title: "Pet Health & Advice",
    icon: "🐾",
    faqs: [
      {
        q: "Can you recommend products for my pet's specific needs?",
        a: "While we can't provide veterinary advice, our product pages include detailed information about use cases and benefits. For specific health concerns, please consult your veterinarian.",
      },
      {
        q: "My pet has allergies. How can I find suitable products?",
        a: "Use our allergen filters to exclude products containing common allergens like chicken, beef, grains, or dairy. Each product page lists all ingredients for your review.",
      },
      {
        q: "Are supplements safe to give with medication?",
        a: "Always consult your veterinarian before starting any new supplement, especially if your pet is on medication. Some supplements may interact with certain medications.",
      },
      {
        q: "How do I transition my pet to a new food?",
        a: "We recommend a gradual transition over 7-10 days. Start by mixing 25% new food with 75% old food, then gradually increase the ratio until fully transitioned.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Help Center
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Find quick answers to common questions. Can&apos;t find what you&apos;re looking for? Our team is always here to help.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white border-b border-[var(--stone-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {FAQ_CATEGORIES.map((category) => (
              <a
                key={category.title}
                href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-5 py-2.5 bg-[var(--stone-100)] hover:bg-[var(--sage-100)] text-[var(--stone-600)] hover:text-[var(--sage-700)] rounded-full text-sm font-medium transition-colors"
              >
                {category.icon} {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {FAQ_CATEGORIES.map((category) => (
            <div key={category.title} id={category.title.toLowerCase().replace(/\s+/g, '-')}>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="font-serif text-3xl text-[var(--stone-800)]">{category.title}</h2>
              </div>
              <div className="space-y-4">
                {category.faqs.map((faq, i) => (
                  <details key={i} className="group bg-white rounded-2xl border border-[var(--stone-200)] overflow-hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <h3 className="font-semibold text-[var(--stone-800)] pr-8">{faq.q}</h3>
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--stone-100)] group-open:bg-[var(--sage-500)] flex items-center justify-center transition-colors">
                        <svg className="w-4 h-4 text-[var(--stone-500)] group-open:text-white group-open:rotate-180 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-[var(--stone-600)] leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 bg-[var(--sage-600)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">Still Have Questions?</h2>
          <p className="text-white/70 text-lg mb-8">
            Our pet-loving support team is here to help you and your furry family members.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:support@animalia.com"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

