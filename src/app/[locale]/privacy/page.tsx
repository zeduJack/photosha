// Privacy is combined with Impressum per the architecture spec
// This redirect ensures /privacy links work
import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { setRequestLocale } from 'next-intl/server'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  redirect({ href: '/impressum', locale })
}
