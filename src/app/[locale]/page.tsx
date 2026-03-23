import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NavBar } from '@/components/nav-bar'
import { HeroImage } from '@/components/hero-image'
import { CategoryCard } from '@/components/category-card'
import { FooterBar } from '@/components/footer-bar'
import { heroImage } from '@/data/hero'
import { startingPrices } from '@/data/pricing'
import { portraitImages } from '@/data/gallery/portrait'
import { weddingImages } from '@/data/gallery/wedding'
import { eventImages } from '@/data/gallery/event'
import { familyImages } from '@/data/gallery/family'
import { landscapeImages } from '@/data/gallery/landscape'
import type { GalleryCategory } from '@/types/gallery'

const CATEGORIES: GalleryCategory[] = [
  'portrait',
  'wedding',
  'event',
  'family',
  'landscape',
]

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

const COVER_IMAGES = {
  portrait:  portraitImages[0],
  wedding:   weddingImages[0],
  event:     eventImages[0],
  family:    familyImages[0],
  landscape: landscapeImages[0],
}

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

        {/* Category card grid */}
        <section
          aria-label={t('home.cta')}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          {CATEGORIES.map((category) => {
            const price = startingPrices[category]
            return (
              <CategoryCard
                key={category}
                category={category}
                label={t(`nav.${category}`)}
                pricingLabel={
                  price != null
                    ? t('pricing.from', { price })
                    : undefined
                }
                image={COVER_IMAGES[category]}
                fullWidth={category === 'landscape'}
              />
            )
          })}
        </section>
      </main>

      <FooterBar />
    </>
  )
}
