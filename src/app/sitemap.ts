import type { MetadataRoute } from 'next'

const BASE_URL = 'https://photosha.ch'
const LOCALES = ['de', 'en'] as const
const PAGES = [
  '',
  '/portrait',
  '/wedding',
  '/event',
  '/family',
  '/landscape',
  '/about',
  '/contact',
  '/impressum',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      const url = `${BASE_URL}/${locale}${page}`
      entries.push({
        url,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${page}`])
          ),
        },
      })
    }
  }

  return entries
}
