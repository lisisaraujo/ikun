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

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

export default function EventRow({ event, past = false }: EventRowProps) {
  const dateStr  = formatDate(event.date)
  const hasLink  = !!event.ticketLink
  const cityLine = [event.city, event.country].filter(Boolean).join(', ')

  const base = past
    ? 'opacity-35 hover:opacity-60'
    : 'bg-transparent hover:bg-[#37C6F4]'

  const textPrimary   = 'text-[#37C6F4]    group-hover:text-white'
  const textSecondary = 'text-[#8B5F3C]/50 group-hover:text-white/60'
  const textTitle     = 'text-[#8B5F3C]    group-hover:text-white'
  const divider       = 'border-[#8B5F3C]/10 group-hover:border-white/20'

  return (
    <div className={`group border-b border-[#8B5F3C]/15 transition-colors duration-200 ${base}`}>
      {/* Mobile layout */}
      <div className="md:hidden px-6 py-5 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <span className={`text-[11px] font-medium tracking-widest tabular-nums ${textPrimary}`}>{dateStr}</span>
          <span className={`text-[10px] uppercase tracking-widest shrink-0 ${textSecondary}`}>{TYPE_LABELS[event.eventType]}</span>
        </div>
        <p className={`text-sm uppercase tracking-wider font-medium ${textTitle}`}>{event.title}</p>
        {cityLine && <p className={`text-[10px] uppercase tracking-widest ${textSecondary}`}>{cityLine}</p>}
        {event.venue && <p className={`text-[10px] uppercase tracking-widest ${textSecondary}`}>{event.venue}</p>}
        {hasLink && (
          <a
            href={event.ticketLink!}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] uppercase tracking-widest mt-1 underline underline-offset-2 ${textSecondary}`}
          >
            {past ? 'View' : 'Reservation'}
          </a>
        )}
      </div>

      {/* Desktop 4-column layout */}
      <div className="hidden md:grid md:grid-cols-[220px_1fr_160px_220px]">

        {/* Col 1: Date + link */}
        <div className={`px-8 py-5 border-r ${divider} flex flex-col justify-between gap-3`}>
          <p className={`text-[11px] font-medium tracking-widest tabular-nums ${textPrimary}`}>{dateStr}</p>
          {hasLink ? (
            <a
              href={event.ticketLink!}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[10px] uppercase tracking-widest ${textSecondary} transition-opacity`}
            >
              {past ? 'View' : 'Reservation'}
            </a>
          ) : (
            <span />
          )}
        </div>

        {/* Col 2: Title + description */}
        <div className={`px-8 py-5 border-r ${divider} flex flex-col justify-between gap-3`}>
          <p className={`text-[11px] uppercase tracking-[0.2em] font-medium ${textTitle}`}>{event.title}</p>
          {event.description && (
            <p className={`text-[10px] uppercase tracking-widest line-clamp-1 ${textSecondary}`}>{event.description}</p>
          )}
        </div>

        {/* Col 4: Location + venue */}
        <div className="px-8 py-5 flex flex-col justify-between gap-3">
          {cityLine && <p className={`text-[10px] uppercase tracking-widest ${textTitle}`}>{cityLine}</p>}
          {event.venue && <p className={`text-[10px] uppercase tracking-widest ${textSecondary}`}>{event.venue}</p>}
          {!cityLine && !event.venue && <span />}
        </div>

      </div>
    </div>
  )
}
