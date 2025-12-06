"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

// Mock order data for demo
const MOCK_ORDER = {
  orderNumber: "ANM-2024-78542",
  status: "in_transit",
  estimatedDelivery: "December 10, 2024",
  carrier: "UPS",
  trackingNumber: "1Z999AA10123456784",
  items: [
    { name: "GlycoFlex Plus Joint Support - 120 Chews", quantity: 1, image: "🦴" },
    { name: "Composure Pro Calming Treats - 60 Count", quantity: 2, image: "😌" },
  ],
  timeline: [
    { status: "Order Placed", date: "Dec 5, 2024 - 10:32 AM", completed: true },
    { status: "Processing", date: "Dec 5, 2024 - 2:15 PM", completed: true },
    { status: "Shipped", date: "Dec 6, 2024 - 9:45 AM", completed: true },
    { status: "In Transit", date: "Dec 7, 2024 - 3:20 PM", completed: true, current: true },
    { status: "Out for Delivery", date: "Estimated Dec 10", completed: false },
    { status: "Delivered", date: "", completed: false },
  ],
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Demo: show mock result for any input
    if (orderNumber && email) {
      setShowResult(true);
    } else {
      setError("Please enter both your order number and email address.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Header />

      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-[var(--stone-900)] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--sage-500)]/20 text-[var(--sage-400)] text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Order Tracking
          </span>
          <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
            Track Your Order
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Enter your order details below to see real-time shipping updates and estimated delivery.
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-[var(--stone-700)] mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--stone-50)] border border-[var(--stone-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent transition-all"
                  placeholder="e.g., ANM-2024-78542"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--stone-700)] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--stone-50)] border border-[var(--stone-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--sage-500)] focus:border-transparent transition-all"
                  placeholder="The email used for your order"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-[var(--sage-600)] text-white font-semibold rounded-xl hover:bg-[var(--sage-700)] transition-colors shadow-lg shadow-[var(--sage-600)]/20"
              >
                Track Order
              </button>
            </div>
            
            <p className="text-center text-[var(--stone-500)] text-sm mt-6">
              Your order number can be found in your confirmation email.
            </p>
          </form>
        </div>
      </section>

      {/* Results */}
      {showResult && (
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Order Status Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-8">
              {/* Header */}
              <div className="bg-[var(--sage-600)] px-8 py-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Order Number</p>
                    <p className="font-semibold text-lg">{MOCK_ORDER.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm mb-1">Estimated Delivery</p>
                    <p className="font-semibold text-lg">{MOCK_ORDER.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-[var(--sage-100)] flex items-center justify-center">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div>
                    <p className="text-[var(--stone-500)] text-sm">Current Status</p>
                    <p className="font-semibold text-[var(--stone-800)] text-xl">In Transit</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {MOCK_ORDER.timeline.map((event, i) => (
                    <div key={event.status} className="flex gap-4 pb-8 last:pb-0">
                      {/* Line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                          event.completed 
                            ? event.current 
                              ? "bg-[var(--sage-500)] ring-4 ring-[var(--sage-100)]" 
                              : "bg-[var(--sage-500)]"
                            : "bg-[var(--stone-200)]"
                        }`} />
                        {i < MOCK_ORDER.timeline.length - 1 && (
                          <div className={`w-0.5 flex-1 mt-2 ${
                            event.completed ? "bg-[var(--sage-500)]" : "bg-[var(--stone-200)]"
                          }`} />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pb-2">
                        <p className={`font-medium ${event.completed ? "text-[var(--stone-800)]" : "text-[var(--stone-400)]"}`}>
                          {event.status}
                        </p>
                        <p className="text-sm text-[var(--stone-500)]">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Link */}
              <div className="px-8 py-6 bg-[var(--stone-50)] border-t border-[var(--stone-200)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[var(--stone-500)] text-sm">Carrier: {MOCK_ORDER.carrier}</p>
                    <p className="text-[var(--stone-700)] font-mono text-sm">{MOCK_ORDER.trackingNumber}</p>
                  </div>
                  <a
                    href="#"
                    className="px-6 py-2 bg-[var(--stone-800)] text-white text-sm font-medium rounded-full hover:bg-[var(--stone-900)] transition-colors"
                  >
                    Track on {MOCK_ORDER.carrier}
                  </a>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="font-semibold text-[var(--stone-800)] text-lg mb-6">Items in This Order</h3>
              <div className="space-y-4">
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 p-4 bg-[var(--stone-50)] rounded-xl">
                    <span className="text-3xl">{item.image}</span>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--stone-800)]">{item.name}</p>
                      <p className="text-sm text-[var(--stone-500)]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl text-[var(--stone-800)] mb-4">Need Help With Your Order?</h2>
          <p className="text-[var(--stone-600)] mb-6">
            Our support team is here to assist you with any questions about your order.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[var(--sage-600)] text-white font-semibold rounded-full hover:bg-[var(--sage-700)] transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="px-8 py-4 bg-[var(--stone-100)] text-[var(--stone-700)] font-semibold rounded-full hover:bg-[var(--stone-200)] transition-colors"
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

