import type { Metadata } from 'next'
import { getHomePage, getAboutPage, getAllProjects, getAllIronuPosts, getAllEvents, getGlobalSettings } from '@/lib/sanity/queries'
import HeroSection from '@/components/features/home/HeroSection'
import HeroVideo from '@/components/features/home/HeroVideo'
import HeroIntroOverlay from '@/components/features/home/HeroIntroOverlay'
import AboutContent from '@/components/features/about/AboutContent'
import ProjectsCarousel from '@/components/features/projects/ProjectsCarousel'
import IronuSpiral from '@/components/features/ironu/IronuSpiral'
import IronuCarousel from '@/components/features/ironu/IronuCarousel'
import SectionSeam from '@/components/layout/SectionSeam'
import SectionBackdrop from '@/components/layout/SectionBackdrop'
import MagneticLink from '@/components/ui/MagneticLink'
import Reveal from '@/components/ui/Reveal'
import { extractYouTubeId } from '@/lib/youtube'
import { SITE_NAME, SITE_EMAIL } from '@/constants/site'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'IKUN Mufutau Yusuf — Nigerian-Irish performer, choreographer and teacher.',
}

export default async function HomePage() {
  const [homeData, about, projects, ironuPosts, events, settings] = await Promise.all([
    getHomePage(),
    getAboutPage(),
    getAllProjects(),
    getAllIronuPosts(),
    getAllEvents(),
    getGlobalSettings(),
  ])

  const now = new Date(); now.setHours(0, 0, 0, 0)
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .slice(0, 4)

  const email = settings?.email ?? SITE_EMAIL
  const insta = settings?.instagramUrl
  const youtube = settings?.youtubeUrl
  const vimeo = settings?.vimeoUrl

  return (
    <div className="block">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <HeroSection>
        <div className="absolute inset-0 overflow-hidden">
          {homeData?.heroVideoUrl && (
            <HeroVideo videoId={extractYouTubeId(homeData.heroVideoUrl)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>
        {homeData?.introText && (
          <HeroIntroOverlay heading={homeData.introHeading} text={homeData.introText} />
        )}
      </HeroSection>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section id="about" className="sticky top-0 z-10 min-h-screen flex flex-col justify-center py-24">
        <SectionBackdrop id="about" color="#1C2433" />
        <SectionSeam />
        {about ? (
          <AboutContent about={about} />
        ) : (
          <p className="text-[#F3F1EB]/40 text-sm uppercase tracking-widest px-8 md:px-24 lg:px-40">About content coming soon.</p>
        )}
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────── */}
      <section id="projects" className="sticky top-0 z-20 min-h-screen flex flex-col justify-center py-24">
        <SectionBackdrop id="projects" color="#8B5F3C" />
        <SectionSeam />
        <ProjectsCarousel projects={projects} />
      </section>

      {/* ── CALENDAR ─────────────────────────────────────────── */}
      <section id="calendar" className="sticky top-0 z-30 min-h-screen flex flex-col justify-center py-24 px-8 md:px-16 lg:px-24">
        <SectionBackdrop id="calendar" color="#1C2433" />
        <SectionSeam />
        {upcomingEvents.length === 0 ? (
          <p className="text-[#F3F1EB]/40 text-sm uppercase tracking-widest">No upcoming events.</p>
        ) : (
          <div className="divide-y divide-[#F3F1EB]/15">
            {upcomingEvents.map((event, i) => {
              const d = new Date(event.date)
              const day = String(d.getDate()).padStart(2, '0')
              const mon = String(d.getMonth() + 1).padStart(2, '0')
              const yr = d.getFullYear()
              const loc = [event.city, event.country].filter(Boolean).join(', ')
              return (
                <Reveal key={event._id} delay={i * 80}>
                  <div className="py-7 grid grid-cols-[80px_1fr_auto] gap-8 items-start">
                    <p className="text-4xl font-light text-[#37C6F4] font-[family-name:var(--font-heading)] tabular-nums leading-none">
                      {day}
                      <span className="block text-[11px] tracking-widest text-[#37C6F4]/50 mt-1 font-normal">{mon}.{yr}</span>
                    </p>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] mb-1">{event.eventType}</p>
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-light text-[#F3F1EB]">{event.title}</h3>
                      {loc && <p className="text-sm text-[#F3F1EB]/50 mt-1">{loc}</p>}
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
                </Reveal>
              )
            })}
          </div>
        )}
        <div className="mt-14 flex justify-end">
          <MagneticLink
            href="/calendar"
            className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
          >
            Full calendar
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticLink>
        </div>
      </section>

      {/* ── ÌRÒNÚ ────────────────────────────────────────────── */}
      <section id="ironu" className="sticky top-0 z-40 min-h-screen flex flex-col justify-center py-24">
        <SectionBackdrop id="ironu" color="#8B5F3C" />
        <SectionSeam />
        <IronuSpiral />
        <IronuCarousel posts={ironuPosts} />
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" className="sticky top-0 z-50 min-h-screen flex flex-col justify-center py-24 px-8 md:px-24 lg:px-40">
        <SectionBackdrop id="contact" color="#1C2433" />
        <SectionSeam />
        <Reveal>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium mb-6">Get in touch</p>
          <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-light text-[#F3F1EB] mb-12 leading-tight">Contact</h2>
        </Reveal>
        <a
          href={`mailto:${email}`}
          className="text-2xl md:text-3xl text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 transition-opacity duration-200 mb-12 font-light"
        >
          {email}
        </a>
        <div className="flex items-center gap-8">
          {insta && (
            <a href={insta} target="_blank" rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-widest text-[#F3F1EB]/50 hover:text-[#37C6F4] transition-colors duration-200">
              Instagram
            </a>
          )}
          {youtube && (
            <a href={youtube} target="_blank" rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-widest text-[#F3F1EB]/50 hover:text-[#37C6F4] transition-colors duration-200">
              YouTube
            </a>
          )}
          {vimeo && (
            <a href={vimeo} target="_blank" rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-widest text-[#F3F1EB]/50 hover:text-[#37C6F4] transition-colors duration-200">
              Vimeo
            </a>
          )}
        </div>
        <div className="mt-16">
          <MagneticLink
            href="/contact"
            className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
          >
            Full contact page
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticLink>
        </div>
      </section>

    </div>
  )
}
