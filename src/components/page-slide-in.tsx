'use client'

import { useEffect, useRef } from 'react'

/**
 * Wraps page content with a slide-in-from-right entrance animation.
 * Uses a CSS class toggled on mount — no extra animation library needed.
 */
export function PageSlideIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Next frame: add the "entered" class to trigger the transition
    const id = requestAnimationFrame(() => el.classList.add('slide-entered'))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      ref={ref}
      className="slide-enter motion-reduce:translate-x-0 motion-reduce:opacity-100"
    >
      {children}
    </div>
  )
}
