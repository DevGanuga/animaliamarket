import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Learn about Animalia's commitment to digital accessibility and how to report any barriers you encounter.",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4">
            Accessibility Statement
          </h1>
          <p className="text-white/60">
            Our commitment to digital accessibility for all users
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="prose prose-stone max-w-none">
              
              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-0 mb-4">Our Commitment</h2>
              <p className="text-[var(--stone-600)] mb-6">
                Animalia is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to guarantee we provide equal access to all users.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Conformance Status</h2>
              <p className="text-[var(--stone-600)] mb-6">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Accessibility Features</h2>
              <p className="text-[var(--stone-600)] mb-4">
                We have implemented the following features to enhance accessibility:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li><strong>Keyboard Navigation:</strong> Our website can be navigated using only a keyboard</li>
                <li><strong>Screen Reader Support:</strong> Content is structured to work with screen readers and assistive technologies</li>
                <li><strong>Alt Text:</strong> Images include descriptive alternative text</li>
                <li><strong>Color Contrast:</strong> We maintain sufficient color contrast ratios for text readability</li>
                <li><strong>Resizable Text:</strong> Text can be resized up to 200% without loss of functionality</li>
                <li><strong>Focus Indicators:</strong> Clear visual focus indicators for interactive elements</li>
                <li><strong>Semantic HTML:</strong> Proper heading structure and landmark regions</li>
                <li><strong>Form Labels:</strong> All form inputs have associated labels</li>
                <li><strong>Skip Links:</strong> Skip navigation links for keyboard users</li>
                <li><strong>Consistent Navigation:</strong> Navigation is consistent across all pages</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Assistive Technologies</h2>
              <p className="text-[var(--stone-600)] mb-4">
                Our website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Screen readers (VoiceOver, NVDA, JAWS)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Browser accessibility features</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Known Limitations</h2>
              <p className="text-[var(--stone-600)] mb-4">
                While we strive for comprehensive accessibility, some areas may still present challenges:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li><strong>Third-party content:</strong> Some content provided by third parties may not fully meet accessibility standards</li>
                <li><strong>PDF documents:</strong> Older PDF documents may not be fully accessible</li>
                <li><strong>Video content:</strong> Some video content may lack captions or audio descriptions</li>
                <li><strong>Complex features:</strong> Some interactive features may have limited accessibility support</li>
              </ul>
              <p className="text-[var(--stone-600)] mb-6">
                We are actively working to address these limitations and improve accessibility across all areas of our website.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Ongoing Efforts</h2>
              <p className="text-[var(--stone-600)] mb-4">
                We are committed to continuous improvement of accessibility through:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>Regular accessibility audits and testing</li>
                <li>Training for our development and content teams</li>
                <li>Integration of accessibility into our design and development process</li>
                <li>Engagement with users who have disabilities for feedback</li>
                <li>Monitoring of accessibility standards and best practices</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Alternative Access</h2>
              <p className="text-[var(--stone-600)] mb-6">
                If you have difficulty accessing any content or feature on our website, we are happy to assist you. Our customer service team can help you complete transactions, find product information, or answer any questions over the phone or via email.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Feedback and Contact</h2>
              <p className="text-[var(--stone-600)] mb-4">
                We welcome your feedback on the accessibility of our website. If you encounter any barriers or have suggestions for improvement, please let us know:
              </p>
              <div className="bg-[var(--sage-50)] rounded-xl p-6 text-[var(--stone-600)] mb-6">
                <p><strong>Accessibility Coordinator</strong></p>
                <p className="mt-2">Email: accessibility@animalia.com</p>
                <p>Phone: +1 (555) 000-0000</p>
                <p className="mt-2">We aim to respond to accessibility feedback within 2 business days.</p>
              </div>
              <p className="text-[var(--stone-600)] mb-6">
                When contacting us, please include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--stone-600)] mb-6">
                <li>A description of the accessibility barrier you encountered</li>
                <li>The web address (URL) of the page</li>
                <li>Your browser and operating system</li>
                <li>Any assistive technology you were using</li>
              </ul>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Formal Complaints</h2>
              <p className="text-[var(--stone-600)] mb-6">
                If you are not satisfied with our response to your accessibility concern, you may file a complaint with the appropriate regulatory body in your jurisdiction. In the United States, you may also contact the U.S. Department of Justice Civil Rights Division.
              </p>

              <h2 className="font-serif text-2xl text-[var(--stone-800)] mt-10 mb-4">Assessment and Updates</h2>
              <p className="text-[var(--stone-600)] mb-6">
                This accessibility statement was last reviewed on December 1, 2024. We review and update this statement annually, or more frequently when significant changes are made to our website.
              </p>

            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-[var(--sage-600)] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Need Assistance?</h3>
            <p className="text-white/70 mb-6">
              Our team is here to help you navigate our website and complete your purchase.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-white text-[var(--sage-700)] font-semibold rounded-full hover:bg-[var(--sage-50)] transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="tel:+15550000000"
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors"
              >
                Call: (555) 000-0000
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

