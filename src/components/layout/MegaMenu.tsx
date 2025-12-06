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
          { label: "Dry Food", href: "/collections/canine-dry-foods" },
          { label: "Wet Food", href: "/collections/canine-wet-foods" },
          { label: "Dehydrated", href: "/collections/canine-dehydrated-foods" },
          { label: "Freeze-Dried", href: "/collections/canine-freeze-dried-foods" },
          { label: "All Dog Food", href: "/collections/canine-dry-foods" },
        ],
      },
      {
        title: "Supplements",
        links: [
          { label: "Hip & Joint", href: "/collections/organic-canine-supplements-hip-and-joint" },
          { label: "Calming", href: "/collections/calm-canine-supplements" },
          { label: "Skin & Coat", href: "/collections/organic-canine-supplements-skin-and-coat" },
          { label: "Digestive", href: "/collections/canine-digestive-supplements" },
          { label: "All Supplements", href: "/collections/organic-canine-supplements-hip-and-joint" },
        ],
      },
      {
        title: "Shop by Need",
        links: [
          { label: "Senior Dogs", href: "/collections/organic-canine-supplements-hip-and-joint" },
          { label: "Puppies", href: "/collections/canine-dry-foods" },
          { label: "Active Dogs", href: "/collections/organic-canine-supplements-hip-and-joint" },
          { label: "Anxious Dogs", href: "/collections/calm-canine-supplements" },
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
          { label: "Wet Food", href: "/collections/feline-wet-foods" },
          { label: "Freeze-Dried", href: "/collections/feline-freeze-dried-foods" },
          { label: "All Cat Food", href: "/collections/feline-dry-foods" },
        ],
      },
      {
        title: "Supplements",
        links: [
          { label: "Calming", href: "/collections/calm-feline-supplements" },
          { label: "Hip & Joint", href: "/collections/feline-hip-and-joint-supplements" },
          { label: "Dental Health", href: "/collections/feline-dental-supplements" },
          { label: "Digestive", href: "/collections/feline-digestive-supplements" },
          { label: "All Supplements", href: "/collections/calm-feline-supplements" },
        ],
      },
      {
        title: "Shop by Need",
        links: [
          { label: "Senior Cats", href: "/collections/feline-hip-and-joint-supplements" },
          { label: "Kittens", href: "/collections/feline-dry-foods" },
          { label: "Indoor Cats", href: "/collections/calm-feline-supplements" },
          { label: "Multi-Cat Homes", href: "/collections/calm-feline-supplements" },
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
            <div className="bg-white rounded-2xl shadow-2xl border border-[var(--stone-100)] p-6 min-w-[600px]">
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
                            className="text-[var(--stone-600)] hover:text-[var(--sage-600)] transition-colors text-sm"
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
                  href={key === "dogs" ? "/collections/organic-canine-supplements-hip-and-joint" : "/collections/calm-feline-supplements"}
                  className="text-sm font-medium text-[var(--sage-600)] hover:text-[var(--sage-700)] flex items-center gap-1"
                >
                  View All {menu.label}
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
                    Vet approved
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
