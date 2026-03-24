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

/**
 * 2-column asymmetric photo grid — matches the old photosha layout.
 * Left col 60% / right col 40%, 3 rows, 4px gap, ~520px centred.
 * GSAP ScrollTrigger: each cell slides in from its side when it enters
 * the viewport.
 */
export function CategoryGrid({ items }: { items: GridItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: ReturnType<typeof import('gsap').gsap.context> | undefined

    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const cells = gridRef.current?.querySelectorAll<HTMLElement>('[data-col]')
      if (!cells) return

      ctx = gsap.context(() => {
        cells.forEach((cell) => {
          const col = cell.dataset.col
          const fromX = col === 'left' ? -60 : col === 'right' ? 60 : 0
          gsap.from(cell, {
            x: fromX,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cell,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          })
        })
      }, gridRef)
    }

    init()
    return () => ctx?.revert()
  }, [])

  // Fixed order: portrait, wedding, event, family, landscape
  const [a, b, c, d, e] = items

  const cells: Array<GridItem & { col: 'left' | 'right' | 'full'; row: number }> = [
    { ...a, col: 'left',  row: 1 },
    { ...b, col: 'right', row: 1 },
    { ...c, col: 'left',  row: 2 },
    { ...d, col: 'right', row: 2 },
    { ...e, col: 'full',  row: 3 },
  ]

  return (
    <section
      aria-label="Photography categories"
      className="py-16 md:py-24 px-4"
    >
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gridTemplateRows: '420px 420px 300px',
          gap: '12px',
          width: '900px',
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        {cells.map(({ category, label, pricingLabel, image, col }) => (
          <Link
            key={category}
            href={`/${category}` as '/portrait'}
            aria-label={`${label} gallery`}
            data-col={col}
            className={`relative block overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]${col === 'full' ? ' col-span-2' : ''}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={
                col === 'full'
                  ? '(max-width: 900px) 100vw, 900px'
                  : col === 'left'
                  ? '(max-width: 900px) 60vw, 540px'
                  : '(max-width: 900px) 40vw, 360px'
              }
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              placeholder="blur"
              blurDataURL={image.blurDataURL}
            />

            {/* Bottom label overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-[7px]"
              style={{ background: 'rgba(0,0,0,0.52)' }}
            >
              <span className="text-white font-body font-medium uppercase tracking-[var(--letter-spacing-wide)] text-[10px]">
                {label}
              </span>
              {pricingLabel && (
                <span className="text-white/65 font-body text-[9px]">
                  {pricingLabel}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
