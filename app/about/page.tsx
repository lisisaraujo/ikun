import type { Metadata } from 'next'
import Image from 'next/image'
import { getAboutPage } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import PortableText from '@/components/ui/PortableText'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Mufutau Yusuf — Nigerian-Irish performer, choreographer and teacher.',
}

export default async function AboutPage() {
  const about = await getAboutPage()

  return (
    <>
      <PageHeader
        title="About"
        subtitle="Mufutau Yusuf — Performer, Choreographer, Teacher."
      />
      <Section className="bg-[#F3F1EB]">
        <Container>
          {about ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Bio text */}
              <div className="lg:col-span-3">
                <PortableText value={about.bio} />
              </div>

              {/* Photo */}
              {about.photo && (
                <div className="lg:col-span-2">
                  <figure>
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
                      <figcaption className="mt-3 text-xs text-[#0B0B0B]/50">
                        {about.photoCaption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[#0B0B0B]/50 text-sm">Content coming soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
