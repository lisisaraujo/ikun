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
 
      <div className="text-[#8B5F3C]/80 text-base md:text-lg leading-relaxed mb-8">
        <PortableText value={text} />
      </div>
    </div>
  )
}
