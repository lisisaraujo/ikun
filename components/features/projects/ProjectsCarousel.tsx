'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityProject } from '@/types/sanity'
import SpiralRings from './SpiralRings'

interface ProjectsCarouselProps {
  projects: SanityProject[]
}

// How far (px) an off-center card sinks below the chain, at maximum distance
const SINK = 56

// The stitched-thread dial that floats beneath each card, tilted flat via
// perspective and spinning constantly. rotateX squashes it visually to
// ~47% height without shrinking the box it occupies in layout, so a
// negative margin pulls the empty reserved half out from under the card
// instead of leaving a gap. `focus` (0–1) shrinks it for off-center cards,
// so the centered card's dial reads largest and the ones either side get
// visibly smaller companions rather than all matching in size.
function SpinnerDial({ focus }: { focus: number }) {
  const scale = 0.5 + focus * 0.5

  return (
    <div className="flex justify-center" style={{ perspective: '700px' }}>
      <div
        className="w-[170px] h-[170px] sm:w-[220px] sm:h-[220px] md:w-[270px] md:h-[270px] lg:w-[320px] lg:h-[320px] mt-[-30px] sm:mt-[-44px] md:mt-[-58px] lg:mt-[-71px] mb-[-30px] sm:mb-[-44px] md:mb-[-58px] lg:mb-[-71px]"
        style={{
          transform: `scale(${scale}) rotateX(62deg)`,
          filter: 'drop-shadow(0 22px 16px rgba(11,11,11,0.45)) drop-shadow(0 8px 6px rgba(11,11,11,0.3))',
          transition: 'transform 0.3s ease-out',
        }}
      >
        <SpiralRings className="w-full h-full pointer-events-none animate-spin-slow" />
      </div>
    </div>
  )
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  // 0 = dead center, 1 = as far from center as it gets
  const [distMap, setDistMap] = useState<number[]>(() => projects.map(() => 0))
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    // Batched via requestAnimationFrame so rapid-fire native scroll events
    // (there can be dozens per second during momentum scrolling) don't each
    // trigger their own layout read + state update
    let raf = 0
    const update = () => {
      raf = 0
      const center = el.scrollLeft + el.clientWidth / 2
      setDistMap(
        cardRefs.current.map((card) => {
          if (!card) return 0
          const cardCenter = card.offsetLeft + card.offsetWidth / 2
          const dist = Math.abs(cardCenter - center)
          return Math.min(dist / (el.clientWidth / 2), 1)
        })
      )
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // Center the second card (not the first) on load, so there's already
    // one card before and one after it in view from the start
    const initial = cardRefs.current[Math.min(1, projects.length - 1)]
    if (initial) {
      el.scrollLeft = initial.offsetLeft + initial.offsetWidth / 2 - el.clientWidth / 2
    }

    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [projects])

  // Steps to the next/previous card by index (rather than an approximate
  // percentage-of-width scroll) so it always lands exactly centered
  function scrollByAmount(dir: 1 | -1) {
    let centerIndex = 0
    let bestDist = Infinity
    distMap.forEach((d, i) => {
      if (d < bestDist) { bestDist = d; centerIndex = i }
    })
    const nextIndex = Math.min(Math.max(centerIndex + dir, 0), projects.length - 1)
    cardRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  if (projects.length === 0) return null

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="relative flex gap-8 md:gap-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pt-2 pb-2 px-[calc(50%-110px)] sm:px-[calc(50%-145px)] md:px-[calc(50%-180px)] lg:px-[calc(50%-210px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => {
          const coverUrl = project.coverImage
            ? urlFor(project.coverImage).width(960).height(1200).auto('format').url()
            : null
          const dist = distMap[i] ?? 0
          const scale = 1 - dist * 0.35
          const opacity = 0.55 + (1 - dist) * 0.45
          const sink = dist * SINK

          return (
            <Link
              key={project._id}
              ref={(el) => { cardRefs.current[i] = el }}
              href={`/projects/${project.slug.current}`}
              className="group relative shrink-0 snap-center w-[220px] sm:w-[290px] md:w-[360px] lg:w-[420px]"
              style={{
                transform: `translateY(${sink}px) scale(${scale})`,
                transformOrigin: 'top center',
                opacity,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              }}
            >
              <div className="relative rounded-2xl shadow-[0_10px_20px_-10px_rgba(58,38,20,0.35)] transition-[transform,box-shadow] duration-300 ease-out [@media(hover:hover)]:group-hover:-translate-y-1.5 [@media(hover:hover)]:group-hover:shadow-[0_25px_35px_-12px_rgba(58,38,20,0.5)]">
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

                  {/* info overlay — always visible on touch devices (no hover to rely on),
                      hidden until hover on devices that actually support it. Anchored
                      below the bottom edge so it reads as washing up from the spinner
                      dial that sits just beneath the card, rather than from the card's
                      own center. */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-100 transition-opacity duration-500 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                    style={{
                      background: 'radial-gradient(circle at 50% 115%, rgba(28,36,51,0.92) 0%, rgba(28,36,51,0.6) 55%, transparent 100%)',
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#37C6F4] mb-1">{project.year}</p>
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-light text-[#F3F1EB]">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-[#F3F1EB]/60 mt-1">{project.location}</p>
                    )}
                  </div>
                </div>
              </div>

              <SpinnerDial focus={1 - dist} />
            </Link>
          )
        })}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll left"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center text-[#F3F1EB] drop-shadow-[0_2px_6px_rgba(28,36,51,0.8)] hover:text-[#37C6F4] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll right"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center text-[#F3F1EB] drop-shadow-[0_2px_6px_rgba(28,36,51,0.8)] hover:text-[#37C6F4] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
