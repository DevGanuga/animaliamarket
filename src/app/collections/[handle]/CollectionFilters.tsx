"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

interface CollectionFiltersProps {
  totalProducts: number;
  vendors: string[];
  currentSort?: string;
  currentAvailability?: string;
}

export function CollectionFilters({
  totalProducts,
  vendors,
  currentSort,
  currentAvailability,
}: CollectionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const sortOptions = [
    { value: "", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "title-asc", label: "A to Z" },
    { value: "title-desc", label: "Z to A" },
  ];

  return (
    <div className="mb-8">
      {/* Desktop Filters */}
      <div className="hidden md:flex items-center justify-between gap-4 pb-6 border-b border-[var(--stone-200)]">
        {/* Left: Filter Pills */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--stone-500)]">Filter:</span>
          
          {/* Availability Toggle */}
          <button
            onClick={() =>
              updateFilter(
                "availability",
                currentAvailability === "in-stock" ? null : "in-stock"
              )
            }
            className={`px-4 py-2 text-sm rounded-full border transition-all ${
              currentAvailability === "in-stock"
                ? "bg-[var(--sage-500)] text-white border-[var(--sage-500)]"
                : "bg-white text-[var(--stone-600)] border-[var(--stone-200)] hover:border-[var(--stone-300)]"
            }`}
          >
            In Stock Only
          </button>
        </div>

        {/* Right: Sort + Count */}
        <div className="flex items-center gap-6">
          <span className="text-sm text-[var(--stone-500)]">
            {totalProducts} products
          </span>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--stone-500)]">Sort by:</label>
            <select
              value={currentSort || ""}
              onChange={(e) => updateFilter("sort", e.target.value || null)}
              className="px-4 py-2 bg-white border border-[var(--stone-200)] rounded-lg text-sm text-[var(--stone-700)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-300)] focus:border-transparent cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Filter Bar */}
      <div className="md:hidden flex items-center justify-between gap-4 pb-4 border-b border-[var(--stone-200)]">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--stone-200)] rounded-lg text-sm text-[var(--stone-700)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>

        <select
          value={currentSort || ""}
          onChange={(e) => updateFilter("sort", e.target.value || null)}
          className="px-4 py-2 bg-white border border-[var(--stone-200)] rounded-lg text-sm text-[var(--stone-700)]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--stone-800)]">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-[var(--stone-100)] rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[var(--stone-700)] mb-3">
                  Availability
                </h4>
                <button
                  onClick={() => {
                    updateFilter(
                      "availability",
                      currentAvailability === "in-stock" ? null : "in-stock"
                    );
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left rounded-xl border transition-all ${
                    currentAvailability === "in-stock"
                      ? "bg-[var(--sage-50)] text-[var(--sage-700)] border-[var(--sage-300)]"
                      : "bg-white text-[var(--stone-600)] border-[var(--stone-200)]"
                  }`}
                >
                  In Stock Only
                </button>
              </div>

              {/* Vendors */}
              {vendors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[var(--stone-700)] mb-3">
                    Brands
                  </h4>
                  <div className="space-y-2">
                    {vendors.slice(0, 10).map((vendor) => (
                      <div
                        key={vendor}
                        className="px-4 py-3 bg-[var(--stone-50)] rounded-xl text-sm text-[var(--stone-600)]"
                      >
                        {vendor}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-[var(--sage-500)] text-white font-medium rounded-xl hover:bg-[var(--sage-600)] transition-colors"
              >
                Show {totalProducts} products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



