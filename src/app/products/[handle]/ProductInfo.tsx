"use client";

import { useState, useMemo } from "react";
import { AddToCartButton } from "./AddToCartButton";
import {
  getFreeShippingCopy,
  getProductBenefits,
  getProductConcernLabel,
  getProductSummary,
  getProductUseCases,
  getValueCallout,
} from "@/lib/merchandising";

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
    metafields?: Array<{ key: string; value: string; namespace: string; type: string } | null>;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((option) => {
      initial[option.name] = option.values[0];
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) =>
      variant.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
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

  const summary = getProductSummary({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const benefits = getProductBenefits({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const concernLabel = getProductConcernLabel({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const useCases = getProductUseCases({
    title: product.title,
    description: product.description,
    tags: product.tags,
    metafields: product.metafields,
  });
  const valueCallout = getValueCallout(selectedVariant?.title || product.title);
  const freeShippingCopy = getFreeShippingCopy(price * quantity);

  return (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[var(--stone-100)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--sage-600)] uppercase tracking-wider">
            {product.vendor}
          </span>
          {product.tags.includes("bestseller") && (
            <span className="px-2.5 py-0.5 bg-[var(--gold-100)] text-[var(--gold-700)] text-xs font-semibold rounded-full">
              Best Seller
            </span>
          )}
          <span className="rounded-full bg-[var(--stone-100)] px-2.5 py-0.5 text-xs font-semibold text-[var(--stone-600)]">
            {concernLabel}
          </span>
        </div>

        <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-[var(--stone-800)] leading-tight">
          {product.title}
        </h1>

        <div className="mt-5">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-[var(--stone-800)]">
              ${price.toFixed(2)}
            </span>
            {isOnSale && (
              <>
                <span className="text-xl text-[var(--stone-400)] line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-sm font-bold rounded-full">
                  Save {Math.round((savings / compareAtPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          {isOnSale && (
            <p className="mt-1.5 text-sm font-medium text-[var(--sage-700)]">
              You save ${savings.toFixed(2)} on this item
            </p>
          )}
        </div>

        {valueCallout && (
          <div className="mt-5 rounded-2xl border border-[var(--sage-200)] bg-[var(--sage-50)] px-4 py-3 text-sm text-[var(--sage-800)]">
            {valueCallout}
          </div>
        )}

        <p className="mt-5 text-[var(--stone-600)] leading-relaxed text-base sm:text-lg">
          {summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {useCases.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--stone-200)] bg-[var(--stone-50)] px-3 py-1.5 text-xs font-medium text-[var(--stone-700)]"
            >
              {item}
            </span>
          ))}
        </div>

        {benefits.length > 0 && (
          <div className="mt-6 rounded-3xl bg-[var(--cream)] p-5 ring-1 ring-[var(--stone-100)]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--stone-500)]">
              Why shoppers buy this
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-[var(--stone-700)]">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--sage-100)] text-[var(--sage-700)]">
                    ✓
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr className="my-6 border-[var(--stone-200)]" />

        {product.options.map((option) => {
          if (option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title") {
            return null;
          }

          return (
            <div key={option.id} className="space-y-3 mb-5 last:mb-0">
              <label className="block text-sm font-medium text-[var(--stone-700)]">
                {option.name}:{" "}
                <span className="font-normal text-[var(--stone-500)]">
                  {selectedOptions[option.name]}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  const isOptionAvailable = product.variants.some(
                    (variant) =>
                      variant.availableForSale &&
                      variant.selectedOptions.some(
                        (selectedOption) => selectedOption.name === option.name && selectedOption.value === value
                      )
                  );

                  return (
                    <button
                      key={value}
                      onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
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

        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-[var(--stone-700)]">
            Quantity
          </label>
          <div className="inline-flex items-center border border-[var(--stone-200)] rounded-xl overflow-hidden bg-white">
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

        <div className="mt-6 space-y-3">
          {isAvailable && (
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-emerald-700">In Stock &mdash; Ready to Ship</span>
            </div>
          )}

          <AddToCartButton
            variantId={selectedVariant?.id || product.variants[0]?.id}
            quantity={quantity}
            available={isAvailable}
          />

          <div className="rounded-2xl border border-[var(--stone-200)] bg-[var(--stone-50)] px-4 py-3 text-sm text-[var(--stone-600)]">
            {freeShippingCopy}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-[var(--stone-200)]">
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
            Curated for clear wellness needs
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
            <svg className="w-5 h-5 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Repeat-use friendly formats
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--stone-600)]">
            <svg className="w-5 h-5 text-[var(--sage-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Great value for daily wellness routines
          </div>
        </div>
      </div>
    </div>
  );
}
