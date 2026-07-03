import type { Metadata } from 'next'
import { getGlobalSettings } from '@/lib/sanity/queries'
import { SITE_EMAIL } from '@/constants/site'
import PortableText from '@/components/ui/PortableText'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for IKUN Mufutau Yusuf — how we collect, use and protect your data.',
}

// Fallback policy shown when no content has been added in Sanity yet.
function DefaultPolicy({ email }: { email: string }) {
  const sections = [
    {
      heading: '1. Who we are',
      body: `IKUN Mufutau Yusuf is a dance company and artistic practice based in Ireland. We are the data controller for the personal data collected through this website. You can contact us at ${email}.`,
    },
    {
      heading: '2. What data we collect',
      body: 'We collect your email address when you subscribe to our newsletter. When you use the contact form we also collect your name and the content of your message. We do not collect any other personal data through this website.',
    },
    {
      heading: '3. Why we collect it',
      body: 'Newsletter subscribers: to send you updates about new work, upcoming events, and Ìrònú posts. Contact form: to respond to your enquiry. The legal basis for processing is your consent (GDPR Article 6(1)(a)).',
    },
    {
      heading: '4. How long we keep it',
      body: 'Newsletter: we retain your email address until you unsubscribe. Contact form messages: we retain correspondence for up to 2 years for administrative purposes, after which it is deleted.',
    },
    {
      heading: '5. Who we share it with',
      body: 'We do not sell or share your personal data with third parties for marketing purposes. Your email address may be processed by our newsletter service provider (e.g. Mailchimp or similar) solely for the purpose of sending you our newsletter.',
    },
    {
      heading: '6. Your rights under GDPR',
      body: `You have the right to: access the personal data we hold about you; request correction of inaccurate data; request erasure of your data; withdraw consent at any time (e.g. by unsubscribing); lodge a complaint with the Data Protection Commission (Ireland) at www.dataprotection.ie. To exercise any of these rights, please contact us at ${email}.`,
    },
    {
      heading: '7. Cookies',
      body: 'This website does not use tracking cookies or analytics cookies. We may use strictly necessary cookies for the proper functioning of the site.',
    },
    {
      heading: '8. Changes to this policy',
      body: 'We may update this policy from time to time. The most current version will always be available at this URL. We encourage you to review it periodically.',
    },
    {
      heading: '9. Contact',
      body: `For any questions about this privacy policy or how we handle your data, please contact us at ${email}.`,
    },
  ]

  return (
    <div className="max-w-2xl space-y-10">
      <p className="text-sm text-[#0B0B0B]/50 pb-6 border-b border-[#C9C9C9]/40">
        Last updated: July 2025
      </p>
      {sections.map((s) => (
        <div key={s.heading}>
          <h2 className="font-[family-name:var(--font-heading)] text-lg text-[#1C2433] mb-3">
            {s.heading}
          </h2>
          <p className="text-sm text-[#0B0B0B]/70 leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  )
}

export default async function PrivacyPage() {
  const settings = await getGlobalSettings()
  const email    = settings?.email ?? SITE_EMAIL

  return (
    <>
      <PageHeader title="Privacy Policy" />
      <Section className="bg-[#F3F1EB]">
        <Container>
          {settings?.privacyPolicy && settings.privacyPolicy.length > 0 ? (
            <div className="max-w-2xl">
              <PortableText value={settings.privacyPolicy} />
            </div>
          ) : (
            <DefaultPolicy email={email} />
          )}
        </Container>
      </Section>
    </>
  )
}
