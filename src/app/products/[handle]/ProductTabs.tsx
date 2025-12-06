"use client";

import { useState } from "react";

interface ProductTabsProps {
  description: string;
  vendor: string;
}

export function ProductTabs({ description, vendor }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "ingredients", label: "Ingredients" },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <div className="mt-16 border-t border-[var(--stone-200)] pt-12">
      {/* Tab Headers */}
      <div className="flex gap-1 border-b border-[var(--stone-200)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? "border-[var(--sage-500)] text-[var(--sage-700)]"
                : "border-transparent text-[var(--stone-500)] hover:text-[var(--stone-700)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === "description" && (
          <div className="prose prose-stone max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: description || "<p>No description available.</p>" }}
              className="text-[var(--stone-600)] leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[var(--stone-800)] [&>h3]:mt-6 [&>h3]:mb-3"
            />
          </div>
        )}

        {activeTab === "ingredients" && (
          <div className="space-y-6">
            <p className="text-[var(--stone-600)]">
              Our products are made with premium, carefully selected ingredients.
              For the complete ingredient list, please refer to the product packaging.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Natural Ingredients", "No Artificial Colors", "No Preservatives", "Made in USA"].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 p-4 bg-[var(--sage-50)] rounded-xl"
                >
                  <svg className="w-5 h-5 text-[var(--sage-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-[var(--sage-700)]">{badge}</span>
                </div>
              ))}
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
                    <span>Express shipping: 1-3 business days</span>
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
                    <span>30-day hassle-free returns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Full refund on unopened items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[var(--sage-500)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Contact us for return authorization</span>
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



