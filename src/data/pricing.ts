import type { GalleryCategory } from '@/types/gallery'

/** Starting prices in CHF — Landscape has no pricing signal */
export const startingPrices: Partial<Record<GalleryCategory, number>> = {
  portrait: 450,
  wedding: 3500,
  event: 800,
  family: 450,
}
