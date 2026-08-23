import type { PortableTextBlock } from '@portabletext/types'
import TextFocusGlow from '@/components/layout/TextFocusGlow'

interface IkunPageProps {
  text: PortableTextBlock[]
}

function blockText(block: PortableTextBlock) {
  if (block._type !== 'block' || !Array.isArray(block.children)) return ''
  return block.children
    .map((child) => ('text' in child && typeof child.text === 'string' ? child.text : ''))
    .join('')
    .trim()
}

function introParagraphs(text: PortableTextBlock[]) {
  const paragraphs: string[] = []
  let continuingParagraph = false

  text.forEach((block) => {
    const raw = blockText(block)
    if (!raw) {
      continuingParagraph = false
      return
    }

    if (continuingParagraph && paragraphs.length > 0) {
      paragraphs[paragraphs.length - 1] = `${paragraphs[paragraphs.length - 1]} ${raw}`
    } else {
      paragraphs.push(raw)
    }
    continuingParagraph = true
  })

  return paragraphs
}

function renderLinkedName(paragraph: string) {
  const name = 'Mufutau Yusuf'
  const parts = paragraph.split(name)

  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && (
        <a
          href="#about"
          className="font-medium text-[#B97A4A] transition-[color,opacity] duration-200 hover:text-[#37C6F4] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60"
        >
          {name}
        </a>
      )}
    </span>
  ))
}

export default function IkunPage({ text }: IkunPageProps) {
  const paragraphs = introParagraphs(text)

  if (paragraphs.length === 0) return null

  const [leadParagraph, ...bodyParagraphs] = paragraphs

  return (
    <section id="ikun" className="relative z-[1] min-h-[86svh] overflow-visible px-6 pb-8 pt-14 sm:px-8 md:px-16 md:pt-18 lg:px-24">
      <div className="relative mx-auto flex min-h-[calc(86svh-5rem)] w-full max-w-[104rem] flex-col justify-center">
        <div className="relative z-10 ml-auto w-full max-w-[72rem] text-left lg:text-right">
          <TextFocusGlow className="-right-28 -top-20 h-[24rem] w-[46rem] -rotate-6 opacity-80 md:-right-40 md:-top-24 md:h-[30rem] md:w-[62rem]" />
          <p
            className="font-[family-name:var(--font-body)] text-[clamp(1.35rem,2.12vw,2.08rem)] font-light leading-[1.4] tracking-normal text-[#A06B43] [text-shadow:0_2px_14px_rgba(0,0,0,0.18)]"
            style={{ fontFamily: "var(--font-body), 'Noto Sans', system-ui, sans-serif" }}
          >
            {renderLinkedName(leadParagraph)}
          </p>
        </div>

        <div className="relative z-10 mt-10 w-full max-w-[57rem] text-left md:mt-12 lg:mt-14 lg:ml-[6vw]">
          <TextFocusGlow className="-bottom-20 -left-24 h-[22rem] w-[38rem] rotate-[8deg] opacity-55 md:-bottom-24 md:-left-32 md:h-[28rem] md:w-[48rem]" />
          <div className="flex flex-col gap-6 md:gap-7">
            {bodyParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-[family-name:var(--font-body)] text-[clamp(1rem,1.1vw,1.16rem)] font-light leading-[1.58] tracking-normal text-[#A06B43] [text-shadow:0_2px_14px_rgba(0,0,0,0.18)]"
                style={{ fontFamily: "var(--font-body), 'Noto Sans', system-ui, sans-serif" }}
              >
                {renderLinkedName(paragraph)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
