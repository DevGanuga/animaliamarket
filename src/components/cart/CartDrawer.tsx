"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentCart, updateCartItemQuantity, removeFromCart } from "@/app/actions/cart";
import type { Cart } from "@/lib/shopify/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      const currentCart = await getCurrentCart();
      setCart(currentCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, []);

  // Fetch cart when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  // Listen for cart updates from AddToCartButton
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, [fetchCart]);

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

  const cartLines = cart?.lines?.edges?.map(edge => edge.node) || [];
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleUpdateQuantity = async (lineId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) {
      await handleRemoveItem(lineId);
      return;
    }

    setUpdatingLineId(lineId);
    try {
      const updatedCart = await updateCartItemQuantity(lineId, newQuantity);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    setUpdatingLineId(lineId);
    try {
      const updatedCart = await removeFromCart(lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingLineId(null);
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
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
              {cartLines.length > 0 && (
                <span className="ml-2 text-[var(--stone-500)] font-normal">
                  ({cart?.totalQuantity || 0})
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
          {cartLines.length > 0 && (
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
                      style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[var(--sage-700)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">You&apos;ve unlocked free shipping!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <svg className="w-8 h-8 animate-spin text-[var(--sage-500)]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : cartLines.length === 0 ? (
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
                {cartLines.map((line) => {
                  const merchandise = line.merchandise;
                  const product = merchandise.product;
                  const price = parseFloat(line.cost?.totalAmount?.amount || "0");
                  const image = merchandise.image?.url || product?.featuredImage?.url;
                  const isUpdating = updatingLineId === line.id;
                  
                  return (
                    <div
                      key={line.id}
                      className={`flex gap-4 p-4 bg-[var(--stone-50)] rounded-xl transition-all duration-300 ${
                        isUpdating ? "opacity-50" : ""
                      }`}
                    >
                      {/* Image */}
                      <Link 
                        href={`/products/${product?.handle}`}
                        className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0"
                        onClick={onClose}
                      >
                        {image ? (
                          <Image
                            src={image}
                            alt={product?.title || "Product"}
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
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${product?.handle}`}
                          className="text-sm font-medium text-[var(--stone-800)] line-clamp-2 mb-1 hover:text-[var(--sage-600)]"
                          onClick={onClose}
                        >
                          {product?.title}
                        </Link>
                        {merchandise.title !== "Default Title" && (
                          <p className="text-xs text-[var(--stone-500)] mb-2">{merchandise.title}</p>
                        )}
                        <p className="text-sm font-semibold text-[var(--stone-800)]">
                          ${price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemoveItem(line.id)}
                          disabled={isUpdating}
                          className="p-1 text-[var(--stone-400)] hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="flex items-center border border-[var(--stone-200)] rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, -1)}
                            disabled={isUpdating}
                            className="px-2 py-1 text-[var(--stone-500)] hover:bg-[var(--stone-100)] disabled:opacity-50"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-[var(--stone-700)]">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, 1)}
                            disabled={isUpdating}
                            className="px-2 py-1 text-[var(--stone-500)] hover:bg-[var(--stone-100)] disabled:opacity-50"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartLines.length > 0 && (
            <div className="border-t border-[var(--stone-200)] px-6 py-5 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-[var(--stone-600)]">Subtotal</span>
                <span className="text-xl font-semibold text-[var(--stone-800)]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-[var(--stone-500)]">
                Shipping and taxes calculated at checkout
              </p>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-[var(--stone-800)] text-white font-semibold rounded-xl hover:bg-[var(--stone-900)] transition-colors flex items-center justify-center gap-2"
              >
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
