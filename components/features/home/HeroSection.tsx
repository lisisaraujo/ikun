'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export default function HeroSection({ children }: { children: ReactNode }) {
  // Hero is sticky (pinned behind every other section), so once scrolled past
  // it's faded out entirely — otherwise it'd keep showing through anything
  // with a translucent background further down the page. The intro-text
  // section sits directly after this one and is deliberately transparent so
  // the video shows through it — that's a second full viewport of scroll
  // where the hero must stay visible, hence *2 instead of the hero's own height.
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY >= window.innerHeight * 2)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="hero"
      className={`sticky top-0 z-0 h-screen bg-[#0B0B0B] transition-opacity duration-300 ${
        pastHero ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {children}
    </section>
  )
}
