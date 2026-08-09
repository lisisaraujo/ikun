'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (!isHome) {
      setVisible(true)
      const idx = SECTIONS.findIndex(
        (s) => pathname.startsWith(s.href)
      )
      setCurrentIndex(idx === -1 ? 0 : idx)
      return
    }

    // A section counts as "entered" the instant its top edge crosses the top of
    // the viewport — the same geometric line the stitched SectionSeam sits on —
    // by shrinking the observer's root to a single line at the very top via
    // rootMargin, so this fires exactly on that crossing rather than lagging
    // behind scroll events.
    const entered = new Array(SECTIONS.length).fill(false)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = SECTIONS.findIndex((s) => s.id === entry.target.id)
          if (idx !== -1) entered[idx] = entry.isIntersecting
        })
        let active = 0
        entered.forEach((isEntered, i) => { if (isEntered) active = i })
        setCurrentIndex(active)
        setVisible(entered.some(Boolean))
      },
      { rootMargin: '0px 0px -100% 0px', threshold: 0 }
    )

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [isHome, pathname])

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
      className={`fixed top-0 right-6 md:right-10 lg:right-14 z-[60] h-28 md:h-32 pt-1 flex flex-col items-end justify-center transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="group flex items-baseline gap-2"
        >
          <span className="font-heading text-[10px] tabular-nums text-[#37C6F4]/50 group-hover:text-[#37C6F4]/80 transition-colors duration-300">
            0{currentIndex + 1}
          </span>
          <span className="relative font-heading uppercase tracking-[0.25em] leading-none select-none font-semibold text-sm text-[#37C6F4] transition-colors duration-300">
            {current.label}
            <span className="absolute left-0 -bottom-1.5 h-px w-full bg-[#37C6F4]/40 group-hover:bg-[#37C6F4] transition-colors duration-300" />
          </span>
        </button>

        <div
          className={`absolute right-0 top-full mt-4 flex flex-col items-end gap-3 origin-top transition-all duration-300 ease-in-out ${
            open
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-1 pointer-events-none'
          }`}
        >
          {SECTIONS.map((section, i) => {
            const isCurrent = i === currentIndex
            const colour = isCurrent ? 'text-[#37C6F4]' : 'text-[#F3F1EB]/80'

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
    </div>
  )
}
