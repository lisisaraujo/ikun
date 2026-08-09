'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityProject } from '@/types/sanity'

interface ProjectsCarouselProps {
  projects: SanityProject[]
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [focusMap, setFocusMap] = useState<number[]>(() => projects.map(() => 1))

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const updateFocus = () => {
      const center = el.scrollLeft + el.clientWidth / 2
      setFocusMap(
        cardRefs.current.map((card) => {
          if (!card) return 1
          const cardCenter = card.offsetLeft + card.offsetWidth / 2
          const dist = Math.abs(cardCenter - center)
          const t = Math.min(dist / (el.clientWidth / 2), 1)
          return 1 - t * 0.35
        })
      )
    }

    updateFocus()
    el.addEventListener('scroll', updateFocus, { passive: true })
    window.addEventListener('resize', updateFocus)
    return () => {
      el.removeEventListener('scroll', updateFocus)
      window.removeEventListener('resize', updateFocus)
    }
  }, [projects])

  if (projects.length === 0) return null

  return (
    <div
      ref={scrollerRef}
      className="flex gap-8 md:gap-10 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {projects.map((project, i) => {
        const coverUrl = project.coverImage
          ? urlFor(project.coverImage).width(800).height(1000).auto('format').url()
          : null
        const focus = focusMap[i] ?? 1

        return (
          <Link
            key={project._id}
            ref={(el) => { cardRefs.current[i] = el }}
            href={`/projects/${project.slug.current}`}
            className={`group relative shrink-0 snap-center w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px] ${
              i % 2 === 1 ? 'md:mt-12' : ''
            }`}
            style={{
              transform: `scale(${focus})`,
              opacity: 0.55 + focus * 0.45,
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
          >
            <div className="relative aspect-[3/4] bg-[#1C2433]">
              {coverUrl && (
                <Image
                  src={coverUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 220px, (max-width: 1024px) 340px, 400px"
                  className="object-cover"
                />
              )}

              {/* hover overlay — desktop/mouse only; touch devices get the static caption below instead */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
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

            {/* static caption for touch devices, where hover can't be relied on */}
            <div className="mt-3 text-center [@media(hover:hover)]:hidden">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#37C6F4] mb-1">{project.year}</p>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-light text-[#F3F1EB]">
                {project.title}
              </h3>
              {project.location && (
                <p className="text-sm text-[#F3F1EB]/60 mt-1">{project.location}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
