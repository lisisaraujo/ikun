import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllEvents } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import Container from '@/components/layout/Container'
import Reveal from '@/components/ui/Reveal'
import KineticHeading from '@/components/ui/KineticHeading'
import SpiralRings from '@/components/features/projects/SpiralRings'
import type { SanityImage } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Upcoming and past shows, workshops, talks and events by IKUN Mufutau Yusuf.',
}

function EventRow({
  event,
  past = false,
  delay = 0,
}: {
  event: { _id: string; title: string; eventType: string; date: string; city: string; country: string; image?: SanityImage; ticketLink?: string }
  past?: boolean
  delay?: number
}) {
  const d = new Date(event.date)
  const day = String(d.getDate()).padStart(2, '0')
  const mon = String(d.getMonth() + 1).padStart(2, '0')
  const yr = d.getFullYear()
  const loc = [event.city, event.country].filter(Boolean).join(', ')

  return (
    <Reveal delay={delay}>
      <div className={`py-7 grid grid-cols-[80px_1fr_auto] gap-8 items-start ${past ? 'opacity-60' : ''}`}>
        <p className="type-title font-light text-[#37C6F4] tabular-nums">
          {day}
          <span className="type-meta mt-1 block font-normal text-[#37C6F4]/50">{mon}.{yr}</span>
        </p>
        <div className="flex items-center gap-4">
          {event.image && (
            <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={urlFor(event.image).width(112).height(112).fit('crop').auto('format').url()}
                alt=""
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          )}
          <div>
            <p className="type-meta mb-1 text-[#37C6F4]">{event.eventType}</p>
            <h3 className="type-heading font-light text-[#1C2433]">{event.title}</h3>
            {loc && <p className="type-small mt-1 text-[#8B5F3C]/60">{loc}</p>}
          </div>
        </div>
        {!past && event.ticketLink && (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="type-label mt-1 text-[#37C6F4] [@media(hover:hover)]:opacity-60 transition-opacity hover:opacity-100"
          >
            Book
          </a>
        )}
      </div>
    </Reveal>
  )
}

export default async function CalendarPage() {
  const events = await getAllEvents()

  const now = new Date(); now.setHours(0, 0, 0, 0)
  const upcoming = events.filter((e) => new Date(e.date) >= now).reverse()
  const past = events.filter((e) => new Date(e.date) < now)

  return (
    <div className="bg-[#F3F1EB] min-h-screen">
      {/* Back link — same slot/treatment as the project and Ìrònú detail
          pages, sitting below the fixed logo's band on mobile. */}
      <div className="fixed top-28 md:top-16 left-0 right-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 pt-5">
          <Link
            href="/#calendar"
            className="type-meta pointer-events-auto inline-flex items-center gap-2 text-[#37C6F4] [@media(hover:hover)]:opacity-60 transition-opacity duration-200 hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth={2} aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      <Container className="pt-40 md:pt-48 pb-24">
        {/* Header — a small spiral accent (the same motif that spins under
            each Projects card and floats through that section's background)
            keeps this page visually tied to the rest of the site rather
            than reading as a plain generic listing. */}
        <div className="relative max-w-2xl mb-16 md:mb-20">
          <div
            className="hidden md:block absolute -top-6 -left-14 w-16 h-16 opacity-[0.18] animate-spin-slow pointer-events-none"
            aria-hidden="true"
          >
            <SpiralRings className="w-full h-full" />
          </div>
          <p className="type-label mb-4 font-medium text-[#37C6F4]">Every performance</p>
          <KineticHeading as="h1" className="type-display mb-5 font-light text-[#1C2433]">Calendar</KineticHeading>
          <p className="type-body max-w-2xl text-[#8B5F3C]/70">
            Shows, workshops and talks — what&apos;s <span className="text-[#37C6F4]">coming up</span>, and a record of what&apos;s already happened.
          </p>
        </div>

        {/* Upcoming */}
        <section>
          <p className="type-label mb-2 text-[#37C6F4]">Upcoming</p>
          {upcoming.length === 0 ? (
            <p className="type-label py-8 text-[#8B5F3C]/40">No upcoming events.</p>
          ) : (
            <div className="divide-y divide-[#8B5F3C]/15 border-b border-[#8B5F3C]/15">
              {upcoming.map((event, i) => (
                <EventRow key={event._id} event={event} delay={i * 60} />
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section id="past-events" className="mt-16 md:mt-20">
            <p className="type-label mb-2 text-[#8B5F3C]/50">Past</p>
            <div className="divide-y divide-[#8B5F3C]/15 border-b border-[#8B5F3C]/15">
              {past.map((event) => (
                <EventRow key={event._id} event={event} past />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  )
}
