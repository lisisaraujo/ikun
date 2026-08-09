'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { IronuPost } from '@/types/sanity'

interface IronuCarouselProps {
  posts: IronuPost[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Same card behavior as ProjectsCarousel — every entry shown inline here,
// no separate listing page; clicking a card goes straight to its detail page
const SINK = 56

export default function IronuCarousel({ posts }: IronuCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [distMap, setDistMap] = useState<number[]>(() => posts.map(() => 0))
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    let raf = 0
    const update = () => {
      raf = 0
      const center = el.scrollLeft + el.clientWidth / 2
      setDistMap(
        cardRefs.current.map((card) => {
          if (!card) return 0
          const cardCenter = card.offsetLeft + card.offsetWidth / 2
          const dist = Math.abs(cardCenter - center)
          return Math.min(dist / (el.clientWidth / 2), 1)
        })
      )
      setCanScrollLeft(el.scrollLeft > 4)
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // Center the second card (not the first) on load, so there's already
    // one card before and one after it in view from the start
    const initial = cardRefs.current[Math.min(1, posts.length - 1)]
    if (initial) {
      el.scrollLeft = initial.offsetLeft + initial.offsetWidth / 2 - el.clientWidth / 2
    }

    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [posts])

  function scrollByAmount(dir: 1 | -1) {
    let centerIndex = 0
    let bestDist = Infinity
    distMap.forEach((d, i) => {
      if (d < bestDist) { bestDist = d; centerIndex = i }
    })
    const nextIndex = Math.min(Math.max(centerIndex + dir, 0), posts.length - 1)
    cardRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  if (posts.length === 0) return null

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="relative flex gap-8 md:gap-10 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pt-2 pb-2 px-[calc(50%-110px)] sm:px-[calc(50%-140px)] md:px-[calc(50%-170px)] lg:px-[calc(50%-200px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post, i) => {
          const coverUrl = post.coverImage
            ? urlFor(post.coverImage).width(800).height(1000).auto('format').url()
            : null
          const dist = distMap[i] ?? 0
          const scale = 1 - dist * 0.35
          const opacity = 0.55 + (1 - dist) * 0.45
          const sink = dist * SINK

          return (
            <Link
              key={post._id}
              ref={(el) => { cardRefs.current[i] = el }}
              href={`/ironu/${post.slug.current}`}
              className="group relative shrink-0 snap-center w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px]"
              style={{
                transform: `translateY(${sink}px) scale(${scale})`,
                transformOrigin: 'top center',
                opacity,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              }}
            >
              <div className="relative rounded-2xl shadow-[0_10px_20px_-10px_rgba(58,38,20,0.35)] transition-[transform,box-shadow] duration-300 ease-out [@media(hover:hover)]:group-hover:-translate-y-1.5 [@media(hover:hover)]:group-hover:shadow-[0_25px_35px_-12px_rgba(58,38,20,0.5)]">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#1C2433]">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 340px, 400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-[family-name:var(--font-heading)] text-6xl text-[#F3F1EB]/10" aria-hidden="true">Ì</span>
                    </div>
                  )}

                  {/* info overlay — always visible on touch devices (no hover to rely on),
                      hidden until hover on devices that actually support it */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(28,36,51,0.85) 0%, rgba(28,36,51,0.55) 70%, transparent 100%)',
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#37C6F4] mb-1">{formatDate(post.date)}</p>
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-light text-[#F3F1EB]">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scrollByAmount(-1)}
          aria-label="Scroll left"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center text-[#F3F1EB] drop-shadow-[0_2px_6px_rgba(28,36,51,0.8)] hover:text-[#37C6F4] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scrollByAmount(1)}
          aria-label="Scroll right"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center text-[#F3F1EB] drop-shadow-[0_2px_6px_rgba(28,36,51,0.8)] hover:text-[#37C6F4] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-current fill-none stroke-[1.75]" aria-hidden="true">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
