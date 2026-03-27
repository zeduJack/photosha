'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { LanguageSwitcher } from './language-switcher'

const NAV_LINKS = [
  { key: 'home',      href: '/'          },
  { key: 'portrait',  href: '/portrait'  },
  { key: 'wedding',   href: '/wedding'   },
  { key: 'event',     href: '/event'     },
  { key: 'family',    href: '/family'    },
  { key: 'landscape', href: '/landscape' },
] as const

interface NavBarProps {
  variant?: 'hero' | 'page'
}

export function NavBar({ variant = 'page' }: NavBarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isHero = variant === 'hero'

  const bgClass = isHero
    ? scrolled || menuOpen
      ? 'bg-[rgba(26,24,20,0.7)] backdrop-blur-[12px]'
      : 'bg-transparent'
    : 'bg-[var(--color-background)] border-b border-[var(--color-border)]'

  const textClass = isHero ? 'text-white' : 'text-[var(--color-text-primary)]'

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  const linkClass = (href: string) => {
    const base = `font-body text-[var(--font-size-label)] font-medium tracking-[var(--letter-spacing-wider)] uppercase transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current`
    const active = isActive(href)
    if (isHero) {
      return `${base} ${active ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`
    }
    return `${base} ${active ? '' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`
  }

  // Hamburger bar style
  const barClass = `block w-5 h-px transition-all duration-300 ${isHero ? 'bg-white' : 'bg-[var(--color-text-primary)]'}`

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter] motion-reduce:transition-none ${bgClass} ${textClass}`}
      >
        <div className="flex items-center justify-between h-14 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
          {/* Wordmark */}
          <Link
            href="/"
            className="font-display text-xl tracking-[var(--letter-spacing-wider)] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          >
            sha
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex flex-1 items-center justify-center mx-4">
            <div className="flex items-center gap-6 whitespace-nowrap">
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

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <Link
              href="/contact"
              aria-current={isActive('/contact') ? 'page' : undefined}
              className={linkClass('/contact')}
            >
              {t('contact')}
            </Link>
            <LanguageSwitcher variant={isHero ? 'light' : 'dark'} />
          </div>

          {/* Mobile right: language + hamburger */}
          <div className="flex md:hidden items-center gap-4">
            <LanguageSwitcher variant={isHero ? 'light' : 'dark'} />
            <button
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex flex-col justify-center items-center w-8 h-8 gap-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-current"
            >
              <span
                className={barClass}
                style={{
                  transform: menuOpen ? 'translateY(6px) rotate(45deg)' : undefined,
                }}
              />
              <span
                className={barClass}
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className={barClass}
                style={{
                  transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : undefined,
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 transition-opacity duration-300 motion-reduce:transition-none
          ${isHero ? 'bg-[rgba(26,24,20,0.95)]' : 'bg-[var(--color-background)]'}
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {NAV_LINKS.map(({ key, href }) => (
          <Link
            key={key}
            href={href as '/portrait'}
            aria-current={isActive(href) ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
            className={`font-display font-light text-3xl tracking-[var(--letter-spacing-wide)]
              ${isHero
                ? isActive(href) ? 'text-white' : 'text-white/60 hover:text-white'
                : isActive(href) ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}
              transition-colors duration-200`}
          >
            {t(key)}
          </Link>
        ))}
        <Link
          href="/contact"
          aria-current={isActive('/contact') ? 'page' : undefined}
          onClick={() => setMenuOpen(false)}
          className={`font-display font-light text-3xl tracking-[var(--letter-spacing-wide)]
            ${isHero
              ? isActive('/contact') ? 'text-white' : 'text-white/60 hover:text-white'
              : isActive('/contact') ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}
            transition-colors duration-200`}
        >
          {t('contact')}
        </Link>
      </div>
    </>
  )
}
