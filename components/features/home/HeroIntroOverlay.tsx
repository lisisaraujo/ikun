'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { PortableTextBlock } from '@portabletext/types'

interface HeroIntroOverlayProps {
  text: PortableTextBlock[]
  started?: boolean
  textHidden?: boolean
  revealImmediately?: boolean
  onDismiss?: () => void
}

interface StoryItem {
  key: string
  start: number
  words: string[]
}

interface StoryToken {
  itemIndex: number
  text: string
  pauseAfter: number
}

const DISMISS_ZONE = 220

const ITEM_LAYOUT = 'mt-[8vh] w-[86vw] max-w-3xl lg:mt-0 lg:w-auto lg:max-w-none'

function blockText(block: PortableTextBlock) {
  if (block._type !== 'block' || !Array.isArray(block.children)) return ''
  return block.children
    .map((child) => ('text' in child && typeof child.text === 'string' ? child.text : ''))
    .join('')
    .trim()
}

function wordPause(word: string, endsItem: boolean) {
  if (endsItem) return 700
  if (/[.!?…][”’"')\]]?$/.test(word)) return 360
  if (/[,;:][”’"')\]]?$/.test(word)) return 170
  return 72
}

export default function HeroIntroOverlay({
  text,
  started = false,
  textHidden = false,
  revealImmediately = false,
  onDismiss,
}: HeroIntroOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const activeItemRef = useRef(-1)
  const [revealedWords, setRevealedWords] = useState(0)

  const story = useMemo(() => {
    const paragraphs = text.map(blockText).filter(Boolean)

    const items = paragraphs.reduce<StoryItem[]>((currentItems, paragraph, index) => {
      const words = paragraph.split(/\s+/).filter(Boolean)
      const previousItem = currentItems.at(-1)
      const start = previousItem ? previousItem.start + previousItem.words.length : 0
      return [...currentItems, { key: `paragraph-${index}`, start, words }]
    }, [])

    const tokens: StoryToken[] = items.flatMap((item, itemIndex) =>
      item.words.map((word, wordIndex) => ({
        itemIndex,
        text: word,
        pauseAfter: wordPause(word, wordIndex === item.words.length - 1),
      }))
    )

    return {
      items,
      tokens,
      plainText: paragraphs.join('\n\n'),
    }
  }, [text])

  // Reveal with punctuation-aware pacing. Sentence endings breathe longer,
  // while the space between ordinary words stays close to spoken cadence.
  useEffect(() => {
    if (!started || revealImmediately || story.tokens.length === 0) return

    let timeout: ReturnType<typeof setTimeout> | undefined
    let nextWord = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      timeout = setTimeout(() => setRevealedWords(story.tokens.length), 0)
      return () => clearTimeout(timeout)
    }

    const revealNext = () => {
      nextWord += 1
      setRevealedWords(nextWord)
      if (nextWord < story.tokens.length) {
        timeout = setTimeout(revealNext, story.tokens[nextWord - 1].pauseAfter)
      }
    }

    timeout = setTimeout(revealNext, 500)
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [revealImmediately, started, story.tokens])

  const visibleWords = revealImmediately ? story.tokens.length : revealedWords

  // Smaller screens still follow the active passage horizontally. From the
  // desktop breakpoint upward every passage shares one full-screen stage,
  // so the story moves around the image without moving the viewport itself.
  useEffect(() => {
    if (!started || visibleWords === 0) return
    const token = story.tokens[Math.min(visibleWords - 1, story.tokens.length - 1)]
    if (!token || token.itemIndex === activeItemRef.current) return

    activeItemRef.current = token.itemIndex
    const container = scrollRef.current
    const item = itemRefs.current[token.itemIndex]
    if (!container || !item || token.itemIndex === 0 || revealImmediately) return
    if (window.matchMedia('(min-width: 1024px)').matches) return

    container.scrollTo({
      left: Math.max(item.offsetLeft - container.clientWidth * 0.1, 0),
      behavior: 'smooth',
    })
  }, [revealImmediately, started, story.tokens, visibleWords])

  // Keep the existing gesture: scrolling through the final runway dismisses
  // the whole composition, matching the Aa button's hidden state.
  useEffect(() => {
    const container = scrollRef.current
    const fadeEl = fadeRef.current
    if (!container || !fadeEl) return

    let raf = 0
    let committed = false
    const update = () => {
      raf = 0
      const maxScroll = container.scrollWidth - container.clientWidth
      const dismissStart = Math.max(maxScroll - DISMISS_ZONE, 0)
      const progress = maxScroll <= 0
        ? 0
        : Math.min(Math.max((container.scrollLeft - dismissStart) / DISMISS_ZONE, 0), 1)

      if (progress > 0 && progress < 1) {
        fadeEl.style.transition = 'none'
        fadeEl.style.opacity = String(1 - progress)
        committed = false
      } else if (progress >= 1 && !committed) {
        committed = true
        fadeEl.style.transition = 'none'
        fadeEl.style.opacity = '0'
        onDismiss?.()
      } else if (progress <= 0) {
        fadeEl.style.transition = ''
        fadeEl.style.opacity = ''
        committed = false
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [onDismiss])

  useEffect(() => {
    const fadeEl = fadeRef.current
    const container = scrollRef.current
    if (fadeEl) {
      fadeEl.style.transition = ''
      fadeEl.style.opacity = ''
    }
    if (!textHidden && container) {
      const maxScroll = container.scrollWidth - container.clientWidth
      const dismissStart = Math.max(maxScroll - DISMISS_ZONE, 0)
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
        <div
          ref={fadeRef}
          className={`h-full transition-opacity duration-200 ${textHidden ? 'opacity-0' : 'opacity-100'}`}
        >
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
            <div className="flex h-full w-max min-w-full items-start gap-[7vw] px-[5vw] pr-[45vw] lg:block lg:w-[calc(100%_+_220px)] lg:min-w-0 lg:px-0 lg:pr-0" aria-hidden="true">
              <div className="contents lg:grid lg:h-full lg:w-[calc(100%_-_220px)] lg:grid-cols-2 lg:content-center lg:gap-x-[7vw] lg:gap-y-10 lg:px-[5vw]">
                {story.items.map((item, itemIndex) => (
                  <div
                    key={item.key}
                    ref={(element) => { itemRefs.current[itemIndex] = element }}
                    className={`shrink-0 ${ITEM_LAYOUT}`}
                  >
                    <p className="font-[family-name:var(--font-heading)] text-[clamp(1.1rem,2vw,1.7rem)] font-light italic leading-[1.35] tracking-[-0.02em] text-[#8b5f3] [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] lg:text-[clamp(1rem,1.2vw,1.35rem)] lg:leading-[1.42]">
                      {item.words.map((word, wordIndex) => {
                        const globalIndex = item.start + wordIndex
                        const visible = globalIndex < visibleWords
                        const accent = globalIndex % 23 === 0

                        return (
                          <span
                            key={`${item.key}-${wordIndex}`}
                            className={`mr-[0.28em] inline-block whitespace-nowrap ${accent ? 'text-[#37C6F4] lg:text-[1.08em]' : ''}`}
                          >
                            {Array.from(word).map((letter, letterIndex) => {
                              const seed = globalIndex * 37 + letterIndex * 17
                              const x = (seed % 19) - 9
                              const y = ((seed * 3) % 25) - 12
                              const looseRotation = (seed % 23) - 11
                              const settledRotation = ((seed % 7) - 3) * 0.12

                              return (
                                <span
                                  key={`${item.key}-${wordIndex}-${letterIndex}`}
                                  className="inline-block motion-reduce:transition-none"
                                  style={{
                                    opacity: visible ? 1 : 0,
                                    filter: visible ? 'blur(0px)' : 'blur(5px)',
                                    transform: visible
                                      ? `translate3d(0, 0, 0) rotate(${settledRotation}deg) scale(1)`
                                      : `translate3d(${x}px, ${y}px, 0) rotate(${looseRotation}deg) scale(0.72)`,
                                    transitionDelay: visible ? `${(seed % 5) * 24 + letterIndex * 12}ms` : '0ms',
                                    transitionDuration: `${680 + (seed % 5) * 95}ms`,
                                    transitionProperty: 'opacity, filter, transform',
                                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                                  }}
                                >
                                  {letter}
                                </span>
                              )
                            })}
                          </span>
                        )
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
