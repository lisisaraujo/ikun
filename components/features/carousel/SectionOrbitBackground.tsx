'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { subscribeCarouselNav } from '@/lib/carouselNavPulse'
import { useReducedMotion } from '@/lib/useReducedMotion'

const IDLE_SECONDS = 70

interface SectionOrbitBackgroundProps {
  // Which carousel's nav events this listens to (see lib/carouselNavPulse.ts)
  channel: string
  sizeClassName: string
  children: ReactNode
}

// One large graphic drifting very slowly behind an entire carousel section —
// ambient background geometry, not a per-card UI element. Two nested
// layers so two motions never fight over the same element's transform: an
// outer wrapper carries the discrete, nav-triggered rotation, an inner one
// carries the continuous idle spin.
export default function SectionOrbitBackground({ channel, sizeClassName, children }: SectionOrbitBackgroundProps) {
  const reducedMotion = useReducedMotion()
  const [nudgeDeg, setNudgeDeg] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    return subscribeCarouselNav(channel, (direction) => {
      setNudgeDeg((deg) => deg + direction * 6)
    })
  }, [channel, reducedMotion])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <div
        className={sizeClassName}
        style={{
          transform: reducedMotion ? 'none' : `rotate(${nudgeDeg}deg)`,
          transition: reducedMotion ? 'none' : 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="h-full w-full"
          style={reducedMotion ? undefined : { animation: `spinSlow ${IDLE_SECONDS}s linear infinite` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
