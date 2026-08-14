'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseCarouselTrackOptions {
  count: number
  // Fired whenever the centered card changes — from a button, the keyboard,
  // or a free swipe/scroll, since all three end up moving `centerIndex` the
  // same way. Used to nudge nearby ambient decorations (see
  // lib/carouselNavPulse.ts), not to drive the carousel itself.
  onNavigate?: (direction: 1 | -1) => void
}

// Shared scroll-tracking for a native-scroll, snap-centered carousel: which
// card is centered, how far (signed, in card-steps) every card currently
// sits from that center, and the step/keyboard navigation that moves it.
// Both ProjectsCarousel and IronuCarousel are driven by this — same
// underlying interaction, just different card content.
export function useCarouselTrack({ count, onNavigate }: UseCarouselTrackOptions) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const [signedDistances, setSignedDistances] = useState<number[]>(() => new Array(count).fill(0))
  const [centerIndex, setCenterIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  // Scales rotation/vertical-offset down on narrow viewports — see
  // carouselMotion.ts. 1 once the viewport is comfortably wide.
  const [intensity, setIntensity] = useState(1)

  const setCardRef = useCallback((i: number) => (el: HTMLElement | null) => {
    cardRefs.current[i] = el
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      const center = el.scrollLeft + el.clientWidth / 2

      // The actual measured distance between two adjacent card centers, so
      // "1 step" always means "one card over" regardless of the current
      // breakpoint's card width/gap — never a guess at layout.
      const first = cardRefs.current[0]
      const second = cardRefs.current[1]
      const pitch = first && second
        ? Math.abs((second.offsetLeft + second.offsetWidth / 2) - (first.offsetLeft + first.offsetWidth / 2))
        : el.clientWidth / 2 || 1

      let nearestIndex = 0
      let nearestAbs = Infinity
      const next = cardRefs.current.map((card, i) => {
        if (!card) return 0
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const signed = (cardCenter - center) / pitch
        if (Math.abs(signed) < nearestAbs) {
          nearestAbs = Math.abs(signed)
          nearestIndex = i
        }
        return signed
      })

      setSignedDistances(next)
      setCenterIndex(nearestIndex)
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
      setIntensity(Math.min(1, el.clientWidth / 900))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // Center the second card (not the first) on load, so there's already
    // one card before and one after it in view from the start.
    const initial = cardRefs.current[Math.min(1, count - 1)]
    if (initial) {
      el.scrollLeft = initial.offsetLeft + initial.offsetWidth / 2 - el.clientWidth / 2
    }

    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [count])

  // Fires `onNavigate` whenever the centered card actually changes, however
  // that happened (button, keyboard, or a free swipe past the midpoint) —
  // one place to detect "the carousel moved," rather than instrumenting
  // every possible trigger separately.
  const prevCenterRef = useRef(centerIndex)
  useEffect(() => {
    if (centerIndex !== prevCenterRef.current) {
      onNavigate?.(centerIndex > prevCenterRef.current ? 1 : -1)
      prevCenterRef.current = centerIndex
    }
  }, [centerIndex, onNavigate])

  const scrollByAmount = useCallback((dir: 1 | -1) => {
    const nextIndex = Math.min(Math.max(centerIndex + dir, 0), count - 1)
    if (nextIndex === centerIndex) return
    cardRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [centerIndex, count])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByAmount(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByAmount(-1) }
  }, [scrollByAmount])

  return {
    scrollerRef,
    setCardRef,
    signedDistances,
    centerIndex,
    canScrollLeft,
    canScrollRight,
    intensity,
    scrollByAmount,
    onKeyDown,
  }
}
