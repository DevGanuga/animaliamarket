"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentCart, updateCartItemQuantity, removeFromCart } from "@/app/actions/cart";
import type { Cart } from "@/lib/shopify/types";

type DrawerSuggestion = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SUGGESTIONS: DrawerSuggestion[] = [
  {
    title: "Add daily omega support",
    description: "Easy add-on products that help lift basket value without making the cart feel heavy.",
    href: "/brands/alaska-naturals",
    cta: "Shop omega oils",
  },
  {
    title: "Add a dental routine",
    description: "Low-friction dental care is one of the simplest ways to turn a one-item cart into a repeat routine.",
    href: "/collections/feline-dental-supplements",
    cta: "Shop dental care",
  },
  {
    title: "Stock up on mobility",
    description: "Larger-count joint support and daily-use products are a natural way to build a stronger wellness basket.",
    href: "/collections/organic-canine-supplements-hip-and-joint",
    cta: "Shop joint support",
  },
];

function getSuggestions(cartTitles: string[], remainingForFreeShipping: number): DrawerSuggestion[] {
  const text = cartTitles.join(" ").toLowerCase();
  const freeShippingPrompt =
    remainingForFreeShipping > 0
      ? `Add one more easy item to close the $${remainingForFreeShipping.toFixed(2)} gap.`
      : "Your cart already qualifies for free shipping, so these are pure basket-builders.";

  if (text.includes("joint") || text.includes("hip") || text.includes("mobility")) {
    return [
      {
        title: "Pair mobility with calming",
        description: `${freeShippingPrompt} Calming products make a natural second need for many households.`,
        href: "/collections/calm-feline-supplements",
        cta: "Add calming support",
      },
      {
        title: "Layer in omega oils",
        description: "Omega products are easy repeat-use add-ons that complement joint and skin routines well.",
        href: "/brands/alaska-naturals",
        cta: "Browse omega oils",
      },
      {
        title: "Round out the routine",
        description: "Dental care is one of the lowest-friction ways to improve basket size without changing the main purchase intent.",
        href: "/collections/feline-dental-supplements",
        cta: "Add dental care",
      },
    ];
  }

  if (text.includes("calm") || text.includes("stress") || text.includes("anxiety")) {
    return [
      {
        title: "Add daily dental care",
        description: `${freeShippingPrompt} Dental products tend to stack well with calming and other daily routines.`,
        href: "/collections/feline-dental-supplements",
        cta: "Shop dental care",
      },
      {
        title: "Support everyday wellness",
        description: "Omega and daily supplement products are easy to justify as a second item in a calm-focused basket.",
        href: "/collections/organic-supplements",
        cta: "Shop daily wellness",
      },
      {
        title: "Build a larger routine",
        description: "Joint support is another strong high-intent category if this household also has a senior or active pet.",
        href: "/collections/organic-canine-supplements-hip-and-joint",
        cta: "Shop joint support",
      },
    ];
  }

  if (text.includes("dental") || text.includes("plaque") || text.includes("breath")) {
    return [
      {
        title: "Add gut or daily wellness",
        description: `${freeShippingPrompt} Dental and digestion products make an easy recurring-care combination.`,
        href: "/collections/feline-digestive-supplements",
        cta: "Shop digestion",
      },
      {
        title: "Add calming support",
        description: "Calming is another low-complexity category that pairs naturally with everyday wellness baskets.",
        href: "/collections/calm-feline-supplements",
        cta: "Shop calming",
      },
      {
        title: "Add omega oils",
        description: "Omega products are simple add-ons with good perceived value and repeat-use potential.",
        href: "/brands/alaska-naturals",
        cta: "Browse omega oils",
      },
    ];
  }

  return DEFAULT_SUGGESTIONS.map((suggestion, index) =>
    index === 0
      ? { ...suggestion, description: `${freeShippingPrompt} ${suggestion.description}` }
      : suggestion
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentCart = await getCurrentCart();
      setCart(currentCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, [fetchCart]);

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

  const cartLines = useMemo(() => cart?.lines?.edges?.map((edge) => edge.node) || [], [cart]);
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const suggestions = useMemo(
    () => getSuggestions(cartLines.map((line) => line.merchandise.product.title), remainingForFreeShipping),
    [cartLines, remainingForFreeShipping]
  );

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
      window.dispatchEvent(new CustomEvent("cart-updated"));
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
      window.dispatchEvent(new CustomEvent("cart-updated"));
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
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
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

          {cartLines.length > 0 && (
            <div className="px-6 py-4 bg-[var(--sage-50)] border-b border-[var(--sage-100)]">
              {remainingForFreeShipping > 0 ? (
                <>
                  <p className="text-sm text-[var(--sage-700)] mb-2">
                    Add <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> more for free shipping.
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
                  <span className="text-sm font-medium">You&apos;ve unlocked free shipping.</span>
                </div>
              )}
            </div>
          )}

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
                <p className="text-[var(--stone-500)] mb-6 max-w-xs">
                  Start with a high-intent need so the store can guide you toward a stronger wellness routine.
                </p>
                <div className="grid w-full gap-3 mb-6">
                  {DEFAULT_SUGGESTIONS.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={onClose}
                      className="rounded-2xl border border-[var(--stone-200)] bg-[var(--stone-50)] p-4 text-left"
                    >
                      <p className="font-medium text-[var(--stone-800)]">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--stone-500)]">{item.cta}</p>
                    </Link>
                  ))}
                </div>
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
                      <Link
                        href={`/products/${product?.handle}`}
                        className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0"
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

                <div className="rounded-3xl border border-[var(--stone-200)] bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sage-700)]">
                        Complete the routine
                      </p>
                      <h3 className="mt-1 font-serif text-xl text-[var(--stone-800)]">
                        Still room in the basket
                      </h3>
                    </div>
                    <span className="rounded-full bg-[var(--sage-50)] px-3 py-1 text-xs font-medium text-[var(--sage-700)]">
                      {remainingForFreeShipping > 0 ? `${remainingForFreeShipping.toFixed(2)} to free shipping` : 'Free shipping unlocked'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {suggestions.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={onClose}
                        className="block rounded-2xl border border-[var(--stone-200)] bg-[var(--stone-50)] p-4 hover:border-[var(--sage-200)] hover:bg-[var(--sage-50)] transition-colors"
                      >
                        <p className="font-medium text-[var(--stone-800)]">{item.title}</p>
                        <p className="mt-1 text-sm text-[var(--stone-500)]">{item.description}</p>
                        <p className="mt-3 text-sm font-medium text-[var(--sage-700)]">{item.cta} →</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {cartLines.length > 0 && (
            <div className="border-t border-[var(--stone-200)] px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--stone-600)]">Subtotal</span>
                <span className="text-xl font-semibold text-[var(--stone-800)]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-[var(--stone-500)]">
                Shipping and taxes calculated at checkout.
              </p>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-[var(--stone-800)] text-white font-semibold rounded-xl hover:bg-[var(--stone-900)] transition-colors flex items-center justify-center gap-2"
              >
                Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

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
