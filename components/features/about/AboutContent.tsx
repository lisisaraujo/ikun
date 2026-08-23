'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import type { PortableTextBlock } from '@portabletext/types'
import PortableText from '@/components/ui/PortableText'
import { urlFor } from '@/lib/sanity/image'
import type { AboutPage, SanityImage, SanityProject } from '@/types/sanity'

interface AboutContentProps {
  about: AboutPage
  companyText?: PortableTextBlock[]
  projects?: SanityProject[]
}

type AboutPanel = {
  id: 'company' | 'artist'
  label: string
  image?: SanityImage
  imageAlt: string
  content: PortableTextBlock[]
}

export default function AboutContent({ about, companyText = [], projects = [] }: AboutContentProps) {
  const [activePanel, setActivePanel] = useState<AboutPanel['id']>('company')
  const [displayedPanel, setDisplayedPanel] = useState<AboutPanel['id']>('company')
  const [isTextVisible, setIsTextVisible] = useState(true)

  const panels = useMemo<AboutPanel[]>(() => {
    const projectImages = projects
      .map((project) => project.coverImage)
      .filter((image): image is SanityImage => Boolean(image))

    return [
      {
        id: 'company',
        label: 'Company',
        image: projectImages[0],
        imageAlt: 'IKUN company',
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
  }, [about.bio, about.photo, about.photoCaption, companyText, projects])

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

  return (
    <div className="relative isolate mx-auto flex min-h-[calc(100svh-12rem)] w-full max-w-[140rem] flex-col justify-start overflow-visible px-4 pt-3 sm:px-6 md:px-8 md:pt-4 lg:px-10 xl:px-12">
      <div className="mx-auto w-full max-w-[112rem]">
        <div className="flex w-full items-stretch gap-0 rounded-2xl px-2 py-1 md:px-4 lg:px-6">
          {panels.map((panel) => {
            const isActive = panel.id === active.id
            const isCompany = panel.id === 'company'

            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActivePanel(panel.id)}
                aria-pressed={isActive}
                className={`group relative z-10 flex min-h-24 items-center rounded-xl px-0 py-5 transition-[flex,opacity] duration-700 ease-[cubic-bezier(.19,1,.22,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70 md:min-h-32 ${
                  isActive
                    ? 'flex-[1.72] opacity-100'
                    : 'flex-[0.72] bg-transparent opacity-70 hover:opacity-100'
                } ${isCompany ? 'justify-start text-left' : 'justify-end text-right'}`}
              >
                {isActive && (
                  <span
                    className={`pointer-events-none absolute top-1/2 z-0 h-[5.8rem] -translate-y-1/2 rounded-2xl bg-[#A06B43]/[0.055] shadow-[0_30px_96px_-72px_rgba(160,107,67,0.68)] md:h-[7.4rem] ${
                      isCompany
                        ? '-left-8 right-0 md:-left-10'
                        : 'left-0 -right-8 md:-right-10'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`relative z-10 translate-y-[0.04em] font-[family-name:var(--font-heading)] font-bold uppercase leading-none tracking-normal transition-[color,font-size] duration-700 ${
                    isActive ? 'text-[#A06B43]' : 'text-[#A06B43]/62 group-hover:text-[#A06B43]'
                  } ${isActive ? 'text-[clamp(2rem,4.2vw,4.8rem)]' : 'text-[clamp(1.45rem,2.45vw,3rem)]'}`}
                >
                  {panel.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="relative mt-5 overflow-visible px-2 py-6 md:mt-7 md:px-4 md:py-7 lg:px-6">
          <div
            className={`relative z-10 origin-center transition-[opacity,transform,filter] duration-[1280ms] ease-[cubic-bezier(.19,1,.22,1)] ${
              isTextVisible
                ? 'translate-y-0 scale-100 opacity-100 blur-0'
                : 'translate-y-3 scale-[0.985] opacity-0 blur-[5px]'
            }`}
          >
            {displayed.content.length > 0 ? (
              displayed.id === 'artist' && displayed.image ? (
                <div className="grid items-start gap-8 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
                  <div className="relative aspect-[4/5] w-full max-w-64 overflow-hidden rounded-2xl bg-[#0B0B0B] shadow-[0_22px_70px_-48px_rgba(11,11,11,0.85)] md:max-w-none">
                    <Image
                      src={urlFor(displayed.image).width(640).height(800).fit('crop').auto('format').url()}
                      alt={displayed.imageAlt}
                      fill
                      className="object-cover grayscale"
                      sizes="(min-width: 1280px) 20rem, (min-width: 768px) 18rem, 16rem"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C2433]/50 via-transparent to-transparent" />
                  </div>
                  <PortableText
                    value={displayed.content}
                    className="!max-w-none text-right text-base leading-[1.58] text-[#A06B43]/90 md:text-[1.08rem] xl:text-[1.16rem] [&_p]:ml-auto [&_p]:mb-6 [&_p]:max-w-[96rem] [&_p:last-child]:mb-0"
                  />
                </div>
              ) : (
                <PortableText
                  value={displayed.content}
                  className={`!max-w-none ${expandedAlignment} leading-[1.58] text-[#A06B43]/90 [&_p]:mb-6 [&_p:last-child]:mb-0 ${
                    displayed.id === 'company'
                      ? 'text-base md:text-[1.08rem] xl:text-[1.16rem] [&_p:first-child]:max-w-[96rem] [&_p:first-child]:text-[clamp(1.35rem,2.12vw,2.08rem)] [&_p:first-child]:leading-[1.4] [&_p:not(:first-child)]:max-w-[88rem]'
                      : 'text-base md:text-[1.08rem] xl:text-[1.16rem] [&_p]:ml-auto [&_p]:max-w-[96rem]'
                  }`}
                />
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
