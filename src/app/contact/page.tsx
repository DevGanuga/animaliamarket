import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Animalia team. We're here to help with questions about orders, products, or anything pet-related.",
};

const CONTACT_METHODS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email Us",
    description: "Our friendly team is here to help.",
    contact: "hello@animalia.com",
    href: "mailto:hello@animalia.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Office",
    description: "Come say hello at our HQ.",
    contact: "100 Smith Street, Collingwood VIC 3066",
    href: "#",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Phone",
    description: "Mon-Fri from 8am to 6pm PST.",
    contact: "+1 (555) 000-0000",
    href: "tel:+15550000000",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Live Chat",
    description: "Chat with our support team.",
    contact: "Start a conversation",
    href: "#",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Have a question about our products, your order, or just want to chat about pets? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_METHODS.map((method) => (
              <a
                key={method.title}
                href={method.href}
                className="group bg-white rounded-2xl p-8 border border-[var(--stone-200)] hover:border-[var(--sage-300)] hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--sage-100)] text-[var(--sage-600)] flex items-center justify-center mb-5 group-hover:bg-[var(--sage-500)] group-hover:text-white transition-colors">
                  {method.icon}
                </div>
                <h3 className="font-semibold text-[var(--stone-800)] text-lg mb-2">{method.title}</h3>
                <p className="text-[var(--stone-500)] text-sm mb-3">{method.description}</p>
                <p className="text-[var(--sage-600)] font-medium group-hover:text-[var(--sage-700)]">{method.contact}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <div className="bg-[var(--cream)] rounded-3xl p-8 lg:p-12">
              <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-3">Send Us a Message</h2>
              <p className="text-[var(--stone-500)] mb-8">Fill out the form and we&apos;ll get back to you within 24 hours.</p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-[var(--stone-700)] mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full px-4 py-3 bg-white border border-[var(--stone-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent transition-all"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-[var(--stone-700)] mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full px-4 py-3 bg-white border border-[var(--stone-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--stone-700)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-white border border-[var(--stone-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent transition-all"
                    placeholder="jane@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[var(--stone-700)] mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-white border border-[var(--stone-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent transition-all"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--stone-700)] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-[var(--stone-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[var(--sage-600)] text-white font-semibold rounded-xl hover:bg-[var(--sage-700)] transition-colors shadow-lg shadow-[var(--sage-600)]/20"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQ Teaser */}
            <div>
              <h2 className="font-serif text-3xl text-[var(--stone-800)] mb-8">Frequently Asked</h2>
              <div className="space-y-4">
                {[
                  { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery." },
                  { q: "What's your return policy?", a: "We offer a 30-day money-back guarantee on all products. If you're not satisfied, we'll make it right." },
                  { q: "Are your products vet-approved?", a: "Yes! Every product is reviewed by our veterinary advisory board before being added to our marketplace." },
                  { q: "Do you ship internationally?", a: "Currently we ship to the US and Canada. International shipping coming soon!" },
                ].map((faq, i) => (
                  <div key={i} className="bg-[var(--stone-50)] rounded-2xl p-6">
                    <h3 className="font-semibold text-[var(--stone-800)] mb-2">{faq.q}</h3>
                    <p className="text-[var(--stone-500)] text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 mt-6 text-[var(--sage-600)] font-medium hover:text-[var(--sage-700)] hover:gap-3 transition-all"
              >
                View All FAQs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

