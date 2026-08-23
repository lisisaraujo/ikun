'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { SanityProject } from '@/types/sanity'

interface ProjectsCarouselProps {
  projects: SanityProject[]
}

const MOBILE_PAGE_SIZE = 1
const DESKTOP_PAGE_SIZE = 3
const WHEEL_PAGE_THRESHOLD = 36
const WHEEL_PAGE_LOCK_MS = 650

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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
        {visibleProjects.map((project) => {
          const coverUrl = project.coverImage
            ? urlFor(project.coverImage).width(1200).height(780).fit('crop').auto('format').url()
            : null

          return (
            <Link
              key={project._id}
              href={`/projects/${project.slug.current}`}
              className="group relative block overflow-hidden rounded-2xl bg-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70"
            >
              <div className="relative aspect-[1.32/1] min-h-[18rem] md:min-h-[26rem] lg:min-h-[31rem]">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={project.coverImage?.alt || project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-80 grayscale-[18%] transition-[transform,opacity,filter] duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#111827]" />
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.08)_0%,rgba(11,11,11,0.14)_45%,rgba(11,11,11,0.78)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[#37C6F4]/80">
                    {project.year}
                  </p>
                  <h3
                    className="max-w-[min(100%,32rem)] font-[family-name:var(--font-heading)] text-lg font-black uppercase leading-[1.08] tracking-normal text-[#F3F1EB] transition-colors duration-300 group-hover:text-[#37C6F4] md:text-xl lg:text-[1.35rem]"
                    style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {canPage && (
        <div className="mt-9 flex items-center justify-start md:mt-12">
          <div className="inline-flex items-center overflow-hidden rounded-full bg-[#8B5F3C]/18 shadow-[0_18px_60px_-48px_rgba(160,107,67,0.75)] ring-1 ring-[#8B5F3C]/28">
            <button
              type="button"
              onClick={() => goToPage(-1)}
              aria-label="Previous projects"
              className="group flex h-14 w-16 items-center justify-center text-[#A06B43] transition-colors duration-300 hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#37C6F4]/60 md:h-16 md:w-20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 group-hover:-translate-x-0.5 md:h-6 md:w-6" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="border-x border-[#8B5F3C]/22 px-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#A06B43]/72 md:px-8 md:text-sm">
              {String(page + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
            </p>
            <button
              type="button"
              onClick={() => goToPage(1)}
              aria-label="Next projects"
              className="group flex h-14 w-16 items-center justify-center text-[#A06B43] transition-colors duration-300 hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#37C6F4]/60 md:h-16 md:w-20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 md:h-6 md:w-6" aria-hidden="true">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
