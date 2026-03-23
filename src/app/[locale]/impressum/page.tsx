import { setRequestLocale } from 'next-intl/server'
import { NavBar } from '@/components/nav-bar'
import { FooterBar } from '@/components/footer-bar'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ImpressumPage({
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
        <div className="px-4 md:px-8 lg:px-12 py-16 max-w-[720px] mx-auto">
          {/* Impressum */}
          <section className="mb-16">
            <h1 className="font-display font-light text-[var(--font-size-h1)] leading-tight mb-10">
              {isDE ? 'Impressum' : 'Legal Notice'}
            </h1>
            <div className="flex flex-col gap-4 font-body text-[var(--font-size-body)] leading-relaxed text-[var(--color-text-secondary)]">
              {/* TODO: Replace with Sha's actual address/contact details */}
              <p>
                <strong className="text-[var(--color-text-primary)]">
                  {isDE ? 'Angaben gemäss §5 TMG' : 'Information according to §5 TMG'}
                </strong>
              </p>
              <p>
                Sha<br />
                {isDE ? 'Zürich, Schweiz' : 'Zürich, Switzerland'}
              </p>
              <p>
                {isDE ? 'E-Mail:' : 'Email:'}{' '}
                <a href="mailto:sha@photosha.ch" className="underline">
                  sha@photosha.ch
                </a>
                <br />
                {isDE ? 'Website:' : 'Website:'}{' '}
                <a href="https://photosha.ch" className="underline">
                  photosha.ch
                </a>
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="font-display font-semibold text-[var(--font-size-h2)] leading-tight mb-8">
              {isDE ? 'Datenschutzerklärung' : 'Privacy Policy'}
            </h2>
            <div className="flex flex-col gap-6 font-body text-[var(--font-size-body)] leading-relaxed text-[var(--color-text-secondary)]">
              {isDE ? (
                <>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">Keine Cookies, keine Tracking-Daten</strong>
                    <br />
                    Diese Website verwendet keine Cookies und speichert keine personenbezogenen Daten von Besuchern. Das Analyse-Tool Umami läuft cookielos und datenschutzkonform (nFADS/DSGVO).
                  </p>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">Kontaktformular</strong>
                    <br />
                    Daten, die du über das Kontaktformular einreichst (Name, E-Mail, Nachricht), werden ausschliesslich per E-Mail an Sha weitergeleitet und nicht in einer Datenbank gespeichert.
                  </p>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">Hosting</strong>
                    <br />
                    Diese Website wird auf einem Server in Europa gehostet. Bilder werden über Cloudflare R2 ausgeliefert.
                  </p>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">Kontakt</strong>
                    <br />
                    Bei Fragen zum Datenschutz:{' '}
                    <a href="mailto:sha@photosha.ch" className="underline">
                      sha@photosha.ch
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">No cookies, no tracking data</strong>
                    <br />
                    This website uses no cookies and stores no personal data from visitors. The analytics tool Umami operates without cookies and in compliance with privacy law (nFADS/GDPR).
                  </p>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">Contact form</strong>
                    <br />
                    Data submitted through the contact form (name, email, message) is forwarded to Sha by email only and is not stored in any database.
                  </p>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">Hosting</strong>
                    <br />
                    This website is hosted on a server in Europe. Images are served via Cloudflare R2.
                  </p>
                  <p>
                    <strong className="text-[var(--color-text-primary)]">Contact</strong>
                    <br />
                    For privacy questions:{' '}
                    <a href="mailto:sha@photosha.ch" className="underline">
                      sha@photosha.ch
                    </a>
                  </p>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <FooterBar />
    </>
  )
}
