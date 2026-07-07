'use client'

import { useState } from 'react'
import type { ProjectReview } from '@/types/sanity'

interface ReviewsCarouselProps {
  reviews: ProjectReview[]
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [index, setIndex] = useState(0)
  const review = reviews[index]
  const total = reviews.length

  const prev = () => setIndex((i) => (i - 1 + total) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  return (
    <div className="relative">
      {/* Quote mark */}
      <div
        className="font-[family-name:var(--font-heading)] text-[7rem] leading-none text-[#8B5F3C] select-none mb-2"
        aria-hidden="true"
      >
        &ldquo;
      </div>

      {/* Quote text */}
      <blockquote
        key={index}
        className="text-[#1C2433] text-xl md:text-2xl leading-relaxed font-light max-w-3xl mb-10"
      >
        {review.quote}
      </blockquote>

      {/* Attribution */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-px bg-[#8B5F3C]" />
        <div>
          {review.reviewer && (
            <p className="text-sm font-semibold text-[#8B5F3C] tracking-wide">
              {review.reviewer}
            </p>
          )}
          {review.publication && (
            <p className="text-xs text-[#8B5F3C]/50 uppercase tracking-[0.15em] mt-0.5">
              {review.publication}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      {total > 1 && (
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={prev}
            aria-label="Previous review"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#C9C9C9]/50 text-[#1C2433] hover:border-[#37C6F4] hover:bg-[#37C6F4] hover:text-[#0B0B0B] transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Review ${i + 1}`}
                className={`transition-all duration-200 rounded-full ${
                  i === index
                    ? 'w-5 h-1.5 bg-[#37C6F4]'
                    : 'w-1.5 h-1.5 bg-[#C9C9C9] hover:bg-[#C9C9C9]/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next review"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-[#C9C9C9]/50 text-[#1C2433] hover:border-[#37C6F4] hover:bg-[#37C6F4] hover:text-[#0B0B0B] transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
