import Image from 'next/image'
import type { GalleryImage } from '@/types/gallery'

interface GalleryScrollProps {
  images: GalleryImage[]
}

/**
 * Server Component — full-width vertical image stack.
 * Rendered in static HTML; GalleryLightbox (Client) adds tap-to-lightbox.
 */
export function GalleryScroll({ images }: GalleryScrollProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-10 w-full">
      {images.map((image, i) => (
        <div
          key={image.src}
          className="w-full animate-gallery-fade motion-reduce:animate-none"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="100vw"
            className="w-full h-auto"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  )
}
