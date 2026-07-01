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
      <div className="text-[#0B0B0B]/80 text-base md:text-lg leading-relaxed mb-8">
        <PortableText value={text} />
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/about"
          className="inline-block rounded bg-[#1C2433] px-6 py-3 text-sm font-semibold text-[#F3F1EB] transition-colors hover:bg-[#37C6F4] hover:text-[#0B0B0B]"
        >
          About Mufutau
        </Link>
        <Link
          href="/projects"
          className="inline-block rounded border border-[#1C2433] px-6 py-3 text-sm font-semibold text-[#1C2433] transition-colors hover:bg-[#1C2433] hover:text-[#F3F1EB]"
        >
          View Projects
        </Link>
      </div>
    </div>
  )
}
