import type { Metadata } from 'next'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import ContactForm from '@/components/features/contact/ContactForm'
import NewsletterForm from '@/components/ui/NewsletterForm'
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with IKUN Mufutau Yusuf.',
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
    </svg>
  )
}

function VimeoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 7.42c-.09 2.01-1.49 4.76-4.2 8.24C15.07 19.2 12.72 21 10.7 21c-1.28 0-2.37-1.19-3.25-3.56L6.1 12.5C5.47 10.13 4.8 8.95 4.08 8.95c-.16 0-.72.34-1.68 1.01L1 8.44c1.06-.93 2.1-1.86 3.12-2.8 1.4-1.22 2.46-1.86 3.15-1.92 1.66-.16 2.68.97 3.06 3.39.41 2.6.7 4.22.86 4.85.48 2.17.99 3.26 1.56 3.26.44 0 1.1-.7 1.99-2.08.88-1.39 1.35-2.44 1.4-3.17.12-1.2-.35-1.8-1.4-1.8-.5 0-1.01.11-1.54.34.97-3.2 2.83-4.75 5.58-4.67 2.03.06 2.99 1.38 2.88 3.37z" />
    </svg>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B5F3C] font-semibold mb-6">
      {children}
    </p>
  )
}

const socials = [
  SOCIAL_LINKS.instagram && {
    label: 'Instagram',
    url: SOCIAL_LINKS.instagram,
    icon: <InstagramIcon />,
  },
  SOCIAL_LINKS.vimeo && {
    label: 'Vimeo',
    url: SOCIAL_LINKS.vimeo,
    icon: <VimeoIcon />,
  },
].filter(Boolean) as { label: string; url: string; icon: React.ReactNode }[]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        subtitle="Get in touch."
      />

      <Section className="bg-[#F3F1EB]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28">

            {/* ── Left: info ──────────────────────────────────── */}
            <div className="space-y-14">

              {/* Email */}
              <div>
                <SectionLabel>Email</SectionLabel>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="group inline-flex items-center gap-3 font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[#1C2433] hover:text-[#37C6F4] transition-colors duration-300 break-all"
                >
                  {SITE_EMAIL}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 shrink-0 stroke-current fill-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-0.5"
                    strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>

              {/* Socials */}
              {socials.length > 0 && (
                <div>
                  <SectionLabel>Follow</SectionLabel>
                  <ul className="space-y-4">
                    {socials.map(({ label, url, icon }) => (
                      <li key={label}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 text-sm text-[#1C2433] hover:text-[#37C6F4] transition-colors duration-200"
                        >
                          <span className="text-[#1C2433]/40 group-hover:text-[#37C6F4] transition-colors duration-200">
                            {icon}
                          </span>
                          {label}
                          <svg
                            viewBox="0 0 24 24"
                            className="w-3 h-3 stroke-current fill-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Newsletter */}
              <div className="pt-2">
                <SectionLabel>Newsletter</SectionLabel>
                <p className="text-sm text-[#0B0B0B]/50 mb-6 leading-relaxed max-w-xs">
                  Stay updated on new work, Ìrònú posts, and upcoming events.
                </p>
                <NewsletterForm />
              </div>

            </div>

            {/* ── Right: form ─────────────────────────────────── */}
            <div>
              <SectionLabel>Send a message</SectionLabel>
              <ContactForm />
            </div>

          </div>
        </Container>
      </Section>
    </>
  )
}
