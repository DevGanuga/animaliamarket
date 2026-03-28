"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { addToCart } from "@/app/actions/cart";

interface ProductCardProps {
  product: {
    id: string;
    handle: string;
    title: string;
    vendor?: string;
    featuredImage?: {
      url: string;
      altText?: string | null;
    } | null;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    availableForSale?: boolean;
    tags?: string[];
    options?: Array<{
      name: string;
      values: string[];
    }>;
    variants?: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale?: boolean;
        };
      }>;
    };
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discountPercent = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const firstVariant = product.variants?.edges?.[0]?.node;
  const hasSingleOptionConfiguration =
    !product.options ||
    product.options.length === 0 ||
    product.options.every((option) => option.values.length === 1);
  const canQuickAdd = Boolean(
    product.availableForSale &&
      firstVariant?.id &&
      (firstVariant.title === "Default Title" || hasSingleOptionConfiguration)
  );

  const quickAddLabel = useMemo(() => {
    if (isAdding) return "Adding...";
    if (isAdded) return "Added";
    return canQuickAdd ? "Quick Add" : "View Product";
  }, [canQuickAdd, isAdded, isAdding]);

  const getBadge = () => {
    if (!product.availableForSale) return { text: "Sold Out", color: "bg-stone-500" };
    if (isOnSale) return { text: `${discountPercent}% Off`, color: "bg-amber-500" };
    if (product.tags?.includes("bestseller")) return { text: "Best Seller", color: "bg-[var(--sage-500)]" };
    if (product.tags?.includes("new")) return { text: "New", color: "bg-blue-500" };
    return null;
  };

  const badge = getBadge();

  const handleQuickAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canQuickAdd || !firstVariant?.id || isAdding) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);

    try {
      await addToCart(firstVariant.id, 1);
      setIsAdded(true);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      window.dispatchEvent(new CustomEvent("cart-open"));
      window.setTimeout(() => setIsAdded(false), 1800);
    } catch (error) {
      console.error("Quick add failed:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--stone-100)] mb-4">
        {badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 ${badge.color} text-white text-xs font-semibold rounded-full`}
          >
            {badge.text}
          </span>
        )}

        {product.featuredImage ? (
          <>
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className={`object-cover transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isHovered ? "scale-105" : "scale-100"}`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--stone-100)] to-[var(--stone-200)] animate-pulse" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--sage-50)] to-[var(--stone-100)]">
            <svg
              className="w-16 h-16 text-[var(--stone-300)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {product.availableForSale && (
          <div
            className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-[var(--stone-800)] text-sm font-medium rounded-xl hover:bg-[var(--sage-500)] hover:text-white transition-colors shadow-lg"
            >
              {quickAddLabel}
            </button>
          </div>
        )}

        {!product.availableForSale && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-[var(--stone-800)] text-white text-sm font-medium rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {product.vendor && (
          <p className="text-xs font-medium text-[var(--stone-500)] uppercase tracking-wider">
            {product.vendor}
          </p>
        )}

        <h3 className="font-medium text-[var(--stone-800)] group-hover:text-[var(--sage-600)] transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 pt-1">
          <span className={`font-semibold ${isOnSale ? "text-[var(--sage-600)]" : "text-[var(--stone-800)]"}`}>
            ${price.toFixed(2)}
          </span>
          {isOnSale && (
            <span className="text-sm text-[var(--stone-400)] line-through">
              ${compareAtPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
