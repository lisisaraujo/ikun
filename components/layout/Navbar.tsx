'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrollDirection } from '@/hooks/useScrollDirection'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const direction = useScrollDirection()

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 0) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome   = pathname === '/'
  const useWhite = isHome && !scrolled
  // Stay visible near the very top regardless of direction, otherwise hide
  // on the way down and reappear as soon as the user scrolls back up
  const hidden = scrolled && direction === 'down'

  function handleLogoClick(e: React.MouseEvent) {
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div
      className="fixed top-0 left-1/2 z-[60] pt-1 pointer-events-none transition-transform duration-300 ease-out"
      style={{ transform: hidden ? 'translate(-50%, -100%)' : 'translate(-50%, 0)' }}
    >
      <Link
        href="/"
        aria-label="Home"
        onClick={handleLogoClick}
        className="block pointer-events-auto hover:opacity-70 transition-opacity duration-200"
      >
        <div className="h-28 md:h-32" style={{ width: 'auto', aspectRatio: '2421/1754' }}>
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
