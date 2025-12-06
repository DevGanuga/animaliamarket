import Image from "next/image";
import Link from "next/link";

interface CollectionHeaderProps {
  title: string;
  description?: string;
  image?: { url: string; altText?: string | null };
  productCount: number;
}

// Map collection titles to appropriate hero images
function getCollectionImage(title: string, image?: { url: string; altText?: string | null }) {
  const titleLower = title.toLowerCase();
  
  if (image?.url) return image.url;
  
  // Map to generated images based on keywords
  if (titleLower.includes("dog") || titleLower.includes("canine")) {
    return "/images/collection-dogs.jpg";
  }
  if (titleLower.includes("cat") || titleLower.includes("feline")) {
    return "/images/collection-cats.jpg";
  }
  if (titleLower.includes("joint") || titleLower.includes("hip")) {
    return "/images/collection-dog-joint.jpg";
  }
  if (titleLower.includes("calm")) {
    return "/images/collection-dog-calming.jpg";
  }
  if (titleLower.includes("supplement")) {
    return "/images/collection-dog-supplements.jpg";
  }
  
  // Default hero
  return "/images/hero-wellness.jpg";
}

export function CollectionHeader({
  title,
  description,
  image,
  productCount,
}: CollectionHeaderProps) {
  const heroImage = getCollectionImage(title, image);
  
  return (
    <div className="relative overflow-hidden min-h-[40vh] flex items-end">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--stone-900)]/80 via-[var(--stone-900)]/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/collections" className="hover:text-white transition-colors">
            Collections
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{title}</span>
        </nav>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-white/80 text-lg leading-relaxed mb-4 max-w-2xl">
            {description}
          </p>
        )}

        {/* Product Count */}
        <p className="text-white/60 text-sm">
          {productCount} {productCount === 1 ? "product" : "products"} available
        </p>
      </div>
    </div>
  );
}



