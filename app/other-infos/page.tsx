import type { Metadata } from 'next'
import Image from 'next/image'
import { getOtherInfos } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import PortableText from '@/components/ui/PortableText'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import type { Partner } from '@/types/sanity'

export const metadata: Metadata = {
  title: 'Other Infos',
  description: 'Funders, partners, press and further information about IKUN Mufutau Yusuf.',
}

function LogoGrid({ entries }: { entries: Partner[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-[#1C2433]/8">
      {entries.map((entry) => {
        const logoUrl = entry.logo
          ? urlFor(entry.logo).height(120).auto('format').url()
          : null

        const inner = (
          <div className="bg-[#F3F1EB] flex items-center justify-center p-8 h-32 group-hover:bg-white/60 transition-colors duration-300">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={entry.name}
                width={160}
                height={80}
                className="object-contain max-h-10 w-auto grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              />
            ) : (
              <span className="text-xs font-medium text-[#1C2433]/40 group-hover:text-[#1C2433] text-center leading-snug transition-colors duration-300">
                {entry.name}
              </span>
            )}
          </div>
        )

        return entry.url ? (
          <a
            key={entry._key}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={entry.name}
            className="group block"
          >
            {inner}
          </a>
        ) : (
          <div key={entry._key} className="group">
            {inner}
          </div>
        )
      })}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B5F3C] font-semibold mb-8">
      {children}
    </p>
  )
}

export default async function OtherInfosPage() {
  const data = await getOtherInfos()

  const funders  = data?.partners?.filter((p) => p.category === 'funder')  ?? []
  const partners = data?.partners?.filter((p) => p.category === 'partner') ?? []

  const hasLogos = funders.length > 0 || partners.length > 0

  return (
    <>
      <PageHeader
        title="Other Infos"
        subtitle="Funders, partners and further information."
      />

      <Section className="bg-[#F3F1EB]">
        <Container>
          <div className="space-y-20">

            {/* Funders */}
            {funders.length > 0 && (
              <div>
                <SectionLabel>Funders</SectionLabel>
                <LogoGrid entries={funders} />
              </div>
            )}

            {/* Partners */}
            {partners.length > 0 && (
              <div>
                <SectionLabel>Partners</SectionLabel>
                <LogoGrid entries={partners} />
              </div>
            )}

            {/* Divider between logos and text sections */}
            {hasLogos && (data?.pressItems?.length || data?.governance?.length || data?.miscContent?.length) ? (
              <div className="border-t border-[#C9C9C9]/40" />
            ) : null}

            {/* Press */}
            {data?.pressItems && data.pressItems.length > 0 && (
              <div className="max-w-2xl">
                <SectionLabel>Press & Media</SectionLabel>
                <ul className="space-y-6">
                  {data.pressItems.map((item) => (
                    <li key={item._key} className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#8B5F3C]">
                        {item.publication}
                        {item.date && <span className="text-[#0B0B0B]/30"> · {new Date(item.date).getFullYear()}</span>}
                      </span>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#0B0B0B] hover:text-[#37C6F4] transition-colors duration-200 underline-offset-2 hover:underline"
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

            {/* Governance */}
            {data?.governance && data.governance.length > 0 && (
              <div className="max-w-2xl">
                <SectionLabel>Governance & Legal</SectionLabel>
                <PortableText value={data.governance} />
              </div>
            )}

            {/* Misc */}
            {data?.miscContent && data.miscContent.length > 0 && (
              <div className="max-w-2xl">
                <PortableText value={data.miscContent} />
              </div>
            )}

            {!data && (
              <p className="text-[#0B0B0B]/40 text-sm uppercase tracking-widest">
                Content coming soon.
              </p>
            )}

          </div>
        </Container>
      </Section>
    </>
  )
}
