'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import PortableText from '@/components/ui/PortableText'
import { urlFor } from '@/lib/sanity/image'
import type { AboutPage } from '@/types/sanity'

interface AboutContentProps {
  about: AboutPage
}

// How far (px) into the bio you need to scroll before the photo is fully gone
const FADE_DISTANCE = 260

// Title and subtitle sit still, centered at the top, like a fixed page
// heading. The portrait stays centered below it — visible while you're at
// the start of the bio, then fading away as you scroll into the text, and
// back in again once you scroll back toward the beginning.
export default function AboutContent({ about }: AboutContentProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [photoOpacity, setPhotoOpacity] = useState(1)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      setPhotoOpacity(Math.max(0, 1 - el.scrollLeft / FADE_DISTANCE))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="flex flex-col h-[80vh] md:h-[72vh]">
      <div className="text-center px-8 pb-6 md:pb-8">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-[#F3F1EB] mb-3 leading-tight">
          Mufutau Yusuf
        </h2>
        <p className="font-[family-name:var(--font-heading)] italic font-light text-[#F3F1EB]/70 text-lg md:text-xl">
          Performer, Choreographer, Teacher.
        </p>
      </div>

      <div className="relative flex-1 min-h-0">
        {about.photo && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center px-8 pointer-events-none transition-opacity duration-100 ease-out"
            style={{ opacity: photoOpacity }}
          >
            <figure>
              <div className="relative w-[220px] sm:w-[270px] md:w-[330px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(11,11,11,0.55)]">
                <Image
                  src={urlFor(about.photo).width(700).height(875).fit('crop').auto('format').url()}
                  alt={about.photoCaption ?? 'Mufutau Yusuf'}
                  fill
                  className="object-cover"
                  sizes="330px"
                />
              </div>
              {about.photoCaption && (
                <figcaption className="mt-3 text-xs text-[#F3F1EB]/50 text-center">
                  {about.photoCaption}
                </figcaption>
              )}
            </figure>
          </div>
        )}

        <div
          ref={scrollerRef}
          className="relative h-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{
            columnWidth: '260px',
            columnGap: '4rem',
            paddingLeft: '8vw',
            paddingRight: '30vw',
            // Fades the far right edge so it reads as "there's more this way"
            // right from the start, before any scrolling has happened
            WebkitMaskImage: 'linear-gradient(to right, black 78%, transparent 96%)',
            maskImage: 'linear-gradient(to right, black 78%, transparent 96%)',
          }}
        >
          <PortableText value={about.bio} className="prose-ikun-editorial text-[#F3F1EB]/85 text-base md:text-lg" />
        </div>
      </div>
    </div>
  )
}
