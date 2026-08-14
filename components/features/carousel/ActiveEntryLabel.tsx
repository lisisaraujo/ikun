'use client'

import Link from 'next/link'
import { useEntryReveal } from './useEntryReveal'
import { CAROUSEL_EASE } from './carouselMotion'

interface ActiveEntryLabelProps {
  // Changes whenever the active entry changes — resets the reveal so the
  // title always plays its mask-emerge again for the new entry, without
  // needing to remount the whole component.
  entryKey: string
  index: number
  total: number
  eyebrow: string
  title: string
  href: string
  ctaLabel: string
  reducedMotion: boolean
  className?: string
}

// The active carousel entry's own typography, living directly beneath the
// track — this is the mobile presentation (see ActiveImageMetadata for the
// desktop, on-image version). Index/year arrive first, the title rises
// through a mask, the CTA follows. Shared by Projects and Ìrònú.
export default function ActiveEntryLabel({
  entryKey,
  index,
  total,
  eyebrow,
  title,
  href,
  ctaLabel,
  reducedMotion,
  className = '',
}: ActiveEntryLabelProps) {
  const revealed = useEntryReveal(entryKey, reducedMotion)

  return (
    <div className={`relative z-10 mt-6 flex flex-col items-center px-4 text-center ${className}`}>
      <p
        className="text-[11px] font-semibold tracking-[0.3em] text-[#37C6F4]"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity 500ms ease-out 0ms' }}
      >
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
      <p
        className="mt-1.5 text-[11px] uppercase tracking-[0.25em] text-[#F3F1EB]/55"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity 500ms ease-out 90ms' }}
      >
        {eyebrow}
      </p>

      {/* Stationary clipping mask — the title rises through it, same
          language as the hero intro's masked line reveal. */}
      <div className="mt-2 overflow-hidden py-1">
        <h3
          className="font-[family-name:var(--font-heading)] text-3xl font-light uppercase tracking-[0.01em] text-[#F3F1EB] sm:text-4xl"
          style={{
            opacity: revealed ? 1 : 0,
            filter: reducedMotion ? 'none' : revealed ? 'blur(0px)' : 'blur(3px)',
            transform: reducedMotion ? 'none' : revealed ? 'translateY(0%)' : 'translateY(110%)',
            transition: reducedMotion
              ? 'opacity 250ms ease-out'
              : `transform 650ms ${CAROUSEL_EASE} 120ms, opacity 650ms ${CAROUSEL_EASE} 120ms, filter 650ms ${CAROUSEL_EASE} 120ms`,
          }}
        >
          {title}
        </h3>
      </div>

      <Link
        href={href}
        className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#F3F1EB]/50 hover:text-[#37C6F4]"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity 500ms ease-out 280ms, color 300ms' }}
      >
        {ctaLabel}
        <span aria-hidden="true">↗</span>
      </Link>
    </div>
  )
}
