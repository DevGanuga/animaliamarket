"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
  };
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discountPercent = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Determine badge
  const getBadge = () => {
    if (!product.availableForSale) return { text: "Sold Out", color: "bg-stone-500" };
    if (isOnSale) return { text: `${discountPercent}% Off`, color: "bg-amber-500" };
    if (product.tags?.includes("bestseller")) return { text: "Best Seller", color: "bg-[var(--sage-500)]" };
    if (product.tags?.includes("new")) return { text: "New", color: "bg-blue-500" };
    return null;
  };

  const badge = getBadge();

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--stone-100)] mb-4">
        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 ${badge.color} text-white text-xs font-semibold rounded-full`}
          >
            {badge.text}
          </span>
        )}

        {/* Image */}
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
            {/* Skeleton while loading */}
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

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300`}
        />

        {/* Quick Add Button */}
        {product.availableForSale && (
          <div
            className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to cart logic
                console.log("Quick add:", product.id);
              }}
              className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-[var(--stone-800)] text-sm font-medium rounded-xl hover:bg-[var(--sage-500)] hover:text-white transition-colors shadow-lg"
            >
              Quick Add
            </button>
          </div>
        )}

        {/* Sold Out Overlay */}
        {!product.availableForSale && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-[var(--stone-800)] text-white text-sm font-medium rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Vendor */}
        {product.vendor && (
          <p className="text-xs font-medium text-[var(--stone-500)] uppercase tracking-wider">
            {product.vendor}
          </p>
        )}

        {/* Title */}
        <h3 className="font-medium text-[var(--stone-800)] group-hover:text-[var(--sage-600)] transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Price */}
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



