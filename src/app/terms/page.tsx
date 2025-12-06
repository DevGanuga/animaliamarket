import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions governing your use of the Animalia website and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4">
            Terms of Service
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
                Welcome to Animalia. By accessing or using our website at animalia.com (&ldquo;Site&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). Please read them carefully before using our services.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">1. Acceptance of Terms</h2>
              <p className="text-[var(--stone-600)] mb-6">
                By accessing, browsing, or using this Site, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Site or services.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">2. Eligibility</h2>
              <p className="text-[var(--stone-600)] mb-6">
                You must be at least 18 years old to use this Site and make purchases. By using our Site, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">3. Account Registration</h2>
              <p className="text-[var(--stone-600)] mb-4">
                To access certain features of our Site, you may need to create an account. When you create an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p className="text-[var(--stone-600)] mb-6">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">4. Products and Orders</h2>
              
              <h3 className="font-semibold text-[var(--stone-800)] text-lg mt-6 mb-3">Product Information</h3>
              <p className="text-[var(--stone-600)] mb-4">
                We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Product information is provided by our brand partners and manufacturers.
              </p>

              <h3 className="font-semibold text-[var(--stone-800)] text-lg mt-6 mb-3">Pricing and Availability</h3>
              <p className="text-[var(--stone-600)] mb-4">
                All prices are in US dollars and are subject to change without notice. We reserve the right to correct any pricing errors. Product availability may vary and is subject to change.
              </p>

              <h3 className="font-semibold text-[var(--stone-800)] text-lg mt-6 mb-3">Order Acceptance</h3>
              <p className="text-[var(--stone-600)] mb-6">
                Your order is an offer to purchase. We reserve the right to accept or decline your order for any reason, including product availability, errors in product or pricing information, or suspected fraud.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">5. Payment</h2>
              <p className="text-[var(--stone-600)] mb-6">
                We accept various payment methods as displayed at checkout. By providing payment information, you represent that you are authorized to use the payment method and authorize us to charge the full amount of your order. All payments are processed securely through our third-party payment processors.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">6. Shipping and Delivery</h2>
              <p className="text-[var(--stone-600)] mb-6">
                Shipping times and costs are estimated and not guaranteed. We are not responsible for delays caused by carriers, customs, weather, or other circumstances beyond our control. Risk of loss and title for products pass to you upon delivery to the carrier.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">7. Returns and Refunds</h2>
              <p className="text-[var(--stone-600)] mb-6">
                Our return and refund policy is detailed on our Returns page. By making a purchase, you agree to our return policy. We reserve the right to modify our return policy at any time.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">8. Intellectual Property</h2>
              <p className="text-[var(--stone-600)] mb-6">
                All content on this Site, including text, graphics, logos, images, and software, is the property of Animalia or our content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">9. User Conduct</h2>
              <p className="text-[var(--stone-600)] mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Use the Site for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the Site</li>
                <li>Interfere with the proper functioning of the Site</li>
                <li>Upload malicious code or harmful content</li>
                <li>Collect or harvest user information without consent</li>
                <li>Impersonate any person or entity</li>
                <li>Use automated systems to access the Site without permission</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-[var(--stone-600)] mb-6">
                THE SITE AND ALL PRODUCTS ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-[var(--stone-600)] mb-6">
                Product information on our Site is for general informational purposes only and is not intended as veterinary advice. Always consult with a qualified veterinarian regarding your pet&apos;s health needs.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">11. Limitation of Liability</h2>
              <p className="text-[var(--stone-600)] mb-6">
                TO THE FULLEST EXTENT PERMITTED BY LAW, ANIMALIA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR PRODUCTS.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">12. Indemnification</h2>
              <p className="text-[var(--stone-600)] mb-6">
                You agree to indemnify and hold harmless Animalia, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Site, violation of these Terms, or infringement of any rights of another party.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">13. Third-Party Links</h2>
              <p className="text-[var(--stone-600)] mb-6">
                Our Site may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of any third-party sites. Your use of third-party sites is at your own risk.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">14. Modifications to Terms</h2>
              <p className="text-[var(--stone-600)] mb-6">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Site after any changes constitutes acceptance of the new Terms.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">15. Governing Law</h2>
              <p className="text-[var(--stone-600)] mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts located in San Francisco County, California.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">16. Severability</h2>
              <p className="text-[var(--stone-600)] mb-6">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">17. Contact Information</h2>
              <p className="text-[var(--stone-600)] mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-[var(--stone-50)] rounded-xl p-6 text-[var(--stone-600)]">
                <p><strong>Animalia, Inc.</strong></p>
                <p>100 Smith Street</p>
                <p>Collingwood, VIC 3066</p>
                <p className="mt-2">Email: legal@animalia.com</p>
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

