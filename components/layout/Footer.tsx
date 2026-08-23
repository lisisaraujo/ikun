import Link from 'next/link'
import Image from 'next/image'
import { getGlobalSettings, getOtherInfos } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { SITE_NAME } from '@/constants/site'
import Container from './Container'
import SectionBackdrop from './SectionBackdrop'

// ── Footer ───────────────────────────────────────────────────────────────────

export default async function Footer() {
  const [, otherInfos] = await Promise.all([
    getGlobalSettings(),
    getOtherInfos(),
  ])

  const footerLogos   = otherInfos?.partners?.filter((p) => p.showInFooter) ?? []
  const year          = new Date().getFullYear()

  return (
    // `min-h-screen` + `relative overflow-hidden` mirrors the home page's
    // own sticky sections (see app/page.tsx) so this reads as one more beat
    // of that same composition rather than a bolted-on strip: same backdrop
    // recipe (SectionBackdrop, same navy/blue as `contact`), same scale.
    <footer id="footer" className="relative isolate flex min-h-screen flex-col overflow-hidden text-[#C9C9C9]">
      <SectionBackdrop color="#1C2433" />

   
      {/* ── Middle: collaborator / funder logos — given real room to
          breathe instead of a cramped row, since this is the one place on
          the site they're shown. Fills all the height the top/bottom
          strips don't need, which is most of it. ─────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 py-16">
        {footerLogos.length > 0 && (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#F3F1EB]/46 md:text-base">
              Supported by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10 px-6">
              {footerLogos.map((partner) => {
                const logoUrl = partner.logo
                  ? urlFor(partner.logo).height(96).auto('format').url()
                  : null

                const logoEl = logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={partner.name}
                    width={150}
                    height={48}
                    className="object-contain max-h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-90 transition-all duration-400"
                  />
                ) : (
                  <span className="text-base text-[#F3F1EB]/48 transition-colors hover:text-[#F3F1EB]/75 md:text-lg">
                    {partner.name}
                  </span>
                )

                return partner.url ? (
                  <a
                    key={partner._key}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={partner.name}
                    className="block"
                  >
                    {logoEl}
                  </a>
                ) : (
                  <div key={partner._key}>{logoEl}</div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom: copyright + credit + privacy ────────── */}
      <Container className="border-t border-[#F3F1EB]/10 py-7">
        <div className="flex flex-col items-center justify-between gap-3 text-center text-sm leading-relaxed text-[#F3F1EB]/52 md:flex-row md:text-left md:text-[15px]">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <p>Brand Identity by Qusay Awad · Designed &amp; Developed by Lísis Araújo</p>
          <Link href="/privacy" className="font-medium text-[#F3F1EB]/58 transition-colors duration-200 hover:text-[#37C6F4]">
            Privacy Policy
          </Link>
        </div>
      </Container>
    </footer>
  )
}
