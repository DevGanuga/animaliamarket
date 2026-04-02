"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: Array<{ url: string; altText?: string | null }>;
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const selectedImage = images[selectedIndex] || images[0];

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl bg-gradient-to-br from-[var(--sage-50)] to-[var(--stone-100)] flex items-center justify-center">
        <svg
          className="w-24 h-24 text-[var(--stone-300)]"
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
    );
  }

  const hasMultipleImages = images.length > 1;

  return (
    <div className={`space-y-4 ${hasMultipleImages ? "lg:grid lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-5 lg:space-y-0" : ""}`}>
      {hasMultipleImages && (
        <div className="order-2 grid grid-cols-5 gap-3 lg:order-1 lg:grid-cols-1">
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-2xl transition-all ${
                selectedIndex === index
                  ? "ring-2 ring-[var(--sage-500)] ring-offset-2"
                  : "opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || `${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      <div className={hasMultipleImages ? "order-1 lg:order-2" : ""}>
        <div
          className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--stone-100)] cursor-zoom-in lg:aspect-square"
          onClick={() => setIsZoomed(true)}
        >
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--stone-700)] shadow-sm">
            {selectedIndex + 1} / {images.length}
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-5 pb-5 pt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Product gallery</p>
                <p className="mt-1 text-sm text-white/85">Zoom in to inspect packaging and product details.</p>
              </div>
              <div className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[var(--stone-700)] opacity-0 transition-opacity group-hover:opacity-100">
                Click to zoom
              </div>
            </div>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-3 text-white/80 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-4 p-3 text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 p-3 text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="relative w-full max-w-4xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    selectedIndex === index ? "w-6 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
