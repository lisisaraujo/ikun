'use client'

import { useEffect, useRef, useState } from 'react'

// A soft blue glow that trails the cursor and blooms open over anything
// clickable — layered on top of the existing branded cursor image, not a
// replacement for it. Skips itself entirely on touch devices.
export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      const el = dotRef.current
      if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    const isInteractive = (target: EventTarget | null) =>
      target instanceof HTMLElement && !!target.closest('a, button, [role="button"], input, textarea, select')

    const onOver = (e: MouseEvent) => { if (isInteractive(e.target)) setActive(true) }
    const onOut = (e: MouseEvent) => { if (isInteractive(e.target)) setActive(false) }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  if (!enabled) return null

  const size = active ? 30 : 8

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[999] pointer-events-none rounded-full"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        backgroundColor: '#37C6F4',
        opacity: active ? 0.5 : 0.35,
        boxShadow: active ? '0 0 22px rgba(55,198,244,0.65)' : '0 0 8px rgba(55,198,244,0.4)',
        transition: 'width 0.2s ease-out, height 0.2s ease-out, margin 0.2s ease-out, opacity 0.2s ease-out, box-shadow 0.2s ease-out',
      }}
    />
  )
}
