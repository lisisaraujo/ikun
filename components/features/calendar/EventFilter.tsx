'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { EventType } from '@/types/sanity'

const FILTERS: { label: string; value: EventType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Shows', value: 'show' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Talks', value: 'talk' },
  { label: 'Other', value: 'other' },
]

export default function EventFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = (searchParams.get('type') ?? 'all') as EventType | 'all'

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
    <div className="flex flex-wrap gap-2 mb-10">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            active === value
              ? 'bg-[#1C2433] border-[#1C2433] text-[#F3F1EB]'
              : 'border-[#C9C9C9] text-[#0B0B0B]/70 hover:border-[#1C2433] hover:text-[#1C2433]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
