import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllEvents } from '@/lib/sanity/queries'
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

/* Column header row — desktop only */
function TableHeader() {
  return (
    <div className="hidden md:grid md:grid-cols-[220px_1fr_160px_220px] border-b border-[#8B5F3C]/30">
      {['Date', 'Event', 'Type', 'Location'].map((col) => (
        <div key={col} className="px-8 py-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8B5F3C]/40 font-medium">{col}</span>
        </div>
      ))}
    </div>
  )
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
    <div className="bg-[#F3F1EB] min-h-screen pt-16">

      {/* Page title + filter */}
      <div className="px-8 md:px-16 pt-12 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#8B5F3C]/20">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-light text-[#8B5F3C]">Calendar</h1>
        </div>
        <Suspense>
          <EventFilter />
        </Suspense>
      </div>

      {filtered.length === 0 && (
        <div className="px-8 md:px-16 py-16">
          <p className="text-[#8B5F3C]/40 text-[11px] uppercase tracking-widest">No events found.</p>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <div className="px-8 md:px-0">
            <div className="px-0 md:px-8 md:pl-8 py-4 md:py-3 flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium pl-0 md:pl-8">Upcoming</span>
            </div>
          </div>
          <TableHeader />
          {upcoming.map((event) => (
            <EventRow key={event._id} event={event} past={false} />
          ))}
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section className={upcoming.length > 0 ? 'mt-12' : ''}>
          <div className="px-8 md:pl-8 py-4 md:py-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8B5F3C]/30 font-medium">
              {upcoming.length > 0 ? 'Past' : 'Past events'}
            </span>
          </div>
          <TableHeader />
          {past.map((event) => (
            <EventRow key={event._id} event={event} past={true} />
          ))}
          <div className="border-b border-[#8B5F3C]/15" />
        </section>
      )}

    </div>
  )
}
