'use client'

import { useEffect, useState } from 'react'
import { subscribeCarouselNav } from '@/lib/carouselNavPulse'
import { useReducedMotion } from '@/lib/useReducedMotion'

// One large stitched-thread spiral drifting very slowly behind the whole
// Ìrònú section — a background mark, not a foreground UI element, so it
// sits low in opacity and doesn't compete with the section's text. The
// continuous drift is pure CSS (inner element); an outer wrapper carries a
// small rotation that steps forward on every carousel navigation and stays
// there (eased in over the transition, not sprung back) — Ìrònú's own
// equivalent of the Projects spinner dial reacting to carousel state,
// without inventing a new per-card UI element that wasn't there before.

function buildSpiralPath(turns = 3, maxR = 92, cx = 100, cy = 100, steps = 200) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = t * turns * Math.PI * 2
    const r = t * maxR
    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `
  }
  return d.trim()
}
const SPIRAL_PATH = buildSpiralPath()

export default function IronuSpiral() {
  const reducedMotion = useReducedMotion()
  const [nudgeDeg, setNudgeDeg] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    return subscribeCarouselNav('ironu', (direction) => {
      setNudgeDeg((deg) => deg + direction * 6)
    })
  }, [reducedMotion])

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <div
        className="w-[680px] h-[680px] sm:w-[820px] sm:h-[820px] md:w-[960px] md:h-[960px]"
        style={{
          transform: reducedMotion ? 'none' : `rotate(${nudgeDeg}deg)`,
          transition: reducedMotion ? 'none' : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={reducedMotion ? undefined : { animation: 'spinSlow 90s linear infinite' }}
        >
          <path
            d={SPIRAL_PATH}
            fill="none"
            stroke="#37C6F4"
            strokeOpacity={0.14}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="4 7 2 9"
          />
        </svg>
      </div>
    </div>
  )
}
