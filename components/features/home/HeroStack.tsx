'use client'

import { useEffect, useRef } from 'react'
import HeroSection from './HeroSection'
import HeroVideo from './HeroVideo'

interface HeroStackProps {
  playbackId: string | null
}

export default function HeroStack({ playbackId }: HeroStackProps) {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      const hero = heroRef.current
      if (hero) {
        hero.style.position = 'relative'
        hero.style.zIndex = '10'
      }
      return
    }

    let frame = 0
    const updateCover = () => {
      frame = 0
      const hero = heroRef.current
      if (!hero) return

      const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.8), 0), 1)
      const lift = progress * -100
      const scale = 1 - progress * 0.025

      hero.style.transform = `translate3d(0, ${lift}%, 0) scale(${scale})`
      hero.style.opacity = `${1 - progress * 0.08}`
      hero.style.zIndex = progress < 0.48 ? '30' : '10'
      hero.style.pointerEvents = progress < 0.48 ? 'auto' : 'none'
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateCover)
    }

    updateCover()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <HeroSection ref={heroRef}>
      <div className="absolute inset-0 overflow-hidden">
        {playbackId && <HeroVideo playbackId={playbackId} />}
      </div>

    </HeroSection>
  )
}
