'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Matches the background each home-page section is actually painted with —
// SectionBackdrop uses #1C2433 (blue) for about/calendar/contact and
// #8B5F3C (brown) for projects/ironu.
const SECTION_LOGO: Record<string, 'white' | 'black'> = {
  about: 'white',
  projects: 'black',
  calendar: 'white',
  ironu: 'black',
  contact: 'white',
}
const SECTION_IDS = Object.keys(SECTION_LOGO)

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  // Still in the hero (before any of the sections below have been reached)
  // defaults to white — same near-black background as before.
  const [homeLogo, setHomeLogo] = useState<'white' | 'black'>('white')

  // Tracks which section currently sits under the fixed logo so its color
  // always matches that section's own background — the same top-of-viewport
  // crossing trick SideNav uses to track the active section.
  useEffect(() => {
    if (!isHome) return

    const entered: Record<string, boolean> = {}

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { entered[entry.target.id] = entry.isIntersecting })
        let active: string | null = null
        SECTION_IDS.forEach((id) => { if (entered[id]) active = id })
        setHomeLogo(active ? SECTION_LOGO[active] : 'white')
      },
      { rootMargin: '0px 0px -100% 0px', threshold: 0 }
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [isHome])

  // Independent of page/color tracking above, and independent of route —
  // the footer (id="footer") is rendered on every page via the root
  // layout, so this runs unconditionally rather than being gated by isHome.
  const [overFooter, setOverFooter] = useState(false)

  // The footer's own backdrop is always the same dark navy regardless of
  // page, so it overrides whatever color the rest of the page would call
  // for — otherwise a black logo (the default on every non-home route)
  // would go invisible against it.
  const useWhite = overFooter ? true : isHome ? homeLogo === 'white' : false
  useEffect(() => {
    const footerEl = document.getElementById('footer')
    if (!footerEl) return

    const observer = new IntersectionObserver(
      ([entry]) => setOverFooter(entry.isIntersecting),
      { threshold: 0.25 }
    )
    observer.observe(footerEl)
    return () => observer.disconnect()
  }, [pathname])

  function handleLogoClick(e: React.MouseEvent) {
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed top-0 left-1/2 z-[65] pt-1 pointer-events-none -translate-x-1/2">
      <Link
        href="/"
        aria-label="Home"
        onClick={handleLogoClick}
        className="block pointer-events-auto hover:opacity-70 transition-opacity duration-200"
      >
        <div
          className={`transition-[height] duration-300 ease-out ${overFooter ? 'h-56 md:h-64' : 'h-28 md:h-32'}`}
          style={{ width: 'auto', aspectRatio: '2421/1754' }}
        >
          <Image
            src={useWhite ? '/ikun-logo-white.png' : '/ikun-logo-black.png'}
            alt="IKUN"
            width={2421}
            height={1754}
            priority
            style={{ height: '100%', width: 'auto' }}
          />
        </div>
      </Link>
    </div>
  )
}
