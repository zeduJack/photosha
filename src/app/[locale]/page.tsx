import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NavBar } from '@/components/nav-bar'
import { HeroImage } from '@/components/hero-image'
import { CategoryGrid } from '@/components/category-grid'
import { FooterBar } from '@/components/footer-bar'
import { heroImage } from '@/data/hero'
import { startingPrices } from '@/data/pricing'
import { portraitImages } from '@/data/gallery/portrait'
import { weddingImages } from '@/data/gallery/wedding'
import { eventImages } from '@/data/gallery/event'
import { familyImages } from '@/data/gallery/family'
import { landscapeImages } from '@/data/gallery/landscape'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.home' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: { de: '/de', en: '/en' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: ['https://images.photosha.ch/photos/wedding/0010.webp'],
    },
  }
}

const GRID_ITEMS = [
  { category: 'portrait'  as const, image: portraitImages[0]  },
  { category: 'wedding'   as const, image: weddingImages[0]   },
  { category: 'event'     as const, image: eventImages[0]     },
  { category: 'family'    as const, image: familyImages[0]    },
  { category: 'landscape' as const, image: landscapeImages[0] },
]

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()

  return (
    <>
      <NavBar variant="hero" />

      <main>
        {/* JSON-LD LocalBusiness structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Sha — Fotografin',
              url: 'https://photosha.ch',
              image: 'https://images.photosha.ch/photos/wedding/0010.webp',
              priceRange: 'CHF 450 – CHF 9000',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Zürich',
                addressCountry: 'CH',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 47.3769,
                longitude: 8.5417,
              },
            }),
          }}
        />

        {/* Hero — full viewport */}
        <HeroImage image={heroImage} />

        {/* Category grid — asymmetric 2-col, GSAP slide-in */}
        <CategoryGrid
          items={GRID_ITEMS.map(({ category, image }) => {
            const price = startingPrices[category]
            return {
              category,
              image,
              label: t(`nav.${category}`),
              pricingLabel: price != null ? t('pricing.from', { price }) : undefined,
            }
          })}
        />
      </main>

      <FooterBar />
    </>
  )
}
