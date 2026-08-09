'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const SECTIONS = [
  { id: 'about',    label: 'About',    href: '/about' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'calendar', label: 'Calendar', href: '/calendar' },
  { id: 'ironu',    label: 'Ìrònú',   href: '/ironu' },
  { id: 'contact',  label: 'Contact',  href: '/contact' },
]

export default function SideNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const isHome   = pathname === '/'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(!isHome)
  const [open, setOpen] = useState(false)

  const detectSection = useCallback(() => {
    // Only switches once a section's top has fully reached the top of the viewport,
    // i.e. the previous section has scrolled completely out of view
    let active = 0
    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id)
      if (!el) return
      if (window.scrollY >= el.offsetTop) active = i
    })
    setCurrentIndex(active)
    // Only reveal once the hero has been scrolled past into the about section
    const aboutEl = document.getElementById('about')
    setVisible(!!aboutEl && window.scrollY >= aboutEl.offsetTop - window.innerHeight * 0.3)
  }, [])

  useEffect(() => {
    if (!isHome) {
      setVisible(true)
      const idx = SECTIONS.findIndex(
        (s) => pathname.startsWith(s.href)
      )
      setCurrentIndex(idx === -1 ? 0 : idx)
      return
    }
    detectSection()
    window.addEventListener('scroll', detectSection, { passive: true })
    return () => window.removeEventListener('scroll', detectSection)
  }, [isHome, pathname, detectSection])

  function handleClick(i: number) {
    const s = SECTIONS[i]
    setOpen(false)
    if (isHome) {
      const el = document.getElementById(s.id)
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    router.push(s.href)
  }

  const current = SECTIONS[currentIndex]

  return (
    <div
      className={`fixed top-6 right-6 md:right-10 lg:right-14 z-[60] flex flex-col items-end transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-heading uppercase tracking-[0.25em] leading-none select-none font-semibold text-sm text-[#37C6F4] transition-colors duration-300"
      >
        {current.label}
      </button>

      <div
        className={`mt-4 flex flex-col items-end gap-3 origin-top transition-all duration-300 ease-in-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        {SECTIONS.map((section, i) => {
          const isCurrent = i === currentIndex
          const colour = isCurrent ? 'text-[#37C6F4]' : 'text-[#8B5F3C]/80'

          return (
            <button
              key={section.id}
              onClick={() => handleClick(i)}
              className={`uppercase tracking-widest transition-colors duration-300 leading-none select-none font-medium text-xs hover:opacity-100 ${
                isCurrent ? 'opacity-100' : 'opacity-70'
              } ${colour}`}
            >
              {section.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
