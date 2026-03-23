import { getLocale } from 'next-intl/server'
import type { Testimonial } from '@/types/testimonial'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export async function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const locale = await getLocale()
  const quote = locale === 'de' ? testimonial.quoteDE : testimonial.quoteEN

  return (
    <blockquote className="border-l-2 border-[var(--color-accent)] pl-6 py-1">
      <p className="font-display text-[var(--font-size-h3)] font-light leading-snug text-[var(--color-text-primary)]">
        {quote}
      </p>
      <footer className="mt-4 font-body text-[var(--font-size-caption)] text-[var(--color-accent-secondary)]">
        {testimonial.firstName} — {testimonial.sessionType}, {testimonial.year}
      </footer>
    </blockquote>
  )
}
