import type { Metadata } from 'next'
import { getAboutPage } from '@/lib/sanity/queries'
import AboutContent from '@/components/features/about/AboutContent'
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
      <Section className="bg-[#8B5F3C]">
        <Container>
          {about ? (
            <AboutContent about={about} />
          ) : (
            <p className="text-[#F3F1EB]/50 text-sm">Content coming soon.</p>
          )}
        </Container>
      </Section>
    </>
  )
}
