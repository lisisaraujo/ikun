'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import Reveal from '@/components/ui/Reveal'
import type { CalendarEvent, SanityImage } from '@/types/sanity'

interface CalendarPreviewProps {
  events: CalendarEvent[]
  backgroundImage?: SanityImage
}

const PAGE_SIZE = 3

export default function CalendarPreview({ events, backgroundImage }: CalendarPreviewProps) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const visibleEvents = events.slice(0, PAGE_SIZE)
  const activeEvent = visibleEvents.find((event) => event._id === activeEventId)
  const activeBackgroundImage = activeEvent?.image ?? backgroundImage

  return (
    <section className="relative sticky top-0 z-30 min-h-screen flex flex-col justify-center overflow-hidden px-4 pb-10 pt-32 sm:px-6 md:px-8 md:pt-36 lg:px-10 xl:px-12">
      <div className="absolute inset-0 -z-10 bg-[#1C2433]" aria-hidden="true" />
      {activeBackgroundImage && (
        <div className="absolute inset-0 -z-[5]" aria-hidden="true">
          <Image
            key={activeBackgroundImage.asset._ref}
            src={urlFor(activeBackgroundImage).width(2200).height(1400).fit('crop').auto('format').url()}
            alt=""
            fill
            className="object-cover object-[62%_center] opacity-35 grayscale transition-opacity duration-[900ms]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#1C2433_0%,rgba(28,36,51,0.86)_35%,rgba(28,36,51,0.28)_78%,#1C2433_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#1C2433_0%,transparent_42%,rgba(28,36,51,0.55)_100%)]" />
        </div>
      )}

      <div className="mx-auto w-full max-w-[140rem]" aria-label="Upcoming events">
        <div className="mb-6 flex items-end justify-between gap-6 text-[#8B5F3C] md:mb-9">
          <p className="hidden pb-1 text-right text-xs font-semibold uppercase tracking-[0.3em] text-[#A06B43]/72 sm:block md:text-sm">
            Upcoming
          </p>
        </div>

        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="rounded-2xl bg-[#0B0B0B]/12 px-6 py-10 text-sm uppercase tracking-widest text-[#8B5F3C]/45">
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
                  <article
                    className="group grid gap-5 rounded-2xl bg-[#0B0B0B]/10 px-5 py-5 shadow-[0_24px_80px_-72px_rgba(160,107,67,0.7)] transition-[background-color,transform] duration-500 hover:bg-[#A06B43]/[0.055] md:grid-cols-[minmax(11rem,0.34fr)_minmax(0,1fr)_auto] md:items-center md:gap-8 md:px-7 md:py-6"
                    onMouseEnter={() => setActiveEventId(event._id)}
                    onMouseLeave={() => setActiveEventId(null)}
                    onFocus={() => setActiveEventId(event._id)}
                    onBlur={() => setActiveEventId(null)}
                  >
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A06B43]/66">
                        <span>{event.eventType}</span>
                      </p>
                      <time
                        dateTime={event.date}
                        className="block font-[family-name:var(--font-heading)] text-[clamp(2.4rem,4vw,5.2rem)] font-bold uppercase leading-[0.9] tracking-normal text-[#A06B43] transition-colors duration-500 group-hover:text-[#37C6F4]"
                      >
                        <span>{day}</span>
                        <span className="ml-3 text-[0.46em] tracking-[0.12em] text-[#A06B43]/76 group-hover:text-[#37C6F4]/78">
                          {monthYear}
                        </span>
                      </time>
                      <p className="mt-2 text-xs text-[#A06B43]/58 md:text-sm">
                        {[event.venue, loc].filter(Boolean).join(' · ')}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <h3 className="max-w-6xl font-[family-name:var(--font-heading)] text-3xl font-bold uppercase leading-[0.96] tracking-normal text-[#A06B43] transition-colors duration-500 group-hover:text-[#37C6F4] md:text-[clamp(2.2rem,3.4vw,4.4rem)]">
                        {event.title}
                      </h3>
                    </div>

                    {event.ticketLink && (
                      <a
                        href={event.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 inline-flex w-fit items-center gap-3 rounded-full bg-[#8B5F3C]/22 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#A06B43] ring-1 ring-[#8B5F3C]/30 transition-colors duration-300 hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60 sm:justify-self-end"
                        aria-label={`Tickets for ${event.title}`}
                      >
                        Tickets
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </article>
                </Reveal>
              )
            })
          )}
        </div>

        <div className="mt-8 flex justify-end md:mt-10">
          <Link
            href="/calendar"
            className="group inline-flex items-center gap-3 rounded-full bg-[#8B5F3C]/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#A06B43] ring-1 ring-[#8B5F3C]/24 transition-colors duration-300 hover:text-[#37C6F4]"
          >
            See all events
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
