import Image from 'next/image'
import type { ReactNode } from 'react'
import PortableText from '@/components/ui/PortableText'
import DigestiveSpiral from '@/components/features/home/DigestiveSpiral'
import TextFocusGlow from '@/components/layout/TextFocusGlow'
import { urlFor } from '@/lib/sanity/image'
import type { AboutPage } from '@/types/sanity'

interface AboutContentProps {
  about: AboutPage
}

type TextChild = {
  _key?: string
  text?: string
  marks?: string[]
}

const titleName = 'Mufutau Yusuf'

function renderMarkedText(text: string, marks: string[] = []) {
  let node: ReactNode = text

  if (marks.includes('strong')) {
    node = <strong className="font-semibold text-[#A06B43]">{node}</strong>
  }

  if (marks.includes('em')) {
    node = <em>{node}</em>
  }

  return node
}

function renderFirstBioParagraph(block: AboutPage['bio'][number]) {
  const children = Array.isArray(block.children) ? (block.children as TextChild[]) : []
  let titleRendered = false

  return (
    <p className="font-[family-name:var(--font-body)] text-[clamp(1.02rem,1.18vw,1.18rem)] leading-[1.52] text-[#A06B43]/88">
      {children.map((child, childIndex) => {
        const text = child.text ?? ''
        if (!text) return null

        if (!titleRendered && text.includes(titleName)) {
          const [before, after] = text.split(titleName)
          titleRendered = true

          return (
            <span key={child._key ?? childIndex}>
              {before && renderMarkedText(before, child.marks)}
              <span className="mr-2 inline font-[family-name:var(--font-heading)] text-[clamp(2.2rem,5vw,5.8rem)] font-light leading-[0.95] text-[#A06B43]">
                {titleName}
              </span>
              {after && renderMarkedText(after, child.marks)}
            </span>
          )
        }

        return <span key={child._key ?? childIndex}>{renderMarkedText(text, child.marks)}</span>
      })}
    </p>
  )
}

export default function AboutContent({ about }: AboutContentProps) {
  const firstBioBlock = about.bio[0]
  const upperBioBlocks = about.bio.slice(1, 3)
  const remainingBioBlocks = about.bio.slice(3)

  return (
    <div className="relative isolate mx-auto min-h-[calc(100svh-12rem)] w-full max-w-[112rem] overflow-visible px-6 sm:px-8 md:px-14 lg:px-16 xl:px-24">
      <div
        className="pointer-events-none absolute -left-[42rem] top-[-34rem] -z-10 h-[1500px] w-[1500px] opacity-[0.11] md:-left-[48rem] md:top-[-42rem] md:h-[1700px] md:w-[1700px]"
        aria-hidden="true"
      >
        <div className="h-full w-full animate-spin-slower">
          <DigestiveSpiral className="h-full w-full" variant="simple" />
        </div>
      </div>

      <div className="flex min-h-[calc(100svh-12rem)] flex-col justify-center">
        <div className="relative z-10 mx-auto w-full max-w-[104rem] text-left">
          <TextFocusGlow className="-left-24 -top-20 h-[24rem] w-[42rem] rotate-[6deg] opacity-70 md:-left-32 md:-top-24 md:h-[30rem] md:w-[56rem]" />
          <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,58rem)_16rem] lg:gap-6 xl:grid-cols-[minmax(0,62rem)_18rem] xl:gap-7">
            <div className="lg:min-h-[20rem] xl:min-h-[22.5rem]">
              {firstBioBlock && renderFirstBioParagraph(firstBioBlock)}
              {upperBioBlocks.length > 0 && (
                <PortableText
                  value={upperBioBlocks}
                  className="!max-w-none text-left text-[clamp(1.02rem,1.18vw,1.18rem)] leading-[1.52] text-[#A06B43]/88 [&_p]:mb-5 [&_p:last-child]:mb-0"
                />
              )}
            </div>

            <aside className="relative w-44 md:w-56 lg:w-full">
              <TextFocusGlow className="-bottom-14 -right-20 h-[24rem] w-[40rem] rotate-[-10deg] opacity-50 md:-bottom-16 md:-right-28 md:h-[30rem] md:w-[52rem]" />
              {about.photo ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0B0B0B] shadow-[0_24px_70px_-38px_rgba(11,11,11,0.85)]">
                  <div className="absolute inset-0 animate-ken-burns">
                    <Image
                      src={urlFor(about.photo).width(720).height(900).fit('crop').auto('format').url()}
                      alt={about.photoCaption ?? 'Mufutau Yusuf'}
                      fill
                      className="object-cover grayscale"
                      sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 16rem, 14rem"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C2433]/50 via-transparent to-transparent" />
                  {about.photoCaption && (
                    <p className="absolute bottom-4 left-4 text-xs text-[#F3F1EB]/60">{about.photoCaption}</p>
                  )}
                </div>
              ) : (
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0B0B0B]/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="aspect-square w-4/5 opacity-[0.18]">
                      <DigestiveSpiral className="h-full w-full" variant="simple" />
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>

          {remainingBioBlocks.length > 0 && (
            <div className="relative z-10 mt-1 w-full text-left md:mt-2 lg:mt-2">
              <PortableText
                value={remainingBioBlocks}
                className="!max-w-none text-left text-base leading-[1.56] text-[#A06B43]/88 md:text-[1.04rem] xl:text-[1.1rem] [&_p]:mb-6 [&_p:last-child]:mb-0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
