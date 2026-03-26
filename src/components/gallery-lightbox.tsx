'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import type { GalleryImage } from '@/types/gallery'
import 'photoswipe/dist/photoswipe.css'

interface GalleryLightboxProps {
  images: GalleryImage[]
}

const GUTTER = 32 // px

/**
 * Responsive gallery grid + PhotoSwipe lightbox.
 * Mobile: single column, full width, no padding — Instagram-style.
 * Desktop (md+): two-column CSS grid, natural aspect ratios, 32px gap.
 * All UI chrome (arrows, close, counter) hidden — swipe/tap to dismiss.
 */
export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Only animate on desktop
    if (window.matchMedia('(max-width: 767px)').matches) return

    let triggers: import('gsap/ScrollTrigger').ScrollTrigger[] = []

    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      gridRef.current?.querySelectorAll<HTMLElement>('[data-item]').forEach((el, i) => {
        // Even index = left column, odd = right column
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
    <Gallery
      options={{ bgOpacity: 0.98, preload: [1, 2] }}
      onOpen={(pswp) => {
        const prevScrollRestoration = history.scrollRestoration
        history.scrollRestoration = 'manual'
        history.pushState({ pswp: true }, '')

        const syncScroll = () => {
          const el = document.querySelector<HTMLElement>(
            `[data-pswp-idx="${pswp.currIndex}"]`
          )
          el?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' })
        }
        pswp.on('change', syncScroll)

        let closedByBack = false
        const onPop = () => {
          closedByBack = true
          pswp.close()
          window.removeEventListener('popstate', onPop)
        }
        window.addEventListener('popstate', onPop)

        pswp.on('close', () => {
          window.removeEventListener('popstate', onPop)
          if (!closedByBack && history.state?.pswp) history.back()
        })
        pswp.on('destroy', () => { history.scrollRestoration = prevScrollRestoration })
      }}
    >
      {/*
        Single flat list — pswp index = array index always.
        CSS grid: 1 col on mobile, 2 col on desktop (align-items:start = natural heights).
      */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gap: GUTTER,
          alignItems: 'start',
        }}
        className="gallery-grid"
      >
        {images.map((image, i) => (
          <div key={image.src} data-item data-pswp-idx={i}>
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
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="w-full h-auto block"
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                    priority={i === 0}
                  />
                </button>
              )}
            </Item>
          </div>
        ))}
      </div>
    </Gallery>
  )
}
