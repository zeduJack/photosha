import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { GalleryImage } from '@/types/gallery'

interface HeroImageProps {
  image: GalleryImage
}

export async function HeroImage({ image }: HeroImageProps) {
  const t = await getTranslations('home.hero')

  return (
    <section className="relative w-full h-[100svh] overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        placeholder="blur"
        blurDataURL={image.blurDataURL}
      />

      {/* Gradient scrim — bottom anchor */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(26,24,20,0.65) 0%, transparent 60%)',
        }}
      />

      {/* Overlay text — bottom left */}
      <div className="absolute bottom-10 left-4 md:left-8 lg:left-12 text-white">
        <h1 className="font-display font-light text-[clamp(3.5rem,8vw,7.5rem)] leading-[1.05] tracking-tight">
          {t('headline')}
        </h1>
        <p className="mt-2 font-body text-[var(--font-size-body-lg)] tracking-[var(--letter-spacing-wide)] text-white/80">
          {t('subline')}
        </p>
      </div>
    </section>
  )
}
