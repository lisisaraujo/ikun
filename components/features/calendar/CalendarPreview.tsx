'use client'

import { useState } from 'react'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'
import type { CalendarEvent } from '@/types/sanity'

interface CalendarPreviewProps {
  events: CalendarEvent[]
}

const PAGE_SIZE = 3

export default function CalendarPreview({ events }: CalendarPreviewProps) {
  const [startIndex, setStartIndex] = useState(0)
  const visibleEvents = events.slice(startIndex, startIndex + PAGE_SIZE)
  const canGoEarlier = startIndex > 0
  const hasMoreEvents = startIndex + PAGE_SIZE < events.length
  const showWindowControls = events.length > PAGE_SIZE
  function moveWindow(direction: -1 | 1) {
    setStartIndex((index) => {
      const nextIndex = index + direction
      return Math.min(Math.max(nextIndex, 0), Math.max(events.length - PAGE_SIZE, 0))
    })
  }

  return (
    <section className="home-section z-calendar relative sticky top-0 flex flex-col justify-start overflow-hidden px-4 pb-6 pt-6 sm:px-6 md:px-8 md:pt-8 lg:px-10 xl:px-12">
      <div className="absolute inset-0 -z-10 bg-[#1C2433]" aria-hidden="true" />

      <div className="mx-auto w-full max-w-[78rem]" aria-label="Upcoming events">
        <div className="mb-5 flex items-center gap-4 text-[#8B5F3C] md:mb-7">
          <h2 className="type-label text-[#A06B43]">
            Upcoming
          </h2>
        </div>

        {showWindowControls && (
          <div className="mb-3 flex justify-center">
            <button
              type="button"
              onClick={() => moveWindow(-1)}
              disabled={!canGoEarlier}
              className="inline-flex items-center justify-center text-[#A06B43] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06B43]/60 disabled:pointer-events-none disabled:opacity-25"
              aria-label="Show earlier events"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                <path d="M4 13l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        <div key={startIndex} className="animate-fadeIn space-y-3">
          {events.length === 0 ? (
            <p className="editorial-frame bg-[#0B0B0B]/12 px-6 py-10 text-sm uppercase tracking-widest text-[#8B5F3C]/45">
              No upcoming events.
            </p>
          ) : (
            visibleEvents.map((event, i) => {
              const d = new Date(event.date)
              const day = d.toLocaleDateString('en-IE', { day: '2-digit' })
              const monthYear = d.toLocaleDateString('en-IE', { month: 'short', year: 'numeric' })
              const loc = [event.city, event.country].filter(Boolean).join(', ')
              return (
                <Reveal key={event._id} delay={i * 80}>
                  <article className="spotlight-hover event-card-copy event-card-frame relative grid gap-4 border-b border-[#A06B43]/16 px-1 py-5 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-center md:gap-10 md:px-2 md:py-6">
                    <div className="relative z-10 flex min-w-0 items-baseline gap-3 md:block">
                      <time dateTime={event.date} className="type-display block whitespace-nowrap text-[clamp(1.8rem,3vw,3rem)] text-[#F3F1EB]">
                        {day}
                      </time>
                      <span className="type-meta text-[#C9C9C9]/76">
                        {monthYear}
                      </span>
                    </div>

                    <div className="relative z-10 min-w-0">
                      <h3 className="type-heading max-w-6xl text-[#F3F1EB]">
                        {event.title}
                      </h3>
                      <p className="type-small mt-1 max-w-[32rem] text-[#C9C9C9]/76">
                        {[event.venue, loc].filter(Boolean).join(' · ')}
                      </p>
                    </div>

                    {event.ticketLink && (
                      <a
                        href={event.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-label relative z-20 inline-flex w-fit items-center gap-3 py-2 font-semibold text-[#A06B43] transition-colors duration-300 hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60 sm:justify-self-end"
                        aria-label={`Tickets for ${event.title}`}
                      >
                        Tickets
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true">
                          <path d="M4 10h11M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    )}
                  </article>
                </Reveal>
              )
            })
          )}
        </div>

        {showWindowControls && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => moveWindow(1)}
              disabled={!hasMoreEvents}
              className="inline-flex items-center justify-center text-[#A06B43] transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06B43]/60 disabled:pointer-events-none disabled:opacity-25"
              aria-label="Show later events"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                <path d="M4 7l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Link
            href="/calendar#past-events"
            className="type-label inline-flex items-center gap-2 normal-case text-[#A06B43] transition-[color,opacity] duration-200 hover:text-[#37C6F4] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06B43]/60"
          >
            Past events
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true">
              <path d="M4 10h11M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
