import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllEvents } from '@/lib/sanity/queries'
import Container from '@/components/layout/Container'
import Reveal from '@/components/ui/Reveal'
import KineticHeading from '@/components/ui/KineticHeading'
import SpiralRings from '@/components/features/projects/SpiralRings'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Upcoming and past shows, workshops, talks and events by IKUN Mufutau Yusuf.',
}

function EventRow({
  event,
  delay = 0,
}: {
  event: { _id: string; title: string; date: string; city: string; country: string }
  delay?: number
}) {
  const d = new Date(event.date)
  const day = String(d.getDate()).padStart(2, '0')
  const mon = String(d.getMonth() + 1).padStart(2, '0')
  const yr = d.getFullYear()
  const loc = [event.city, event.country].filter(Boolean).join(', ')

  return (
    <Reveal delay={delay}>
      <article className="calendar-event-row grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-8 border-b border-[#1C2433]/20 py-8 md:gap-12 md:py-10">
        <time dateTime={event.date} className="type-title font-light tabular-nums text-[#1C2433]">
          {day}
          <span className="type-meta mt-2 block font-normal text-[#1C2433]/60">{mon}.{yr}</span>
        </time>
        <div className="min-w-0">
          <h2 className="type-heading text-[#1C2433]">{event.title}</h2>
          {loc && <p className="type-body mt-2 text-[#1C2433]/68">{loc}</p>}
        </div>
      </article>
    </Reveal>
  )
}

export default async function CalendarPage() {
  const events = await getAllEvents()

  const now = new Date(); now.setHours(0, 0, 0, 0)
  const past = events.filter((e) => new Date(e.date) < now)

  return (
    <div className="min-h-screen bg-[#8B5F3C]">
      {/* Back link shares the top navigation row with the logo and menu. */}
      <div className="fixed left-0 right-0 top-5 z-40 pointer-events-none md:top-4">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
          <Link
            href="/#calendar"
            className="type-meta pointer-events-auto inline-flex items-center gap-2 text-[#1C2433] [@media(hover:hover)]:opacity-60 transition-opacity duration-200 hover:opacity-100"
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
        <div className="relative mb-14 max-w-2xl md:mb-20">
          <div
            className="hidden md:block absolute -top-6 -left-14 w-16 h-16 opacity-[0.18] animate-spin-slow pointer-events-none"
            aria-hidden="true"
          >
            <SpiralRings className="w-full h-full" />
          </div>
          <KineticHeading as="h1" className="type-display mb-5 font-light text-[#1C2433]">Past events</KineticHeading>
        </div>

        <section id="past-events">
          {past.length === 0 ? (
            <p className="type-body mx-auto py-8 text-center text-[#1C2433]/70">No past events yet.</p>
          ) : (
            <div className="max-w-4xl border-t border-[#1C2433]/20">
              {past.map((event, i) => (
                <EventRow key={event._id} event={event} delay={i * 60} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  )
}
