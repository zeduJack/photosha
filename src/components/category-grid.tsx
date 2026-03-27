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

const GUTTER = 32 // px

/**
 * Responsive category grid.
 * Mobile: single column, full-width, no padding — Instagram-style.
 * Desktop (md+): two-column CSS grid, natural aspect ratios, 32px gap.
 * GSAP slide-in on desktop only.
 */
export function CategoryGrid({ items }: { items: GridItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 767px)').matches) return

    let triggers: import('gsap/ScrollTrigger').ScrollTrigger[] = []

    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      gridRef.current?.querySelectorAll<HTMLElement>('[data-item]').forEach((el, i) => {
        const x = i % 2 === 0 ? -60 : 60
        const tween = gsap.fromTo(
          el,
          { x, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
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
    }

    init()
    return () => { triggers.forEach(t => t.kill()) }
  }, [])

  return (
    <section
      aria-label="Photography categories"
      className="py-8 md:py-24 md:px-16 lg:px-24"
    >
      <div
        ref={gridRef}
        className="category-grid"
      >
        {items.map((item, i) => (
          <div key={item.category} data-item>
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
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                placeholder="blur"
                blurDataURL={item.image.blurDataURL}
                priority={i === 0}
              />

              {/* Label overlay */}
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
    </section>
  )
}
