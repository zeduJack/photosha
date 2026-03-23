import { getTranslations } from 'next-intl/server'
import { startingPrices } from '@/data/pricing'
import type { GalleryCategory } from '@/types/gallery'

interface PricingSignalProps {
  category: GalleryCategory
}

export async function PricingSignal({ category }: PricingSignalProps) {
  const price = startingPrices[category]
  if (price == null) return null

  const t = await getTranslations('pricing')

  return (
    <p className="font-body text-[var(--font-size-body)] text-[var(--color-text-secondary)]">
      {t('from', { price })}
    </p>
  )
}
