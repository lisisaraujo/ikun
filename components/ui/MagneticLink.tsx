'use client'

import { useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import Link from 'next/link'

interface MagneticLinkProps {
  href: string
  className?: string
  children: ReactNode
  strength?: number
}

// Nudges itself toward the cursor while hovered, springs back on leave —
// direct DOM style writes (not React state) so it stays smooth at 60fps
export default function MagneticLink({ href, className, children, strength = 0.3 }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: 'transform 0.2s ease-out' }}
    >
      {children}
    </Link>
  )
}
