import Image from 'next/image'
import PortableText from '@/components/ui/PortableText'
import { urlFor } from '@/lib/sanity/image'
import type { AboutPage } from '@/types/sanity'

interface AboutContentProps {
  about: AboutPage
}

export default function AboutContent({ about }: AboutContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
      <div className="lg:col-span-3">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-[#F3F1EB] mb-3 leading-tight">
          Mufutau Yusuf
        </h2>
        <p className="text-[#F3F1EB]/70 text-base md:text-lg font-light mb-10 leading-relaxed">
          Performer, Choreographer, Teacher.
        </p>
        <PortableText value={about.bio} className="prose-ikun-editorial text-[#F3F1EB]/85 text-base md:text-lg" />
      </div>

      {about.photo && (
        <div className="lg:col-span-2">
          <figure className="lg:sticky lg:top-32">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden">
              <Image
                src={urlFor(about.photo).width(600).height(800).fit('crop').auto('format').url()}
                alt={about.photoCaption ?? 'Mufutau Yusuf'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            {about.photoCaption && (
              <figcaption className="mt-3 text-xs text-[#F3F1EB]/50">
                {about.photoCaption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  )
}
