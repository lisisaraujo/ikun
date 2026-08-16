'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  // The footer is rendered on every page via the root layout, so this runs
  // unconditionally rather than being gated by isHome.
  const [overFooter, setOverFooter] = useState(false)
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
            src="/01_IKUN_Logo-with-name-beneath.png"
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
