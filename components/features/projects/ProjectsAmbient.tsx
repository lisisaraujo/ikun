'use client'

import { useEffect, useRef, useState } from 'react'
import { subscribeCarouselNav } from '@/lib/carouselNavPulse'
import { useReducedMotion } from '@/lib/useReducedMotion'
import SpiralRings from './SpiralRings'

// Only the spinning spirals remain here — every other decorative layer
// (the still spirals, the fading coil/dots/cross marks) was removed so the
// section background is otherwise plain, with motion coming from just
// these plus the big SectionOrbitBackground ring elsewhere in the section.
const FLOATING_SPIRALS = [
  { top: '6%',  left: '7%',  size: 60, opacity: 0.16, spin: 75 },
  { top: '80%', right: '6%', size: 66, opacity: 0.18, spin: 95 },
]

export default function ProjectsAmbient() {
  const reducedMotion = useReducedMotion()
  const [nudge, setNudge] = useState(0)
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (reducedMotion) return
    const unsubscribe = subscribeCarouselNav('projects', (direction) => {
      if (settleTimeout.current) clearTimeout(settleTimeout.current)
      // Nudges opposite the navigation direction, holds briefly, then the
      // same transition eases it back to rest — drift, then settle.
      setNudge(-direction * 16)
      settleTimeout.current = setTimeout(() => setNudge(0), 220)
    })
    return () => {
      unsubscribe()
      if (settleTimeout.current) clearTimeout(settleTimeout.current)
    }
  }, [reducedMotion])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {FLOATING_SPIRALS.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            transform: reducedMotion ? undefined : `translateX(${nudge}px)`,
            transition: reducedMotion ? undefined : 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <SpiralRings
            className="w-full h-full"
            style={reducedMotion ? undefined : { animation: `spinSlow ${s.spin}s linear infinite` }}
          />
        </div>
      ))}
    </div>
  )
}
