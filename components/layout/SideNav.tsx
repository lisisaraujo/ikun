'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useReducedMotion } from '@/lib/useReducedMotion'

const PANEL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

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
  const firstItemRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()

  // Desktop panel's masked item reveal — resets the instant the panel
  // starts closing (render-time "adjust state" pattern, not an effect,
  // since the closing transition needs to start on the very same render).
  const [itemsRevealed, setItemsRevealed] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (!open) setItemsRevealed(false)
    else if (reducedMotion) setItemsRevealed(true)
  }

  useEffect(() => {
    if (!open || reducedMotion) return
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setItemsRevealed(true))
    })
    return () => cancelAnimationFrame(raf)
  }, [open, reducedMotion])

  // Moves focus into the panel for keyboard users — not a focus trap (this
  // is navigation, not a modal), just a sensible landing spot on open.
  useEffect(() => {
    if (open) firstItemRef.current?.focus()
  }, [open])

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

  // Off-home, the current section is a pure function of `pathname` — no DOM
  // observation needed — so it's derived during render (React's documented
  // "adjust state when a prop changes" pattern) rather than routed through
  // an effect, which would apply it a render late for no benefit.
  const [prevRouteKey, setPrevRouteKey] = useState(`${isHome}:${pathname}`)
  const routeKey = `${isHome}:${pathname}`
  if (prevRouteKey !== routeKey) {
    setPrevRouteKey(routeKey)
    if (!isHome) {
      setVisible(true)
      const idx = SECTIONS.findIndex(
        (s) => s.routePrefix && pathname.startsWith(s.routePrefix)
      )
      setCurrentIndex(idx === -1 ? 0 : idx)
    }
  }

  useEffect(() => {
    if (!isHome) return

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
  }, [isHome])

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
      {/* ── Desktop / tablet — quiet editorial trigger + slide-in panel ──
          Click-only (no hover-to-open — a 600ms panel slide shouldn't fire
          on an accidental mouse pass). The trigger stays fixed in the same
          corner whether the panel is open or closed, just swapping its own
          label/icon (section name + "+" → "Menu" + "×"), so it doubles as
          the panel's own close control without a second, redundant button. */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="side-nav-panel"
        aria-label={open ? 'Close menu' : undefined}
        className={`group hidden md:flex fixed top-[60px] md:top-[68px] right-6 md:right-10 lg:right-14 z-[70] -translate-y-1/2 flex-col items-end py-1 focus-visible:outline-none transition-opacity duration-500 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="flex items-center gap-3">
          {!open && (
            <span
              className="font-heading uppercase tracking-[0.2em] leading-none select-none text-xs font-semibold text-[#37C6F4] whitespace-nowrap transition-transform duration-300 group-hover:-translate-x-1 group-focus-visible:-translate-x-1"
              style={{ transitionTimingFunction: PANEL_EASE }}
            >
              {current.label}
            </span>
          )}
          <svg
            viewBox="0 0 16 16"
            className="w-3 h-3 shrink-0 text-[#37C6F4] transition-[transform,opacity] duration-300 group-hover:opacity-90"
            style={{ transform: `rotate(${open ? 45 : 0}deg)`, transitionTimingFunction: PANEL_EASE }}
            fill="none" aria-hidden="true"
          >
            <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Backdrop — a hint that something opened, not a modal scrim. Purely
          decorative (pointer-events-none): the existing outside-pointerdown
          listener above already closes the panel no matter what element a
          click lands on, so the page underneath stays fully interactive. */}
      <div
        aria-hidden="true"
        className="hidden md:block fixed inset-0 z-[68] bg-black pointer-events-none"
        style={{
          opacity: open ? 0.15 : 0,
          transition: reducedMotion ? 'opacity 200ms ease-out' : `opacity 500ms ${PANEL_EASE}`,
        }}
      />

      {/* Panel — a narrow editorial slice of the page, not a dropdown card
          or a full-screen takeover. Dark navy/black at ~95% opacity so the
          site's own palette carries it rather than a generic modal surface. */}
      <div
        id="side-nav-panel"
        role="menu"
        aria-hidden={!open}
        className="hidden md:flex fixed inset-y-0 right-0 z-[69] w-[340px] max-w-[85vw] flex-col border-l border-[#37C6F4]/15 bg-[#0B0B0B]/95 backdrop-blur-md px-8 pb-10 pt-28 lg:px-10"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: reducedMotion ? 'transform 200ms ease-out' : `transform 600ms ${PANEL_EASE}`,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <nav className="flex flex-1 flex-col justify-center gap-8">
          {SECTIONS.map((section, i) => {
            const isCurrent = i === currentIndex
            const delay = open ? 120 + i * 70 : 0

            return (
              <button
                key={section.id}
                ref={i === 0 ? firstItemRef : undefined}
                role="menuitem"
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => handleClick(i)}
                className="group flex items-center gap-4 text-left focus-visible:outline-none"
              >
                <span className="shrink-0 text-[10px] font-medium tracking-[0.3em] text-[#37C6F4]/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="block flex-1 overflow-hidden">
                  <span
                    className="flex items-center gap-3 font-[family-name:var(--font-heading)] uppercase tracking-[0.02em] text-2xl lg:text-[28px] font-light text-[#F3F1EB] transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                    style={{
                      opacity: itemsRevealed ? 1 : 0,
                      filter: reducedMotion ? 'none' : itemsRevealed ? 'blur(0px)' : 'blur(3px)',
                      transform: reducedMotion ? 'none' : itemsRevealed ? 'translateY(0%)' : 'translateY(110%)',
                      transition: reducedMotion
                        ? 'opacity 200ms ease-out'
                        : `transform 600ms ${PANEL_EASE} ${delay}ms, opacity 600ms ${PANEL_EASE} ${delay}ms, filter 600ms ${PANEL_EASE} ${delay}ms`,
                    }}
                  >
                    {section.label}
                    {isCurrent ? (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#37C6F4]" />
                    ) : (
                      <span
                        className="shrink-0 text-[#37C6F4] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </nav>

        {/* A single, quiet geometric mark — secondary to the typography,
            still rather than spinning (see the carousel work's "stillness
            is part of the composition too" principle). */}
        <div className="mt-10 flex justify-center opacity-[0.16]" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="h-10 w-10">
            <circle cx={100} cy={100} r={64} fill="none" stroke="#37C6F4" strokeWidth={2.5} strokeDasharray="5 10 3 8" strokeLinecap="round" />
          </svg>
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
