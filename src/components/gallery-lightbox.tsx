'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import type { GalleryImage } from '@/types/gallery'
import 'photoswipe/dist/photoswipe.css'

interface GalleryLightboxProps {
  images: GalleryImage[]
}

const GUTTER = 32 // px — same as category grid

/**
 * Two-column height-balanced gallery with PhotoSwipe lightbox.
 * Same layout algorithm and GSAP slide-in as CategoryGrid.
 */
export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  // Distribute images to left/right by cumulative height (balance algorithm)
  let leftH = 0
  let rightH = 0
  const leftImages:  Array<GalleryImage & { originalIndex: number }> = []
  const rightImages: Array<GalleryImage & { originalIndex: number }> = []

  images.forEach((image, i) => {
    if (leftH <= rightH) {
      leftImages.push({ ...image, originalIndex: i })
      leftH += image.height / image.width + GUTTER
    } else {
      rightImages.push({ ...image, originalIndex: i })
      rightH += image.height / image.width + GUTTER
    }
  })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let triggers: import('gsap/ScrollTrigger').ScrollTrigger[] = []

    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ;[
        { ref: leftRef,  x: -60 },
        { ref: rightRef, x:  60 },
      ].forEach(({ ref, x }) => {
        ref.current?.querySelectorAll<HTMLElement>('[data-item]').forEach((el, i) => {
          const tween = gsap.fromTo(
            el,
            { x, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power2.out',
              delay: i * 0.08,
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
                once: true,
              },
            }
          )
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
        })
      })
    }

    init()
    return () => { triggers.forEach(t => t.kill()) }
  }, [])

  const renderColumn = (
    col: Array<GalleryImage & { originalIndex: number }>,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => (
    <div ref={ref} style={{ flex: '1 1 0', minWidth: 0 }}>
      {col.map((image) => (
        <div key={image.src} data-item style={{ marginBottom: GUTTER }}>
          <Item
            original={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
          >
            {({ ref, open }) => (
              <button
                ref={ref}
                onClick={open}
                className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
                aria-label={image.alt}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="50vw"
                  className="w-full h-auto block"
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                  priority={image.originalIndex === 0}
                />
              </button>
            )}
          </Item>
        </div>
      ))}
    </div>
  )

  return (
    <Gallery
      options={{
        bgOpacity: 0.95,
        preload: [1, 2],
        history: true,
      }}
    >
      <div style={{ display: 'flex', gap: GUTTER }}>
        {renderColumn(leftImages,  leftRef)}
        {renderColumn(rightImages, rightRef)}
      </div>
    </Gallery>
  )
}
