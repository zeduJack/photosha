import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './language-switcher'

export async function FooterBar() {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)]">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 md:px-8 lg:px-12 py-5 max-w-[1440px] mx-auto">
        <p className="font-body text-[var(--font-size-caption)] text-[var(--color-text-secondary)]">
          {t('copyright', { year })}
        </p>

        <div className="flex items-center gap-5">
          <Link
            href="/impressum"
            className="font-body text-[var(--font-size-caption)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          >
            {t('impressum')}
          </Link>
          <Link
            href="/privacy"
            className="font-body text-[var(--font-size-caption)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
          >
            {t('privacy')}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}
