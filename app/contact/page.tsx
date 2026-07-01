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

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" />
      <Section className="bg-[#F3F1EB]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact form */}
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-700 text-[#1C2433] mb-6">
                Get in touch
              </h2>
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <div className="space-y-10">
              {/* Email */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8B5F3C] mb-2">
                  Email
                </h3>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="text-sm text-[#1C2433] hover:text-[#37C6F4] transition-colors underline-offset-2 hover:underline"
                >
                  {SITE_EMAIL}
                </a>
              </div>

              {/* Social */}
              {SOCIAL_LINKS.instagram && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8B5F3C] mb-2">
                    Social
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li>
                      <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1C2433] hover:text-[#37C6F4] transition-colors"
                      >
                        Instagram →
                      </a>
                    </li>
                    {SOCIAL_LINKS.vimeo && (
                      <li>
                        <a
                          href={SOCIAL_LINKS.vimeo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1C2433] hover:text-[#37C6F4] transition-colors"
                        >
                          Vimeo →
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-[#1C2433] rounded-sm p-6">
                <h3 className="font-[family-name:var(--font-heading)] text-base font-700 text-[#F3F1EB] mb-1">
                  Newsletter
                </h3>
                <p className="text-sm text-[#C9C9C9] mb-4">
                  Subscribe to receive new Irònú posts and updates directly.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
