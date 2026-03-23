import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { GalleryImage } from '@/types/gallery'
import type { GalleryCategory } from '@/types/gallery'

interface CategoryCardProps {
  category: GalleryCategory
  label: string
  pricingLabel?: string
  image: GalleryImage
  /** Spans full grid width (used for Landscape) */
  fullWidth?: boolean
}

export function CategoryCard({
  category,
  label,
  pricingLabel,
  image,
  fullWidth = false,
}: CategoryCardProps) {
  return (
    <Link
      href={`/${category}` as '/portrait'}
      aria-label={`View ${label} gallery`}
      className={`group relative block overflow-hidden aspect-[4/3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={fullWidth ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
        className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        placeholder="blur"
        blurDataURL={image.blurDataURL}
      />

      {/* Dark scrim for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(26,24,20,0.25)]"
      />

      {/* Text overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
      >
        <span
          className="font-display font-normal leading-tight"
          style={{ fontSize: '28px' }}
        >
          {label}
        </span>
        {pricingLabel && (
          <span className="mt-1 font-body font-medium tracking-[var(--letter-spacing-wide)]" style={{ fontSize: '11px' }}>
            {pricingLabel}
          </span>
        )}
      </div>
    </Link>
  )
}
