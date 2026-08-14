'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
}

// The active carousel entry's own typography, living in the surrounding
// composition rather than as an overlay inside the photograph — index/year
// arrive first, the title rises through a mask, the CTA follows. Shared by
// Projects and Ìrònú so both carousels speak the same typographic language.
export default function ActiveEntryLabel({
  entryKey,
  index,
  total,
  eyebrow,
  title,
  href,
  ctaLabel,
  reducedMotion,
}: ActiveEntryLabelProps) {
  const [revealed, setRevealed] = useState(reducedMotion)

  // Resetting `revealed` to false when the entry changes must happen
  // synchronously with that change (React's documented "adjust state
  // during render" pattern) — an effect would apply it a render late.
  // Only the *timed* release back to true (below) needs an effect, since
  // that's inherently async (a couple of animation frames later).
  const [prevKey, setPrevKey] = useState(entryKey)
  if (prevKey !== entryKey) {
    setPrevKey(entryKey)
    setRevealed(reducedMotion)
  }

  useEffect(() => {
    if (reducedMotion) return
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true))
    })
    return () => cancelAnimationFrame(raf)
  }, [entryKey, reducedMotion])

  return (
    <div className="relative z-10 mt-8 flex flex-col items-center px-4 text-center md:mt-12">
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
      <div className="mt-3 overflow-hidden py-1">
        <h3
          className="font-[family-name:var(--font-heading)] text-4xl font-light uppercase tracking-[0.01em] text-[#F3F1EB] sm:text-5xl md:text-6xl"
          style={{
            opacity: revealed ? 1 : 0,
            filter: reducedMotion ? 'none' : revealed ? 'blur(0px)' : 'blur(3px)',
            transform: reducedMotion ? 'none' : revealed ? 'translateY(0%)' : 'translateY(110%)',
            transition: reducedMotion
              ? 'opacity 250ms ease-out'
              : `transform 800ms ${CAROUSEL_EASE} 160ms, opacity 800ms ${CAROUSEL_EASE} 160ms, filter 800ms ${CAROUSEL_EASE} 160ms`,
          }}
        >
          {title}
        </h3>
      </div>

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#F3F1EB]/50 hover:text-[#37C6F4]"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity 500ms ease-out 320ms, color 300ms' }}
      >
        {ctaLabel}
        <span aria-hidden="true">↗</span>
      </Link>
    </div>
  )
}
