'use client'

import { useEffect, useRef, useState } from 'react'
import PortableText from '@/components/ui/PortableText'
import type { PortableTextBlock } from '@portabletext/types'

interface HeroIntroOverlayProps {
  heading?: string
  text: PortableTextBlock[]
  // User-driven override (the "Aa" button on the video) — independent of
  // the auto-entrance below. Kept separate so toggling it never replays the
  // entrance animation; it only plays the smaller fade layered on top.
  textHidden?: boolean
  // Fires once when scrolling the text all the way past its end commits to
  // hiding it — a second, gesture-driven way to reach the same hidden state
  // the "Aa" button reaches, so the parent only needs one source of truth.
  onDismiss?: () => void
}

// Delay before the text beams in on its own — long enough to read as a
// considered entrance rather than a loading flash, short enough that it
// doesn't feel like a missing element while you wait.
const AUTO_ENTER_DELAY = 600

// How much of the trailing padding (see `paddingRight` below) counts as the
// "keep scrolling to dismiss" zone, in px.
const DISMISS_ZONE = 220

export default function HeroIntroOverlay({ heading, text, textHidden = false, onDismiss }: HeroIntroOverlayProps) {
  const [entered, setEntered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)

  // Now lives inside the hero's own viewport rather than its own scroll
  // section, so it appears on its own shortly after mount instead of
  // waiting for the user to scroll into it.
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), AUTO_ENTER_DELAY)
    return () => clearTimeout(t)
  }, [])

  // Reading past the last column keeps scrolling into the container's own
  // trailing padding — the last `DISMISS_ZONE` px of that runway fades the
  // text out 1:1 with the drag, so pushing it all the way off-screen is a
  // second way to hide it. Tracks scroll position directly rather than
  // through React state so it can update every frame without re-rendering.
  useEffect(() => {
    const container = scrollRef.current
    const fadeEl = fadeRef.current
    if (!container || !fadeEl) return

    let raf = 0
    let committed = false

    const update = () => {
      raf = 0
      const maxScroll = container.scrollWidth - container.clientWidth
      const dismissStart = Math.max(maxScroll - DISMISS_ZONE, 0)
      const progress =
        maxScroll <= 0 ? 0 : Math.min(Math.max((container.scrollLeft - dismissStart) / DISMISS_ZONE, 0), 1)

      if (progress > 0 && progress < 1) {
        // Actively being dragged through the dismiss zone — track the
        // gesture 1:1, no easing lag.
        fadeEl.style.transition = 'none'
        fadeEl.style.opacity = String(1 - progress)
        committed = false
      } else if (progress >= 1) {
        if (!committed) {
          committed = true
          // Hold at fully faded (rather than clearing the inline override
          // immediately) so there's no one-frame flash back to visible
          // before the parent's re-render with textHidden=true lands —
          // the `[textHidden]` effect below does the actual handoff.
          fadeEl.style.transition = 'none'
          fadeEl.style.opacity = '0'
          onDismiss?.()
        }
      } else {
        fadeEl.style.transition = ''
        fadeEl.style.opacity = ''
        committed = false
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [onDismiss])

  // Once the parent confirms the hidden state (however it was reached),
  // drop any inline drag override so the CSS class/transition fully owns
  // opacity again — and if we're still parked in the dismiss zone, pull
  // back out of it so reopening (via the "Aa" button) doesn't land right
  // back in a scroll position that reads as "still faded".
  useEffect(() => {
    const fadeEl = fadeRef.current
    const container = scrollRef.current
    if (fadeEl) {
      fadeEl.style.transition = ''
      fadeEl.style.opacity = ''
    }
    if (!textHidden && container) {
      const maxScroll = container.scrollWidth - container.clientWidth
      const dismissStart = Math.max(maxScroll - DISMISS_ZONE, 0)
      if (container.scrollLeft > dismissStart) {
        container.scrollLeft = dismissStart
      }
    }
  }, [textHidden])

  // Subtle cursor-follow parallax on the whole text field — a few px of
  // drift opposite the cursor's offset from center
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = fieldRef.current
      if (!el) return
      const x = (e.clientX / window.innerWidth - 0.5) * -12
      const y = (e.clientY / window.innerHeight - 0.5) * -8
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center px-4 sm:px-8 pt-16 sm:pt-20 text-center pointer-events-none">
      {/* light beam trailing down from the logo — fixed height, animated via
          scale so it never shifts the layout below it. Follows the manual
          toggle too (a plain fade is enough for a 1px line — no need for
          the two-layer treatment the text field gets below). */}
      <div
        aria-hidden="true"
        className={`shrink-0 h-8 sm:h-10 w-px bg-gradient-to-b from-[#37C6F4]/90 via-[#37C6F4]/25 to-transparent origin-top blur-[1px] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-[900ms] ${
          entered && !textHidden ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
        }`}
      />

      {/* text field: fills the rest of the screen so the reading frame feels
          full-height rather than a small centered box */}
      <div
        ref={fieldRef}
        className="relative mt-6 sm:mt-8 max-w-[92vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full mx-auto flex-1 min-h-0"
        style={{ transition: 'transform 0.3s ease-out' }}
      >
        {/* Outer layer — the auto-entrance only, untouched by the manual
            toggle below: text materializes out of the beam once on load,
            the "big" version of this move. */}
        <div
          className={`h-full origin-top transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-[900ms] ${
            entered
              ? 'opacity-100 translate-y-0 scale-100 blur-0'
              : 'opacity-0 -translate-y-16 sm:-translate-y-24 scale-[0.35] blur-sm'
          }`}
        >
          {/* Inner layer — the manual "Aa" toggle. A much smaller move (a
              near-imperceptible settle rather than a materialize) so
              switching it back and forth reads as a quiet aside, not a
              second grand entrance every time. */}
          <div
            ref={fadeRef}
            className={`h-full origin-top transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-500 ${
              textHidden ? 'opacity-0 -translate-y-2 scale-[0.97] blur-[2px]' : 'opacity-100 translate-y-0 scale-100 blur-0'
            }`}
          >
            {/* Horizontal, not vertical — a normal wheel/touch scroll on
                this section always means "go to About", never "read the
                next line". Reading happens by scrolling this frame
                sideways instead, the same CSS-columns mechanic AboutContent
                uses: text auto-flows into fixed-width columns rightward. */}
            <div
              ref={scrollRef}
              className={`relative h-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                entered && !textHidden ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              style={{
                columnWidth: '280px',
                columnGap: '3.5rem',
                paddingLeft: '4vw',
                paddingRight: '30vw',
                // Fades the far right edge so it reads as "there's more this
                // way" right from the start, before any scrolling has happened
                WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 97%)',
                maskImage: 'linear-gradient(to right, black 80%, transparent 97%)',
              }}
            >
              <PortableText
                value={text}
                className="text-left text-[#8B5F3C] text-[15px] sm:text-lg md:text-xl leading-relaxed [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
