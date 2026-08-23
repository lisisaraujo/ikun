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

  const [leadParagraph] = paragraphs

  return (
    <section id="ikun" className="relative z-[1] overflow-visible px-4 pb-20 pt-20 sm:px-6 md:px-8 md:pb-24 md:pt-24 lg:px-10 xl:px-12">
      <div className="relative mx-auto flex w-full max-w-[136rem] flex-col justify-center">
        <div className="relative z-10 mx-auto w-full max-w-[108rem] text-center">
          <TextFocusGlow className="-right-24 -top-20 h-[26rem] w-[52rem] -rotate-6 opacity-85 md:-right-36 md:-top-24 md:h-[32rem] md:w-[68rem]" />
          <p
            className="font-[family-name:var(--font-body)] text-[clamp(1.48rem,2.38vw,2.38rem)] font-light leading-[1.38] tracking-normal text-[#A06B43] [text-shadow:0_2px_14px_rgba(0,0,0,0.18)]"
            style={{ fontFamily: "var(--font-body), 'Noto Sans', system-ui, sans-serif" }}
          >
            {renderLinkedName(leadParagraph)}
          </p>
        </div>
      </div>
    </section>
  )
}
