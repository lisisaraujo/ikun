'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LogoMark() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 0) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'
  const useWhite = isHome && !scrolled

  return (
<Link href="/" aria-label="Home" className="block transition-opacity duration-200 hover:opacity-70">
  <div className="h-34 md:h-40" style={{ width: 'auto', aspectRatio: '2421/1754' }}>
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
  )
}
