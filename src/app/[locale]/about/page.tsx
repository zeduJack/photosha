import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NavBar } from '@/components/nav-bar'
import { FooterBar } from '@/components/footer-bar'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.about' })
  return {
    title: t('title'), description: t('description'),
    alternates: { canonical: `/${locale}/about`, languages: { de: '/de/about', en: '/en/about' } },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// TODO: Add Sha's portrait photo and replace copy with Sha's authentic text
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const isDE = locale === 'de'

  return (
    <>
      <NavBar variant="page" />

      <main className="pt-14">
        <article className="px-4 md:px-8 lg:px-12 py-16 max-w-[720px] mx-auto">
          <h1 className="font-display font-light text-[var(--font-size-h1)] leading-tight mb-12">
            {isDE ? 'Über mich' : 'About'}
          </h1>

          {/* TODO: Insert Sha's portrait photo here */}
          {/* <Image src="..." alt="Sha — Fotografin" width={600} height={800} ... /> */}

          <div className="flex flex-col gap-6 font-body text-[var(--font-size-body-lg)] leading-relaxed text-[var(--color-text-secondary)]">
            {isDE ? (
              <>
                <p>
                  Ich bin Sha — Fotografin aus Zürich. Aufgewachsen in Thailand, seit Jahren zu Hause in der Schweiz. Meine Arbeit bewegt sich zwischen diesen beiden Welten: warm, authentisch, nah am Menschen.
                </p>
                <p>
                  Was mich antreibt? Echte Momente. Nicht die perfekt gestellten Posen, sondern das Lachen dazwischen, der kurze Blick, die Berührung, die man nicht plant. Diese Bilder erzählen eine Geschichte — und genau das möchte ich für dich festhalten.
                </p>
                <p>
                  Ich arbeite locker und entspannt — du sollst dich wohlfühlen, nicht performen. Meine Kunden sagen oft, sie hätten mich nach kurzer Zeit völlig vergessen. Das ist das grösste Kompliment.
                </p>
                <p>
                  Hochzeiten, Portraits, Familie, Events, Landschaft — ich liebe jeden dieser Bereiche aus einem anderen Grund. Gemeinsam ist ihnen: Licht, Stimmung, Echtheit.
                </p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  Ich freue mich auf dich.
                </p>
              </>
            ) : (
              <>
                <p>
                  I'm Sha — a photographer based in Zürich. Raised in Thailand, at home in Switzerland for many years now. My work moves between these two worlds: warm, authentic, close to people.
                </p>
                <p>
                  What drives me? Real moments. Not the perfectly staged poses, but the laughter in between, the brief glance, the touch nobody planned. Those images tell a story — and that's exactly what I want to capture for you.
                </p>
                <p>
                  I work in a relaxed, easy-going way — you're here to feel comfortable, not to perform. My clients often say they forgot I was there after a few minutes. That's the greatest compliment.
                </p>
                <p>
                  Weddings, portraits, family, events, landscape — I love each of these for different reasons. What they share: light, atmosphere, and honesty.
                </p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  I look forward to meeting you.
                </p>
              </>
            )}
          </div>

          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-block bg-[var(--color-text-primary)] text-white font-body font-medium text-[11px] tracking-[var(--letter-spacing-wider)] uppercase px-10 py-4 hover:bg-[var(--color-accent-hover)] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            >
              {isDE ? 'Session anfragen' : 'Enquire about a session'}
            </Link>
          </div>
        </article>
      </main>

      <FooterBar />
    </>
  )
}
