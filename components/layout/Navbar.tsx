'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [overHero, setOverHero] = useState(isHome)

  // The footer is rendered on every page via the root layout, so this runs
  // unconditionally rather than being gated by isHome.
  const [overFooter, setOverFooter] = useState(false)

  useEffect(() => {
    if (!isHome) return

    const heroEl = document.getElementById('hero')
    if (!heroEl) return

    let raf = 0
    let previous: boolean | undefined
    const updateFromScroll = () => {
      raf = 0
      const rect = heroEl.getBoundingClientRect()
      const next = rect.bottom > window.innerHeight * 0.55
      if (next !== previous) {
        previous = next
        setOverHero(next)
      }
    }

    const scheduleUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(updateFromScroll)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [isHome, pathname])

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

  const logoSrc = (isHome && overHero) || overFooter ? '/ikun-logo-white.png' : '/ikun-logo-black.png'
  const logoSizeClass = overFooter
    ? 'h-16 md:h-20'
    : isHome && overHero
      ? 'h-28 md:h-32'
      : isHome
        ? 'h-20 md:h-24'
        : 'h-28 md:h-32'

  return (
    <div className="z-navbar fixed -top-2 left-1/2 pointer-events-none -translate-x-1/2">
      <Link
        href="/"
        aria-label="Home"
        onClick={handleLogoClick}
        className="block pointer-events-auto hover:opacity-70 transition-opacity duration-200"
      >
        <div
          className={`transition-[height] duration-300 ease-out ${logoSizeClass}`}
          style={{ width: 'auto', aspectRatio: '2421/1754' }}
        >
          <Image
            src={logoSrc}
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
