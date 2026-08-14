'use client'

import type { ReactNode } from 'react'
import { ORBIT_IDLE_SECONDS, ORBIT_KICK_MS } from './carouselMotion'

interface CarouselOrbitProps {
  reducedMotion: boolean
  // Index-mapped orientation + a small live nudge from the active card's
  // own scroll position, already combined by the caller — this component
  // only cares about the final angle and animates smoothly toward it.
  rotationDeg: number
  sizeClassName: string
  children: ReactNode
}

// A graphic field radiating from behind the active card — not a per-card
// UI element anymore, just one instance mounted behind whichever card is
// currently centered. Three nested layers so the discrete "step to a new
// orientation" transition and the continuous ambient idle spin never fight
// over the same element's `transform`:
//   outer  — absolute position + responsive size, centered on the card
//   middle — the discrete, transitioned index/nav rotation
//   inner  — the CSS-driven, always-on idle drift
export default function CarouselOrbit({ reducedMotion, rotationDeg, sizeClassName, children }: CarouselOrbitProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 ${sizeClassName}`}
    >
      <div
        className="h-full w-full"
        style={{
          transform: reducedMotion ? 'none' : `rotate(${rotationDeg}deg)`,
          transition: reducedMotion ? 'none' : `transform ${ORBIT_KICK_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <div
          className="h-full w-full"
          style={reducedMotion ? undefined : { animation: `spinSlow ${ORBIT_IDLE_SECONDS}s linear infinite` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
