import type { Metadata } from 'next'
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
      <section className="relative h-screen min-h-[500px] overflow-hidden bg-[#0B0B0B]">
        {homeData?.heroVideoUrl ? (
          <HeroVideo videoId={extractYouTubeId(homeData.heroVideoUrl)} />
        ) : null}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

        {/* Top-left: IKUN logo — offset below the fixed navbar (~64px) */}
        <div className="absolute top-20 left-8 z-20 md:left-10 lg:left-16">
          <p className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[#37C6F4] mb-2">
            Performer · Choreographer · Teacher
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-800 text-[#F3F1EB] leading-tight">
            IKUN
            <br />
            Mufutau Yusuf
          </h1>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      {homeData?.introText && (
        <Section className="bg-[#F3F1EB]">
          <Container>
            <HomeIntro heading={homeData.introHeading} text={homeData.introText} />
            <div className="mt-12 flex justify-end">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[#1C2433] text-sm font-semibold tracking-widest uppercase hover:text-[#37C6F4] transition-colors"
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
