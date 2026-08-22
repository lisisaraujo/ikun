import type { PortableTextBlock } from '@portabletext/types'
import SectionOrbitBackground from '@/components/features/carousel/SectionOrbitBackground'
import SpiralRings from '@/components/features/projects/SpiralRings'

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

export default function IkunPage({ text }: IkunPageProps) {
  const paragraphs = introParagraphs(text)

  if (paragraphs.length === 0) return null

  return (
    <section className="relative z-[1] min-h-screen overflow-hidden px-6 pb-20 pt-32 sm:px-8 md:px-16 md:pt-36 lg:px-24">
      <div className="absolute inset-0 -z-20 bg-[#1C2433]" aria-hidden="true" />
      <SectionOrbitBackground channel="projects" sizeClassName="w-[800px] h-[800px] sm:w-[950px] sm:h-[950px] md:w-[1100px] md:h-[1100px]">
        <div className="h-full w-full opacity-[0.16]">
          <SpiralRings className="h-full w-full" />
        </div>
      </SectionOrbitBackground>

      <div className="relative mx-auto grid min-h-[calc(100svh-13rem)] w-full max-w-[110rem] gap-10 md:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1fr)] md:gap-14 lg:grid-cols-[minmax(22rem,0.95fr)_minmax(30rem,0.9fr)] lg:gap-20">
        <div className="pt-2 md:pt-8" aria-hidden="true">
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2.5rem,10vw,5rem)] font-black uppercase leading-[0.8] tracking-normal text-[#F3F1EB]">
            IKUN
          </h1>
          <div className="mt-9 h-1.5 w-full max-w-[34rem] bg-[#F3F1EB]" />
        </div>

        <div className="max-w-[44rem] md:pt-24 lg:pt-32">
          <div className="flex flex-col gap-7">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="font-[family-name:var(--font-body)] text-[clamp(1.15rem,1.6vw,1.55rem)] font-light italic leading-[1.35] tracking-normal text-[#8B5F3C] [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] lg:leading-[1.38]"
                style={{ fontFamily: "var(--font-body), 'Noto Sans', system-ui, sans-serif" }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
