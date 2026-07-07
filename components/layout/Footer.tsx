import Link from 'next/link'
import Image from 'next/image'
import { getGlobalSettings, getOtherInfos } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import { NAV_LINKS } from '@/constants/nav'
import { SITE_NAME, SITE_EMAIL } from '@/constants/site'
import Container from './Container'

// ── Icons ────────────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}

function VimeoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 7.42c-.09 2.01-1.49 4.76-4.2 8.24C15.07 19.2 12.72 21 10.7 21c-1.28 0-2.37-1.19-3.25-3.56L6.1 12.5C5.47 10.13 4.8 8.95 4.08 8.95c-.16 0-.72.34-1.68 1.01L1 8.44c1.06-.93 2.1-1.86 3.12-2.8 1.4-1.22 2.46-1.86 3.15-1.92 1.66-.16 2.68.97 3.06 3.39.41 2.6.7 4.22.86 4.85.48 2.17.99 3.26 1.56 3.26.44 0 1.1-.7 1.99-2.08.88-1.39 1.35-2.44 1.4-3.17.12-1.2-.35-1.8-1.4-1.8-.5 0-1.01.11-1.54.34.97-3.2 2.83-4.75 5.58-4.67 2.03.06 2.99 1.38 2.88 3.37z" />
    </svg>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────

export default async function Footer() {
  const [settings, otherInfos] = await Promise.all([
    getGlobalSettings(),
    getOtherInfos(),
  ])

  const email         = settings?.email ?? SITE_EMAIL
  const instagramUrl  = settings?.instagramUrl
  const youtubeUrl    = settings?.youtubeUrl
  const vimeoUrl      = settings?.vimeoUrl
  const footerLogos   = otherInfos?.partners?.filter((p) => p.showInFooter) ?? []
  const year          = new Date().getFullYear()

  const socials = [
    instagramUrl && { label: 'Instagram', url: instagramUrl, icon: <InstagramIcon /> },
    youtubeUrl   && { label: 'YouTube',   url: youtubeUrl,   icon: <YouTubeIcon />   },
    vimeoUrl     && { label: 'Vimeo',     url: vimeoUrl,     icon: <VimeoIcon />     },
  ].filter(Boolean) as { label: string; url: string; icon: React.ReactNode }[]

  return (
    <footer className="text-[#C9C9C9]">

      {/* ── Middle: email + socials + logos ─────────────── */}
      <Container className="py-10 border-b border-[#8B5F3C]/20">
         <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-base font-800 text-[#F3F1EB] hover:text-[#37C6F4] transition-colors duration-200 shrink-0"
          >
            {SITE_NAME}
          </Link>

  
       
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="text-sm text-[#8B5F3C]/70 hover:text-[#37C6F4] transition-colors duration-200"
          >
            {email}
          </a>

          {/* Social icons */}
          {socials.length > 0 && (
            <ul className="flex items-center gap-5">
              {socials.map(({ label, url, icon }) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="block text-[#8B5F3C]/50 hover:text-[#37C6F4] transition-colors duration-200"
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Funder / partner logos */}
        {footerLogos.length > 0 && (
          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-[#8B5F3C]/20">
            {footerLogos.map((partner) => {
              const logoUrl = partner.logo
                ? urlFor(partner.logo).height(64).auto('format').url()
                : null

              const logoEl = logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={partner.name}
                  width={100}
                  height={32}
                  className="object-contain max-h-8 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-80 transition-all duration-400"
                />
              ) : (
                <span className="text-xs text-[#C9C9C9]/40 hover:text-[#C9C9C9]/70 transition-colors">
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
        )}
      </Container>

      {/* ── Bottom: copyright + credit + privacy ────────── */}
      <Container className="py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-[#8B5F3C]/40">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <p>Designed by Qusay &amp; Developed by Lísis Araújo</p>
          <Link href="/privacy" className="hover:text-[#37C6F4] transition-colors duration-200">
            Privacy Policy
          </Link>
        </div>
      </Container>

    </footer>
  )
}
