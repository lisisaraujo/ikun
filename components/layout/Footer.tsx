import Link from 'next/link'
import { SITE_NAME, SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site'
import { NAV_LINKS } from '@/constants/nav'
import Container from './Container'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1C2433] text-[#C9C9C9]">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-[family-name:var(--font-heading)] text-lg font-700 text-[#F3F1EB] mb-2">
              {SITE_NAME}
            </p>
            <p className="text-sm leading-relaxed text-[#C9C9C9]">
              Performer · Choreographer · Teacher
            </p>
          </div>

          {/* Contact / social */}
          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="hover:text-[#37C6F4] transition-colors"
            >
              {SITE_EMAIL}
            </a>
            {SOCIAL_LINKS.instagram && (
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#37C6F4] transition-colors"
              >
                Instagram
              </a>
            )}
            {SOCIAL_LINKS.vimeo && (
              <a
                href={SOCIAL_LINKS.vimeo}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#37C6F4] transition-colors"
              >
                Vimeo
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[#C9C9C9]/60">
          © {year} {SITE_NAME}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
