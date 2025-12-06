"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
  variant?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Demo cart items - in production this would come from cart state
const demoItems: CartItem[] = [];

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>(demoItems);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = async (id: string) => {
    setIsRemoving(id);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setItems((prev) => prev.filter((item) => item.id !== id));
    setIsRemoving(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--stone-200)]">
            <h2 className="text-xl font-semibold text-[var(--stone-800)]">
              Your Cart
              {items.length > 0 && (
                <span className="ml-2 text-[var(--stone-500)] font-normal">
                  ({items.length})
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[var(--stone-500)] hover:text-[var(--stone-700)] hover:bg-[var(--stone-100)] rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress */}
          {items.length > 0 && (
            <div className="px-6 py-4 bg-[var(--sage-50)]">
              {remainingForFreeShipping > 0 ? (
                <>
                  <p className="text-sm text-[var(--sage-700)] mb-2">
                    Add <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> more
                    for free shipping!
                  </p>
                  <div className="h-2 bg-[var(--sage-100)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--sage-500)] rounded-full transition-all duration-500"
                      style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[var(--sage-700)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">You've unlocked free shipping!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-[var(--stone-100)] rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-10 h-10 text-[var(--stone-400)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--stone-700)] mb-2">
                  Your cart is empty
                </h3>
                <p className="text-[var(--stone-500)] mb-6">
                  Add some products to get started!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[var(--sage-500)] text-white font-medium rounded-xl hover:bg-[var(--sage-600)] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 bg-[var(--stone-50)] rounded-xl transition-all duration-300 ${
                      isRemoving === item.id ? "opacity-50 scale-95" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--stone-300)]">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[var(--stone-800)] line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      {item.variant && (
                        <p className="text-xs text-[var(--stone-500)] mb-2">{item.variant}</p>
                      )}
                      <p className="text-sm font-semibold text-[var(--stone-800)]">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-[var(--stone-400)] hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex items-center border border-[var(--stone-200)] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-[var(--stone-500)] hover:bg-[var(--stone-100)]"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-[var(--stone-700)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-[var(--stone-500)] hover:bg-[var(--stone-100)]"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[var(--stone-200)] px-6 py-5 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--stone-600)]">Subtotal</span>
                <span className="text-xl font-semibold text-[var(--stone-800)]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button className="w-full py-4 bg-[var(--stone-800)] text-white font-semibold rounded-xl hover:bg-[var(--stone-900)] transition-colors flex items-center justify-center gap-2">
                Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full py-3 text-[var(--stone-600)] font-medium hover:text-[var(--stone-800)] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}



