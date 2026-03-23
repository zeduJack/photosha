import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NavBar } from '@/components/nav-bar'
import { ContactForm } from '@/components/contact-form'
import { FooterBar } from '@/components/footer-bar'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.contact' })
  return {
    title: t('title'), description: t('description'),
    alternates: { canonical: `/${locale}/contact`, languages: { de: '/de/contact', en: '/en/contact' } },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <>
      <NavBar variant="page" />

      <main className="pt-14">
        <div className="px-4 md:px-8 lg:px-12 py-16 max-w-[680px] mx-auto">
          <h1 className="font-display font-light text-[var(--font-size-h1)] leading-tight mb-12">
            {t('title')}
          </h1>
          <ContactForm />
        </div>
      </main>

      <FooterBar />
    </>
  )
}
