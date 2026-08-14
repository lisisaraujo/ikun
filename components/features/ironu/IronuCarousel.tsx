'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { emitCarouselNav } from '@/lib/carouselNavPulse'
import type { IronuPost } from '@/types/sanity'
import { useCarouselTrack } from '@/components/features/carousel/useCarouselTrack'
import { getCardMotion, CAROUSEL_EASE } from '@/components/features/carousel/carouselMotion'
import CarouselOrbit from '@/components/features/carousel/CarouselOrbit'
import ActiveImageMetadata from '@/components/features/carousel/ActiveImageMetadata'
import ActiveEntryLabel from '@/components/features/carousel/ActiveEntryLabel'
import IronuSpiralGraphic from './IronuSpiralGraphic'

interface IronuCarouselProps {
  posts: IronuPost[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Roughly 1.2–1.36x the active card's own width at each breakpoint —
// matches ProjectsCarousel's orbit proportions on the same principle,
// scaled to Ìrònú's own (slightly narrower) card widths.
const ORBIT_SIZE = 'w-[250px] sm:w-[350px] md:w-[440px] lg:w-[540px] aspect-square'

// Same interaction language as ProjectsCarousel — strong center hierarchy,
// side entries tilted and receding, spatial (scroll-driven, not swapped)
// transitions, active-entry typography attached to the artwork on desktop
// and stacked beneath it on mobile, and a single orbit graphic behind the
// active card rather than a whole-section background mark.
export default function IronuCarousel({ posts }: IronuCarouselProps) {
  const reducedMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const {
    scrollerRef,
    setCardRef,
    signedDistances,
    centerIndex,
    canScrollLeft,
    canScrollRight,
    intensity,
    scrollByAmount,
    onKeyDown,
  } = useCarouselTrack({
    count: posts.length,
    onNavigate: (dir) => emitCarouselNav('ironu', dir),
  })

  if (posts.length === 0) return null

  const activePost = posts[centerIndex]
  const orbitStep = 360 / posts.length
  const liveNudge = -(signedDistances[centerIndex] ?? 0) * 40

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Ìrònú"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative flex gap-8 md:gap-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pt-2 pb-2 px-[calc(50%-110px)] sm:px-[calc(50%-140px)] md:px-[calc(50%-170px)] lg:px-[calc(50%-200px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/50 rounded-2xl"
      >
        {posts.map((post, i) => {
          const coverUrl = post.coverImage
            ? urlFor(post.coverImage).width(800).height(1000).auto('format').url()
            : null
          const signedDist = signedDistances[i] ?? 0
          const isCenter = i === centerIndex
          const isHovered = i === hoveredIndex
          const motion = getCardMotion(signedDist, reducedMotion, intensity)

          const hoverEase = isHovered && !isCenter && !reducedMotion ? 1 : 0
          const opacity = Math.min(1, motion.opacity + hoverEase * 0.15)
          const blurPx = Math.max(0, motion.blurPx - hoverEase * 0.6)
          const rotateDeg = motion.rotateDeg * (1 - hoverEase * 0.35)
          const scale = motion.scale + hoverEase * 0.02 + (isCenter && isHovered && !reducedMotion ? 0.015 : 0)

          return (
            <Link
              key={post._id}
              ref={setCardRef(i)}
              href={`/ironu/${post.slug.current}`}
              aria-label={`${post.title}${isCenter ? '' : ' — read article'}`}
              aria-current={isCenter ? 'true' : undefined}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex((current) => (current === i ? null : current))}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex((current) => (current === i ? null : current))}
              className="group relative shrink-0 snap-center w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px]"
              style={{
                transform: `translateY(${motion.translateY}px) scale(${scale}) rotate(${rotateDeg}deg)`,
                transformOrigin: 'top center',
                opacity,
                filter: blurPx > 0.05 ? `blur(${blurPx}px)` : 'none',
                transition: `transform 420ms ${CAROUSEL_EASE}, opacity 420ms ${CAROUSEL_EASE}, filter 420ms ${CAROUSEL_EASE}`,
              }}
            >
              {isCenter && (
                <CarouselOrbit
                  reducedMotion={reducedMotion}
                  rotationDeg={centerIndex * orbitStep + liveNudge}
                  sizeClassName={ORBIT_SIZE}
                >
                  <IronuSpiralGraphic className="w-full h-full" />
                </CarouselOrbit>
              )}

              <div className="relative rounded-2xl shadow-[0_10px_20px_-10px_rgba(58,38,20,0.35)]">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#1C2433]">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 340px, 400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-[family-name:var(--font-heading)] text-6xl text-[#F3F1EB]/10" aria-hidden="true">Ì</span>
                    </div>
                  )}

                  {isCenter && (
                    <ActiveImageMetadata
                      entryKey={post._id}
                      index={centerIndex}
                      total={posts.length}
                      eyebrow={formatDate(post.date)}
                      title={post.title}
                      ctaLabel="Read"
                      reducedMotion={reducedMotion}
                    />
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-1)}
          aria-label="Previous entry"
          className="group/prev hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center gap-2 text-[#F3F1EB]/60 drop-shadow-[0_2px_6px_rgba(28,36,51,0.8)] hover:text-[#37C6F4] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-0 -translate-x-1 transition-all duration-300 group-hover/prev:opacity-100 group-hover/prev:translate-x-0">
            Previous
          </span>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollByAmount(1)}
          aria-label="Next entry"
          className="group/next hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-2 text-[#F3F1EB]/60 drop-shadow-[0_2px_6px_rgba(28,36,51,0.8)] hover:text-[#37C6F4] transition-colors"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-0 translate-x-1 transition-all duration-300 group-hover/next:opacity-100 group-hover/next:translate-x-0">
            Next
          </span>
          <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.5]" aria-hidden="true">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Mobile only — desktop's active-entry typography lives on the
          image itself now (ActiveImageMetadata above). */}
      {activePost && (
        <ActiveEntryLabel
          entryKey={activePost._id}
          index={centerIndex}
          total={posts.length}
          eyebrow={formatDate(activePost.date)}
          title={activePost.title}
          href={`/ironu/${activePost.slug.current}`}
          ctaLabel="Read"
          reducedMotion={reducedMotion}
          className="md:hidden"
        />
      )}
    </div>
  )
}
