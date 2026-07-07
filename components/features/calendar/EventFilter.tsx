'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { EventType } from '@/types/sanity'

const FILTERS: { label: string; value: EventType | 'all' }[] = [
  { label: 'All',        value: 'all' },
  { label: 'Shows',      value: 'show' },
  { label: 'Workshops',  value: 'workshop' },
  { label: 'Talks',      value: 'talk' },
  { label: 'Other',      value: 'other' },
]

export default function EventFilter() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const active       = (searchParams.get('type') ?? 'all') as EventType | 'all'

  function setFilter(value: EventType | 'all') {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('type')
    } else {
      params.set('type', value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <nav aria-label="Filter events by type" className="flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-[#C9C9C9]/40 mb-14">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`pb-3 -mb-px text-xs uppercase tracking-widest transition-colors border-b-2 ${
            active === value
              ? 'border-[#37C6F4] text-[#8B5F3C] font-semibold'
              : 'border-transparent text-[#8B5F3C]/40 hover:text-[#0B0B0B]/70 hover:border-[#C9C9C9]'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
