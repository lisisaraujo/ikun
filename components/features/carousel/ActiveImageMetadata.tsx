'use client'

import { useEntryReveal } from './useEntryReveal'
import { CAROUSEL_EASE } from './carouselMotion'

interface ActiveImageMetadataProps {
  entryKey: string
  index: number
  total: number
  eyebrow: string
  title: string
  ctaLabel: string
  reducedMotion: boolean
}

// Desktop only: the active entry's index/year/title, living directly on
// the photograph rather than in a detached block underneath it — attached
// to the artwork rather than floating in its own section. No separate CTA
// link here (the whole card is already the click target — nesting another
// `<a>` inside it would be invalid), just a small "view project" hint.
// Sits inside the same `overflow-hidden` image frame the photo does, so it
// never spills past the card's own rounded corners.
export default function ActiveImageMetadata({
  entryKey,
  index,
  total,
  eyebrow,
  title,
  ctaLabel,
  reducedMotion,
}: ActiveImageMetadataProps) {
  const revealed = useEntryReveal(entryKey, reducedMotion)

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 hidden flex-col items-center px-5 pb-6 pt-14 text-center md:flex">
      {/* Very soft local darkening confined to the text area — not the
          whole photograph — so metadata stays legible regardless of the
          image's own brightness. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/12 to-transparent"
      />

      <div className="relative">
        <p
          className="text-[10px] font-semibold tracking-[0.28em] text-[#37C6F4]"
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 400ms ease-out 0ms' }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <p
          className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#F3F1EB]/70"
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 400ms ease-out 70ms' }}
        >
          {eyebrow}
        </p>

        <div className="mt-1.5 overflow-hidden">
          <h3
            className="font-[family-name:var(--font-heading)] text-2xl font-light uppercase tracking-[0.01em] text-[#F3F1EB] lg:text-3xl"
            style={{
              opacity: revealed ? 1 : 0,
              filter: reducedMotion ? 'none' : revealed ? 'blur(0px)' : 'blur(2.5px)',
              transform: reducedMotion ? 'none' : revealed ? 'translateY(0%)' : 'translateY(110%)',
              transition: reducedMotion
                ? 'opacity 220ms ease-out'
                : `transform 700ms ${CAROUSEL_EASE} 130ms, opacity 700ms ${CAROUSEL_EASE} 130ms, filter 700ms ${CAROUSEL_EASE} 130ms`,
            }}
          >
            {title}
          </h3>
        </div>

        <p
          className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#F3F1EB]/45"
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 400ms ease-out 260ms' }}
        >
          {ctaLabel} ↗
        </p>
      </div>
    </div>
  )
}
