import Image from "next/image";
import Link from "next/link";
import {
  cleanCollectionTitle,
  getCollectionFallbackImage,
  getCollectionSupportCopy,
} from "@/lib/merchandising";

interface CollectionHeaderProps {
  title: string;
  description?: string;
  image?: { url: string; altText?: string | null };
  productCount: number;
}

// Map collection titles to appropriate hero images
function getCollectionImage(title: string, image?: { url: string; altText?: string | null }) {
  if (image?.url) return image.url;
  return getCollectionFallbackImage(title);
}

export function CollectionHeader({
  title,
  description,
  image,
  productCount,
}: CollectionHeaderProps) {
  const heroImage = getCollectionImage(title, image);
  const cleanTitle = cleanCollectionTitle(title);
  const supportCopy = getCollectionSupportCopy(title);
  
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
          {cleanTitle}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-white/80 text-lg leading-relaxed mb-4 max-w-2xl">
            {description}
          </p>
        )}

        <div className="mb-5 flex flex-wrap gap-2">
          {["Curated selection", "Need-based shopping", `${productCount} items in stock`].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="grid gap-3 text-sm text-white/75 md:grid-cols-2 md:max-w-3xl">
          {supportCopy.map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 backdrop-blur-sm">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}



