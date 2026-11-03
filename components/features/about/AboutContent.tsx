'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { PortableTextBlock } from '@portabletext/types'
import type { ReactNode } from 'react'
import PortableText from '@/components/ui/PortableText'
import { urlFor } from '@/lib/sanity/image'
import type { AboutPage, SanityImage } from '@/types/sanity'

interface AboutContentProps {
  about: AboutPage
  companyText?: PortableTextBlock[]
}

type AboutPanel = {
  id: 'company' | 'artist'
  label: string
  image?: SanityImage
  imageAlt: string
  content: PortableTextBlock[]
}

type PortableTextChild = {
  _key?: string
  text?: string
}

const artistName = 'Mufutau Yusuf'

export default function AboutContent({ about, companyText = [] }: AboutContentProps) {
  const [activePanel, setActivePanel] = useState<AboutPanel['id']>('company')
  const [displayedPanel, setDisplayedPanel] = useState<AboutPanel['id']>('company')
  const [isTextVisible, setIsTextVisible] = useState(true)

  const panels = useMemo<AboutPanel[]>(() => [
    {
      id: 'company',
      label: 'Company',
      image: about.photo,
      imageAlt: about.photoCaption ?? 'IKUN',
      content: companyText,
    },
    {
      id: 'artist',
      label: 'Mufutau Yusuf',
      image: about.photo,
      imageAlt: about.photoCaption ?? 'Mufutau Yusuf',
      content: about.bio,
    },
  ], [about.bio, about.photo, about.photoCaption, companyText])

  const displayed = panels.find((panel) => panel.id === displayedPanel) ?? panels[0]

  useEffect(() => {
    if (activePanel === displayedPanel) return

    const fadeTimer = window.setTimeout(() => setIsTextVisible(false), 0)
    const swapTimer = window.setTimeout(() => {
      setDisplayedPanel(activePanel)
      setIsTextVisible(true)
    }, 320)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(swapTimer)
    }
  }, [activePanel, displayedPanel])

  function renderCompanyText() {
    return (
      <div className="about-editorial-text type-body text-[#F3F1EB]/88">
        {displayed.content.map((block, blockIndex) => {
          if (block._type !== 'block') return null

          const children = Array.isArray(block.children) ? (block.children as PortableTextChild[]) : []
          const nodes: ReactNode[] = []

          children.forEach((child, childIndex) => {
            const text = child.text ?? ''
            if (!text) return

            const parts = text.split(artistName)
            parts.forEach((part, partIndex) => {
              if (part) nodes.push(<span key={`${child._key ?? childIndex}-${partIndex}-text`}>{part}</span>)
              if (partIndex < parts.length - 1) {
                nodes.push(
                  <button
                    key={`${child._key ?? childIndex}-${partIndex}-artist`}
                    type="button"
                    onClick={() => setActivePanel('artist')}
                    className="font-medium text-[#A06B43] underline decoration-[#A06B43]/50 underline-offset-4 transition-colors hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60"
                  >
                    {artistName}
                  </button>,
                )
              }
            })
          })

          return (
            <p key={block._key ?? blockIndex} className="mb-6 max-w-[62ch] last:mb-0">
              {nodes}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className="home-section-inner relative isolate mx-auto w-full max-w-[78rem] px-4 pt-2 sm:px-6 md:px-8 md:pt-3 lg:px-10 xl:px-12">
      <div className="mx-auto w-full">
        <div
          className="about-panel-switch flex w-fit items-center gap-6"
          role="tablist"
          aria-label="About sections"
        >
          {panels.map((panel) => {
            const isActive = panel.id === activePanel
            return (
              <button
                key={panel.id}
                type="button"
                role="tab"
                onClick={() => setActivePanel(panel.id)}
                aria-label={`Show ${panel.label}`}
                aria-selected={isActive}
                className={`about-tab type-label py-3 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70 ${
                  isActive ? 'font-semibold text-[#F3F1EB]' : 'text-[#A06B43]/65 hover:text-[#A06B43]'
                }`}
              >
                {panel.label}
              </button>
            )
          })}
        </div>

        <div className={`about-editorial-layout mt-10 grid items-start gap-8 md:mt-14 md:grid-cols-[minmax(12rem,17rem)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)] lg:gap-20 transition-[opacity,transform] duration-300 ease-out ${isTextVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          {displayed.image && (
            <div className="about-editorial-portrait about-image-frame relative aspect-[4/5] w-full max-w-[17rem] overflow-hidden bg-[#0B0B0B] shadow-[0_28px_72px_-40px_rgba(11,11,11,0.9)] ring-1 ring-[#8B5F3C]/30">
              <Image
                src={urlFor(displayed.image).width(720).height(900).fit('crop').auto('format').url()}
                alt={displayed.imageAlt}
                fill
                className="object-cover grayscale-[12%]"
                sizes="(min-width: 1024px) 20rem, (min-width: 768px) 17rem, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/40 via-transparent to-transparent" />
              <span className="about-image-tape" aria-hidden="true" />
            </div>
          )}

          <div className="about-editorial-copy min-w-0 max-w-[68ch]">
            {displayed.content.length > 0 ? (
              displayed.id === 'company' ? (
                renderCompanyText()
              ) : (
                <PortableText
                  value={displayed.content}
                  className="about-editorial-text type-body !max-w-none text-[#F3F1EB]/88 [&_p]:mb-6 [&_p:last-child]:mb-0"
                />
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
