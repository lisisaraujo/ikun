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
  // Starts collapsed into the logo, then beams down after a beat on first load
  const [shown, setShown] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1100)
    return () => clearTimeout(t)
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
    <div className="absolute inset-0 z-30 flex flex-col items-center px-4 sm:px-8 pt-24 sm:pt-28 md:pt-32 text-center pointer-events-none">
      {/* light beam trailing down from the logo — fixed height, animated via scale so it never shifts the layout below it */}
      <div
        aria-hidden="true"
        className={`h-8 sm:h-10 w-px bg-gradient-to-b from-[#37C6F4]/90 via-[#37C6F4]/25 to-transparent origin-top blur-[1px] transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-[900ms] ${
          shown ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
        }`}
      />

      {/* text field: relative wrapper sized to match the frame, so the toggle can anchor to its corner */}
      <div className="relative mt-6 sm:mt-8 max-w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl w-full mx-auto">
        <button
          onClick={() => setShown((v) => !v)}
          className={`pointer-events-auto absolute -top-9 right-1 sm:right-2 rounded-full backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-200 ${
            shown
              ? 'bg-[#37C6F4]/10 text-[#37C6F4] hover:bg-[#37C6F4]/20'
              : 'bg-[#8B5F3C]/10 text-[#8B5F3C] hover:bg-[#8B5F3C]/20'
          }`}
        >
          {shown ? 'Hide' : 'Show'}
        </button>

        {/* text materializes out of the beam, defocuses back into it on hide */}
        <div
          className={`origin-top transition-all ease-[cubic-bezier(0.22,1,0.36,1)] duration-[900ms] ${
            shown
              ? 'opacity-100 translate-y-0 scale-100 blur-0'
              : 'opacity-0 -translate-y-16 sm:-translate-y-24 scale-[0.35] blur-sm'
          }`}
        >
          <div
            ref={scrollRef}
            className={`relative max-h-[60vh] overflow-y-auto overscroll-contain px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              shown ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
            }}
          >
            {/* spacers (not padding) so every paragraph — including the last — can scroll all the way to center */}
            <div aria-hidden="true" style={{ height: '30vh' }} />
            <div className="text-[#8B5F3C] text-[13px] sm:text-lg md:text-xl leading-relaxed transition-opacity duration-200 [&_p]:transition-opacity [&_p]:duration-200 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
              <PortableText value={text} />
            </div>
            <div aria-hidden="true" style={{ height: '30vh' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
