import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllEvents } from '@/lib/sanity/queries'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import EventRow from '@/components/features/calendar/EventRow'
import EventFilter from '@/components/features/calendar/EventFilter'
import type { EventType } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Upcoming and past shows, workshops, talks and events by IKUN Mufutau Yusuf.',
}

interface Props {
  searchParams: Promise<{ type?: string }>
}

export default async function CalendarPage({ searchParams }: Props) {
  const { type } = await searchParams
  const allEvents = await getAllEvents()

  const filtered = type && type !== 'all'
    ? allEvents.filter((e) => e.eventType === (type as EventType))
    : allEvents

  const upcoming = filtered.filter((e) => new Date(e.date) >= new Date())
  const past = filtered.filter((e) => new Date(e.date) < new Date())

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Shows, workshops, talks and other events."
      />
      <Section className="bg-[#F3F1EB]">
        <Container>
          <Suspense>
            <EventFilter />
          </Suspense>

          {upcoming.length > 0 && (
            <div className="mb-16">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-700 text-[#1C2433] mb-2 uppercase tracking-widest text-sm">
                Upcoming
              </h2>
              <div className="divide-y divide-[#C9C9C9]">
                {upcoming.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-700 text-[#1C2433] mb-2 uppercase tracking-widest text-sm">
                Past
              </h2>
              <div className="divide-y divide-[#C9C9C9]">
                {past.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-[#0B0B0B]/50 text-sm">No events found.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
