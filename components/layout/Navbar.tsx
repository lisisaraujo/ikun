'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/nav'
import { SITE_NAME } from '@/constants/site'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll so the nav gains a background on non-hero pages
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isHome = pathname === '/'
  const navBg = (!isHome || scrolled || menuOpen)
    ? 'bg-[#1C2433] shadow-md'
    : 'bg-transparent'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
        {/* Logo / wordmark */}
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-xl font-800 tracking-tight text-[#F3F1EB] hover:text-[#37C6F4] transition-colors"
        >
          {SITE_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname.startsWith(href)
                  ? 'text-[#37C6F4]'
                  : 'text-[#C9C9C9] hover:text-[#F3F1EB]'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-[#F3F1EB] transition-transform duration-200 ${
              menuOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#F3F1EB] transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#F3F1EB] transition-transform duration-200 ${
              menuOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/10 bg-[#1C2433] px-6 pb-6 pt-2">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block text-base font-medium transition-colors ${
                    pathname.startsWith(href)
                      ? 'text-[#37C6F4]'
                      : 'text-[#C9C9C9] hover:text-[#F3F1EB]'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
