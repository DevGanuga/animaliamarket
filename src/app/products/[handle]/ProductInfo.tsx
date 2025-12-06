"use client";

import { useState, useMemo } from "react";
import { AddToCartButton } from "./AddToCartButton";

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
}

interface ProductInfoProps {
  product: {
    id: string;
    title: string;
    vendor: string;
    description: string;
    options: Array<{
      id: string;
      name: string;
      values: string[];
    }>;
    variants: Variant[];
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
      maxVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    availableForSale: boolean;
    tags: string[];
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  // Track selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((option) => {
      initial[option.name] = option.values[0];
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);

  // Find matching variant based on selected options
  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) =>
      variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
    );
  }, [product.variants, selectedOptions]);

  const price = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  const compareAtPrice = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : parseFloat(product.compareAtPriceRange.minVariantPrice.amount);

  const isOnSale = compareAtPrice > price;
  const savings = isOnSale ? compareAtPrice - price : 0;

  const isAvailable = selectedVariant?.availableForSale ?? product.availableForSale;

  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      {/* Vendor */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[var(--sage-600)] uppercase tracking-wider">
          {product.vendor}
        </span>
        {product.tags.includes("bestseller") && (
          <span className="px-2.5 py-0.5 bg-[var(--gold-100)] text-[var(--gold-700)] text-xs font-semibold rounded-full">
            Best Seller
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl text-[var(--stone-800)] leading-tight">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold text-[var(--stone-800)]">
          ${price.toFixed(2)}
        </span>
        {isOnSale && (
          <>
            <span className="text-xl text-[var(--stone-400)] line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
            <span className="px-2.5 py-1 bg-[var(--sage-100)] text-[var(--sage-700)] text-sm font-semibold rounded-full">
              Save ${savings.toFixed(2)}
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.description && (
        <p className="text-[var(--stone-600)] leading-relaxed line-clamp-3">
          {product.description}
        </p>
      )}

      {/* Divider */}
      <hr className="border-[var(--stone-200)]" />

      {/* Options */}
      {product.options.map((option) => {
        // Skip "Title" option if it only has "Default Title"
        if (option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title") {
          return null;
        }

        return (
          <div key={option.id} className="space-y-3">
            <label className="block text-sm font-medium text-[var(--stone-700)]">
              {option.name}:{" "}
              <span className="font-normal text-[var(--stone-500)]">
                {selectedOptions[option.name]}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                
                // Check if this option value combination is available
                const isOptionAvailable = product.variants.some(
                  (v) =>
                    v.availableForSale &&
                    v.selectedOptions.some(
                      (o) => o.name === option.name && o.value === value
                    )
                );

                return (
                  <button
                    key={value}
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))
                    }
                    disabled={!isOptionAvailable}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-[var(--stone-800)] text-white border-[var(--stone-800)]"
                        : isOptionAvailable
                        ? "bg-white text-[var(--stone-700)] border-[var(--stone-200)] hover:border-[var(--stone-400)]"
                        : "bg-[var(--stone-100)] text-[var(--stone-400)] border-[var(--stone-100)] cursor-not-allowed line-through"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[var(--stone-700)]">
          Quantity
        </label>
        <div className="inline-flex items-center border border-[var(--stone-200)] rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 text-[var(--stone-600)] hover:bg-[var(--stone-50)] transition-colors"
            disabled={quantity <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="px-6 py-3 text-[var(--stone-800)] font-medium min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-3 text-[var(--stone-600)] hover:bg-[var(--stone-50)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="space-y-3 pt-2">
        <AddToCartButton
          variantId={selectedVariant?.id || product.variants[0]?.id}
          quantity={quantity}
          available={isAvailable}
        />
        
        {/* Buy Now */}
        {isAvailable && (
          <button className="w-full py-4 border-2 border-[var(--stone-800)] text-[var(--stone-800)] font-semibold rounded-xl hover:bg-[var(--stone-800)] hover:text-white transition-all">
            Buy Now
          </button>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
          <svg className="w-5 h-5 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Free shipping $50+
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
          <svg className="w-5 h-5 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Vet approved
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
          <svg className="w-5 h-5 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Easy returns
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
          <svg className="w-5 h-5 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Best price guaranteed
        </div>
      </div>
    </div>
  );
}



