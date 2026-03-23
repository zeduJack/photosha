export type GalleryCategory =
  | 'portrait'
  | 'wedding'
  | 'event'
  | 'family'
  | 'landscape'

export interface GalleryImage {
  src: string
  width: number
  height: number
  alt: string
  blurDataURL: string
}
