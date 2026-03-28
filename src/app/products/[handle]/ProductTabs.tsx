"use client";

import { useState } from "react";

interface ProductTabsProps {
  vendor: string;
  overviewParagraphs: string[];
  ingredients: string;
  usage: string;
}

export function ProductTabs({ vendor, overviewParagraphs, ingredients, usage }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Overview" },
    { id: "ingredients", label: "Details" },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <div className="mt-16 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[var(--stone-100)] sm:p-8">
      <div className="flex gap-1 border-b border-[var(--stone-200)] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[var(--sage-500)] text-[var(--sage-700)]"
                : "border-transparent text-[var(--stone-500)] hover:text-[var(--stone-700)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === "description" && (
          <div className="space-y-4 text-[var(--stone-600)] leading-relaxed">
            {overviewParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="rounded-2xl bg-[var(--stone-50)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--stone-500)] mb-2">
                Brand
              </p>
              <p>{vendor}</p>
            </div>
          </div>
        )}

        {activeTab === "ingredients" && (
          <div className="space-y-6">
            {usage && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[var(--stone-800)]">
                  How to use
                </h3>
                <div className="rounded-2xl bg-[var(--stone-50)] p-5 text-[var(--stone-600)]">
                  {usage.split("\n").map((line) => (
                    <p key={line} className="mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="mb-3 text-lg font-semibold text-[var(--stone-800)]">
                Ingredients and product details
              </h3>
              {ingredients ? (
                <div className="rounded-2xl bg-[var(--stone-50)] p-5 text-[var(--stone-600)]">
                  {ingredients.split("\n").map((line) => (
                    <p key={line} className="mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--stone-600)]">
                  Ingredient details from the supplier are limited or inconsistent for this item. Please review the product packaging after delivery or contact us if you want help confirming fit before you order.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-[var(--stone-800)] mb-4">
                  Shipping Information
                </h3>
                <ul className="space-y-3 text-[var(--stone-600)]">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on orders over $50</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Standard shipping: 3-7 business days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Checkout calculates final shipping and taxes.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--stone-800)] mb-4">
                  Returns Policy
                </h3>
                <ul className="space-y-3 text-[var(--stone-600)]">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day returns on unopened items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Contact support if you need help before or after ordering.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>We&apos;ll help you find the right next step if a product is not the right fit.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
