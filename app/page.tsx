import type { Metadata } from 'next'
import { getHomePage, getAboutPage, getAllProjects, getAllIronuPosts, getAllEvents, getGlobalSettings, getOtherInfos } from '@/lib/sanity/queries'
import DigestiveSpiral from '@/components/features/home/DigestiveSpiral'
import HeroStack from '@/components/features/home/HeroStack'
import AboutContent from '@/components/features/about/AboutContent'
import CalendarPreview from '@/components/features/calendar/CalendarPreview'
import ContactForm from '@/components/features/contact/ContactForm'
import PressLinks from '@/components/features/contact/PressLinks'
import ProjectsCarousel from '@/components/features/projects/ProjectsCarousel'
import ProjectsAmbient from '@/components/features/projects/ProjectsAmbient'
import IronuPreview from '@/components/features/ironu/IronuPreview'
import { SITE_NAME, SITE_EMAIL } from '@/constants/site'

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'IKUN Mufutau Yusuf — Nigerian-Irish performer, choreographer and teacher.',
}

export default async function HomePage() {
  const [homeData, about, projects, ironuPosts, events, settings, otherInfos] = await Promise.all([
    getHomePage(),
    getAboutPage(),
    getAllProjects(),
    getAllIronuPosts(),
    getAllEvents(),
    getGlobalSettings(),
    getOtherInfos(),
  ])

  const now = new Date(); now.setHours(0, 0, 0, 0)
  // getAllEvents orders by date desc (furthest future first) — reverse
  // before slicing so "next 3" really means the 3 soonest, not the 3
  // farthest out.
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const email = settings?.email ?? SITE_EMAIL
  const insta = settings?.instagramUrl
  const youtube = settings?.youtubeUrl
  const vimeo = settings?.vimeoUrl

  return (
    <div className="block">

      <div className="relative isolate bg-[#1C2433]">
        <div className="pointer-events-none absolute left-1/2 top-[92svh] z-0 h-[1500px] w-[1500px] -translate-x-1/2 opacity-[0.06] md:left-[56%] md:top-[86svh] md:h-[1700px] md:w-[1700px]" aria-hidden="true">
          <div className="h-full w-full animate-spin-slower">
            <DigestiveSpiral className="h-full w-full" variant="simple" />
            {/* <DigestiveSpiral className="h-full w-full" variant="segmented" /> */}
            {/* <DigestiveSpiral className="h-full w-full" variant="original" /> */}
          </div>
        </div>

        {/* ── HERO + INTRO TEXT ────────────────────────────────── */}
        <div className="relative z-30 h-[162svh]">
          <HeroStack playbackId={homeData?.heroMuxPlaybackId ?? null} />
        </div>

        {/* ── ABOUT ────────────────────────────────────────────── */}
        {/* Wrapped in a plain, non-sticky div carrying the id: a `position:
            sticky` element's own `offsetTop` drifts to track the current
            scroll position once you've scrolled past it (a real browser
            quirk), which breaks SideNav's scrollTo-based jump once you're
            deeper in the page. This wrapper's offsetTop stays the true,
            stable document position, since it isn't sticky itself. */}
        <div id="about" className="relative z-20 -mt-[100svh]">
          <section className="home-section home-section-about home-flow-section relative flex flex-col justify-start">
            {about ? (
              <AboutContent
                about={about}
                companyText={homeData?.introText ?? []}
              />
            ) : (
              <p className="type-label px-4 text-[#A06B43]/70 sm:px-6 md:px-8 lg:px-10 xl:px-12">About content coming soon.</p>
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
          <section className="home-section home-section-projects home-flow-section z-projects relative flex flex-col justify-start overflow-hidden">
            <ProjectsAmbient />

            <ProjectsCarousel projects={projects} />
          </section>
        </div>
      </div>

      {/* ── CALENDAR ─────────────────────────────────────────── */}
      <div id="calendar">
        <CalendarPreview events={upcomingEvents} />
      </div>

      <div className="relative isolate overflow-visible bg-[#1C2433]">
        <div
          className="pointer-events-none absolute right-[-34rem] top-[6rem] z-0 h-[1400px] w-[1400px] opacity-[0.05] md:right-[-42rem] md:top-[2rem] md:h-[1650px] md:w-[1650px]"
          aria-hidden="true"
        >
          <div className="h-full w-full">
            <DigestiveSpiral className="h-full w-full" variant="simple" />
          </div>
        </div>

        {/* ── ÌRÒNÚ ────────────────────────────────────────────── */}
        <div id="ironu" className="home-flow-section z-section-content relative overflow-visible">
          <IronuPreview posts={ironuPosts} />
        </div>

        {/* ── CONTACT ──────────────────────────────────────────── */}
        <div id="contact" className="relative z-projects overflow-visible">
          <section className="home-section home-flow-section z-contact relative overflow-visible px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="home-section-inner relative z-10 mx-auto grid w-full max-w-[140rem] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(32rem,0.95fr)] lg:gap-16 xl:gap-24">
              <div className="max-w-[54rem] text-left">
                <h2 className="type-title text-[#F3F1EB]">
                  Get in touch
                </h2>
                <p className="type-body mt-6 max-w-[42rem] text-[#F3F1EB]/84">
                  For bookings, touring, workshops, press, collaborations, or invitations, reach out directly or leave a message.
                </p>
                <a
                  href={`mailto:${email}`}
                  className="contact-email type-feature mt-9 block max-w-[44rem] break-words font-medium text-[#A06B43] transition-colors duration-300 hover:text-[#37C6F4]"
                >
                  {email}
                </a>
                <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-7">
                  {insta && (
                    <a href={insta} target="_blank" rel="noopener noreferrer"
                      className="type-label text-[#A06B43]/62 transition-colors duration-300 hover:text-[#37C6F4]">
                      Instagram
                    </a>
                  )}
                  {youtube && (
                    <a href={youtube} target="_blank" rel="noopener noreferrer"
                      className="type-label text-[#A06B43]/62 transition-colors duration-300 hover:text-[#37C6F4]">
                      YouTube
                    </a>
                  )}
                  {vimeo && (
                    <a href={vimeo} target="_blank" rel="noopener noreferrer"
                      className="type-label text-[#A06B43]/62 transition-colors duration-300 hover:text-[#37C6F4]">
                      Vimeo
                    </a>
                  )}
                </div>
                <PressLinks items={otherInfos?.pressItems} />
              </div>

              <div className="editorial-frame bg-[#0B0B0B]/10 p-6 shadow-[0_24px_80px_-72px_rgba(160,107,67,0.7)] md:p-8 lg:p-10">
                <p className="type-meta mb-7 text-[#A06B43]/62">Send a message</p>
                <ContactForm />
              </div>
            </div>
          </section>
        </div>
      </div>

    </div>
  )
}
