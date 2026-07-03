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

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const filtered =
    type && type !== 'all'
      ? allEvents.filter((e) => e.eventType === (type as EventType))
      : allEvents

  const upcoming = filtered.filter((e) => new Date(e.date) >= now)
  const past     = filtered.filter((e) => new Date(e.date) <  now)

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

          {filtered.length === 0 && (
            <p className="text-[#0B0B0B]/40 text-sm uppercase tracking-widest">
              No events found.
            </p>
          )}

          {upcoming.length > 0 && (
            <section className="mb-16">
              <h2 className="text-[10px] uppercase tracking-widest text-[#8B5F3C] font-semibold mb-0">
                Upcoming
              </h2>
              {upcoming.map((event) => (
                <EventRow key={event._id} event={event} past={false} />
              ))}
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-[10px] uppercase tracking-widest text-[#0B0B0B]/30 font-semibold mb-0 mt-2">
                {upcoming.length > 0 ? 'Past' : 'Past events'}
              </h2>
              {past.map((event) => (
                <EventRow key={event._id} event={event} past={true} />
              ))}
            </section>
          )}
        </Container>
      </Section>
    </>
  )
}
