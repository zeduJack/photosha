'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import type { GalleryImage } from '@/types/gallery'
import 'photoswipe/dist/photoswipe.css'

interface GalleryLightboxProps {
  images: GalleryImage[]
}

const GUTTER = 32 // px

/**
 * Desktop: two independent flex columns, height-balancing.
 *   Fixed 32px gaps everywhere — no row-locking, columns are independent.
 * Mobile: single column, full-width, no padding — Instagram-style.
 * PhotoSwipe: all UI hidden, swipe/tap to dismiss.
 */
export function GalleryLightbox({ images }: GalleryLightboxProps) {
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

  // Height-balancing: place each image in the shorter column
  let leftH = 0, rightH = 0
  const leftImages:  Array<GalleryImage & { pswpIdx: number }> = []
  const rightImages: Array<GalleryImage & { pswpIdx: number }> = []

  // pswp registration order: left column first, then right column
  // We'll assign indices after distribution
  const leftItems:  Array<GalleryImage> = []
  const rightItems: Array<GalleryImage> = []

  images.forEach((image) => {
    if (leftH <= rightH) {
      leftItems.push(image)
      leftH += image.height / image.width + GUTTER
    } else {
      rightItems.push(image)
      rightH += image.height / image.width + GUTTER
    }
  })

  leftItems.forEach((img, i)  => leftImages.push({ ...img, pswpIdx: i }))
  rightItems.forEach((img, i) => rightImages.push({ ...img, pswpIdx: leftItems.length + i }))

  const onOpen = (pswp: import('photoswipe').default) => {
    const prevScrollRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    history.pushState({ pswp: true }, '')

    const syncScroll = () => {
      const el = document.querySelector<HTMLElement>(`[data-pswp-idx="${pswp.currIndex}"]`)
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
  }

  const renderItem = (image: GalleryImage & { pswpIdx: number }, priority = false) => (
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
            priority={priority}
          />
        </button>
      )}
    </Item>
  )

  // Mobile: single column, original order, pswp idx = original index
  if (isMobile) {
    return (
      <Gallery options={{ bgOpacity: 0.98, preload: [1, 2] }} onOpen={onOpen}>
        <div className="flex flex-col">
          {images.map((image, i) => (
            <div key={image.src} data-pswp-idx={i} style={{ marginBottom: 0 }}>
              {renderItem({ ...image, pswpIdx: i }, i === 0)}
            </div>
          ))}
        </div>
      </Gallery>
    )
  }

  // Desktop: two independent columns, height-balanced, fixed 32px gaps
  return (
    <Gallery options={{ bgOpacity: 0.98, preload: [1, 2] }} onOpen={onOpen}>
      <div style={{ display: 'flex', gap: GUTTER }}>
        <div ref={leftRef} style={{ flex: '1 1 0', minWidth: 0 }}>
          {leftImages.map((image, i) => (
            <div key={image.src} data-item data-pswp-idx={image.pswpIdx} style={{ marginBottom: GUTTER }}>
              {renderItem(image, i === 0)}
            </div>
          ))}
        </div>
        <div ref={rightRef} style={{ flex: '1 1 0', minWidth: 0 }}>
          {rightImages.map((image) => (
            <div key={image.src} data-item data-pswp-idx={image.pswpIdx} style={{ marginBottom: GUTTER }}>
              {renderItem(image)}
            </div>
          ))}
        </div>
      </div>
    </Gallery>
  )
}
