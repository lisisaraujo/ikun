'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { IronuPost } from '@/types/sanity'

type PostMeta = Pick<IronuPost, '_id' | 'title' | 'slug'>

interface IronuModalProps {
  children: React.ReactNode
  allPosts: PostMeta[]
  currentSlug: string
}

export default function IronuModal({ children, allPosts, currentSlug }: IronuModalProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const idx      = allPosts.findIndex((p) => p.slug.current === currentSlug)
  const prevPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null  // older post
  const nextPost = idx > 0                    ? allPosts[idx - 1] : null  // newer post

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 16)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.body.style.overflow = original
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[60] bg-[#F3F1EB] overflow-y-auto transition-all duration-500 ease-out border-t-2 border-[#37C6F4] ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      {/* Close button */}
      <button
        onClick={() => router.back()}
        aria-label="Close"
        className="fixed top-5 right-6 md:right-10 z-[70] flex items-center gap-2 text-[#0B0B0B]/40 hover:text-[#37C6F4] transition-colors duration-200 group"
      >
        <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Close</span>
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none" strokeWidth={1.5} aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Scrollable content */}
      <div className="min-h-full flex flex-col">
        <div className="flex-1">
          {children}
        </div>

        {/* Prev / Next */}
        <div className="border-t border-[#C9C9C9]/40 mt-20">
          <div className="mx-auto max-w-2xl px-6 md:px-10 lg:px-16 py-14 grid grid-cols-2 gap-8">
            <div>
              {prevPost && (
                <Link href={`/ironu/${prevPost.slug.current}`} className="group block">
                  <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] opacity-50 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                    ← Older
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-base text-[#37C6F4] opacity-70 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 leading-snug">
                    {prevPost.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="text-right">
              {nextPost && (
                <Link href={`/ironu/${nextPost.slug.current}`} className="group block">
                  <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] opacity-50 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                    Newer →
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-base text-[#37C6F4] opacity-70 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 leading-snug">
                    {nextPost.title}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
