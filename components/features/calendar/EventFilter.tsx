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
    <nav aria-label="Filter events by type" className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`text-[10px] uppercase tracking-[0.25em] transition-colors pb-1 border-b ${
            active === value
              ? 'border-[#37C6F4] text-[#37C6F4] font-semibold'
              : 'border-transparent text-[#8B5F3C]/40 hover:text-[#8B5F3C]'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
