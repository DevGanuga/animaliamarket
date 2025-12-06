import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Animalia collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/60">
            Last updated: December 1, 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="prose prose-stone max-w-none">
              
              <p className="text-lg text-[var(--stone-600)] mb-8">
                At Animalia (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website animalia.com or make a purchase from us.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">1. Information We Collect</h2>
              
              <h3 className="font-semibold text-[var(--stone-800)] text-lg mt-6 mb-3">Personal Information</h3>
              <p className="text-[var(--stone-600)] mb-4">
                When you make a purchase or create an account, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Name and contact information (email address, phone number, shipping and billing address)</li>
                <li>Payment information (processed securely through our payment providers)</li>
                <li>Account credentials (username and encrypted password)</li>
                <li>Order history and preferences</li>
                <li>Communications with our customer support team</li>
              </ul>

              <h3 className="font-semibold text-[var(--stone-800)] text-lg mt-6 mb-3">Automatically Collected Information</h3>
              <p className="text-[var(--stone-600)] mb-4">
                When you visit our website, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Device information (browser type, operating system, device type)</li>
                <li>IP address and general location</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website or source</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">2. How We Use Your Information</h2>
              <p className="text-[var(--stone-600)] mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Personalize your shopping experience</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">3. Information Sharing</h2>
              <p className="text-[var(--stone-600)] mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li><strong>Service Providers:</strong> Third parties that help us operate our business (payment processors, shipping carriers, email services)</li>
                <li><strong>Brand Partners:</strong> When you purchase products, we may share necessary order information with the brand for fulfillment purposes</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">4. Cookies and Tracking</h2>
              <p className="text-[var(--stone-600)] mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Remember your preferences and shopping cart</li>
                <li>Understand how you use our website</li>
                <li>Deliver relevant advertisements</li>
                <li>Analyze site traffic and trends</li>
              </ul>
              <p className="text-[var(--stone-600)] mb-6">
                You can control cookies through your browser settings. Note that disabling cookies may affect site functionality.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">5. Data Security</h2>
              <p className="text-[var(--stone-600)] mb-6">
                We implement appropriate technical and organizational measures to protect your personal information, including SSL encryption, secure payment processing, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">6. Your Rights</h2>
              <p className="text-[var(--stone-600)] mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p className="text-[var(--stone-600)] mb-6">
                To exercise these rights, please contact us at privacy@animalia.com.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">7. California Privacy Rights</h2>
              <p className="text-[var(--stone-600)] mb-6">
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and how it&apos;s used, the right to delete your information, and the right to opt out of the sale of your information (though we do not sell personal information).
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">8. Children&apos;s Privacy</h2>
              <p className="text-[var(--stone-600)] mb-6">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">9. Third-Party Links</h2>
              <p className="text-[var(--stone-600)] mb-6">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">10. Changes to This Policy</h2>
              <p className="text-[var(--stone-600)] mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">11. Contact Us</h2>
              <p className="text-[var(--stone-600)] mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[var(--stone-50)] rounded-xl p-6 text-[var(--stone-600)]">
                <p><strong>Animalia, Inc.</strong></p>
                <p>100 Smith Street</p>
                <p>Collingwood, VIC 3066</p>
                <p className="mt-2">Email: privacy@animalia.com</p>
                <p>Phone: +1 (555) 000-0000</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

