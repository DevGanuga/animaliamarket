"use client";

import { useState } from "react";

interface AddToCartButtonProps {
  variantId: string;
  availableForSale: boolean;
}

/**
 * Client-side Add to Cart button
 *
 * This component handles the cart addition logic on the client.
 * In a full implementation, you would:
 * 1. Store cart ID in cookies/localStorage
 * 2. Call Server Actions to add items to the cart
 * 3. Update cart context/state
 */
export function AddToCartButton({ variantId, availableForSale }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function handleAddToCart() {
    if (!availableForSale) return;

    setIsAdding(true);

    // TODO: Implement actual cart logic
    // 1. Get or create cart ID from cookies
    // 2. Call addToCart server action
    // 3. Update cart state

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`Adding ${quantity} of variant ${variantId} to cart`);

    setIsAdding(false);

    // Show success message or update cart UI
  }

  if (!availableForSale) {
    return (
      <button
        disabled
        className="w-full py-4 px-6 bg-[var(--color-warm-gray)]/20 text-[var(--color-warm-gray)] font-medium rounded-full cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-[var(--color-charcoal)]">Quantity</span>
        <div className="flex items-center border border-[var(--color-sage-light)] rounded-full">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] transition-colors"
            disabled={quantity <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center font-medium text-[var(--color-charcoal)]">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full py-4 px-6 bg-[var(--color-charcoal)] text-white font-medium rounded-full hover:bg-[var(--color-sage-dark)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isAdding ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}



