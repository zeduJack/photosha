'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import type { GalleryImage } from '@/types/gallery'
import 'photoswipe/dist/photoswipe.css'

interface GalleryLightboxProps {
  images: GalleryImage[]
}

export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return (
    <Gallery
      options={{
        showAnimationDuration: reducedMotion.current ? 0 : 200,
        hideAnimationDuration: reducedMotion.current ? 0 : 150,
        zoomAnimationDuration: reducedMotion.current ? 0 : 200,
        bgOpacity: 0.95,
        preload: [1, 2],
      }}
    >
      <div className="flex flex-col gap-8 md:gap-16 w-full">
        {images.map((image, i) => (
          <Item
            key={image.src}
            original={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
          >
            {({ ref, open }) => (
              <button
                ref={ref}
                onClick={open}
                className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)] animate-gallery-fade motion-reduce:animate-none"
                aria-label={image.alt}
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
              </button>
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  )
}
