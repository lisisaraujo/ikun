import Image from 'next/image'
import PortableText from '@/components/ui/PortableText'
import { urlFor } from '@/lib/sanity/image'
import type { AboutPage } from '@/types/sanity'

interface AboutContentProps {
  about: AboutPage
}

export default function AboutContent({ about }: AboutContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
      <div className="lg:col-span-7">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-[#F3F1EB] mb-4 leading-tight">
          Mufutau Yusuf
        </h2>
        <p className="font-[family-name:var(--font-heading)] italic font-light text-[#F3F1EB]/80 text-xl md:text-2xl mb-10 leading-snug max-w-md">
          Performer, Choreographer, Teacher.
        </p>
        <PortableText value={about.bio} className="prose-ikun-editorial text-[#F3F1EB]/85 text-base md:text-lg" />
      </div>

      {about.photo && (
        <div className="lg:col-span-5">
          <figure className="lg:sticky lg:top-32 lg:mt-20 lg:mr-[-2rem] xl:mr-[-4rem]">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
              <Image
                src={urlFor(about.photo).width(700).height(875).fit('crop').auto('format').url()}
                alt={about.photoCaption ?? 'Mufutau Yusuf'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
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
