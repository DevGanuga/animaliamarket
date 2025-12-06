import Image from "next/image";

interface CollectionHeaderProps {
  title: string;
  description?: string;
  image?: { url: string; altText?: string | null };
  productCount: number;
}

export function CollectionHeader({
  title,
  description,
  image,
  productCount,
}: CollectionHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[var(--sage-50)] to-[var(--cream)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--sage-100) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, var(--gold-100) 0%, transparent 50%)`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Collection Image */}
          {image && (
            <div className="relative w-40 h-40 lg:w-52 lg:h-52 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0">
              <Image
                src={image.url}
                alt={image.altText || title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Collection Info */}
          <div className={`text-center ${image ? "lg:text-left" : ""} max-w-2xl`}>
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center lg:justify-start gap-2 text-sm text-[var(--stone-500)] mb-4">
              <a href="/" className="hover:text-[var(--sage-600)] transition-colors">
                Home
              </a>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <a href="/collections" className="hover:text-[var(--sage-600)] transition-colors">
                Collections
              </a>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[var(--stone-700)]">{title}</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--stone-800)] mb-4">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-[var(--stone-600)] text-lg leading-relaxed mb-4">
                {description}
              </p>
            )}

            {/* Product Count */}
            <p className="text-sm text-[var(--stone-500)]">
              {productCount} {productCount === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



