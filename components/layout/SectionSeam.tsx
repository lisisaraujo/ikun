'use client'

import { useEffect, useRef } from 'react'

// Stitched divider marking the boundary between two page sections. The seam
// stays visible while its repeated stitches travel with the page: scrolling
// down carries them right, and scrolling back up carries them left. Sits at
// the top edge of the section it's placed in, which must be positioned.
export default function SectionSeam() {
  const stitchesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stitches = stitchesRef.current
    if (!stitches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      stitches.style.backgroundPositionX = `${window.scrollY * 0.18}px`
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
      {/* thread */}
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#37C6F4]/80 shadow-[0_0_6px_rgba(55,198,244,0.5)]"
      />
      {/* stitches — the cursor accent mark, tiled, small and soft */}
      <div className="absolute inset-x-0 top-1/2 h-5 -translate-y-1/2">
        <div
          ref={stitchesRef}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/cursor-accent.png)',
            backgroundRepeat: 'repeat-x',
            backgroundSize: '16px 19px',
            backgroundPosition: '0 center',
            filter: 'drop-shadow(0 0 3px rgba(55, 198, 244, 0.65))',
            willChange: 'background-position',
          }}
        />
      </div>
    </div>
  )
}
