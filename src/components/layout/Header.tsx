"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MegaMenu } from "./MegaMenu";
import { CartDrawer } from "../cart";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[var(--sage-600)] text-white py-2.5 text-center text-sm">
        <span className="hidden sm:inline">🐾 </span>
        Free shipping on orders over $50 •{" "}
        <Link href="/collections/all" className="underline hover:no-underline">
          Shop Now
        </Link>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[var(--stone-600)] hover:text-[var(--stone-800)]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <span className="font-serif text-2xl text-[var(--stone-800)]">animalia</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <MegaMenu />
              <Link
                href="/collections/all"
                className="px-4 py-2 text-[var(--stone-600)] hover:text-[var(--stone-800)] font-medium transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-[var(--stone-600)] hover:text-[var(--stone-800)] font-medium transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-[var(--stone-600)] hover:text-[var(--stone-800)] hover:bg-[var(--stone-100)] rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex p-2.5 text-[var(--stone-600)] hover:text-[var(--stone-800)] hover:bg-[var(--stone-100)] rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 text-[var(--stone-600)] hover:text-[var(--stone-800)] hover:bg-[var(--stone-100)] rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {/* Cart Count Badge */}
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--sage-500)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="max-w-2xl mx-auto mt-24 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 p-4 border-b border-[var(--stone-200)]">
                <svg className="w-5 h-5 text-[var(--stone-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 text-lg outline-none bg-transparent"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-[var(--stone-400)] hover:text-[var(--stone-600)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-[var(--stone-500)] mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Hip & Joint", "Calming", "Cat Food", "Dog Treats", "Supplements"].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="px-4 py-2 bg-[var(--stone-100)] text-[var(--stone-700)] rounded-full text-sm hover:bg-[var(--stone-200)] transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[var(--stone-200)]">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-2xl">🐾</span>
                <span className="font-serif text-xl text-[var(--stone-800)]">animalia</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[var(--stone-500)] hover:text-[var(--stone-700)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4 space-y-1">
              <p className="text-xs font-medium text-[var(--stone-500)] uppercase tracking-wider px-3 mb-2">
                Shop
              </p>
              {[
                { label: "All Products", href: "/collections/all" },
                { label: "Dogs", href: "/collections/organic-canine-supplements-hip-and-joint" },
                { label: "Cats", href: "/collections/calm-feline-supplements" },
                { label: "Supplements", href: "/collections/organic-canine-supplements-hip-and-joint" },
                { label: "Food", href: "/collections/canine-dry-foods" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-[var(--stone-700)] hover:bg-[var(--stone-50)] rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="my-4 border-[var(--stone-200)]" />

              <p className="text-xs font-medium text-[var(--stone-500)] uppercase tracking-wider px-3 mb-2">
                Info
              </p>
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Shipping", href: "/shipping" },
                { label: "Returns", href: "/returns" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-[var(--stone-700)] hover:bg-[var(--stone-50)] rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
