'use client'

import type { PortableTextBlock } from '@portabletext/types'
import HeroSection from './HeroSection'
import HeroVideo from './HeroVideo'
import IkunPage from './HeroIntroOverlay'

interface HeroStackProps {
  playbackId: string | null
  introText: PortableTextBlock[]
}

export default function HeroStack({ playbackId, introText }: HeroStackProps) {
  const hasIntro = introText && introText.length > 0

  return (
    <>
      <HeroSection>
        <div className="absolute inset-0 overflow-hidden">
          {playbackId && <HeroVideo playbackId={playbackId} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        </div>
      </HeroSection>

      {/* ── INTRO TEXT ───────────────────────────────────────────
          Lives after the hero video as its own scroll section, so the user
          sees the film first, then the IKUN text, then About. Deliberately
          not in SideNav's SECTIONS list, so it's not a menu destination. */}
      {hasIntro && (
        <IkunPage text={introText} />
      )}
    </>
  )
}
