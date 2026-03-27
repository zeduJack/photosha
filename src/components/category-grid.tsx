'use client'

import { useEffect, useRef, useState } from 'react'
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

const GUTTER = 32 // px — gap between columns AND between items vertically

/**
 * Desktop: two independent flex columns, height-balancing algorithm.
 *   Each item gets marginBottom: GUTTER → gaps are always exactly 32px,
 *   regardless of image aspect ratio (columns are independent, no row locking).
 * Mobile: single column, full-width, no padding.
 */
export function CategoryGrid({ items }: { items: GridItem[] }) {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // GSAP — desktop only
  useEffect(() => {
    if (isMobile) return
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
              x: 0, opacity: 1,
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
  }, [isMobile])

  // Height-balancing: place each item in the shorter column
  let leftH = 0, rightH = 0
  const left: GridItem[] = [], right: GridItem[] = []
  items.forEach((item) => {
    if (leftH <= rightH) {
      left.push(item)
      leftH += item.image.height / item.image.width + GUTTER
    } else {
      right.push(item)
      rightH += item.image.height / item.image.width + GUTTER
    }
  })

  const renderCard = (item: GridItem) => (
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
      />
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
  )

  // Mobile: single column, all items in original order
  if (isMobile) {
    return (
      <section aria-label="Photography categories" className="py-8">
        <div className="flex flex-col" style={{ gap: 0 }}>
          {items.map((item) => (
            <div key={item.category} data-item>
              {renderCard(item)}
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Desktop: two independent columns, height-balanced, fixed 32px gaps
  return (
    <section aria-label="Photography categories" className="py-24 px-16 lg:px-24">
      <div style={{ display: 'flex', gap: GUTTER }}>
        <div ref={leftRef} style={{ flex: '1 1 0', minWidth: 0 }}>
          {left.map((item) => (
            <div key={item.category} data-item style={{ marginBottom: GUTTER }}>
              {renderCard(item)}
            </div>
          ))}
        </div>
        <div ref={rightRef} style={{ flex: '1 1 0', minWidth: 0 }}>
          {right.map((item) => (
            <div key={item.category} data-item style={{ marginBottom: GUTTER }}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
