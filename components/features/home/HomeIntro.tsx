import Link from 'next/link'
import PortableText from '@/components/ui/PortableText'
import type { PortableTextBlock } from '@portabletext/types'

interface HomeIntroProps {
  heading?: string
  text: PortableTextBlock[]
}

export default function HomeIntro({ heading, text }: HomeIntroProps) {
  return (
    <div className="max-w-2xl">
      {heading && (
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-800 text-[#1C2433] mb-6">
          {heading}
        </h2>
      )}
      <div className="text-[#8B5F3C]/80 text-base md:text-lg leading-relaxed mb-8">
        <PortableText value={text} />
      </div>
    </div>
  )
}
