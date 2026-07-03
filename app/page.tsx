import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getHomePage, getAllProjects, getAllEvents } from '@/lib/sanity/queries'
import HeroVideo from '@/components/features/home/HeroVideo'
import { extractYouTubeId } from '@/lib/youtube'
import HomeIntro from '@/components/features/home/HomeIntro'
import ProjectCard from '@/components/features/projects/ProjectCard'
import EventRow from '@/components/features/calendar/EventRow'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import { SITE_NAME } from '@/constants/site'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'IKUN Mufutau Yusuf — Nigerian-Irish performer, choreographer and teacher.',
}

export default async function HomePage() {
  const [homeData, projects, events] = await Promise.all([
    getHomePage(),
    getAllProjects(),
    getAllEvents(),
  ])

  const featuredProjects = projects.slice(0, 3)
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 4)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[500px] bg-[#0B0B0B]">
        {/* Video + gradient — overflow-hidden scoped here so text isn't clipped */}
        <div className="absolute inset-0 overflow-hidden">
          {homeData?.heroVideoUrl ? (
            <HeroVideo videoId={extractYouTubeId(homeData.heroVideoUrl)} />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>

        {/* Logo + name */}
        <div className="absolute top-20 left-8 z-20 md:left-10 lg:left-16">
          <h1 className="flex items-center gap-5 md:gap-7">
            {/* Wrapper div controls size; image fills it */}
            <div className="flex-shrink-0 h-36 md:h-52 lg:h-64" style={{ width: 'auto', aspectRatio: '2421/1754' }}>
              <Image
                src="/ikun-logo-white.png"
                alt="IKUN"
                width={2421}
                height={1754}
                priority
                style={{ height: '100%', width: 'auto' }}
              />
            </div>
            <div className="font-[family-name:var(--font-heading)] leading-snug text-[#F3F1EB] font-light">
              <div className="text-2xl md:text-4xl lg:text-5xl tracking-[0.18em]">MUFUTAU</div>
              <div className="text-2xl md:text-4xl lg:text-5xl tracking-[0.18em]">YUSUF</div>
            </div>
          </h1>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      {homeData?.introText && (
        <Section className="bg-[#F3F1EB] border-t-2 border-[#37C6F4]">
          <Container>
            <HomeIntro heading={homeData.introHeading} text={homeData.introText} />
            <div className="mt-12 flex justify-end">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[#37C6F4] opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
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
      )}

    </>
  )
}
