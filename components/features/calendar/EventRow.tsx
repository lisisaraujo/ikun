import Tag from '@/components/ui/Tag'
import type { CalendarEvent, EventType } from '@/types/sanity'

interface EventRowProps {
  event: CalendarEvent
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  show: 'Show',
  workshop: 'Workshop',
  talk: 'Talk',
  other: 'Other',
}

const EVENT_TYPE_VARIANTS: Record<EventType, 'blue' | 'navy' | 'brown'> = {
  show: 'blue',
  workshop: 'navy',
  talk: 'brown',
  other: 'navy',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function EventRow({ event }: EventRowProps) {
  const isPast = new Date(event.date) < new Date()

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 py-5 ${isPast ? 'opacity-60' : ''}`}>
      {/* Date */}
      <div className="sm:w-44 shrink-0">
        <p className="text-sm font-semibold text-[#1C2433]">{formatDate(event.date)}</p>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Tag label={EVENT_TYPE_LABELS[event.eventType]} variant={EVENT_TYPE_VARIANTS[event.eventType]} />
        </div>
        <h3 className="font-[family-name:var(--font-heading)] text-base font-700 text-[#0B0B0B] leading-snug">
          {event.title}
        </h3>
        <p className="text-sm text-[#0B0B0B]/60 mt-0.5">
          {event.venue}, {event.city}, {event.country}
        </p>
        {event.description && (
          <p className="text-sm text-[#0B0B0B]/70 mt-1 line-clamp-2">{event.description}</p>
        )}
      </div>

      {/* Ticket link */}
      {event.ticketLink && !isPast && (
        <div className="shrink-0">
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border border-[#1C2433] px-4 py-1.5 text-xs font-semibold text-[#1C2433] transition-colors hover:bg-[#1C2433] hover:text-[#F3F1EB]"
          >
            Tickets →
          </a>
        </div>
      )}
    </div>
  )
}
