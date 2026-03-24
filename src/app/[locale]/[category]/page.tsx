import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NavBar } from '@/components/nav-bar'
import { PageSlideIn } from '@/components/page-slide-in'
import { GalleryLightbox } from '@/components/gallery-lightbox'
import { PricingSignal } from '@/components/pricing-signal'
import { TestimonialCard } from '@/components/testimonial-card'
import { FooterBar } from '@/components/footer-bar'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { portraitImages }  from '@/data/gallery/portrait'
import { weddingImages }   from '@/data/gallery/wedding'
import { eventImages }     from '@/data/gallery/event'
import { familyImages }    from '@/data/gallery/family'
import { landscapeImages } from '@/data/gallery/landscape'
import { portraitTestimonial } from '@/data/testimonials/portrait'
import { weddingTestimonial }  from '@/data/testimonials/wedding'
import { eventTestimonial }    from '@/data/testimonials/event'
import { familyTestimonial }   from '@/data/testimonials/family'
import type { GalleryCategory } from '@/types/gallery'
import type { Testimonial } from '@/types/testimonial'

const GALLERY_IMAGES: Record<GalleryCategory, typeof portraitImages> = {
  portrait:  portraitImages,
  wedding:   weddingImages,
  event:     eventImages,
  family:    familyImages,
  landscape: landscapeImages,
}

const TESTIMONIALS: Partial<Record<GalleryCategory, Testimonial>> = {
  portrait:  portraitTestimonial,
  wedding:   weddingTestimonial,
  event:     eventTestimonial,
  family:    familyTestimonial,
}

const VALID_CATEGORIES: GalleryCategory[] = [
  'portrait', 'wedding', 'event', 'family', 'landscape',
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { locale, category } = await params
  if (!VALID_CATEGORIES.includes(category as GalleryCategory)) return {}
  const t = await getTranslations({ locale, namespace: `meta.${category}` })
  const coverImage = GALLERY_IMAGES[category as GalleryCategory]?.[0]
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/${category}`,
      languages: { de: `/de/${category}`, en: `/en/${category}` },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: coverImage ? [coverImage.src] : [],
    },
  }
}

export function generateStaticParams() {
  const params = []
  for (const locale of routing.locales) {
    for (const category of VALID_CATEGORIES) {
      params.push({ locale, category })
    }
  }
  return params
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale, category } = await params
  setRequestLocale(locale)

  if (!VALID_CATEGORIES.includes(category as GalleryCategory)) {
    notFound()
  }

  const cat = category as GalleryCategory
  const images = GALLERY_IMAGES[cat]
  const testimonial = TESTIMONIALS[cat]
  const t = await getTranslations()

  const isEvent = cat === 'event'

  return (
    <>
      <NavBar variant="page" />

      <PageSlideIn>
        <main className="pt-14">
          {/* Page title */}
          <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-8 max-w-[1440px] mx-auto">
            <h1 className="font-display font-light text-[var(--font-size-h1)] leading-tight text-[var(--color-text-primary)]">
              {t(`nav.${cat}`)}
            </h1>
            {isEvent && (
              <p className="mt-4 font-body text-[var(--font-size-body-lg)] text-[var(--color-text-secondary)] max-w-prose">
                {locale === 'de'
                  ? 'Firmenanlässe, Feste, Geburtstage — und auf Wunsch auch als Fotobuch.'
                  : 'Corporate events, celebrations, birthdays — and available as a photobook.'}
              </p>
            )}
          </div>

          {/* Gallery — constrained with generous side space */}
          <section
            aria-label={t(`nav.${cat}`)}
            className="px-6 md:px-16 lg:px-24 xl:px-32"
          >
            <GalleryLightbox images={images} />
          </section>

          {/* Below-gallery content */}
          <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-16 max-w-[900px] flex flex-col gap-10">
            <PricingSignal category={cat} />

            {testimonial && <TestimonialCard testimonial={testimonial} />}

            {/* Primary CTA */}
            <div>
              <Link
                href="/contact"
                className="inline-block bg-[var(--color-text-primary)] text-white font-body font-medium text-[11px] tracking-[var(--letter-spacing-wider)] uppercase px-10 py-4 hover:bg-[var(--color-accent-hover)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
              >
                {t('gallery.cta')}
              </Link>
            </div>
          </div>
        </main>
      </PageSlideIn>

      <FooterBar />
    </>
  )
}
