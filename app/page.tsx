import type { Metadata } from 'next'
import Link from 'next/link'
import { getHomePage, getAboutPage, getAllProjects, getAllIronuPosts, getAllEvents, getGlobalSettings } from '@/lib/sanity/queries'
import HeroStack from '@/components/features/home/HeroStack'
import AboutContent from '@/components/features/about/AboutContent'
import ContactForm from '@/components/features/contact/ContactForm'
import ProjectsCarousel from '@/components/features/projects/ProjectsCarousel'
import ProjectsAmbient from '@/components/features/projects/ProjectsAmbient'
import SpiralRings from '@/components/features/projects/SpiralRings'
import IronuSpiral from '@/components/features/ironu/IronuSpiral'
import IronuCarousel from '@/components/features/ironu/IronuCarousel'
import SectionSeam from '@/components/layout/SectionSeam'
import SectionBackdrop from '@/components/layout/SectionBackdrop'
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
  // getAllEvents orders by date desc (furthest future first) — reverse
  // before slicing so "next 3" really means the 3 soonest, not the 3
  // farthest out.
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .reverse()
    .slice(0, 3)

  const email = settings?.email ?? SITE_EMAIL
  const insta = settings?.instagramUrl
  const youtube = settings?.youtubeUrl
  const vimeo = settings?.vimeoUrl

  return (
    <div className="block">

      {/* ── HERO + INTRO TEXT ────────────────────────────────── */}
      <HeroStack
        videoId={homeData?.heroVideoUrl ? extractYouTubeId(homeData.heroVideoUrl) : null}
        introHeading={homeData?.introHeading}
        introText={homeData?.introText ?? []}
      />

      {/* ── ABOUT ────────────────────────────────────────────── */}
      {/* Wrapped in a plain, non-sticky div carrying the id: a `position:
          sticky` element's own `offsetTop` drifts to track the current
          scroll position once you've scrolled past it (a real browser
          quirk), which breaks SideNav's scrollTo-based jump once you're
          deeper in the page. This wrapper's offsetTop stays the true,
          stable document position, since it isn't sticky itself. */}
      <div id="about">
        <section className="sticky top-0 z-10 min-h-screen flex flex-col justify-center py-24">
          <SectionBackdrop id="about" color="#1C2433" />
          <SectionSeam />
          {about ? (
            <AboutContent about={about} />
          ) : (
            <p className="text-[#F3F1EB]/40 text-sm uppercase tracking-widest px-8 md:px-24 lg:px-40">About content coming soon.</p>
          )}
        </section>
      </div>

      {/* ── PROJECTS ─────────────────────────────────────────── */}
      <div id="projects">
        {/* pt/pb deliberately asymmetric, not py-24 — centering on the raw
            viewport left content looking too high, since the fixed logo up
            top eats into the space justify-center doesn't know about. The
            extra top padding nudges the centered block down to sit in the
            middle of what's actually free below the logo. */}
        <section className="relative sticky top-0 z-20 min-h-screen flex flex-col justify-center pt-40 pb-10 overflow-hidden">
          <SectionBackdrop id="projects" color="#8B5F3C" />
          <SectionSeam />
          <ProjectsAmbient />
          <ProjectsCarousel projects={projects} />
        </section>
      </div>

      {/* ── CALENDAR ─────────────────────────────────────────── */}
      <div id="calendar">
        <section className="relative sticky top-0 z-30 min-h-screen flex flex-col justify-center pt-40 pb-10 px-8 md:px-16 lg:px-24">
          <SectionBackdrop id="calendar" color="#1C2433" />
          <SectionSeam />
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium mb-4">What&apos;s next</p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-[#F3F1EB] mb-12 leading-tight">Calendar</h2>
          </Reveal>
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
            <Link
              href="/calendar"
              className="group inline-flex items-center gap-3 text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 text-sm font-semibold tracking-widest uppercase transition-opacity duration-200"
            >
              See all events
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </section>
      </div>

      {/* ── ÌRÒNÚ ────────────────────────────────────────────── */}
      <div id="ironu">
        <section className="sticky top-0 z-40 min-h-screen flex flex-col justify-center py-24">
          <SectionBackdrop id="ironu" color="#8B5F3C" />
          <SectionSeam />
          <IronuSpiral />
          <IronuCarousel posts={ironuPosts} />
        </section>
      </div>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <div id="contact">
        <section className="relative sticky top-0 z-50 min-h-screen flex flex-col justify-center pt-40 pb-10 px-8 md:px-24 lg:px-40 overflow-hidden">
          <SectionBackdrop id="contact" color="#1C2433" />
          <SectionSeam />

          {/* Ambient accent, echoing the same drifting spiral used in
              Projects/Ìrònú — quiet enough not to compete with the form */}
          <div
            className="hidden lg:block absolute top-24 right-16 w-24 h-24 opacity-[0.14] animate-spin-slow pointer-events-none"
            aria-hidden="true"
          >
            <SpiralRings className="w-full h-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <div>
              <Reveal>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#37C6F4] font-medium mb-6">Get in touch</p>
                <h2 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-light text-[#F3F1EB] mb-6 leading-tight">Contact</h2>
                <p className="text-[#F3F1EB]/60 text-base md:text-lg leading-relaxed max-w-md mb-10">
                  A project in mind, a workshop to propose, or just a hello — reach out directly or leave a message and I&apos;ll get back to you.
                </p>
              </Reveal>
              <a
                href={`mailto:${email}`}
                className="block text-2xl md:text-3xl text-[#37C6F4] [@media(hover:hover)]:opacity-70 hover:opacity-100 transition-opacity duration-200 mb-12 font-light break-all"
              >
                {email}
              </a>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
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
            </div>

            <div className="rounded-2xl border border-[#F3F1EB]/10 bg-[#F3F1EB]/[0.03] backdrop-blur-sm p-8 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#37C6F4] font-semibold mb-6">Send a message</p>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}
