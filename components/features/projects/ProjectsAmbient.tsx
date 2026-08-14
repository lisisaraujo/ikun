'use client'

import { useEffect, useRef, useState } from 'react'
import { subscribeCarouselNav } from '@/lib/carouselNavPulse'
import { useReducedMotion } from '@/lib/useReducedMotion'
import SpiralRings from './SpiralRings'

// Small background accents scattered around the section — the same ring
// motif as the focused card's spinner dial (kept at its own larger, fixed
// size in ProjectsCarousel), just smaller, dimmer, and drifting free in the
// background rather than tied to any one card. Percentage-based positions
// so they stay roughly in place across viewport sizes.
//
// Only some of these actually spin, and slowly — stillness is part of the
// composition too, not every decorative mark needs to be in motion.
const FLOATING_SPIRALS: { top: string; left?: string; right?: string; size: number; opacity: number; spin?: number }[] = [
  { top: '6%',  left: '7%',   size: 60, opacity: 0.16, spin: 75 },
  { top: '12%', right: '9%',  size: 42, opacity: 0.13 },
  { top: '58%', left: '4%',   size: 50, opacity: 0.15 },
  { top: '80%', right: '6%',  size: 66, opacity: 0.18, spin: 95 },
  { top: '38%', left: '13%',  size: 34, opacity: 0.11 },
  { top: '88%', left: '44%',  size: 40, opacity: 0.13 },
]

// Small hand-drawn marks, echoing SectionBackdrop's engravings. Most stay
// completely still; a couple quietly fade in and out on a very slow loop.
const FLOATING_MARKS: { top: string; left?: string; right?: string; size: number; delay: number; duration?: number; kind: 'coil' | 'dots' | 'cross' }[] = [
  { top: '20%', right: '22%', size: 30, delay: 0,   duration: 26, kind: 'coil' },
  { top: '50%', right: '32%', size: 22, delay: 3,               kind: 'dots' },
  { top: '28%', left: '25%',  size: 26, delay: 5.5,              kind: 'cross' },
  { top: '68%', left: '22%',  size: 20, delay: 1.5, duration: 22, kind: 'dots' },
  { top: '90%', right: '18%', size: 24, delay: 4,               kind: 'coil' },
]

// A couple of these nudge a few px in the opposite direction of carousel
// navigation, then settle back — an almost-imperceptible sense that the
// whole field responds to movement, without a visible "parallax effect."
const REACTIVE_SPIRAL_INDICES = [0, 3]

function CoilMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#37C6F4" strokeOpacity={0.4} strokeWidth={1.6} strokeLinecap="round">
      <path d="M28,17 a8,7.5 0 1,1 -0.8,-8.2 a13,12.3 0 1,0 -1.7,13.4" />
    </svg>
  )
}

function DotsMark() {
  return (
    <svg viewBox="0 0 40 40" fill="#37C6F4" fillOpacity={0.4}>
      <ellipse cx={12} cy={10} rx={3.4} ry={2.8} transform="rotate(-12 12 10)" />
      <ellipse cx={22} cy={16} rx={2.5} ry={3} transform="rotate(20 22 16)" />
      <ellipse cx={9} cy={22} rx={2} ry={1.7} transform="rotate(8 9 22)" />
    </svg>
  )
}

function CrossMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#37C6F4" strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round">
      <path d="M12,12 Q19,20 28,28" />
      <path d="M12,29 Q20,21 28,12" />
      <path d="M16,18 L20,16 L24,18 L23,23 L19,25 L15,23 Z" strokeWidth={1.2} />
    </svg>
  )
}

const MARK_COMPONENTS = { coil: CoilMark, dots: DotsMark, cross: CrossMark }

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
      {FLOATING_SPIRALS.map((s, i) => {
        const reactive = REACTIVE_SPIRAL_INDICES.includes(i) && !reducedMotion
        return (
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
              transform: reactive ? `translateX(${nudge}px)` : undefined,
              transition: reactive ? `transform 900ms cubic-bezier(0.16, 1, 0.3, 1)` : undefined,
            }}
          >
            <SpiralRings
              className="w-full h-full"
              style={s.spin && !reducedMotion ? { animation: `spinSlow ${s.spin}s linear infinite` } : undefined}
            />
          </div>
        )
      })}
      {FLOATING_MARKS.map((m, i) => {
        const Mark = MARK_COMPONENTS[m.kind]
        return (
          <div
            key={i}
            className={m.duration && !reducedMotion ? 'absolute animate-ambient-fade' : 'absolute'}
            style={{
              top: m.top,
              left: m.left,
              right: m.right,
              width: m.size,
              height: m.size,
              animationDelay: m.duration ? `${m.delay}s` : undefined,
              animationDuration: m.duration ? `${m.duration}s` : undefined,
              opacity: m.duration ? undefined : 0.55,
            }}
          >
            <Mark />
          </div>
        )
      })}
    </div>
  )
}
