import Image from 'next/image'
import PortableText from '@/components/ui/PortableText'
import KineticHeading from '@/components/ui/KineticHeading'
import SpiralRings from '@/components/features/projects/SpiralRings'
import HeroOrbitText from '@/components/features/home/HeroOrbitText'
import { urlFor } from '@/lib/sanity/image'
import type { AboutPage } from '@/types/sanity'

interface AboutContentProps {
  about: AboutPage
}

// Static left, moving right — the specific tension named in the Ballet
// National de Marseille reference. Bio text sits still and readable on the
// left; the portrait never stops drifting on the right (a slow Ken Burns
// zoom). The spiral motif (SpiralRings, same as under the Projects cards)
// only appears as a placeholder when there's no photo — behind an actual
// photo it would be fully hidden anyway, so it's not drawn there at all.
// One deliberate structural swing, not a site-wide pattern — every other
// section stays a single centered column.
export default function AboutContent({ about }: AboutContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-10 lg:gap-16 h-[82vh] md:h-[74vh]">
      {/* ── Static: name, subtitle, bio ─────────────────────────── */}
      <div className="relative flex flex-col min-h-0 px-8 lg:pl-24 xl:pl-40 lg:pr-0">
        <HeroOrbitText />

        <div className="shrink-0 mb-6 md:mb-8 text-center lg:text-left">
          <KineticHeading
            as="h2"
            className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-[#8B5F3C] mb-3 leading-tight"
          >
            Mufutau Yusuf
          </KineticHeading>
          <p className="font-[family-name:var(--font-heading)] italic font-light text-[#8B5F3C]/70 text-lg md:text-xl">
            Performer, <span className="not-italic">Choreographer</span>, Teacher.
          </p>
        </div>

        {/* Compact photo — mobile/tablet only. Below `lg` there's no room
            for a true side-by-side split, so the moving portrait folds into
            the same static column instead of disappearing outright. */}
        {about.photo && (
          <div className="lg:hidden shrink-0 relative w-[150px] aspect-[4/5] mx-auto mb-6 rounded-xl overflow-hidden shadow-[0_20px_40px_-16px_rgba(11,11,11,0.55)]">
            <div className="absolute inset-0 animate-ken-burns">
              <Image
                src={urlFor(about.photo).width(400).height(500).fit('crop').auto('format').url()}
                alt={about.photoCaption ?? 'Mufutau Yusuf'}
                fill
                className="object-cover"
                sizes="150px"
              />
            </div>
          </div>
        )}

        {/* Deliberately no overscroll-contain: once this column's own scroll
            is exhausted, wheel/touch input chains straight through to the
            page, same as every other internally-scrolling frame on the site. */}
        <div
          className="relative flex-1 min-h-0 overflow-y-auto pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
          }}
        >
          <PortableText value={about.bio} className="prose-ikun-editorial text-[#8B5F3C]/85 text-base md:text-lg" />
        </div>
      </div>

      {/* ── Moving: portrait, never still ───────────────────────── */}
      <div className="relative hidden lg:block min-h-0 overflow-hidden rounded-2xl">
        {about.photo ? (
          <>
            <div className="absolute inset-0 animate-ken-burns">
              <Image
                src={urlFor(about.photo).width(1000).height(1250).fit('crop').auto('format').url()}
                alt={about.photoCaption ?? 'Mufutau Yusuf'}
                fill
                className="object-cover"
                sizes="45vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C2433]/70 via-transparent to-transparent" />
            {about.photoCaption && (
              <p className="absolute bottom-5 left-6 text-xs text-[#F3F1EB]/60">{about.photoCaption}</p>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 aspect-square opacity-[0.25] animate-spin-slower">
              <SpiralRings className="w-full h-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
