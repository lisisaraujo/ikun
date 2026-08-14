'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { PortableTextBlock } from '@portabletext/types'

interface HeroIntroOverlayProps {
  text: PortableTextBlock[]
  started?: boolean
  textHidden?: boolean
  onDismiss?: () => void
}

interface StoryItem {
  key: string
  start: number
  words: string[]
  // The narrative/animation order this paragraph belongs to. Equal to its
  // index among the *merged* paragraphs (see `story` below) — i.e. reading
  // order, which is also grid order once blank-line-adjacent blocks have
  // been rejoined, so there's no separate "visual position" to diverge from.
  section: number
}

type LayerPhase = 'visible' | 'exiting' | 'hidden' | 'entering'
type RevealMode = 'cinematic' | 'quick'

// Desktop's extra scrollable width is 220px (see the `calc(100% ± 220px)`
// sizing below) — kept exactly as it was, since it's layout, not gesture.
// The portion of that scrollable range treated as the live drag gesture:
// opacity/blur only start ramping, and only commit, inside this final
// stretch — everything before it is neutral, giving the drag room to
// breathe before anything starts leaving.
const FADE_ZONE = 110
const VELOCITY_COMMIT_PX_MS = 0.9
const SNAP_BACK_IDLE_MS = 140
const MAX_DRAG_BLUR = 4

// The physical layer's own exit/entrance — shared by the swipe gesture and
// the Aa button, so hiding the text always reads as the same choreography
// regardless of what triggered it. This is entirely separate from the
// typography reveal below: this transform only ever applies to the layer
// wrapper, never to a line or word.
const EXIT_DURATION = 620
const ENTER_DURATION = 620
const EXIT_TRANSLATE_X = -90
const ENTER_FROM_TRANSLATE_X = 26
const LAYER_BLUR = 4

const HINT_STORAGE_KEY = 'ikun:hero-intro-swipe-hint-seen'

const ITEM_LAYOUT = 'mt-[8vh] w-[86vw] max-w-3xl lg:mt-0 lg:w-auto lg:max-w-none'

// How many narrative sections the reveal's section-start delays below are
// tuned for. If the CMS ever grows a 5th paragraph, it reuses the last
// section's timing rather than throwing.
const SECTION_COUNT = 4

// Masked line-reveal choreography: a line rises 115% of its own height from
// beneath its stationary clipping mask — not a small px nudge — so the
// "emerging typography" effect is unmistakable rather than reading as a
// generic fade. Cinematic is the once-per-visit entrance; quick is used
// every time the text returns from being hidden (see phase === 'entering'
// below) — same choreography, compressed timing, per spec section 13.
const LINE_TRANSLATE_Y = '115%'
const LINE_BLUR = 5
const ACCENT_TRANSLATE_X = -6
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
// Section START delays — when each section's first line begins, not when
// it finishes. Sections overlap heavily by design: the previous section is
// still settling when the next begins.
const CINEMATIC = {
  lineDuration: 1200,
  lineStagger: 150,
  sectionDelay: [0, 650, 1300, 1950],
  accentDuration: 480,
  accentDelayOffset: 150,
}
const QUICK = {
  lineDuration: 700,
  lineStagger: 70,
  sectionDelay: [0, 70, 140, 210],
  accentDuration: 260,
  accentDelayOffset: 70,
}
// The pause after the background/logo have established themselves and
// before section 1 begins rising — only used for the cinematic entrance.
const INITIAL_PAUSE = 450

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

function blockText(block: PortableTextBlock) {
  if (block._type !== 'block' || !Array.isArray(block.children)) return ''
  return block.children
    .map((child) => ('text' in child && typeof child.text === 'string' ? child.text : ''))
    .join('')
    .trim()
}

export default function HeroIntroOverlay({
  text,
  started = false,
  textHidden = false,
  onDismiss,
}: HeroIntroOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const wordElRefs = useRef<HTMLSpanElement[][]>([])
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  // Which visual line (within its own paragraph) each word landed on —
  // measured from real layout so the stagger always matches how the
  // browser actually wrapped the text, at whatever viewport width it's
  // currently rendered at.
  const [wordLines, setWordLines] = useState<number[][]>([])

  // `revealed` flips once, the first time the entrance is allowed to play,
  // and gates the one-time swipe hint. `wordsVisible` is the typography's
  // actual on/off switch — it resets to false whenever the layer fully
  // hides, so the masked reveal can play again (in `quick` mode) on restore.
  const [revealed, setRevealed] = useState(false)
  const [wordsVisible, setWordsVisible] = useState(false)
  const [revealMode, setRevealMode] = useState<RevealMode>('cinematic')

  // The text layer's own physical state — driven by `textHidden`, but with
  // its own transient exiting/entering beats so the departure/arrival always
  // finishes its animation rather than snapping, no matter how fast the
  // prop flips (e.g. the Aa button toggled twice in a row).
  const [phase, setPhase] = useState<LayerPhase>(() => (textHidden ? 'hidden' : 'visible'))
  // Adjusted during render (React's documented pattern for "reset/derive
  // state when a prop changes") rather than in an effect, since the
  // adjustment must happen synchronously with the prop flip — an effect
  // would apply it a render late and trigger an avoidable cascade.
  const [prevTextHidden, setPrevTextHidden] = useState(textHidden)
  if (prevTextHidden !== textHidden) {
    setPrevTextHidden(textHidden)
    setPhase(textHidden ? 'exiting' : 'entering')
  }

  const [enterPending, setEnterPending] = useState(false)
  const [prevPhase, setPrevPhase] = useState<LayerPhase>(phase)
  if (prevPhase !== phase) {
    setPrevPhase(phase)
    setEnterPending(phase === 'entering' && !reducedMotion)
    // The typography resets once the layer has fully left, so the next
    // arrival has something to reveal again instead of appearing already
    // settled. It does NOT reset on `exiting` — the physical layer's own
    // fade/blur/slide is what carries the text away; the words themselves
    // just go along for that ride until the layer is actually gone.
    if (phase === 'hidden') setWordsVisible(false)
  }

  const [prevRevealed, setPrevRevealed] = useState(revealed)
  if (prevRevealed !== revealed) {
    setPrevRevealed(revealed)
    if (revealed) setWordsVisible(true)
  }

  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const hintShownRef = useRef(false)

  const story = useMemo(() => {
    // A blank Portable Text block is a real paragraph break in the CMS
    // editor. Two content blocks with NO blank block between them (e.g. the
    // final sentence's "...seeks to develop" / "groundbreaking..." halves)
    // are one paragraph the editor's rich-text UI happened to wrap across
    // two blocks, not two separate paragraphs — so they're rejoined here
    // rather than rendered (and animated) as if they were unrelated blocks.
    const paragraphs: string[] = []
    let continuingParagraph = false
    text.forEach((block) => {
      const raw = blockText(block)
      if (!raw) {
        continuingParagraph = false
        return
      }
      if (continuingParagraph && paragraphs.length > 0) {
        paragraphs[paragraphs.length - 1] = `${paragraphs[paragraphs.length - 1]} ${raw}`
      } else {
        paragraphs.push(raw)
      }
      continuingParagraph = true
    })

    const items = paragraphs.reduce<StoryItem[]>((currentItems, paragraph, index) => {
      const words = paragraph.split(/\s+/).filter(Boolean)
      const previousItem = currentItems.at(-1)
      const start = previousItem ? previousItem.start + previousItem.words.length : 0
      // Reading order === array order === grid order, all three now that
      // paragraphs are merged correctly — a 5th future paragraph reuses the
      // last section's timing rather than indexing past it.
      const section = Math.min(index, SECTION_COUNT - 1)
      return [...currentItems, { key: `paragraph-${index}`, start, words, section }]
    }, [])

    return { items, plainText: paragraphs.join('\n\n') }
  }, [text])

  // Groups each paragraph's word spans by their measured offsetTop, i.e. the
  // real line breaks the browser just produced — never a guess at where
  // text wraps, so it stays correct at any viewport width or font load state.
  const measureLines = useCallback(() => {
    const nextWordLines: number[][] = []

    story.items.forEach((item, itemIndex) => {
      const els = wordElRefs.current[itemIndex] || []
      const lines: number[] = []
      let currentTop: number | null = null
      let lineIndex = -1

      item.words.forEach((_, wordIndex) => {
        const top = els[wordIndex]?.offsetTop
        if (top === undefined) {
          lines.push(Math.max(lineIndex, 0))
          return
        }
        if (currentTop === null || Math.abs(top - currentTop) > 2) {
          lineIndex += 1
          currentTop = top
        }
        lines.push(lineIndex)
      })

      nextWordLines.push(lines)
    })

    setWordLines(nextWordLines)
  }, [story.items])

  useLayoutEffect(() => {
    measureLines()
  }, [measureLines])

  // Re-measure on resize and once webfonts finish swapping in — both can
  // shift where lines actually break.
  useEffect(() => {
    let raf = 0
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measureLines)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [measureLines])

  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return
    document.fonts.ready.then(measureLines).catch(() => {})
  }, [measureLines])

  // The cinematic entrance: plays once, the first time `started` allows it.
  useEffect(() => {
    if (!started || revealed) return
    const delay = reducedMotion ? 0 : INITIAL_PAUSE
    const timeout = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(timeout)
  }, [started, revealed, reducedMotion])

  // Every later arrival (Aa button or swipe-right, always after the layer
  // has fully hidden) replays a shorter version of the same masked reveal
  // instead of an instant snap — see spec section 13.
  useEffect(() => {
    if (phase !== 'entering') return
    const timeout = setTimeout(() => {
      setRevealMode('quick')
      setWordsVisible(true)
    }, reducedMotion ? 0 : 120)
    return () => clearTimeout(timeout)
  }, [phase, reducedMotion])

  // `phase`'s VISIBLE<->EXITING<->HIDDEN<->ENTERING transitions are derived
  // from `textHidden` during render, above (both the Aa button and the drag
  // gesture below only ever flip `textHidden` — neither talks to `phase`
  // directly, so there's exactly one animation system for both triggers).
  // This effect only carries the *timed* half: ending each transient beat
  // once its animation has actually finished playing.
  useEffect(() => {
    if (phase === 'exiting') {
      const timeout = setTimeout(() => setPhase('hidden'), reducedMotion ? 180 : EXIT_DURATION)
      return () => clearTimeout(timeout)
    }
    if (phase === 'entering') {
      const timeout = setTimeout(() => setPhase('visible'), reducedMotion ? 180 : ENTER_DURATION)
      return () => clearTimeout(timeout)
    }
  }, [phase, reducedMotion])

  // The layer's entrance starts from a snapped-in, invisible offset on the
  // opposite side from the exit (set during render, above), then releases
  // into the transition one frame later — otherwise the very first render
  // of "entering" would have nothing to transition from and the layer
  // would just pop into place.
  useEffect(() => {
    if (!enterPending) return
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEnterPending(false))
    })
    return () => cancelAnimationFrame(raf)
  }, [enterPending])

  // A one-time, wordless nudge teaching the drag-to-hide gesture exists —
  // shown once the entrance has settled, never again after that (tracked in
  // localStorage, independent of whether the visitor ever actually swiped).
  useEffect(() => {
    if (!revealed || hintShownRef.current) return
    hintShownRef.current = true
    if (typeof window === 'undefined' || reducedMotion) return
    let seen = false
    try {
      seen = window.localStorage.getItem(HINT_STORAGE_KEY) === '1'
    } catch {
      seen = true
    }
    if (seen) return
    const timeout = setTimeout(() => setShowSwipeHint(true), 900)
    return () => clearTimeout(timeout)
  }, [revealed, reducedMotion])

  useEffect(() => {
    if (!showSwipeHint) return
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, '1')
    } catch {
      // ignore — worst case the hint reappears next visit
    }
    const timeout = setTimeout(() => setShowSwipeHint(false), 1700)
    return () => clearTimeout(timeout)
  }, [showSwipeHint])

  // The drag-to-hide gesture: dragging follows the pointer/finger via native
  // horizontal scroll (so it stays touch-native and never fights vertical
  // page scrolling), with opacity/blur ramping — with a little resistance,
  // via a smoothstep curve — only in the final FADE_ZONE stretch. Release
  // past the threshold, or with enough velocity, commits the hide; anywhere
  // short of it, an idle timer eases the content back to rest.
  useEffect(() => {
    const container = scrollRef.current
    const fadeEl = fadeRef.current
    if (!container || !fadeEl) return

    let raf = 0
    let committed = false
    let lastScrollLeft = container.scrollLeft
    let lastTime = performance.now()
    let idleTimer: ReturnType<typeof setTimeout> | undefined

    const settle = () => {
      committed = false
      fadeEl.style.transition = ''
      fadeEl.style.opacity = ''
      fadeEl.style.filter = ''
    }

    const update = () => {
      raf = 0
      const maxScroll = container.scrollWidth - container.clientWidth
      const dismissStart = Math.max(maxScroll - FADE_ZONE, 0)
      const rawProgress = maxScroll <= 0
        ? 0
        : Math.min(Math.max((container.scrollLeft - dismissStart) / FADE_ZONE, 0), 1)
      const eased = rawProgress * rawProgress * (3 - 2 * rawProgress)

      const now = performance.now()
      const dt = now - lastTime
      const velocity = dt > 0 ? (container.scrollLeft - lastScrollLeft) / dt : 0
      lastTime = now
      lastScrollLeft = container.scrollLeft

      if (rawProgress > 0 && rawProgress < 1 && !committed) {
        fadeEl.style.transition = 'none'
        fadeEl.style.opacity = String(1 - eased)
        fadeEl.style.filter = reducedMotion ? '' : `blur(${eased * MAX_DRAG_BLUR}px)`
      }

      const earlyCommit = !reducedMotion && velocity > VELOCITY_COMMIT_PX_MS && rawProgress > 0.2
      if ((rawProgress >= 1 || earlyCommit) && !committed) {
        committed = true
        setShowSwipeHint(false)
        try {
          window.localStorage.setItem(HINT_STORAGE_KEY, '1')
        } catch {
          // ignore
        }
        onDismiss?.()
      } else if (rawProgress <= 0) {
        settle()
      }

      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (!committed && rawProgress > 0 && rawProgress < 1) {
          container.scrollTo({ left: dismissStart, behavior: reducedMotion ? 'auto' : 'smooth' })
        }
      }, SNAP_BACK_IDLE_MS)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      if (idleTimer) clearTimeout(idleTimer)
    }
  }, [onDismiss, reducedMotion])

  useEffect(() => {
    const fadeEl = fadeRef.current
    const container = scrollRef.current
    if (fadeEl) {
      fadeEl.style.transition = ''
      fadeEl.style.opacity = ''
      fadeEl.style.filter = ''
    }
    if (!textHidden && container) {
      const maxScroll = container.scrollWidth - container.clientWidth
      const dismissStart = Math.max(maxScroll - FADE_ZONE, 0)
      if (container.scrollLeft > dismissStart) container.scrollLeft = dismissStart
    }
  }, [textHidden])

  // A small counter-drift keeps the written field connected to the moving
  // image without compromising legibility or taking control away from it.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (event: MouseEvent) => {
      const field = fieldRef.current
      if (!field) return
      const x = (event.clientX / window.innerWidth - 0.5) * -10
      const y = (event.clientY / window.innerHeight - 0.5) * -7
      field.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const setWordRef = (itemIndex: number, wordIndex: number) => (el: HTMLSpanElement | null) => {
    if (!wordElRefs.current[itemIndex]) wordElRefs.current[itemIndex] = []
    wordElRefs.current[itemIndex][wordIndex] = el as HTMLSpanElement
  }

  const timing = revealMode === 'quick' ? QUICK : CINEMATIC

  // The layer's own physical exit/entrance — one shared style object driven
  // purely by `phase`, used identically whether `textHidden` came from the
  // Aa button or from a completed drag. Never touches a line or word.
  const isExitLike = phase === 'exiting' || phase === 'hidden'
  const isEnterSnap = phase === 'entering' && enterPending
  const layerConcealed = isExitLike || isEnterSnap
  const layerDuration = phase === 'entering' ? ENTER_DURATION : EXIT_DURATION
  const layerStyle: React.CSSProperties = {
    transform: reducedMotion
      ? 'none'
      : isExitLike
        ? `translate3d(${EXIT_TRANSLATE_X}px, 0, 0)`
        : isEnterSnap
          ? `translate3d(${ENTER_FROM_TRANSLATE_X}px, 0, 0)`
          : 'translate3d(0, 0, 0)',
    opacity: layerConcealed ? 0 : 1,
    filter: reducedMotion ? 'none' : layerConcealed ? `blur(${LAYER_BLUR}px)` : 'blur(0px)',
    transition: isEnterSnap
      ? 'none'
      : reducedMotion
        ? 'opacity 180ms ease-out'
        : `transform ${layerDuration}ms ${EASE}, opacity ${layerDuration}ms ${EASE}, filter ${layerDuration}ms ${EASE}`,
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden px-4 pb-8 pt-28 sm:px-8 sm:pt-32 md:pt-36">
      <div className="sr-only">
        {story.plainText.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>

      <div
        ref={fieldRef}
        className={`relative mx-auto h-full w-full transition-opacity duration-200 ${
          started && !textHidden ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionProperty: 'opacity, transform', transitionDuration: '200ms, 300ms' }}
      >
        {/* This is the one physical layer: dragging and the Aa button both
            only ever move `textHidden`, and both are rendered by this same
            transform/opacity/blur — never two competing animations, and
            never the same DOM element as the line/word reveal below. */}
        <div ref={fadeRef} className="h-full" style={layerStyle}>
          <div
            ref={scrollRef}
            className={`h-full overflow-x-auto overflow-y-hidden overscroll-x-contain [touch-action:pan-x_pan-y] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              started && !textHidden ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 91%, transparent 99%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 91%, transparent 99%)',
            }}
          >
            {/* Static paragraph positions — this level never moves. Only the
                masked line content inside each word rises/settles. */}
            <div className="flex h-full w-max min-w-full items-start gap-[7vw] px-[5vw] pr-[45vw] lg:block lg:w-[calc(100%_+_220px)] lg:min-w-0 lg:px-0 lg:pr-0" aria-hidden="true">
              <div className="contents lg:grid lg:h-full lg:w-[calc(100%_-_220px)] lg:grid-cols-2 lg:content-center lg:gap-x-[7vw] lg:gap-y-10 lg:px-[5vw]">
                {story.items.map((item, itemIndex) => (
                  <div key={item.key} className={`shrink-0 ${ITEM_LAYOUT}`}>
                    <p
                      className="font-[family-name:var(--font-heading)] text-[clamp(1.1rem,2vw,1.7rem)] font-light italic leading-[1.35] tracking-[-0.02em] text-[#8b5f3] [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] lg:text-[clamp(1rem,1.2vw,1.35rem)] lg:leading-[1.42]"
                      style={{ fontFamily: "var(--font-heading), 'Noto Sans', system-ui, sans-serif" }}
                    >
                      {item.words.map((word, wordIndex) => {
                        const globalIndex = item.start + wordIndex
                        const accent = globalIndex % 23 === 0
                        const lineInItem = wordLines[itemIndex]?.[wordIndex] ?? Math.floor(wordIndex / 8)
                        const sectionStart = timing.sectionDelay[item.section] ?? timing.sectionDelay.at(-1) ?? 0
                        const delay = reducedMotion ? 0 : sectionStart + lineInItem * timing.lineStagger

                        const wordStyle: React.CSSProperties = {
                          opacity: wordsVisible ? 1 : 0,
                          filter: reducedMotion ? 'none' : wordsVisible ? 'blur(0px)' : `blur(${LINE_BLUR}px)`,
                          transform: reducedMotion
                            ? 'none'
                            : wordsVisible
                              ? 'translate3d(0, 0%, 0)'
                              : `translate3d(0, ${LINE_TRANSLATE_Y}, 0)`,
                          transitionProperty: reducedMotion ? 'opacity' : 'opacity, filter, transform',
                          transitionDuration: reducedMotion ? '220ms' : `${timing.lineDuration}ms`,
                          transitionDelay: `${delay}ms`,
                          transitionTimingFunction: EASE,
                        }

                        return (
                          // Outer span is the stationary clipping mask (its box
                          // is exactly one word tall/wide); inner span is what
                          // actually rises through it.
                          <span
                            key={`${item.key}-${wordIndex}`}
                            className="mr-[0.28em] inline-block overflow-hidden align-top"
                          >
                            <span
                              ref={setWordRef(itemIndex, wordIndex)}
                              className={`inline-block whitespace-nowrap ${accent ? 'text-[#37C6F4] lg:text-[1.08em]' : ''}`}
                              style={wordStyle}
                            >
                              {accent ? (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    opacity: wordsVisible ? 1 : 0.4,
                                    transform: reducedMotion || wordsVisible
                                      ? 'translate3d(0, 0, 0)'
                                      : `translate3d(${ACCENT_TRANSLATE_X}px, 0, 0)`,
                                    transitionProperty: 'opacity, transform',
                                    transitionDuration: reducedMotion ? '220ms' : `${timing.accentDuration}ms`,
                                    transitionDelay: `${delay + timing.accentDelayOffset}ms`,
                                    transitionTimingFunction: EASE,
                                  }}
                                >
                                  {word}
                                </span>
                              ) : (
                                word
                              )}
                            </span>
                          </span>
                        )
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* A wordless, one-time nudge toward the drag gesture — a hairline
              that eases a few pixels left and fades, never explained in text,
              never repeated once shown (see the localStorage effect above). */}
          <div
            aria-hidden="true"
            className="absolute bottom-[9%] left-[9%] h-px w-9 rounded-full bg-[#37C6F4]/50 transition-all ease-out"
            style={{
              opacity: showSwipeHint ? 1 : 0,
              transform: showSwipeHint ? 'translate3d(-14px, 0, 0)' : 'translate3d(0, 0, 0)',
              transitionDuration: showSwipeHint ? '1400ms' : '260ms',
            }}
          />
        </div>
      </div>
    </div>
  )
}
