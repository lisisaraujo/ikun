'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useReducedMotion } from '@/lib/useReducedMotion'

const NAV_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const ITEM_SPREAD = 42
const SCROLL_COLLAPSE_THRESHOLD = 72
const COLLAPSE_ANIMATION_MS = 1050

const SECTIONS = [
  { id: 'ikun', label: 'Ikun', href: '/#hero' },
  { id: 'projects', label: 'Projects', href: '/#projects', routePrefix: '/projects' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'calendar', label: 'Calendar', href: '/#calendar', routePrefix: '/calendar' },
  { id: 'ironu', label: 'Ìrònú', href: '/#ironu', routePrefix: '/ironu' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
]

export default function SideNav() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const lastScrollYRef = useRef(0)
  const openRef = useRef(false)
  const expandedRef = useRef(isHome)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [autoExpanded, setAutoExpanded] = useState(isHome)
  const expanded = open || autoExpanded
  const [collapseAnimating, setCollapseAnimating] = useState(false)
  const [prevExpanded, setPrevExpanded] = useState(expanded)
  if (prevExpanded !== expanded) {
    setPrevExpanded(expanded)
    if (!expanded) setCollapseAnimating(true)
  }

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    expandedRef.current = expanded
    if (expanded) lastScrollYRef.current = window.scrollY
  }, [expanded])

  useEffect(() => {
    if (!collapseAnimating) return
    const timeout = setTimeout(() => setCollapseAnimating(false), COLLAPSE_ANIMATION_MS)
    return () => clearTimeout(timeout)
  }, [collapseAnimating])

  const [prevRouteKey, setPrevRouteKey] = useState(`${isHome}:${pathname}`)
  const routeKey = `${isHome}:${pathname}`
  if (prevRouteKey !== routeKey) {
    setPrevRouteKey(routeKey)
    setOpen(false)
    setAutoExpanded(isHome)
    if (!isHome) {
      const idx = SECTIONS.findIndex((section) => (
        section.routePrefix && pathname.startsWith(section.routePrefix)
      ))
      setCurrentIndex(idx === -1 ? 0 : idx)
    }
  }

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    if (!open || typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 767px)').matches) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  useEffect(() => {
    if (!isHome) return

    let raf = 0
    const update = () => {
      raf = 0
      const scrollDelta = Math.abs(window.scrollY - lastScrollYRef.current)

      const y = window.scrollY + window.innerHeight * 0.32
      let active = 0

      SECTIONS.forEach((section, index) => {
        const el = document.getElementById(section.id)
        if (el && y >= el.offsetTop) active = index
      })

      if (expandedRef.current && scrollDelta > SCROLL_COLLAPSE_THRESHOLD) {
        if (openRef.current) setOpen(false)
        setAutoExpanded(false)
        lastScrollYRef.current = window.scrollY
      }

      setCurrentIndex(active)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    lastScrollYRef.current = window.scrollY
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isHome])

  function navigateTo(index: number) {
    const section = SECTIONS[index]
    setOpen(false)

    if (isHome) {
      if (section.id === 'ikun') {
        setAutoExpanded(false)
        window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }

      const el = document.getElementById(section.id)
      if (el) {
        window.scrollTo({ top: el.offsetTop + 1, behavior: 'instant' })
        return
      }
    }

    router.push(section.href)
  }

  function handleDesktopClick(index: number) {
    if (!expanded) {
      setOpen(true)
      return
    }
    navigateTo(index)
  }

  return (
    <div ref={rootRef}>
      <nav
        aria-label="Section navigation"
        className="hidden md:block fixed right-6 top-[4.25rem] z-[70] h-[18rem] w-[15rem] md:right-10 lg:right-14"
      >
        {SECTIONS.map((section, index) => {
          const isCurrent = index === currentIndex
          const expandedY = index * ITEM_SPREAD
          const distanceFromCurrent = Math.abs(index - currentIndex)
          const y = expanded ? expandedY : 0
          const delay = expanded ? index * 45 : collapseAnimating ? distanceFromCurrent * 70 : 0
          const visible = expanded || isCurrent
          const transformDuration = expanded ? 1100 : collapseAnimating ? 1000 : 260
          const opacityDuration = expanded ? 950 : collapseAnimating ? 980 : 320
          const filterDuration = expanded ? 1000 : collapseAnimating ? 980 : 320

          return (
            <button
              key={section.id}
              type="button"
              aria-current={isCurrent ? 'true' : undefined}
              aria-expanded={isCurrent ? expanded : undefined}
              onClick={() => handleDesktopClick(index)}
              className="group absolute right-0 top-0 flex items-center justify-end gap-2 whitespace-nowrap text-right focus-visible:outline-none"
              style={{
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
                transform: `translate3d(0, ${y}px, 0)`,
                filter: reducedMotion ? 'none' : visible ? 'blur(0px)' : 'blur(2px)',
                transition: reducedMotion
                  ? 'opacity 180ms ease-out, color 180ms ease-out'
                  : `transform ${transformDuration}ms ${NAV_EASE} ${delay}ms, opacity ${opacityDuration}ms ${NAV_EASE} ${delay}ms, filter ${filterDuration}ms ${NAV_EASE} ${delay}ms, color 250ms ${NAV_EASE}`,
              }}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full bg-[#37C6F4] transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70'
                  }`}
              />
              <span
                className={`font-[family-name:var(--font-heading)] text-base font-light uppercase tracking-[0.14em] transition-colors duration-300 lg:text-xl ${isCurrent
                    ? 'text-[#37C6F4]'
                    : 'text-[#F3F1EB]/80 group-hover:text-[#37C6F4] group-focus-visible:text-[#37C6F4]'
                  }`}
              >
                {section.label}
              </span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full bg-[#37C6F4] transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70'
                  }`}
              />
            </button>
          )
        })}
      </nav>

      <button
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mobile-side-nav-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="md:hidden fixed top-6 right-6 z-[80] flex h-10 w-10 items-center justify-center rounded-full border border-[#37C6F4]/30 bg-[#0B0B0B]/60 backdrop-blur-md shadow-[0_4px_20px_-6px_rgba(0,0,0,0.5)]"
      >
        <span className="relative block h-4 w-5 shrink-0">
          <span className={`absolute left-0 h-0.5 w-5 rounded-full bg-[#37C6F4] transition-all duration-300 ${open ? 'top-[7px] rotate-45' : 'top-0'}`} />
          <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-[#37C6F4] transition-opacity duration-200 ${open ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`absolute left-0 h-0.5 w-5 rounded-full bg-[#37C6F4] transition-all duration-300 ${open ? 'top-[7px] -rotate-45' : 'top-[14px]'}`} />
        </span>
      </button>

      <div
        id="mobile-side-nav-menu"
        role="menu"
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-[75] flex flex-col items-center justify-center gap-2 bg-[#0B0B0B]/97 backdrop-blur-lg transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {SECTIONS.map((section, index) => {
          const isCurrent = index === currentIndex

          return (
            <button
              key={section.id}
              role="menuitem"
              aria-current={isCurrent ? 'true' : undefined}
              onClick={() => navigateTo(index)}
              className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 ease-out ${open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              style={{ transitionDelay: open ? `${index * 40}ms` : '0ms' }}
            >
              <span
                className={`font-heading text-3xl font-semibold uppercase tracking-[0.15em] ${isCurrent ? 'text-[#37C6F4]' : 'text-[#F3F1EB]/80'
                  }`}
              >
                {section.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
