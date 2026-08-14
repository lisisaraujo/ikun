'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage, GalleryImage } from '@/types/sanity'

interface ProjectGalleryHeroProps {
  title: string
  year?: string | number
  coverImage: SanityImage | null
  images: GalleryImage[]
  backHref: string
  backLabel: string
}

export default function ProjectGalleryHero({
  title,
  year,
  coverImage,
  images,
  backHref,
  backLabel,
}: ProjectGalleryHeroProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // Studio allows an "images" array item to exist with no asset actually
  // uploaded yet (or one whose asset was since deleted) — urlFor() throws
  // on those, so they're filtered out here rather than trusted as-is.
  const galleryImages = images.filter((img) => img?.asset?._ref)
  const hasGallery = galleryImages.length > 0
  const total = galleryImages.length

  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const coverSrc = coverImage?.asset?._ref
    ? urlFor(coverImage).width(1600).height(900).fit('crop').auto('format').url()
    : null

  const currentImage = galleryImages[index]
  const currentSrc = currentImage
    ? urlFor(currentImage).width(1920).height(1080).fit('max').auto('format').url()
    : null

  return (
    <>
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[75vh] bg-[#1C2433] overflow-hidden">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={title}
            fill
            priority
            className="object-cover opacity-75"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1C2433]" />
        )}
        {/* Bottom-to-top dark gradient for title legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-[#0B0B0B]/20 to-transparent" />
        {/* Subtle top vignette so the back link is always readable */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Clickable overlay to open gallery */}
        {hasGallery && (
          <button
            onClick={() => { setIndex(0); setOpen(true) }}
            aria-label={`Open gallery — ${total} photos`}
            className="absolute inset-0 z-10 w-full h-full cursor-pointer focus:outline-none"
          />
        )}

        {/* Back link — top left, above gallery button. Pushed down below the
            fixed logo's ~112px band on mobile, where the two would otherwise
            visually collide in that top-left corner. */}
        <div className="absolute top-28 left-6 md:top-6 md:left-10 lg:left-16 z-30">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-[#37C6F4] [@media(hover:hover)]:opacity-60 hover:opacity-100 text-xs uppercase tracking-widest transition-opacity duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {backLabel}
          </Link>
        </div>

        {/* Gallery indicator — bottom right */}
        {hasGallery && (
          <div className="absolute bottom-20 right-6 md:right-8 z-20 pointer-events-none flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded px-3 py-1.5 text-[#F3F1EB]/80 text-xs uppercase tracking-widest">
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-current flex-shrink-0" aria-hidden="true">
              <rect x="1" y="1" width="8" height="8" rx="0.5" />
              <rect x="11" y="1" width="8" height="8" rx="0.5" />
              <rect x="1" y="11" width="8" height="8" rx="0.5" />
              <rect x="11" y="11" width="8" height="8" rx="0.5" />
            </svg>
            {total} photos
          </div>
        )}

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 z-20 pointer-events-none">
          <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-4">
              {year && (
                <span className="text-[#8B5F3C] text-xs uppercase tracking-widest">
                  {year}
                </span>
              )}
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl font-800 text-[#F3F1EB] leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {open && currentSrc && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <span className="text-[#F3F1EB]/40 text-xs uppercase tracking-widest tabular-nums">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close gallery"
              className="text-[#F3F1EB]/60 hover:text-[#37C6F4] transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Image area */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 md:px-20">
            <div className="relative w-full h-full">
              <Image
                key={index}
                src={currentSrc}
                alt={currentImage.alt ?? currentImage.caption ?? `Photo ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain animate-fadeIn"
                priority
              />
            </div>

            {/* Prev */}
            {total > 1 && (
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-2" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Next */}
            {total > 1 && (
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-2" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Caption + thumbnail strip */}
          <div className="flex-shrink-0 px-6 md:px-10 pt-3 pb-4">
            {currentImage.caption && (
              <p className="text-[#C9C9C9]/60 text-xs uppercase tracking-widest mb-3 text-center">
                {currentImage.caption}
              </p>
            )}
            {total > 1 && (
              <div className="flex gap-1.5 overflow-x-auto justify-center">
                {galleryImages.map((img, i) => {
                  const thumbSrc = urlFor(img).width(120).height(80).fit('crop').auto('format').url()
                  return (
                    <button
                      key={img._key}
                      onClick={() => setIndex(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`relative flex-shrink-0 w-14 h-9 overflow-hidden transition-all duration-200 ${
                        i === index
                          ? 'opacity-100 ring-1 ring-[#37C6F4]'
                          : 'opacity-30 hover:opacity-60'
                      }`}
                    >
                      <Image src={thumbSrc} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
