import { PortableText as SanityPortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import type { SanityImage } from '@/types/sanity'

interface PortableTextProps {
  value: PortableTextBlock[]
  className?: string
}

const components = {
  types: {
    image: ({ value }: { value: SanityImage & { alt?: string } }) => (
      <figure className="my-8">
        <Image
          src={urlFor(value).width(900).fit('max').auto('format').url()}
          alt={value.alt ?? ''}
          width={900}
          height={600}
          className="rounded-2xl"
          style={{ objectFit: 'cover' }}
        />
      </figure>
    ),
  },
}

export default function PortableText({ value, className = '' }: PortableTextProps) {
  return (
    <div className={`prose-ikun ${className}`}>
      <SanityPortableText value={value} components={components} />
    </div>
  )
}
