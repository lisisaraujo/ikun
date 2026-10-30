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

  const panels = useMemo<AboutPanel[]>(() => {
    return [
      {
        id: 'company',
        label: 'Company',
        image: about.photo,
        imageAlt: about.photoCaption ?? 'Mufutau Yusuf',
        content: companyText,
      },
      {
        id: 'artist',
        label: 'Mufutau Yusuf',
        image: about.photo,
        imageAlt: about.photoCaption ?? 'Mufutau Yusuf',
        content: about.bio,
      },
    ]
  }, [about.bio, about.photo, about.photoCaption, companyText])

  const active = panels.find((panel) => panel.id === activePanel) ?? panels[0]
  const displayed = panels.find((panel) => panel.id === displayedPanel) ?? active
  const expandedAlignment = displayed.id === 'company' ? 'text-left' : 'text-right'

  useEffect(() => {
    if (activePanel === displayedPanel) return

    const fadeTimer = window.setTimeout(() => {
      setIsTextVisible(false)
    }, 0)
    const swapTimer = window.setTimeout(() => {
      setDisplayedPanel(activePanel)
      setIsTextVisible(true)
    }, 520)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(swapTimer)
    }
  }, [activePanel, displayedPanel])

  function renderCompanyText() {
    return (
      <div className="about-editorial-copy about-editorial-text type-body !max-w-none text-left text-[#A06B43]/90 md:order-1 md:self-start">
        {displayed.content.map((block, blockIndex) => {
          if (block._type !== 'block') return null

          const children = Array.isArray(block.children) ? (block.children as PortableTextChild[]) : []
          const nodes: ReactNode[] = []

          children.forEach((child, childIndex) => {
            const text = child.text ?? ''
            if (!text) return

            const parts = text.split(artistName)
            parts.forEach((part, partIndex) => {
              if (part) {
                nodes.push(<span key={`${child._key ?? childIndex}-${partIndex}-text`}>{part}</span>)
              }

              if (partIndex < parts.length - 1) {
                nodes.push(
                  <button
                    key={`${child._key ?? childIndex}-${partIndex}-artist`}
                    type="button"
                    onClick={() => setActivePanel('artist')}
                    className="inline cursor-pointer bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_0.14em] bg-[position:0_88%] bg-no-repeat p-0 font-semibold text-[#A06B43] transition-colors duration-300 hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60"
                  >
                    {artistName}
                  </button>,
                )
              }
            })
          })

          const paragraphMeasure =
            blockIndex === 0 ? 'max-w-[56ch]' : blockIndex % 3 === 2 ? 'max-w-[52ch]' : 'max-w-[64ch]'

          return (
            <p
              key={block._key ?? blockIndex}
              className={`mb-7 last:mb-0 ${paragraphMeasure}`}
            >
              {nodes}
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className="home-section-inner relative isolate mx-auto flex w-full max-w-[140rem] flex-col justify-start overflow-visible px-4 pt-2 sm:px-6 md:px-8 md:pt-3 lg:px-10 xl:px-12">
      <div className="mx-auto w-full max-w-[112rem]">
        <div
          className="mx-auto flex w-full max-w-[56rem] items-stretch justify-center gap-2"
          role="tablist"
          aria-label="About sections"
        >
          {panels.map((panel) => {
            const isActive = panel.id === active.id
            const isCompany = panel.id === 'company'

            return (
              <button
                key={panel.id}
                type="button"
                role="tab"
                onClick={() => setActivePanel(panel.id)}
                aria-label={`Show ${panel.label}`}
                aria-selected={isActive}
                className={`group relative z-10 flex min-h-16 min-w-0 flex-1 cursor-pointer touch-manipulation select-none items-center justify-center type-heading text-center uppercase transition-[color,opacity,text-shadow] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70 sm:px-7 md:min-h-20 md:px-9 ${
                  isActive
                    ? `about-tab-focus ${isCompany ? 'about-tab-focus-left' : 'about-tab-focus-right'} text-[#A06B43] opacity-100`
                    : 'bg-transparent text-[#A06B43] opacity-40 hover:opacity-100'
                } px-5`}
              >
                <span className="relative z-10">{panel.label}</span>
              </button>
            )
          })}
        </div>

        <div className="relative mt-5 overflow-visible px-0 py-6 md:mt-7 md:py-7">
          <div
            className={`about-content-light ${displayed.id === 'company' ? 'about-content-light-company' : 'about-content-light-artist'} relative z-10 w-full origin-center transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(.19,1,.22,1)] md:max-w-none ${
              isTextVisible
                ? 'translate-y-0 scale-100 opacity-100 blur-0'
                : 'translate-y-3 scale-[0.985] opacity-0 blur-[5px]'
            }`}
          >
            {displayed.content.length > 0 ? (
              displayed.id === 'artist' && displayed.image ? (
                <div className="about-image-composition about-image-composition-artist type-body text-right text-[#A06B43]/90 md:grid md:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)] md:items-start md:gap-4 lg:gap-6 [&_p]:mb-6 [&_p:last-child]:mb-0">
                  <div className="about-image-frame about-image-frame-artist relative mb-6 aspect-[4/5] w-full max-w-48 overflow-hidden bg-[#0B0B0B] shadow-[0_28px_72px_-40px_rgba(11,11,11,0.9)] ring-1 ring-[#8B5F3C]/20 md:mb-0 md:w-full md:max-w-none md:-translate-y-2 md:translate-x-12 lg:translate-x-16">
                    <Image
                      src={urlFor(displayed.image).width(640).height(800).fit('crop').auto('format').url()}
                      alt={displayed.imageAlt}
                      fill
                      className="object-cover grayscale"
                      sizes="(min-width: 1280px) 12rem, (min-width: 768px) 11rem, 10rem"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C2433]/50 via-transparent to-transparent" />
                    <span className="about-image-tape" aria-hidden="true" />
                  </div>
                  <div className="about-editorial-copy about-editorial-copy-artist relative z-10 min-w-0 w-full md:min-w-0 md:max-w-[70ch] md:justify-self-end">
                    <PortableText
                      value={displayed.content}
                      className="about-editorial-text !max-w-none text-right [&_p]:ml-auto [&_p]:mb-6 [&_p]:max-w-[70ch] [&_p:last-child]:mb-0"
                    />
                  </div>
                </div>
              ) : (
                displayed.id === 'company' && displayed.image ? (
                  <div className="about-image-composition about-image-composition-company grid items-start gap-8 md:grid-cols-[minmax(0,64ch)_minmax(10rem,14rem)] lg:grid-cols-[minmax(0,68ch)_minmax(11rem,15rem)] lg:gap-12">
                    <div className="about-image-frame about-image-frame-company relative mb-6 aspect-[4/5] w-full max-w-48 overflow-hidden bg-[#0B0B0B] shadow-[0_28px_72px_-40px_rgba(11,11,11,0.9)] ring-1 ring-[#8B5F3C]/20 md:order-2 md:mb-0 md:w-full md:max-w-none md:translate-y-2">
                      <Image
                        src={urlFor(displayed.image).width(640).height(800).fit('crop').auto('format').url()}
                        alt={displayed.imageAlt}
                        fill
                        className="object-cover grayscale"
                        sizes="(min-width: 1280px) 12rem, (min-width: 768px) 11rem, 10rem"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C2433]/50 via-transparent to-transparent" />
                      <span className="about-image-tape" aria-hidden="true" />
                    </div>
                    {renderCompanyText()}
                  </div>
                ) : displayed.id === 'company' ? (
                  renderCompanyText()
                ) : (
                  <PortableText
                    value={displayed.content}
                    className={`type-body !max-w-none ${expandedAlignment} text-[#A06B43]/90 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_p]:ml-auto [&_p]:max-w-[96rem]`}
                  />
                )
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
