'use client'

import { useEffect, useRef, useState } from 'react'

// A soft blue glow that trails the cursor and blooms open over anything
// clickable — layered on top of the existing branded cursor image, not a
// replacement for it. Skips itself entirely on touch devices.
export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return

    const enableFrame = window.requestAnimationFrame(() => setEnabled(true))

    const onMove = (e: MouseEvent) => {
      const el = dotRef.current
      if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }
    const isInteractive = (target: EventTarget | null) =>
      target instanceof HTMLElement && !!target.closest('a, button, [role="button"], input, textarea, select')

    const setActive = (active: boolean, tone: 'blue' | 'warm' = 'blue') => {
      const el = dotRef.current
      if (!el) return
      el.dataset.active = active ? 'true' : 'false'
      const size = active ? 16 : 5
      const color = tone === 'warm' ? '#A06B43' : '#37C6F4'
      const shadow = tone === 'warm'
        ? '0 0 12px rgba(160,107,67,0.42)'
        : '0 0 12px rgba(55,198,244,0.42)'
      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.marginLeft = `${-size / 2}px`
      el.style.marginTop = `${-size / 2}px`
      el.style.opacity = active ? '0.42' : '0.28'
      el.style.backgroundColor = color
      el.style.boxShadow = active ? shadow : `0 0 5px ${tone === 'warm' ? 'rgba(160,107,67,0.25)' : 'rgba(55,198,244,0.28)'}`
    }
    const onOver = (e: MouseEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null
      const interactive = target?.closest('a, button, [role="button"], input, textarea, select')
      if (!interactive) return
      const tone = interactive.closest('[data-cursor-tone="warm"]') ? 'warm' : 'blue'
      setActive(true, tone)
    }
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target) && !(e.relatedTarget instanceof Node && (e.target as Element).contains(e.relatedTarget))) {
        setActive(false)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      window.cancelAnimationFrame(enableFrame)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="z-cursor fixed top-0 left-0 pointer-events-none rounded-full"
      data-active="false"
      style={{
        width: 5,
        height: 5,
        marginLeft: -2.5,
        marginTop: -2.5,
        backgroundColor: '#37C6F4',
        opacity: 0.28,
        boxShadow: '0 0 5px rgba(55,198,244,0.25)',
        transition: 'width 0.2s ease-out, height 0.2s ease-out, margin 0.2s ease-out, opacity 0.2s ease-out, box-shadow 0.2s ease-out',
      }}
    />
  )
}
