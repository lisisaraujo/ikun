'use client'

import { useEffect, useRef, useState } from 'react'

// Tracks whether the page is currently being scrolled up or down, ignoring
// jitter smaller than `threshold` px so it doesn't flip on every tiny
// scroll-wheel tick
export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState<'up' | 'down'>('up')
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    let raf = 0

    const update = () => {
      raf = 0
      const y = window.scrollY
      const diff = y - lastY.current
      if (Math.abs(diff) > threshold) {
        setDirection(diff > 0 ? 'down' : 'up')
        lastY.current = y
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [threshold])

  return direction
}
