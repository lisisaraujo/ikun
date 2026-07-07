import type { Metadata } from 'next'
import Link from 'next/link'
import { getHomePage } from '@/lib/sanity/queries'
import HeroVideo from '@/components/features/home/HeroVideo'
import { extractYouTubeId } from '@/lib/youtube'
import HomeIntro from '@/components/features/home/HomeIntro'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import { SITE_NAME } from '@/constants/site'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'IKUN Mufutau Yusuf — Nigerian-Irish performer, choreographer and teacher.',
}

export default async function HomePage() {
  const homeData = await getHomePage()

  return (
    <div className="block">
      {/* ── Hero — sticky so it stays pinned while intro slides over it ── */}
      <section className="sticky top-0 z-0 h-screen bg-[#0B0B0B] -mt-16">
        <div className="absolute inset-0 overflow-hidden">
          {homeData?.heroVideoUrl ? (
            <HeroVideo videoId={extractYouTubeId(homeData.heroVideoUrl)} />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>
      </section>

      {/* ── Intro — z-10 so it layers above the sticky hero as it scrolls up ── */}
      {homeData?.introText && (
        <div className="relative z-10">
          <Section className="bg-[#F3F1EB] border-t-2 border-[#37C6F4]">
            <Container>
              <HomeIntro heading={homeData.introHeading} text={homeData.introText} />
              <div className="mt-12 flex justify-end">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
                >
                  About
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </Container>
          </Section>
        </div>
      )}
    </div>
  )
}
