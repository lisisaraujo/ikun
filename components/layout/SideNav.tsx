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

const ITEM_H = 38

export default function SideNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const isHome   = pathname === '/'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [onDark, setOnDark] = useState(isHome)

  const detectSection = useCallback(() => {
    const viewCenter = window.scrollY + window.innerHeight / 2
    let active = 0
    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id)
      if (!el) return
      if (el.offsetTop <= viewCenter) active = i
    })
    setCurrentIndex(active)
    // Dark when still mostly on the hero (before about section)
    const aboutEl = document.getElementById('about')
    setOnDark(!aboutEl || window.scrollY < aboutEl.offsetTop - window.innerHeight * 0.3)
  }, [])

  useEffect(() => {
    if (!isHome) {
      setOnDark(false)
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
    if (isHome) {
      const el = document.getElementById(s.id)
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    router.push(s.href)
  }

  const translateY = -(currentIndex * ITEM_H + ITEM_H / 2)

  return (
    <div className="fixed right-6 md:right-10 lg:right-14 z-[60]" style={{ top: '50vh' }}>
      <div
        className="flex flex-col items-end transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {SECTIONS.map((section, i) => {
          const dist = Math.abs(i - currentIndex)

          const fontSize =
            dist === 0 ? 'text-sm'     :
            dist === 1 ? 'text-xs'     :
            dist === 2 ? 'text-[11px]' :
                         'text-[10px]'

          const colour =
            dist === 0
              ? onDark ? 'text-white' : 'text-[#37C6F4]'
              : onDark ? 'text-white' : 'text-[#8B5F3C]'

          const opacity =
            dist === 0 ? 1    :
            dist === 1 ? 0.45 :
            dist === 2 ? 0.25 :
            dist === 3 ? 0.15 :
                         0.08

          return (
            <div key={section.id} style={{ height: ITEM_H }} className="flex items-center justify-end">
              <button
                onClick={() => handleClick(i)}
                style={{ opacity }}
                className={`text-right uppercase tracking-widest transition-all duration-500 leading-none select-none font-medium hover:opacity-100 ${fontSize} ${colour}`}
              >
                {section.label}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
