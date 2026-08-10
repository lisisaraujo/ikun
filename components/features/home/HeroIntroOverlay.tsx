'use client'

import { useEffect, useRef, useState } from 'react'
import PortableText from '@/components/ui/PortableText'
import type { PortableTextBlock } from '@portabletext/types'

interface HeroIntroOverlayProps {
  heading?: string
  text: PortableTextBlock[]
}

const FOCUS_SELECTOR = 'p, h1, h2, h3, h4, blockquote'
const MIN_OPACITY = 0.28

export default function HeroIntroOverlay({ heading, text }: HeroIntroOverlayProps) {
  // Starts hidden, beams in once this section has actually scrolled into
  // view (it lives in its own sticky section now, so simply being mounted
  // doesn't mean it's on screen yet)
  const [shown, setShown] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    // Same trick used for the section seams/side nav: shrinking the
    // observer's root to a sliver at the very top of the viewport means
    // this fires exactly when the section's top edge reaches the top of
    // the screen (i.e. it's just become fully sticky/covering), not at
    // some percentage-visible guess that could fire early mid-transition.
    const observer = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { rootMargin: '0px 0px -100% 0px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Subtle cursor-follow parallax on the whole text field — a few px of
  // drift opposite the cursor's offset from center, nothing that fights
  // the entrance/scroll-focus transforms already happening inside it
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = fieldRef.current
      if (!el) return
      const x = (e.clientX / window.innerWidth - 0.5) * -12
      const y = (e.clientY / window.innerHeight - 0.5) * -8
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Dims paragraphs the further they sit from the frame's vertical center as the user scrolls
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const paragraphs = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUS_SELECTOR))

    const updateFocus = () => {
      const center = container.scrollTop + container.clientHeight / 2
      paragraphs().forEach((el) => {
        const elCenter = el.offsetTop + el.offsetHeight / 2
        const dist = Math.abs(elCenter - center)
        const maxDist = container.clientHeight / 2 + el.offsetHeight
        const t = Math.min(dist / maxDist, 1)
        el.style.opacity = String(1 - t * (1 - MIN_OPACITY))
      })
    }

    // Centers the first paragraph in the frame once it's settled in place
    const centerFirst = () => {
      const first = paragraphs()[0]
      if (first) {
        container.scrollTop = Math.max(
          first.offsetTop + first.offsetHeight / 2 - container.clientHeight / 2,
          0
        )
      }
      updateFocus()
    }

    if (shown) centerFirst()
    container.addEventListener('scroll', updateFocus, { passive: true })
    window.addEventListener('resize', updateFocus)
    return () => {
      container.removeEventListener('scroll', updateFocus)
      window.removeEventListener('resize', updateFocus)
    }
  }, [shown])

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-30 flex flex-col items-center px-4 sm:px-8 pt-16 sm:pt-20 text-center pointer-events-none"
    >
      {/* light beam trailing down from the logo — fixed height, animated via scale so it never shifts the layout below it */}
      <div
        aria-hidden="true"
        className={`shrink-0 h-8 sm:h-10 w-px bg-gradient-to-b from-[#37C6F4]/90 via-[#37C6F4]/25 to-transparent origin-top blur-[1px] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-[900ms] ${
          shown ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
        }`}
      />

      {/* text field: fills the rest of the screen so the reading frame feels
          full-height rather than a small centered box */}
      <div
        ref={fieldRef}
        className="relative mt-6 sm:mt-8 max-w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full mx-auto flex-1 min-h-0"
        style={{ transition: 'transform 0.3s ease-out' }}
      >
        {/* text materializes out of the beam as this section scrolls into view */}
        <div
          className={`h-full origin-top transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-[900ms] ${
            shown
              ? 'opacity-100 translate-y-0 scale-100 blur-0'
              : 'opacity-0 -translate-y-16 sm:-translate-y-24 scale-[0.35] blur-sm'
          }`}
        >
          {/* Deliberately no overscroll-contain: once this inner frame's own
              scroll is exhausted, wheel/touch input chains straight through
              to the page, naturally advancing to the About section below —
              that hand-off is the whole point of this being a "page" and not
              a scroll-jacked overlay. */}
          <div
            ref={scrollRef}
            className={`relative h-full overflow-y-auto px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              shown ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
            }}
          >
            {/* spacers (not padding) so every paragraph — including the last — can scroll all the way to center */}
            <div aria-hidden="true" style={{ height: '38vh' }} />
            <div className="text-[#8B5F3C] text-[15px] sm:text-lg md:text-xl leading-relaxed transition-opacity duration-200 [&_p]:transition-opacity [&_p]:duration-200 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
              <PortableText value={text} />
            </div>
            <div aria-hidden="true" style={{ height: '38vh' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
