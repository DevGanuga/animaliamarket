"use client";

import { useState } from "react";
import Link from "next/link";

const menuData = {
  dogs: {
    label: "Dogs",
    emoji: "🐕",
    featured: {
      title: "Best Sellers",
      description: "Our most loved dog products",
      href: "/collections/organic-canine-supplements-hip-and-joint",
    },
    columns: [
      {
        title: "Food",
        links: [
          { label: "Dry Food", href: "/collections/canine-dry-food" },
          { label: "Wet Food", href: "/collections/canine-wet-food" },
          { label: "All Dog Food", href: "/collections/organic-canine-food" },
        ],
      },
      {
        title: "Supplements",
        links: [
          { label: "Hip & Joint", href: "/collections/organic-canine-supplements-hip-and-joint" },
          { label: "All Supplements", href: "/collections/organic-supplements" },
        ],
      },
      {
        title: "Popular Brands",
        links: [
          { label: "VetriScience", href: "/brands/vetriscience" },
          { label: "Cosequin", href: "/brands/cosequin" },
          { label: "Grizzly", href: "/brands/grizzly-pet-products" },
          { label: "Nupro", href: "/brands/nupro" },
          { label: "View All Brands →", href: "/brands" },
        ],
      },
    ],
  },
  cats: {
    label: "Cats",
    emoji: "🐱",
    featured: {
      title: "Cat Wellness",
      description: "Everything for happy, healthy cats",
      href: "/collections/calm-feline-supplements",
    },
    columns: [
      {
        title: "Food",
        links: [
          { label: "Dry Food", href: "/collections/feline-dry-foods" },
          { label: "Dehydrated", href: "/collections/feline-dehydrated-goods" },
        ],
      },
      {
        title: "Supplements",
        links: [
          { label: "Calming", href: "/collections/calm-feline-supplements" },
          { label: "Hip & Joint", href: "/collections/feline-supplements-hip-joint" },
          { label: "Dental Health", href: "/collections/feline-dental-supplements" },
          { label: "Digestive", href: "/collections/feline-digestive-supplements" },
          { label: "Skin & Coat", href: "/collections/feline-skin-coat-supplements" },
          { label: "Ear & Eye Care", href: "/collections/feline-ear-eyes-supplements" },
          { label: "Kitten Care", href: "/collections/kitten-supplements" },
        ],
      },
      {
        title: "Popular Brands",
        links: [
          { label: "Comfort Zone", href: "/brands/comfort-zone" },
          { label: "Tiki Pets", href: "/brands/tiki-pets" },
          { label: "Greenies", href: "/brands/greenies" },
          { label: "Ark Naturals", href: "/brands/ark-naturals" },
          { label: "View All Brands →", href: "/brands" },
        ],
      },
    ],
  },
  brands: {
    label: "Brands",
    emoji: "✦",
    featured: {
      title: "Featured Products",
      description: "Top picks from our catalog",
      href: "/collections/frontpage",
    },
    columns: [
      {
        title: "Supplements",
        links: [
          { label: "VetriScience", href: "/brands/vetriscience" },
          { label: "Cosequin", href: "/brands/cosequin" },
          { label: "Pet Naturals", href: "/brands/pet-naturals-of-vermont" },
          { label: "Grizzly", href: "/brands/grizzly-pet-products" },
          { label: "Nupro", href: "/brands/nupro" },
        ],
      },
      {
        title: "Food & Nutrition",
        links: [
          { label: "The Honest Kitchen", href: "/brands/the-honest-kitchen" },
          { label: "Primal Pet Foods", href: "/brands/primal-pet-food" },
          { label: "Steve's Real Food", href: "/brands/steves-real-food" },
          { label: "Tiki Pets", href: "/brands/tiki-pets" },
        ],
      },
      {
        title: "Dental & Wellness",
        links: [
          { label: "Ark Naturals", href: "/brands/ark-naturals" },
          { label: "Greenies", href: "/brands/greenies" },
          { label: "Comfort Zone", href: "/brands/comfort-zone" },
          { label: "TropiClean", href: "/brands/tropicclean" },
          { label: "All Brands →", href: "/brands" },
        ],
      },
    ],
  },
};

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="relative flex items-center">
      {Object.entries(menuData).map(([key, menu]) => (
        <div
          key={key}
          className="relative"
          onMouseEnter={() => setActiveMenu(key)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          {/* Trigger */}
          <button
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors rounded-lg ${
              activeMenu === key
                ? "text-[var(--sage-700)] bg-[var(--sage-50)]"
                : "text-[var(--stone-600)] hover:text-[var(--stone-800)]"
            }`}
          >
            <span>{menu.emoji}</span>
            <span>{menu.label}</span>
            <svg
              className={`w-4 h-4 transition-transform ${activeMenu === key ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
              activeMenu === key
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-[var(--stone-100)] p-6 min-w-[650px]">
              <div className="grid grid-cols-4 gap-6">
                {/* Columns */}
                {menu.columns.map((column) => (
                  <div key={column.title}>
                    <h3 className="text-xs font-semibold text-[var(--stone-500)] uppercase tracking-wider mb-3">
                      {column.title}
                    </h3>
                    <ul className="space-y-2">
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className={`transition-colors text-sm ${
                              link.label.includes("→") 
                                ? "text-[var(--sage-600)] hover:text-[var(--sage-700)] font-medium"
                                : "text-[var(--stone-600)] hover:text-[var(--sage-600)]"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Featured */}
                <div className="bg-gradient-to-br from-[var(--sage-50)] to-[var(--gold-50)] rounded-xl p-4">
                  <span className="text-xs font-semibold text-[var(--sage-600)] uppercase tracking-wider">
                    Featured
                  </span>
                  <h4 className="font-semibold text-[var(--stone-800)] mt-2 mb-1">
                    {menu.featured.title}
                  </h4>
                  <p className="text-sm text-[var(--stone-600)] mb-3">
                    {menu.featured.description}
                  </p>
                  <Link
                    href={menu.featured.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--sage-600)] hover:text-[var(--sage-700)]"
                  >
                    Shop Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="mt-6 pt-4 border-t border-[var(--stone-100)] flex items-center justify-between">
                <Link
                  href={key === "brands" ? "/brands" : key === "dogs" ? "/collections/organic-canine-food" : "/collections/feline-dry-foods"}
                  className="text-sm font-medium text-[var(--sage-600)] hover:text-[var(--sage-700)] flex items-center gap-1"
                >
                  {key === "brands" ? "Browse All Brands" : `View All ${menu.label} Products`}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <div className="flex items-center gap-4 text-xs text-[var(--stone-500)]">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free shipping $50+
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Trusted brands only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
