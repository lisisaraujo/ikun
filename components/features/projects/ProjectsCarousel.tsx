'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { emitCarouselNav } from '@/lib/carouselNavPulse'
import type { SanityProject } from '@/types/sanity'
import SpiralRings from './SpiralRings'
import { useCarouselTrack } from '@/components/features/carousel/useCarouselTrack'
import { getCardMotion, getCardFocus, CAROUSEL_EASE } from '@/components/features/carousel/carouselMotion'
import ActiveEntryLabel from '@/components/features/carousel/ActiveEntryLabel'

interface ProjectsCarouselProps {
  projects: SanityProject[]
}

// The stitched-thread dial that floats beneath each card, tilted flat via
// perspective. rotateX squashes it visually to ~47% height without
// shrinking the box it occupies in layout, so a negative margin pulls the
// empty reserved half out from under the card instead of leaving a gap.
// `focus` shrinks it for off-center cards, so the centered card's dial
// reads largest. `indexRotation` + `liveNudge` turn it from unrelated
// decoration into a carousel indicator: indexRotation steps to a new
// orientation per active project, liveNudge tracks this card's own live
// scroll position as it approaches/leaves center — direction follows
// navigation direction because it's driven by the same signed distance
// the card's own transform uses.
function SpinnerDial({
  focus,
  indexRotation,
  liveNudge,
  accelerated,
  reducedMotion,
}: {
  focus: number
  indexRotation: number
  liveNudge: number
  accelerated: boolean
  reducedMotion: boolean
}) {
  const scale = 0.5 + focus * 0.5
  const rotation = reducedMotion ? 0 : indexRotation + liveNudge

  return (
    <div className="flex justify-center" style={{ perspective: '700px' }}>
      <div
        className="w-[170px] h-[170px] sm:w-[220px] sm:h-[220px] md:w-[270px] md:h-[270px] lg:w-[320px] lg:h-[320px] mt-[-30px] sm:mt-[-44px] md:mt-[-58px] lg:mt-[-71px] mb-[-30px] sm:mb-[-44px] md:mb-[-58px] lg:mb-[-71px]"
        style={{
          transform: `scale(${scale}) rotateX(62deg) rotate(${rotation}deg)`,
          filter: 'drop-shadow(0 22px 16px rgba(11,11,11,0.45)) drop-shadow(0 8px 6px rgba(11,11,11,0.3))',
          transition: reducedMotion ? 'transform 200ms ease-out' : `transform 500ms ${CAROUSEL_EASE}`,
        }}
      >
        <SpiralRings
          className="w-full h-full pointer-events-none"
          style={
            reducedMotion
              ? undefined
              : { animation: `spinSlow ${accelerated ? 12 : 60}s linear infinite` }
          }
        />
      </div>
    </div>
  )
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
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
    count: projects.length,
    onNavigate: (dir) => emitCarouselNav('projects', dir),
  })

  if (projects.length === 0) return null

  const activeProject = projects[centerIndex]
  const dialStep = 360 / projects.length

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative flex gap-8 md:gap-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pt-2 pb-2 px-[calc(50%-110px)] sm:px-[calc(50%-145px)] md:px-[calc(50%-180px)] lg:px-[calc(50%-210px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/50 rounded-2xl"
      >
        {projects.map((project, i) => {
          const coverUrl = project.coverImage
            ? urlFor(project.coverImage).width(960).height(1200).auto('format').url()
            : null
          const signedDist = signedDistances[i] ?? 0
          const isCenter = i === centerIndex
          const isHovered = i === hoveredIndex
          const motion = getCardMotion(signedDist, reducedMotion, intensity)
          const focus = getCardFocus(signedDist)

          // Side cards hint at clickability on hover: a touch more opacity,
          // a touch less blur/tilt — never stronger than the center image.
          const hoverEase = isHovered && !isCenter && !reducedMotion ? 1 : 0
          const opacity = Math.min(1, motion.opacity + hoverEase * 0.15)
          const blurPx = Math.max(0, motion.blurPx - hoverEase * 0.6)
          const rotateDeg = motion.rotateDeg * (1 - hoverEase * 0.35)
          const scale = motion.scale + hoverEase * 0.02 + (isCenter && isHovered && !reducedMotion ? 0.015 : 0)

          return (
            <Link
              key={project._id}
              ref={setCardRef(i)}
              href={`/projects/${project.slug.current}`}
              aria-label={`${project.title}${isCenter ? '' : ' — view project'}`}
              aria-current={isCenter ? 'true' : undefined}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex((current) => (current === i ? null : current))}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex((current) => (current === i ? null : current))}
              className="group relative shrink-0 snap-center w-[220px] sm:w-[290px] md:w-[360px] lg:w-[420px]"
              style={{
                transform: `translateY(${motion.translateY}px) scale(${scale}) rotate(${rotateDeg}deg)`,
                transformOrigin: 'top center',
                opacity,
                filter: blurPx > 0.05 ? `blur(${blurPx}px)` : 'none',
                transition: `transform 420ms ${CAROUSEL_EASE}, opacity 420ms ${CAROUSEL_EASE}, filter 420ms ${CAROUSEL_EASE}`,
              }}
            >
              <div className="relative rounded-2xl shadow-[0_10px_20px_-10px_rgba(58,38,20,0.35)]">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#1C2433]">
                  {coverUrl && (
                    <Image
                      src={coverUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 360px, 420px"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>

              <SpinnerDial
                focus={focus}
                indexRotation={centerIndex * dialStep}
                liveNudge={-signedDist * 30}
                accelerated={isCenter && isHovered}
                reducedMotion={reducedMotion}
              />
            </Link>
          )
        })}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-1)}
          aria-label="Previous project"
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
          aria-label="Next project"
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

      {activeProject && (
        <ActiveEntryLabel
          entryKey={activeProject._id}
          index={centerIndex}
          total={projects.length}
          eyebrow={String(activeProject.year)}
          title={activeProject.title}
          href={`/projects/${activeProject.slug.current}`}
          ctaLabel="View project"
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  )
}
