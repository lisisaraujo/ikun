import type { Metadata } from 'next'
import Image from 'next/image'
import { getOtherInfos } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import PortableText from '@/components/ui/PortableText'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'Other Infos',
  description: 'Press, partners, governance and further information about IKUN Mufutau Yusuf.',
}

export default async function OtherInfosPage() {
  const data = await getOtherInfos()

  return (
    <>
      <PageHeader title="Other Infos" />
      <Section className="bg-[#F3F1EB]">
        <Container>
          <div className="space-y-16 max-w-3xl">

            {/* Press */}
            {data?.pressItems && data.pressItems.length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-700 text-[#1C2433] mb-6">
                  Press & Media
                </h2>
                <ul className="space-y-4">
                  {data.pressItems.map((item) => (
                    <li key={item._key} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                      <span className="text-xs font-medium text-[#8B5F3C] uppercase tracking-wider shrink-0">
                        {item.publication}
                        {item.date && ` — ${new Date(item.date).getFullYear()}`}
                      </span>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0B0B0B] hover:text-[#37C6F4] transition-colors underline-offset-2 hover:underline"
                        >
                          {item.headline}
                        </a>
                      ) : (
                        <span className="text-sm text-[#0B0B0B]">{item.headline}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Partners */}
            {data?.partners && data.partners.length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-700 text-[#1C2433] mb-6">
                  Partners & Funders
                </h2>
                <div className="flex flex-wrap items-center gap-8">
                  {data.partners.map((partner) => (
                    <div key={partner._key}>
                      {partner.logo ? (
                        <a
                          href={partner.url ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={partner.name}
                          className="block opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <Image
                            src={urlFor(partner.logo).height(64).auto('format').url()}
                            alt={partner.name}
                            width={120}
                            height={64}
                            className="object-contain"
                            style={{ maxHeight: '64px', width: 'auto' }}
                          />
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-[#1C2433]">{partner.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Governance */}
            {data?.governance && data.governance.length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-700 text-[#1C2433] mb-6">
                  Governance & Legal
                </h2>
                <PortableText value={data.governance} />
              </div>
            )}

            {/* Misc */}
            {data?.miscContent && data.miscContent.length > 0 && (
              <div>
                <PortableText value={data.miscContent} />
              </div>
            )}

            {!data && (
              <p className="text-[#0B0B0B]/50 text-sm">Content coming soon.</p>
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}
