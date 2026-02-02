"use client";

import { useState } from "react";
import { addToCart } from "@/app/actions/cart";

interface AddToCartButtonProps {
  variantId: string;
  quantity: number;
  available: boolean;
}

export function AddToCartButton({ variantId, quantity, available }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!available || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      await addToCart(variantId, quantity);
      
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      
      // Dispatch custom event to update cart drawer
      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(err instanceof Error ? err.message : "Failed to add to cart");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!available) {
    return (
      <button
        disabled
        className="w-full py-4 bg-[var(--stone-200)] text-[var(--stone-500)] font-semibold rounded-xl cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
        isAdded
          ? "bg-[var(--sage-500)] text-white"
          : "bg-[var(--stone-800)] text-white hover:bg-[var(--stone-900)]"
      }`}
    >
      {isLoading ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Adding...
        </>
      ) : isAdded ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </>
      ) : error ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}



