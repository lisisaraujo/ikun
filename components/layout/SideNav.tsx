'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

// `routePrefix` maps a standalone route (a project, an Ìrònú post, or the
// full calendar listing) back to the home section it belongs to, so the
// trigger still shows the right current label when you're deep on that
// page instead of home.
const SECTIONS = [
  { id: 'about',    label: 'About',    href: '/#about' },
  { id: 'projects', label: 'Projects', href: '/#projects', routePrefix: '/projects' },
  { id: 'calendar', label: 'Calendar', href: '/#calendar', routePrefix: '/calendar' },
  { id: 'ironu',    label: 'Ìrònú',   href: '/#ironu',    routePrefix: '/ironu' },
  { id: 'contact',  label: 'Contact',  href: '/#contact' },
]

export default function SideNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const isHome   = pathname === '/'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(!isHome)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Closes the menu on an outside tap/click — the only reliable close signal
  // on touch devices, which never fire `mouseleave`.
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  // Closes on Escape for keyboard users.
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Locks background scroll while the full-screen mobile menu is open. Only
  // matters below the `md` breakpoint — the desktop hover dropdown doesn't
  // cover the page, so scrolling underneath it should stay possible.
  useEffect(() => {
    if (!open || typeof window === 'undefined') return
    if (!window.matchMedia('(max-width: 767px)').matches) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  useEffect(() => {
    if (!isHome) {
      setVisible(true)
      const idx = SECTIONS.findIndex(
        (s) => s.routePrefix && pathname.startsWith(s.routePrefix)
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
      // Sections are `position: sticky` and stacked several deep. A native
      // *smooth* scroll that jumps across multiple of them at once can leave
      // their stuck/unstuck state out of sync mid-animation (some browsers
      // don't fully recompute every sticky element on each animation frame),
      // which is what caused two unrelated sections to render on screen at
      // once. An instant jump has no "mid-animation" for that to happen in —
      // the browser only ever has to get the final, single scroll position
      // right, which it always does correctly. Must be `behavior: 'instant'`,
      // not `'auto'` — `app/globals.css` sets `scroll-behavior: smooth` on
      // `<html>`, and `'auto'` defers to that CSS (silently turning this back
      // into the smooth, desyncing scroll this comment warns against).
      // `'instant'` always bypasses the CSS setting. The `+ 1` lands just
      // past the section's exact top edge — the IntersectionObserver below
      // watches a razor-thin (0px-tall) line at the very top of the
      // viewport, so landing exactly ON a boundary makes the outgoing and
      // incoming section tie for "intersecting" and the wrong one can win.
      if (el) { window.scrollTo({ top: el.offsetTop + 1, behavior: 'instant' }); return }
    }
    router.push(s.href)
  }

  const current = SECTIONS[currentIndex]

  return (
    <div ref={rootRef}>
      {/* ── Desktop / tablet — hover pill + dropdown card ─────────────── */}
      <div
        className={`hidden md:flex fixed top-0 right-6 md:right-10 lg:right-14 z-[65] h-28 md:h-32 pt-1 flex-col items-end justify-center transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="relative">
          {/* Trigger — a bordered, filled pill so it unmistakably reads as a
              button rather than a stray label, with a chevron that flips to
              signal open/closed state. */}
          <button
            onClick={() => setOpen(true)}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="side-nav-menu"
            className="group flex items-center gap-2.5 rounded-full border border-[#37C6F4]/30 bg-[#0B0B0B]/55 backdrop-blur-md pl-3.5 pr-3 py-2.5 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.5)] hover:border-[#37C6F4]/60 hover:bg-[#0B0B0B]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60 transition-colors duration-300"
          >
            <span className="font-heading uppercase tracking-[0.2em] leading-none select-none font-semibold text-sm text-[#37C6F4]">
              {current.label}
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`w-3.5 h-3.5 stroke-current text-[#37C6F4] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              fill="none" strokeWidth={2} aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Panel — a solid card, not floating bare text. */}
          <div
            id="side-nav-menu"
            role="menu"
            className={`absolute right-0 top-full mt-3 w-48 rounded-2xl border border-[#37C6F4]/20 bg-[#0B0B0B]/85 backdrop-blur-md shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6)] overflow-hidden origin-top-right transition-all duration-300 ease-in-out ${
              open
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}
          >
            {SECTIONS.map((section, i) => {
              const isCurrent = i === currentIndex

              return (
                <button
                  key={section.id}
                  role="menuitem"
                  aria-current={isCurrent ? 'true' : undefined}
                  onClick={() => handleClick(i)}
                  className={`flex items-center justify-between gap-3 w-full px-4 py-3.5 text-left uppercase tracking-widest text-[13px] font-medium transition-colors duration-200 ${
                    isCurrent
                      ? 'text-[#37C6F4] bg-[#37C6F4]/10'
                      : 'text-[#F3F1EB]/75 hover:text-[#F3F1EB] hover:bg-white/5'
                  }`}
                >
                  {section.label}
                  {isCurrent && <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#37C6F4]" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile — hamburger trigger ─────────────────────────────────
          Same slot (top-6 right-6, 40px) the hero video's pause/play button
          occupies before you've scrolled into a section, so this reads as a
          clean handoff in that corner rather than two controls competing
          for it — see the z-[51] note in HeroVideo.tsx. */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mobile-side-nav-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className={`md:hidden fixed top-6 right-6 z-[80] flex items-center justify-center w-10 h-10 rounded-full border border-[#37C6F4]/30 bg-[#0B0B0B]/60 backdrop-blur-md shadow-[0_4px_20px_-6px_rgba(0,0,0,0.5)] transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="relative w-5 h-4 block shrink-0">
          <span
            className={`absolute left-0 w-5 h-0.5 rounded-full bg-[#37C6F4] transition-all duration-300 ${
              open ? 'top-[7px] rotate-45' : 'top-0'
            }`}
          />
          <span
            className={`absolute left-0 top-[7px] w-5 h-0.5 rounded-full bg-[#37C6F4] transition-opacity duration-200 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 w-5 h-0.5 rounded-full bg-[#37C6F4] transition-all duration-300 ${
              open ? 'top-[7px] -rotate-45' : 'top-[14px]'
            }`}
          />
        </span>
      </button>

      {/* ── Mobile — full-screen takeover menu ──────────────────────────
          Centered items, opened by the hamburger above. Kept mounted
          (rather than conditionally rendered) so the fade/scale transition
          plays on both open and close. */}
      <div
        id="mobile-side-nav-menu"
        role="menu"
        aria-hidden={!open}
        className={`md:hidden fixed inset-0 z-[75] flex flex-col items-center justify-center gap-2 bg-[#0B0B0B]/97 backdrop-blur-lg transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {SECTIONS.map((section, i) => {
          const isCurrent = i === currentIndex

          return (
            <button
              key={section.id}
              role="menuitem"
              aria-current={isCurrent ? 'true' : undefined}
              onClick={() => handleClick(i)}
              className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 ease-out ${
                open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }}
            >
              <span
                className={`font-heading uppercase tracking-[0.15em] text-3xl font-semibold ${
                  isCurrent ? 'text-[#37C6F4]' : 'text-[#F3F1EB]/80'
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
