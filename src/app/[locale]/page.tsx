import { setRequestLocale } from 'next-intl/server'

// Story 1.2: Home page implementation
// Stub — renders until E1 stories are implemented
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <p>photosha — coming soon</p>
    </main>
  )
}
