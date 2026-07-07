import type { CalendarEvent, EventType } from '@/types/sanity'

interface EventRowProps {
  event: CalendarEvent
  past?: boolean
}

const TYPE_LABELS: Record<EventType, string> = {
  show:     'Show',
  workshop: 'Workshop',
  talk:     'Talk',
  other:    'Other',
}

function parseDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day:      d.toLocaleDateString('en-IE', { day: 'numeric' }),
    month:    d.toLocaleDateString('en-IE', { month: 'short' }).toUpperCase(),
    year:     d.toLocaleDateString('en-IE', { year: 'numeric' }),
    full:     d.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

export default function EventRow({ event, past = false }: EventRowProps) {
  const date    = parseDate(event.date)
  const hasLink = !!event.ticketLink

  const location = [event.venue, event.city, event.country].filter(Boolean).join(', ')

  return (
    <div
      className={`grid grid-cols-[4rem_1fr] sm:grid-cols-[5rem_1fr_auto] gap-x-8 gap-y-1 items-start py-7 border-b border-[#C9C9C9]/40 transition-opacity ${
        past ? 'opacity-50' : ''
      }`}
    >
      {/* Date column */}
      <div className="flex flex-col items-center pt-0.5 select-none">
        <span className={`font-[family-name:var(--font-heading)] leading-none ${past ? 'text-3xl text-[#1C2433]/50' : 'text-3xl text-[#1C2433]'}`}>
          {date.day}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#8B5F3C]/40 mt-0.5">{date.month}</span>
        <span className="text-[10px] tracking-wide text-[#8B5F3C]/30">{date.year}</span>
      </div>

      {/* Content column */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
          <h3 className={`font-[family-name:var(--font-heading)] text-lg leading-snug ${past ? 'text-[#8B5F3C]/70' : 'text-[#8B5F3C]'}`}>
            {event.title}
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-[#8B5F3C] font-medium shrink-0">
            {TYPE_LABELS[event.eventType]}
          </span>
        </div>
        {location && (
          <p className="text-sm text-[#8B5F3C]/40 leading-snug">{location}</p>
        )}
        {event.description && (
          <p className="text-sm text-[#8B5F3C]/55 mt-1.5 leading-relaxed line-clamp-2 max-w-prose">
            {event.description}
          </p>
        )}

        {/* Mobile ticket link */}
        {hasLink && (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden inline-flex items-center gap-1.5 mt-3 text-xs uppercase tracking-widest text-[#37C6F4] transition-opacity"
          >
            {past ? 'View' : 'Tickets'}
            <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>

      {/* Ticket link — desktop */}
      <div className="hidden sm:flex items-start pt-1 shrink-0">
        {hasLink && (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#37C6F4] [@media(hover:hover)]:opacity-60 hover:opacity-100 transition-opacity"
          >
            {past ? 'View' : 'Tickets'}
            <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
