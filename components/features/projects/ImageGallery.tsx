'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { GalleryImage } from '@/types/sanity'

interface ImageGalleryProps {
  images: GalleryImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const total = images.length
  const current = images[index]

  const prev = () => setIndex((i) => (i - 1 + total) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  const src = urlFor(current).width(1600).height(900).fit('crop').auto('format').url()

  return (
    <div className="relative bg-[#0B0B0B] select-none">
      {/* Main image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          key={index}
          src={src}
          alt={current.caption ?? `Image ${index + 1} of ${total}`}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />

        {/* Left arrow */}
        {total > 1 && (
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-[#F3F1EB] hover:bg-black/60 transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {total > 1 && (
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-[#F3F1EB] hover:bg-black/60 transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Caption + counter strip */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        <p className="text-[#C9C9C9]/60 text-xs tracking-widest uppercase">
          {current.caption ?? ''}
        </p>
        <p className="text-[#C9C9C9]/40 text-xs tabular-nums">
          {index + 1} / {total}
        </p>
      </div>

      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="flex gap-1.5 px-6 md:px-10 pb-6 overflow-x-auto">
          {images.map((img, i) => {
            const thumbSrc = urlFor(img).width(120).height(80).fit('crop').auto('format').url()
            return (
              <button
                key={img._key}
                onClick={() => setIndex(i)}
                aria-label={`Image ${i + 1}`}
                className={`relative flex-shrink-0 w-16 h-10 overflow-hidden transition-opacity duration-200 ${
                  i === index ? 'opacity-100 ring-1 ring-[#8B5F3C]' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <Image
                  src={thumbSrc}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
