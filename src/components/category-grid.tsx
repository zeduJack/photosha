'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { GalleryImage } from '@/types/gallery'
import type { GalleryCategory } from '@/types/gallery'

export interface GridItem {
  category: GalleryCategory
  label: string
  image: GalleryImage
  pricingLabel?: string
}

const GUTTER = 32 // px — gap between columns AND below each image

/**
 * Two equal columns, images at natural aspect ratio, 32px gap everywhere.
 * Items distributed by height-balancing (same algorithm as old photosha.ch).
 * GSAP: left column slides from left, right column slides from right.
 */
export function CategoryGrid({ items }: { items: GridItem[] }) {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

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
              delay: i * 0.1,
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
    // Kill triggers only — do NOT revert visual state so back-navigation works
    return () => { triggers.forEach(t => t.kill()) }
  }, [])

  // Distribute items to left/right column by cumulative height (balance algorithm)
  let leftH = 0
  let rightH = 0
  const left: GridItem[]  = []
  const right: GridItem[] = []

  items.forEach((item) => {
    if (leftH <= rightH) {
      left.push(item)
      leftH += item.image.height / item.image.width + GUTTER
    } else {
      right.push(item)
      rightH += item.image.height / item.image.width + GUTTER
    }
  })

  const renderColumn = (
    col: GridItem[],
    ref: React.RefObject<HTMLDivElement | null>,
  ) => (
    <div ref={ref} style={{ flex: '1 1 0', minWidth: 0 }}>
      {col.map((item) => (
        <div
          key={item.category}
          data-item
          style={{ marginBottom: GUTTER }}
        >
          <Link
            href={`/${item.category}` as '/portrait'}
            aria-label={`${item.label} gallery`}
            className="group relative block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
              placeholder="blur"
              blurDataURL={item.image.blurDataURL}
            />

            {/* Label overlay — matches old site exactly */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ background: 'rgba(80,80,80,0.5)' }}
            >
              <span className="text-white font-body font-medium uppercase tracking-[var(--letter-spacing-wide)] text-[11px]">
                {item.label}
              </span>
              {item.pricingLabel && (
                <span className="ml-2 text-white/70 font-body text-[10px]">
                  {item.pricingLabel}
                </span>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  )

  return (
    <section
      aria-label="Photography categories"
      className="py-16 md:py-24 px-8 md:px-16 lg:px-24"
    >
      <div style={{ display: 'flex', gap: GUTTER }}>
        {renderColumn(left,  leftRef)}
        {renderColumn(right, rightRef)}
      </div>
    </section>
  )
}
