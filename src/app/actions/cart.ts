"use server";

import { cookies } from "next/headers";
import { shopify, Cart } from "@/lib/shopify";

const CART_COOKIE_NAME = "animalia-cart-id";

/**
 * Get the current cart ID from cookies
 */
async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value;
}

/**
 * Set the cart ID in cookies
 */
async function setCartId(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

/**
 * Get the current cart, creating one if it doesn't exist
 */
export async function getOrCreateCart(): Promise<Cart> {
  const cartId = await getCartId();

  if (cartId) {
    const existingCart = await shopify.getCart(cartId);
    if (existingCart) {
      return existingCart;
    }
  }

  // Create new cart
  const newCart = await shopify.createCart();
  await setCartId(newCart.id);
  return newCart;
}

/**
 * Add an item to the cart
 */
export async function addToCart(variantId: string, quantity: number = 1): Promise<Cart> {
  const cart = await getOrCreateCart();

  const updatedCart = await shopify.addToCart(cart.id, [
    {
      merchandiseId: variantId,
      quantity,
    },
  ]);

  return updatedCart;
}

/**
 * Update a cart line item quantity
 */
export async function updateCartItemQuantity(lineId: string, quantity: number): Promise<Cart> {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const updatedCart = await shopify.updateCartLines(cartId, [
    {
      id: lineId,
      quantity,
    },
  ]);

  return updatedCart;
}

/**
 * Remove an item from the cart
 */
export async function removeFromCart(lineId: string): Promise<Cart> {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const updatedCart = await shopify.removeFromCart(cartId, [lineId]);
  return updatedCart;
}

/**
 * Apply a discount code to the cart
 */
export async function applyDiscount(code: string): Promise<Cart & { discountCodes: { code: string; applicable: boolean }[] }> {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No cart found");
  }

  const updatedCart = await shopify.applyDiscountCode(cartId, [code]);
  return updatedCart;
}

/**
 * Get the current cart (returns null if no cart exists)
 */
export async function getCurrentCart(): Promise<Cart | null> {
  const cartId = await getCartId();

  if (!cartId) {
    return null;
  }

  return shopify.getCart(cartId);
}



