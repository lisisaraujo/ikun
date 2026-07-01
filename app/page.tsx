import type { Metadata } from 'next'
import Link from 'next/link'
import { getHomePage, getAllProjects, getAllEvents } from '@/lib/sanity/queries'
import HeroVideo, { extractYouTubeId } from '@/components/features/home/HeroVideo'
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
      <section className="relative h-screen min-h-[500px] flex items-end overflow-hidden bg-[#0B0B0B]">
        {homeData?.heroVideoUrl ? (
          <HeroVideo videoId={extractYouTubeId(homeData.heroVideoUrl)} />
        ) : null}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

        <Container className="relative z-20 pb-16 md:pb-24">
          <p className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.2em] text-[#37C6F4] mb-4">
            Performer · Choreographer · Teacher
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl font-800 text-[#F3F1EB] leading-tight">
            IKUN
            <br />
            Mufutau Yusuf
          </h1>
        </Container>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      {homeData?.introText && (
        <Section className="bg-[#F3F1EB]">
          <Container>
            <HomeIntro heading={homeData.introHeading} text={homeData.introText} />
          </Container>
        </Section>
      )}

      {/* ── Featured Projects ─────────────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <Section className="bg-[#1C2433]">
          <Container>
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-700 text-[#F3F1EB]">
                Projects
              </h2>
              <Link
                href="/projects"
                className="text-sm text-[#37C6F4] hover:underline underline-offset-2"
              >
                All projects →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} dark />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── Upcoming Events ───────────────────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <Section className="bg-[#F3F1EB]">
          <Container>
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-700 text-[#1C2433]">
                Upcoming
              </h2>
              <Link
                href="/calendar"
                className="text-sm text-[#1C2433] hover:text-[#37C6F4] transition-colors"
              >
                Full calendar →
              </Link>
            </div>
            <div className="divide-y divide-[#C9C9C9]">
              {upcomingEvents.map((event) => (
                <EventRow key={event._id} event={event} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
