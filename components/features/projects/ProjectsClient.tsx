'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityProject } from '@/types/sanity'

type View = 'list' | 'gallery'

interface ProjectsClientProps {
  projects: SanityProject[]
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="0.5" />
      <rect x="11" y="2" width="7" height="7" rx="0.5" />
      <rect x="2" y="11" width="7" height="7" rx="0.5" />
      <rect x="11" y="11" width="7" height="7" rx="0.5" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current" aria-hidden="true">
      <rect x="2" y="2" width="16" height="5" rx="0.5" />
      <rect x="2" y="9" width="16" height="5" rx="0.5" />
      <rect x="2" y="16" width="16" height="2" rx="0.5" />
    </svg>
  )
}

function ChevronUp() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2" aria-hidden="true">
      <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-2" aria-hidden="true">
      <path d="M5 9l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Big List View ─────────────────────────────────────────────────────────────

function BigListView({ projects }: { projects: SanityProject[] }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollTo = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory">
      {projects.map((project, i) => {
        const imageSrc = project.coverImage
          ? urlFor(project.coverImage).width(1600).height(900).fit('crop').auto('format').url()
          : null

        const meta = [project.year, project.location].filter(Boolean).join(' · ')

        return (
          <div
            key={project._id}
            ref={(el) => { itemRefs.current[i] = el }}
            className="relative h-screen w-full snap-start overflow-hidden bg-[#0B0B0B]"
          >
            {/* Background image */}
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={project.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover opacity-75"
              />
            )}

            {/* Gradient: dark at bottom for text, subtle at top */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

            {/* Clickable content area — links to project page */}
            <Link
              href={`/projects/${project.slug.current}`}
              className="absolute inset-0 z-10 flex flex-col justify-end px-8 pb-24 md:px-16 md:pb-20 lg:px-24"
            >
              {meta && (
                <p className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[#37C6F4] mb-4">
                  {meta}
                </p>
              )}
              <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-black text-[#F3F1EB] leading-tight mb-6">
                {project.title}
              </h2>
              <p className="text-[#C9C9C9] text-base md:text-lg leading-relaxed max-w-xl">
                {project.shortDescription}
              </p>
            </Link>

            {/* Up arrow */}
            {i > 0 && (
              <button
                onClick={() => scrollTo(i - 1)}
                aria-label="Previous project"
                className="absolute top-24 left-1/2 -translate-x-1/2 z-20 text-[#F3F1EB] opacity-25 hover:opacity-75 transition-opacity duration-200"
              >
                <ChevronUp />
              </button>
            )}

            {/* Down arrow */}
            {i < projects.length - 1 && (
              <button
                onClick={() => scrollTo(i + 1)}
                aria-label="Next project"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#F3F1EB] opacity-25 hover:opacity-75 transition-opacity duration-200"
              >
                <ChevronDown />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Gallery View ──────────────────────────────────────────────────────────────

function GalleryView({ projects }: { projects: SanityProject[] }) {
  return (
    <div className="pt-28 pb-24 px-6 md:px-10 lg:px-16 bg-[#F3F1EB] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-black text-[#1C2433] mb-12">
          Projects
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {projects.map((project) => {
            const imageSrc = project.coverImage
              ? urlFor(project.coverImage).width(800).height(600).fit('crop').auto('format').url()
              : null

            const meta = [project.year, project.location].filter(Boolean).join(' · ')

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug.current}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-[#1C2433]"
              >
                {/* Image */}
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#C9C9C9]/40 text-sm">No image</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#0B0B0B]/0 group-hover:bg-[#0B0B0B]/70 transition-colors duration-400 flex flex-col justify-end p-6">
                  <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {meta && (
                      <p className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[#37C6F4] mb-2">
                        {meta}
                      </p>
                    )}
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#F3F1EB] leading-snug">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main Client Component ─────────────────────────────────────────────────────

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [view, setView] = useState<View>('list')

  return (
    <div className="relative">
      {/* View toggle — fixed below the navbar, top-right */}
      <button
        onClick={() => setView((v) => (v === 'list' ? 'gallery' : 'list'))}
        aria-label={view === 'list' ? 'Switch to gallery view' : 'Switch to list view'}
        className="fixed top-[76px] right-8 z-40 flex items-center justify-center w-9 h-9 text-[#F3F1EB] bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
      >
        {view === 'list' ? <GridIcon /> : <ListIcon />}
      </button>

      {view === 'list' ? (
        <BigListView projects={projects} />
      ) : (
        <GalleryView projects={projects} />
      )}
    </div>
  )
}
