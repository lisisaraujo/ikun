import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getHomePage, getAllProjects, getAllEvents, getGlobalSettings } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import HeroVideo from '@/components/features/home/HeroVideo'
import HomeIntro from '@/components/features/home/HomeIntro'
import { extractYouTubeId } from '@/lib/youtube'
import { SITE_NAME, SITE_EMAIL } from '@/constants/site'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'IKUN Mufutau Yusuf — Nigerian-Irish performer, choreographer and teacher.',
}

export default async function HomePage() {
  const [homeData, projects, events, settings] = await Promise.all([
    getHomePage(),
    getAllProjects(),
    getAllEvents(),
    getGlobalSettings(),
  ])

  const featuredProjects = projects.slice(0, 3)

  const now = new Date(); now.setHours(0, 0, 0, 0)
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .slice(0, 4)

  const email    = settings?.email ?? SITE_EMAIL
  const insta    = settings?.instagramUrl
  const youtube  = settings?.youtubeUrl
  const vimeo    = settings?.vimeoUrl

  return (
    <div className="block">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="hero" className="sticky top-0 z-0 h-screen bg-[#0B0B0B]">
        <div className="absolute inset-0 overflow-hidden">
          {homeData?.heroVideoUrl && (
            <HeroVideo videoId={extractYouTubeId(homeData.heroVideoUrl)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section id="about" className="relative z-10 min-h-screen flex flex-col justify-center bg-[#F3F1EB] border-t-2 border-[#37C6F4] px-8 md:px-24 lg:px-40 py-32">
        {homeData?.introText ? (
          <>
            <HomeIntro heading={homeData.introHeading} text={homeData.introText} />
            <div className="mt-14 flex justify-end">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
              >
                Full bio
                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-[#8B5F3C]/40 text-sm uppercase tracking-widest">About content coming soon.</p>
        )}
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────── */}
      <section id="projects" className="relative z-10 min-h-screen bg-[#0B0B0B] flex flex-col justify-center py-24 px-8 md:px-16 lg:px-24">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium mb-10">Selected work</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featuredProjects.map((project) => {
            const coverUrl = project.coverImage
              ? urlFor(project.coverImage).width(800).height(500).auto('format').url()
              : null
            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug.current}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1C2433] mb-4">
                  {coverUrl && (
                    <Image
                      src={coverUrl}
                      alt={project.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#37C6F4] mb-1">{project.year}</p>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-light text-[#F3F1EB] group-hover:text-[#37C6F4] transition-colors duration-200">
                  {project.title}
                </h3>
                {project.location && (
                  <p className="text-sm text-[#C9C9C9]/40 mt-1">{project.location}</p>
                )}
              </Link>
            )
          })}
        </div>
        <div className="mt-14 flex justify-end">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
          >
            All projects
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── CALENDAR ─────────────────────────────────────────── */}
      <section id="calendar" className="relative z-10 min-h-screen bg-[#F3F1EB] flex flex-col justify-center py-24 px-8 md:px-16 lg:px-24">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium mb-10">Upcoming</p>
        {upcomingEvents.length === 0 ? (
          <p className="text-[#8B5F3C]/40 text-sm uppercase tracking-widest">No upcoming events.</p>
        ) : (
          <div className="divide-y divide-[#8B5F3C]/15">
            {upcomingEvents.map((event) => {
              const d   = new Date(event.date)
              const day = String(d.getDate()).padStart(2, '0')
              const mon = String(d.getMonth() + 1).padStart(2, '0')
              const yr  = d.getFullYear()
              const loc = [event.city, event.country].filter(Boolean).join(', ')
              return (
                <div key={event._id} className="py-7 grid grid-cols-[80px_1fr_auto] gap-8 items-start">
                  <p className="text-4xl font-light text-[#37C6F4] font-[family-name:var(--font-heading)] tabular-nums leading-none">
                    {day}
                    <span className="block text-[11px] tracking-widest text-[#37C6F4]/50 mt-1 font-normal">{mon}.{yr}</span>
                  </p>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] mb-1">{event.eventType}</p>
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-light text-[#8B5F3C]">{event.title}</h3>
                    {loc && <p className="text-sm text-[#8B5F3C]/45 mt-1">{loc}</p>}
                  </div>
                  {event.ticketLink && (
                    <a
                      href={event.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-widest text-[#37C6F4] [@media(hover:hover)]:opacity-50 hover:opacity-100 transition-opacity mt-1"
                    >
                      Book ↗
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
        <div className="mt-14 flex justify-end">
          <Link
            href="/calendar"
            className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
          >
            Full calendar
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── ÌRÒNÚ ────────────────────────────────────────────── */}
      <section id="ironu" className="relative z-10 min-h-screen bg-[#1C2433] flex flex-col justify-center py-24 px-8 md:px-24 lg:px-40">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium mb-6">Dance journal</p>
        <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-light text-[#F3F1EB] mb-8 leading-tight">Ìrònú</h2>
        <p className="text-[#C9C9C9]/60 max-w-xl leading-relaxed mb-14">
          A journal of reflection, process and practice — writings, videos and visual notes from the studio.
        </p>
        <Link
          href="/ironu"
          className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200 self-start"
        >
          Explore
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" className="relative z-10 min-h-screen bg-[#F3F1EB] flex flex-col justify-center py-24 px-8 md:px-24 lg:px-40">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium mb-6">Get in touch</p>
        <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-light text-[#8B5F3C] mb-12 leading-tight">Contact</h2>
        <a
          href={`mailto:${email}`}
          className="text-2xl md:text-3xl text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 transition-opacity duration-200 mb-12 font-light"
        >
          {email}
        </a>
        <div className="flex items-center gap-8">
          {insta && (
            <a href={insta} target="_blank" rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-widest text-[#8B5F3C]/50 hover:text-[#37C6F4] transition-colors duration-200">
              Instagram
            </a>
          )}
          {youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-widest text-[#8B5F3C]/50 hover:text-[#37C6F4] transition-colors duration-200">
              YouTube
            </a>
          )}
          {vimeo && (
            <a href={vimeo} target="_blank" rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-widest text-[#8B5F3C]/50 hover:text-[#37C6F4] transition-colors duration-200">
              Vimeo
            </a>
          )}
        </div>
        <div className="mt-16">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
          >
            Full contact page
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  )
}
