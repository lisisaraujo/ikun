'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { SanityProject } from '@/types/sanity'

interface ProjectsCarouselProps {
  projects: SanityProject[]
}

const MOBILE_PAGE_SIZE = 1
const DESKTOP_PAGE_SIZE = 2
const WHEEL_PAGE_THRESHOLD = 36
const WHEEL_PAGE_LOCK_MS = 650

function FittedProjectTitle({ title }: { title: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const element = titleRef.current
    if (!element) return

    const fitTitle = () => {
      element.style.fontSize = ''
      const baseSize = Number.parseFloat(window.getComputedStyle(element).fontSize)
      const availableWidth = element.clientWidth
      const textWidth = element.scrollWidth

      if (textWidth > availableWidth && availableWidth > 0) {
        element.style.fontSize = `${Math.max(11, baseSize * (availableWidth / textWidth))}px`
      }
    }

    const frame = window.requestAnimationFrame(fitTitle)
    const observer = new ResizeObserver(fitTitle)
    observer.observe(element)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [title])

  return (
    <h3
      ref={titleRef}
      className="project-card-title type-feature min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[#F3F1EB] transition-colors duration-300 group-hover:text-[#A06B43]"
    >
      {title}
    </h3>
  )
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const lastWheelPageAtRef = useRef(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(MOBILE_PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize))
  const canPage = projects.length > pageSize

  const visibleProjects = useMemo(() => {
    const start = page * pageSize
    return projects.slice(start, start + pageSize)
  }, [page, pageSize, projects])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const updatePageSize = () => {
      setPageSize(query.matches ? DESKTOP_PAGE_SIZE : MOBILE_PAGE_SIZE)
      setPage(0)
    }

    updatePageSize()
    query.addEventListener('change', updatePageSize)
    return () => query.removeEventListener('change', updatePageSize)
  }, [])

  if (projects.length === 0) return null

  function goToPage(direction: -1 | 1) {
    setPage((current) => (current + direction + totalPages) % totalPages)
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!canPage) return

    const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY)
    if (!horizontalIntent || Math.abs(event.deltaX) < WHEEL_PAGE_THRESHOLD) return

    event.preventDefault()
    const now = Date.now()
    if (now - lastWheelPageAtRef.current < WHEEL_PAGE_LOCK_MS) return
    lastWheelPageAtRef.current = now
    goToPage(event.deltaX > 0 ? 1 : -1)
  }

  return (
    <div
      className="relative mx-auto flex w-full max-w-[140rem] flex-col px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12"
      onWheel={handleWheel}
    >
      <div className="relative">
        <div className="mb-7 flex items-end justify-between gap-6">
          <p className="type-meta text-[#A06B43]/78">Selected work</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:gap-10">
          {visibleProjects.map((project) => {
            const coverUrl = project.coverImage
              ? urlFor(project.coverImage).width(1200).height(780).fit('crop').auto('format').url()
              : null

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug.current}`}
                className="spotlight-hover project-card-frame group relative block bg-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70"
              >
                <div className="relative aspect-[1.32/1] min-h-[18rem] md:min-h-[26rem] lg:min-h-[31rem]">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={project.coverImage?.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-80 grayscale-[18%] transition-[opacity,filter] duration-700 ease-out group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#111827]" />
                  )}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.08)_0%,rgba(11,11,11,0.14)_45%,rgba(11,11,11,0.78)_100%)]" />
                  <div className="absolute inset-x-0 bottom-[8%] md:bottom-[10%]">
                    <div className="project-card-copy min-w-0 px-4 py-4 md:px-5 md:py-5">
                      <p className="type-meta mb-2 font-medium text-[#A06B43]/80 transition-colors duration-300 group-hover:text-[#A06B43]">
                        {project.year}
                      </p>
                      <FittedProjectTitle title={project.title} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {canPage && (
          <div className="pointer-events-none absolute -inset-x-6 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between sm:-inset-x-7 md:-inset-x-8">
          <button
            type="button"
            onClick={() => goToPage(-1)}
            aria-label="Previous projects"
            className="group pointer-events-auto flex h-12 w-12 items-center justify-center text-[#A06B43] transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06B43]/60 md:h-14 md:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[2.4] transition-transform duration-300 group-hover:-translate-x-0.5 md:h-7 md:w-7" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goToPage(1)}
            aria-label="Next projects"
            className="group pointer-events-auto flex h-12 w-12 items-center justify-center text-[#A06B43] transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06B43]/60 md:h-14 md:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 md:h-7 md:w-7" aria-hidden="true">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          </div>
        )}
      </div>
    </div>
  )
}
