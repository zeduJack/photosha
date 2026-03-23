'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

interface LanguageSwitcherProps {
  /** Controls text colour — 'light' for hero overlay, 'dark' for page nav */
  variant?: 'light' | 'dark'
}

export function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()

  const activeClass =
    variant === 'light'
      ? 'text-white'
      : 'text-[var(--color-text-primary)]'

  const inactiveClass =
    variant === 'light'
      ? 'text-white/50 hover:text-white'
      : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'

  return (
    <div
      className="flex items-center gap-1 font-body text-[var(--font-size-label)] font-medium tracking-[var(--letter-spacing-wider)] uppercase"
      aria-label="Language switcher"
    >
      <Link
        href={pathname}
        locale="de"
        aria-current={locale === 'de' ? 'true' : undefined}
        className={`transition-colors duration-200 ${locale === 'de' ? activeClass : inactiveClass + ' hover:underline underline-offset-2'}`}
        hrefLang="de"
      >
        DE
      </Link>
      <span className={variant === 'light' ? 'text-white/30' : 'text-[var(--color-border)]'}>
        /
      </span>
      <Link
        href={pathname}
        locale="en"
        aria-current={locale === 'en' ? 'true' : undefined}
        className={`transition-colors duration-200 ${locale === 'en' ? activeClass : inactiveClass + ' hover:underline underline-offset-2'}`}
        hrefLang="en"
      >
        EN
      </Link>
    </div>
  )
}
