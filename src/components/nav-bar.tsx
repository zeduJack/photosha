'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { LanguageSwitcher } from './language-switcher'

const NAV_LINKS = [
  { key: 'portrait',  href: '/portrait'  },
  { key: 'wedding',   href: '/wedding'   },
  { key: 'event',     href: '/event'     },
  { key: 'family',    href: '/family'    },
  { key: 'landscape', href: '/landscape' },
] as const

interface NavBarProps {
  /**
   * 'hero'  — transparent initially, white text (home page over full-bleed photo)
   * 'page'  — always opaque surface background, dark text (all interior pages)
   */
  variant?: 'hero' | 'page'
}

export function NavBar({ variant = 'page' }: NavBarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 80)
    // Set initial state
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHero = variant === 'hero'

  // Background behaviour
  const bgClass = isHero
    ? scrolled
      ? 'bg-[rgba(26,24,20,0.7)] backdrop-blur-[12px]'
      : 'bg-transparent'
    : 'bg-[var(--color-background)] border-b border-[var(--color-border)]'

  // Text colour
  const textClass = isHero
    ? 'text-white'
    : 'text-[var(--color-text-primary)]'

  // Active link indicator
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const linkClass = (href: string) => {
    const base = `font-body text-[var(--font-size-label)] font-medium tracking-[var(--letter-spacing-wider)] uppercase transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current`
    const active = isActive(href)
    if (isHero) {
      return `${base} ${active ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`
    }
    return `${base} ${active ? '' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`
  }

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter] motion-reduce:transition-none ${bgClass} ${textClass}`}
    >
      <div className="flex items-center justify-between h-14 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {/* Wordmark */}
        <Link
          href="/"
          className={`font-display text-xl tracking-[var(--letter-spacing-wider)] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current`}
        >
          sha
        </Link>

        {/* Category links — scrollable on mobile */}
        <div className="flex-1 flex items-center justify-center overflow-x-auto scrollbar-none mx-4">
          <div className="flex items-center gap-5 md:gap-6 whitespace-nowrap">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href as '/portrait'}
                aria-current={isActive(href) ? 'page' : undefined}
                className={linkClass(href)}
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Contact + Language switcher */}
        <div className="flex items-center gap-5 md:gap-6 shrink-0">
          <Link
            href="/contact"
            aria-current={isActive('/contact') ? 'page' : undefined}
            className={linkClass('/contact')}
          >
            {t('contact')}
          </Link>
          <LanguageSwitcher variant={isHero ? 'light' : 'dark'} />
        </div>
      </div>
    </nav>
  )
}
