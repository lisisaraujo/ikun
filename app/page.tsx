import type { Metadata } from 'next'
import { getHomePage, getAboutPage, getAllProjects, getAllIronuPosts, getAllEvents, getGlobalSettings } from '@/lib/sanity/queries'
import DigestiveSpiral from '@/components/features/home/DigestiveSpiral'
import HeroStack from '@/components/features/home/HeroStack'
import AboutContent from '@/components/features/about/AboutContent'
import CalendarPreview from '@/components/features/calendar/CalendarPreview'
import ContactForm from '@/components/features/contact/ContactForm'
import ProjectsCarousel from '@/components/features/projects/ProjectsCarousel'
import ProjectsAmbient from '@/components/features/projects/ProjectsAmbient'
import IronuPreview from '@/components/features/ironu/IronuPreview'
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
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const calendarImage = upcomingEvents.find((event) => event.image)?.image

  const email = settings?.email ?? SITE_EMAIL
  const insta = settings?.instagramUrl
  const youtube = settings?.youtubeUrl
  const vimeo = settings?.vimeoUrl

  return (
    <div className="block">

      <div className="relative isolate bg-[#1C2433]">
        <div className="pointer-events-none absolute left-1/2 top-[92svh] z-0 h-[1500px] w-[1500px] -translate-x-1/2 opacity-[0.13] md:left-[56%] md:top-[86svh] md:h-[1700px] md:w-[1700px]" aria-hidden="true">
          <div className="h-full w-full animate-spin-slower">
            <DigestiveSpiral className="h-full w-full" variant="simple" />
            {/* <DigestiveSpiral className="h-full w-full" variant="segmented" /> */}
            {/* <DigestiveSpiral className="h-full w-full" variant="original" /> */}
          </div>
        </div>

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
          <section className="sticky top-0 z-10 min-h-screen flex flex-col justify-start pb-20 pt-16 md:pt-20">
            {about ? (
              <AboutContent
                about={about}
                companyText={homeData?.introText ?? []}
                projects={projects}
              />
            ) : (
              <p className="text-[#F3F1EB]/40 text-sm uppercase tracking-widest px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">About content coming soon.</p>
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
          <section className="relative sticky top-0 z-20 min-h-screen flex flex-col justify-start pt-28 pb-10 overflow-hidden md:pt-32">
            <ProjectsAmbient />

            <ProjectsCarousel projects={projects} />
          </section>
        </div>
      </div>

      {/* ── CALENDAR ─────────────────────────────────────────── */}
      <div id="calendar">
        <CalendarPreview events={upcomingEvents} backgroundImage={calendarImage} />
      </div>

      <div className="relative isolate overflow-visible bg-[#1C2433]">
        <div
          className="pointer-events-none absolute right-[-34rem] top-[6rem] z-0 h-[1400px] w-[1400px] opacity-[0.11] md:right-[-42rem] md:top-[2rem] md:h-[1650px] md:w-[1650px]"
          aria-hidden="true"
        >
          <div className="h-full w-full animate-spin-slower">
            <DigestiveSpiral className="h-full w-full" variant="simple" />
          </div>
        </div>

        {/* ── ÌRÒNÚ ────────────────────────────────────────────── */}
        <div id="ironu" className="relative z-10 overflow-visible">
          <IronuPreview posts={ironuPosts} />
        </div>

        {/* ── CONTACT ──────────────────────────────────────────── */}
        <div id="contact" className="relative z-20 overflow-visible">
          <section className="relative sticky top-0 z-50 min-h-screen overflow-visible px-4 pb-12 pt-32 sm:px-6 md:px-8 md:pt-36 lg:px-10 xl:px-12">
            <div className="relative z-10 mx-auto grid min-h-[calc(100svh-10rem)] w-full max-w-[140rem] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,0.95fr)] lg:gap-16 xl:gap-24">
              <div className="max-w-[54rem] text-left">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A06B43]/62">Contact</p>
                <h2 className="font-[family-name:var(--font-heading)] text-[clamp(2.6rem,5.2vw,6.7rem)] font-bold uppercase leading-[0.9] tracking-normal text-[#A06B43]">
                  Get in touch
                </h2>
                <p className="mt-6 max-w-[42rem] text-base leading-[1.58] text-[#A06B43]/84 md:text-[1.08rem] xl:text-[1.16rem]">
                  For projects, workshops, collaborations, or invitations, reach out directly or leave a message.
                </p>
                <a
                  href={`mailto:${email}`}
                  className="mt-9 block max-w-[44rem] break-words text-[clamp(1.35rem,2vw,2.45rem)] font-medium leading-[1.12] tracking-normal text-[#A06B43] transition-colors duration-300 hover:text-[#37C6F4]"
                >
                  {email}
                </a>
                <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-7">
                  {insta && (
                    <a href={insta} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] font-semibold uppercase tracking-widest text-[#A06B43]/62 transition-colors duration-300 hover:text-[#37C6F4]">
                      Instagram
                    </a>
                  )}
                  {youtube && (
                    <a href={youtube} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] font-semibold uppercase tracking-widest text-[#A06B43]/62 transition-colors duration-300 hover:text-[#37C6F4]">
                      YouTube
                    </a>
                  )}
                  {vimeo && (
                    <a href={vimeo} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] font-semibold uppercase tracking-widest text-[#A06B43]/62 transition-colors duration-300 hover:text-[#37C6F4]">
                      Vimeo
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-[#0B0B0B]/10 p-6 shadow-[0_24px_80px_-72px_rgba(160,107,67,0.7)] md:p-8 lg:p-10">
                <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A06B43]/62">Send a message</p>
                <ContactForm />
              </div>
            </div>
          </section>
        </div>
      </div>

    </div>
  )
}
