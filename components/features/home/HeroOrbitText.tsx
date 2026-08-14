'use client'

import { useEffect, useState } from 'react'

// A ring of text slowly circling behind the About section's bio column —
// Ikun's own version of the rotating title effect on the Marseille
// reference, built with the same "circle of things, always spinning" idea
// already used for the spiral motif elsewhere (SpiralRings, ProjectsAmbient),
// just applied to words instead of rings. Sized and centered to sit behind
// the whole left (text) column, spilling slightly into the gap toward the
// portrait rather than being contained by it — the same kind of open-margin
// bleed it originally had in the hero. Wide screens only: there's no
// distinct "column" to orbit once the layout stacks on narrower viewports.
const ORBIT_WORDS = ['CHOREOGRAPHY', 'PERFORMANCE', 'TEACHING', 'ÌKÙN']
const PATH_ID = 'hero-orbit-path'
const IDLE_OPACITY = 0.08
const SETTLED_OPACITY = 0.3
// Roughly when the main typography has established itself (section 4 of
// the hero copy begins rising around ~1950ms into the cinematic entrance),
// so the ring feels like the final beat of that entrance rather than its
// own competing event.
const SETTLE_DELAY = 2100

interface HeroOrbitTextProps {
  active?: boolean
}

export default function HeroOrbitText({ active = true }: HeroOrbitTextProps) {
  const text = `${ORBIT_WORDS.join('   ·   ')}   ·   `
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!active || settled) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(() => setSettled(true), reducedMotion ? 0 : SETTLE_DELAY)
    return () => clearTimeout(timer)
  }, [active, settled])

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block absolute left-1/2 top-1/2 -z-10 h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-spin-slower transition-opacity duration-[1400ms] ease-out"
      style={{ opacity: settled ? SETTLED_OPACITY : IDLE_OPACITY }}
    >
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <path id={PATH_ID} d="M 200,200 m -170,0 a 170,170 0 1,1 340,0 a 170,170 0 1,1 -340,0" />
        </defs>
        <text
          fill="#37C6F4"
          fontSize="13"
          letterSpacing="4"
          className="font-heading"
          style={{ fontWeight: 600 }}
        >
          <textPath href={`#${PATH_ID}`}>{text}</textPath>
        </text>
      </svg>
    </div>
  )
}
