'use client'

import { useEffect, useRef, useState } from 'react'

// Stitched divider marking the boundary between two page sections. Slides
// up into place as you scroll down toward it, settles once you've reached
// the section, then slides on up and fades as you move deeper past it —
// so the next section's own seam is arriving from below at the same time
// this one is leaving. Sits at the top edge of the section it's placed in,
// which must be `relative`-positioned.
export default function SectionSeam() {
  const ref = useRef<HTMLDivElement>(null)
  // -1 = fully passed/above, 0 = at rest right at the crossing, 1 = not yet reached
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      const dist = el.getBoundingClientRect().top
      const scale = window.innerHeight * 0.5
      setProgress(Math.max(-1, Math.min(1, dist / scale)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const opacity = 1 - Math.min(Math.abs(progress), 1)
  const slide = progress * 28

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-x-0 top-0 pointer-events-none"
      style={{
        transform: `translateY(calc(-50% + ${slide}px))`,
        opacity,
        transition: 'transform 0.1s linear, opacity 0.1s linear',
      }}
    >
      {/* thread */}
      <div
        className="h-px bg-[#37C6F4]/28"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      />
      {/* stitches — the cursor accent mark, tiled, small and soft */}
      <div
        className="absolute inset-x-0 -top-2 h-4 opacity-75"
        style={{
          backgroundImage: 'url(/cursor-accent.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: '16px 19px',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      />
    </div>
  )
}
