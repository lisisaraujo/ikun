'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [hidden, setHidden]           = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)
  const lastYRef = useRef(0)

  // Close menu when navigating — setState during render is React's recommended
  // pattern for syncing state to a changing prop without an effect.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY
      const wasAtTop = lastYRef.current === 0

      setScrolled(currentY > 0)

      if (currentY <= 0) {
        setHidden(false)
      } else if (wasAtTop) {
        setHidden(true)
      } else if (currentY > lastYRef.current + 8) {
        setHidden(true)
      } else if (currentY < lastYRef.current - 8) {
        setHidden(false)
      }

      lastYRef.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const effectiveHidden = hidden && !menuOpen

  const isHome   = pathname === '/'
  const darkMode = isHome && !scrolled && !menuOpen

  const burgerBar = darkMode ? 'bg-[#F3F1EB]' : 'bg-[#0B0B0B]'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent ${effectiveHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-end pr-6 py-4 md:pr-10 lg:pr-16">

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
                  ${isActive
                    ? `text-[#37C6F4]`
                    : `${darkMode ? 'text-[#F3F1EB]/75' : 'text-[#8B5F3C]/65'}`
                  }`}
              >
                {isActive && <span className="nav-mark" aria-hidden="true" />}
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

      {/* Mobile menu */}
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
                      isActive ? 'text-[#37C6F4]' : 'text-[#8B5F3C]/65 hover:text-[#37C6F4]'
                    }`}
                  >
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
