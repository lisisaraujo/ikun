'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface KineticHeadingProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2'
}

// A heading that arrives with a "breathing in" entrance — wide, light
// tracking that settles to normal as it scrolls into view — and then keeps
// a faint pulse of life by tilting a few degrees toward the cursor. Two of
// the reference feedback's asks (kinetic type, cursor-responsive type)
// share one mechanism: both are just the heading reacting to something,
// entrance once, cursor continuously.
export default function KineticHeading({ children, className = '', as = 'h2' }: KineticHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [entered, setEntered] = useState(false)
  const Tag = as

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Skips itself on touch devices — there's no cursor to respond to, and
  // the entrance animation above already carries the "alive" feeling.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover)').matches) return
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 420))
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 420))
      el.style.setProperty('--kinetic-skew', `${dx * 2.5}deg`)
      el.style.setProperty('--kinetic-lift', `${-dy * 3}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <Tag
      ref={ref}
      className={`inline-block transition-[letter-spacing,opacity,font-weight] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
      style={{
        letterSpacing: entered ? 'normal' : '0.2em',
        opacity: entered ? 1 : 0,
        transform: 'skewX(var(--kinetic-skew, 0deg)) translateY(var(--kinetic-lift, 0px))',
        transitionProperty: 'letter-spacing, opacity, transform',
        transitionDuration: '1100ms, 1100ms, 400ms',
        transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {children}
    </Tag>
  )
}
