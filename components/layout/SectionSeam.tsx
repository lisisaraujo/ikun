'use client'

import { useEffect, useId, useRef } from 'react'

// How far apart (px) each accent mark repeats — wide enough that it reads
// as an occasional signature along the seam, not a dense stitch line.
const TILE_WIDTH = 900

// A quiet seam marking the boundary between two page sections — the
// brand's own accent mark (the same tilde used in the logo/cursor)
// recurring sparsely. The hairline beneath it is kept in the markup but
// invisible (opacity 0) rather than removed. Drifts slowly with scroll.
// Sits at the top edge of the section it's placed in, which must be
// positioned.
export default function SectionSeam() {
  const patternId = `seam-accent-${useId()}`
  const patternRef = useRef<SVGPatternElement>(null)

  useEffect(() => {
    const pattern = patternRef.current
    if (!pattern || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const x = (window.scrollY * 0.15) % TILE_WIDTH
      pattern.setAttribute('x', String(x))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-20 h-6 overflow-hidden"
    >
      {/* hairline — present but invisible */}
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 opacity-0 bg-[#37C6F4]" />

      {/* the accent mark itself, widely and evenly spaced */}
      <svg className="absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2" aria-hidden="true">
        <defs>
          <pattern ref={patternRef} id={patternId} patternUnits="userSpaceOnUse" width={TILE_WIDTH} height={20} x={0}>
            <image href="/cursor-accent.png" x={0} y={0.5} width={16} height={19} opacity={0.8} />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${patternId})`}
          style={{ filter: 'drop-shadow(0 0 3px rgba(55, 198, 244, 0.5))' }}
        />
      </svg>
    </div>
  )
}
