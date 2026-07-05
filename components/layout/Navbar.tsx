'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav'
import { SITE_NAME } from '@/constants/site'

export default function Navbar() {
  const pathname  = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden]     = useState(false)
  const lastYRef = useRef(0)

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY
      const wasAtTop = lastYRef.current === 0

      setScrolled(currentY > 0)

      if (currentY <= 0) {
        setHidden(false)
      } else if (wasAtTop) {
        // Leaving y=0: batch hidden+scrolled in the same render to avoid a bg flash
        setHidden(true)
      } else if (currentY > lastYRef.current + 8 && !menuOpen) {
        setHidden(true)
      } else if (currentY < lastYRef.current - 8) {
        setHidden(false)
      }

      lastYRef.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  useEffect(() => { if (menuOpen) setHidden(false) }, [menuOpen])
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isHome   = pathname === '/'
  const darkMode = isHome && !scrolled && !menuOpen

  const navBg = darkMode
    ? 'bg-transparent'
    : 'bg-[#F3F1EB] border-b border-[#0B0B0B]/8'

  const logoClass     = darkMode ? 'text-[#F3F1EB] hover:text-[#37C6F4]' : 'text-[#0B0B0B] hover:text-[#37C6F4]'
  const baseLinkClass = darkMode ? 'text-[#F3F1EB]/75 hover:text-[#37C6F4]' : 'text-[#0B0B0B]/65 hover:text-[#37C6F4]'
  const burgerBar     = darkMode ? 'bg-[#F3F1EB]' : 'bg-[#0B0B0B]'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">

        {/* Logo */}
        <Link
          href="/"
          className={`font-[family-name:var(--font-heading)] text-xl font-800 tracking-tight transition-colors duration-200 ${logoClass}`}
        >
          {SITE_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`relative inline-block text-sm font-medium tracking-wide transition-colors duration-200
                  hover:text-[#37C6F4]
                  after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px]
                  after:bg-[#37C6F4] after:transition-[transform,opacity] after:duration-200 after:origin-left
                  ${isActive
                    ? 'text-[#37C6F4] after:scale-x-100 after:opacity-100'
                    : `${darkMode ? 'text-[#F3F1EB]/75' : 'text-[#0B0B0B]/65'} after:scale-x-0 after:opacity-0 hover:after:scale-x-100 hover:after:opacity-100`
                  }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block h-0.5 w-6 transition-all duration-200 ${burgerBar} ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 transition-opacity duration-200 ${burgerBar} ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 transition-all duration-200 ${burgerBar} ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu — solid background for readability */}
      {menuOpen && (
        <nav
          className="md:hidden border-t border-[#0B0B0B]/8 bg-[#F3F1EB] px-6 pb-6 pt-3"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 text-base font-medium transition-colors duration-200 ${
                      isActive ? 'text-[#37C6F4]' : 'text-[#0B0B0B]/65 hover:text-[#37C6F4]'
                    }`}
                  >
                    {/* Left accent bar replaces the dot */}
                    <span
                      className={`inline-block w-[2px] h-4 flex-shrink-0 rounded-full transition-colors duration-200 ${
                        isActive ? 'bg-[#37C6F4]' : 'bg-[#C9C9C9]/50'
                      }`}
                      aria-hidden="true"
                    />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
