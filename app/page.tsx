import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getHomePage, getAboutPage, getAllProjects, getAllIronuPosts, getAllEvents, getGlobalSettings } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import HeroStack from '@/components/features/home/HeroStack'
import AboutContent from '@/components/features/about/AboutContent'
import ContactForm from '@/components/features/contact/ContactForm'
import ProjectsCarousel from '@/components/features/projects/ProjectsCarousel'
import ProjectsAmbient from '@/components/features/projects/ProjectsAmbient'
import SpiralRings from '@/components/features/projects/SpiralRings'
import IronuCarousel from '@/components/features/ironu/IronuCarousel'
import IronuSpiralGraphic from '@/components/features/ironu/IronuSpiralGraphic'
import SectionOrbitBackground from '@/components/features/carousel/SectionOrbitBackground'
import SectionBackdrop from '@/components/layout/SectionBackdrop'
import Reveal from '@/components/ui/Reveal'
import KineticHeading from '@/components/ui/KineticHeading'
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
  const calendarImage = upcomingEvents.find((event) => event.image)?.image

  const email = settings?.email ?? SITE_EMAIL
  const insta = settings?.instagramUrl
  const youtube = settings?.youtubeUrl
  const vimeo = settings?.vimeoUrl

  return (
    <div className="block">

      {/* ── HERO + INTRO TEXT ────────────────────────────────── */}
      <HeroStack
        playbackId={homeData?.heroMuxPlaybackId ?? null}
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
          <SectionBackdrop color="#1C2433" />

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
          <SectionBackdrop color="#1C2433" />
          <ProjectsAmbient />
          <SectionOrbitBackground channel="projects" sizeClassName="w-[800px] h-[800px] sm:w-[950px] sm:h-[950px] md:w-[1100px] md:h-[1100px]">
            <div className="h-full w-full opacity-[0.16]">
              <SpiralRings className="h-full w-full" />
            </div>
          </SectionOrbitBackground>
          <ProjectsCarousel projects={projects} />
        </section>
      </div>

      {/* ── CALENDAR ─────────────────────────────────────────── */}
      <div id="calendar">
        <section className="relative sticky top-0 z-30 min-h-screen flex flex-col justify-center overflow-hidden px-6 pb-10 pt-32 sm:px-8 md:px-16 md:pt-36 lg:px-24">
          <SectionBackdrop color="#1C2433" />
          {calendarImage && (
            <div className="absolute inset-0 -z-[5]" aria-hidden="true">
              <Image
                src={urlFor(calendarImage).width(2200).auto('format').url()}
                alt=""
                fill
                className="object-cover object-[70%_center] opacity-35 grayscale"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#1C2433_0%,rgba(28,36,51,0.86)_35%,rgba(28,36,51,0.28)_78%,#1C2433_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,#1C2433_0%,transparent_42%,rgba(28,36,51,0.55)_100%)]" />
            </div>
          )}

          <div className="mx-auto w-full max-w-[110rem]" aria-label="Upcoming events">
            <div className="mb-5 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.28em] text-[#8B5F3C] md:mb-7">
              <p>What&apos;s next</p>
              <p className="hidden sm:block">Upcoming performances&nbsp;&nbsp; / &nbsp;&nbsp;01—{String(upcomingEvents.length).padStart(2, '0')}</p>
            </div>

            <div className="border-t-[6px] border-[#8B5F3C]/75">
              {upcomingEvents.length === 0 ? (
                <p className="border-b-[6px] border-[#8B5F3C]/25 py-10 text-sm uppercase tracking-widest text-[#8B5F3C]/40">
                  No upcoming events.
                </p>
              ) : (
                upcomingEvents.map((event, i) => {
                  const d = new Date(event.date)
                  const date = d.toLocaleDateString('en-IE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                  const loc = [event.city, event.country].filter(Boolean).join(', ')

                  return (
                    <Reveal key={event._id} delay={i * 80}>
                      <article className="group grid gap-4 border-b-[6px] border-[#8B5F3C]/55 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center md:grid-cols-[4.5rem_minmax(0,1fr)_auto] md:gap-8 md:py-6">
                        <p className="hidden font-[family-name:var(--font-heading)] text-4xl font-light italic leading-none text-[#8B5F3C]/45 sm:block md:text-5xl" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </p>
                        <div className="min-w-0">
                          <p className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B5F3C]">
                            <span>{event.eventType}</span>
                            <span className="h-px w-5 bg-[#8B5F3C]/45" aria-hidden="true" />
                            <time dateTime={event.date}>{date}</time>
                          </p>
                          <h3 className="max-w-5xl font-[family-name:var(--font-heading)] text-3xl font-light italic leading-[0.95] tracking-[-0.035em] text-[#8B5F3C] transition-transform duration-500 group-hover:translate-x-2 md:text-[clamp(2.4rem,3.6vw,4.75rem)]">
                            {event.title}
                          </h3>
                          <p className="mt-2 text-xs text-[#8B5F3C]/65 md:text-sm">
                            {[event.venue, loc].filter(Boolean).join(' · ')}
                          </p>
                        </div>

                        {event.ticketLink && (
                          <a
                            href={event.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-3 rounded-full border border-[#F3F1EB]/75 bg-[#F3F1EB] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#1C2433] transition-colors duration-200 hover:border-[#8B5F3C] hover:bg-[#8B5F3C] hover:text-[#F3F1EB] sm:justify-self-end"
                            aria-label={`Tickets for ${event.title}`}
                          >
                            Tickets
                            <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </article>
                    </Reveal>
                  )
                })
              )}
            </div>

            <div className="mt-8 flex justify-end md:mt-10">
              <Link
                href="/calendar"
                className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[#8B5F3C] transition-opacity duration-200 [@media(hover:hover)]:opacity-70 hover:opacity-100"
              >
                See all events
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── ÌRÒNÚ ────────────────────────────────────────────── */}
      <div id="ironu">
        <section className="sticky top-0 z-40 min-h-screen flex flex-col justify-center py-24">
          <SectionBackdrop color="#1C2433" />
          <SectionOrbitBackground channel="ironu" sizeClassName="w-[800px] h-[800px] sm:w-[950px] sm:h-[950px] md:w-[1100px] md:h-[1100px]">
            <IronuSpiralGraphic className="h-full w-full" opacity={0.16} />
          </SectionOrbitBackground>
          <IronuCarousel posts={ironuPosts} />
        </section>
      </div>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <div id="contact">
        <section className="relative sticky top-0 z-50 min-h-screen flex flex-col justify-center pt-40 pb-10 px-8 md:px-24 lg:px-40 overflow-hidden">
          <SectionBackdrop color="#1C2433" />

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
                <KineticHeading className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-light text-[#F3F1EB] mb-6 leading-tight">Contact</KineticHeading>
                <p className="text-[#F3F1EB]/60 text-base md:text-lg leading-relaxed max-w-md mb-10">
                  A project in mind, a workshop to propose, or just a <span className="text-[#37C6F4]">hello</span> — reach out directly or leave a message and I&apos;ll get back to you.
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
