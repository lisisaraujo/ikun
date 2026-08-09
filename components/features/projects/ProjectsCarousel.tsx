'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityProject } from '@/types/sanity'

interface ProjectsCarouselProps {
  projects: SanityProject[]
}

// How far (px) an off-center card sinks below the chain, at maximum distance
const SINK = 56

// A stitched-thread spiral, precomputed once as a plain point-to-point path
// (in a 0–200 viewBox) so the same string can be reused at every breakpoint
function buildSpiralPath(turns = 2.25, maxR = 92, cx = 100, cy = 100, steps = 140) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = t * turns * Math.PI * 2
    const r = t * maxR
    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `
  }
  return d.trim()
}
const SPIRAL_PATH = buildSpiralPath()

// Concentric rings — irregular dash rhythm per ring so it reads as
// hand-worked rather than a machine-uniform pattern
const RINGS = [
  { r: 30, dasharray: '4 9' },
  { r: 54, dasharray: '3 6 7 9' },
  { r: 80, dasharray: '5 10 3 8' },
]

// The stitched-thread dial, tilted flat via perspective and spinning
// constantly. rotateX squashes it visually to ~47% height without
// shrinking the box it occupies in layout, so a negative margin pulls the
// empty reserved half out from under (or above) the card instead of
// leaving a gap — which side depends on which face of the "sandwich" it's on.
// Top and bottom use related but distinct marks (a coil vs. nested rings,
// out of phase with each other) so the pair reads as two carved seals
// rather than one dial copy-pasted twice.
function SpinnerDial({ edge }: { edge: 'top' | 'bottom' }) {
  const pull = edge === 'top'
    ? 'mb-[-44px] sm:mb-[-60px] md:mb-[-76px] lg:mb-[-92px]'
    : 'mt-[-44px] sm:mt-[-60px] md:mt-[-76px] lg:mt-[-92px]'
  const isSpiral = edge === 'top'

  return (
    <div className="flex justify-center" style={{ perspective: '700px' }}>
      <div
        className={`w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] ${pull}`}
        style={{ transform: 'rotateX(62deg)' }}
      >
        <svg
          viewBox="0 0 200 200"
          aria-hidden="true"
          className="w-full h-full pointer-events-none animate-spin-slow"
          style={{ animationDelay: isSpiral ? '0s' : '-5s' }}
        >
          {isSpiral ? (
            <path
              d={SPIRAL_PATH}
              fill="none"
              stroke="#37C6F4"
              strokeOpacity={0.65}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="4 7 2 9"
            />
          ) : (
            RINGS.map(({ r, dasharray }) => (
              <circle
                key={r}
                cx={100}
                cy={100}
                r={r}
                fill="none"
                stroke="#37C6F4"
                strokeOpacity={0.6}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={dasharray}
              />
            ))
          )}
          {/* centered seal mark — a bounded medallion, not an empty coil */}
          <rect
            x={93}
            y={93}
            width={14}
            height={14}
            transform="rotate(45 100 100)"
            fill="#37C6F4"
            fillOpacity={0.75}
          />
        </svg>
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
      {/* top dial removed from view here (kept in SpinnerDial's code above for reuse elsewhere) */}

      <div
        ref={scrollerRef}
        className="relative flex gap-8 md:gap-10 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-2 pb-2 px-[calc(50%-110px)] sm:px-[calc(50%-140px)] md:px-[calc(50%-170px)] lg:px-[calc(50%-200px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => {
          const coverUrl = project.coverImage
            ? urlFor(project.coverImage).width(800).height(1000).auto('format').url()
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
              className="group relative shrink-0 snap-center w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px]"
              style={{
                transform: `translateY(${sink}px) scale(${scale})`,
                transformOrigin: 'top center',
                opacity,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              }}
            >
              <div className="relative rounded-lg shadow-[0_10px_20px_-10px_rgba(58,38,20,0.35)] transition-[transform,box-shadow] duration-300 ease-out [@media(hover:hover)]:group-hover:-translate-y-1.5 [@media(hover:hover)]:group-hover:shadow-[0_25px_35px_-12px_rgba(58,38,20,0.5)]">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#1C2433]">
                  {coverUrl && (
                    <Image
                      src={coverUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 340px, 400px"
                      className="object-cover"
                    />
                  )}

                  {/* info overlay — always visible on touch devices (no hover to rely on),
                      hidden until hover on devices that actually support it */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(28,36,51,0.85) 0%, rgba(28,36,51,0.55) 70%, transparent 100%)',
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
            </Link>
          )
        })}
      </div>

      <SpinnerDial edge="bottom" />

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
