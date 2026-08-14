'use client'

import { useState } from 'react'
import type { PortableTextBlock } from '@portabletext/types'
import HeroSection from './HeroSection'
import HeroVideo from './HeroVideo'
import HeroIntroOverlay from './HeroIntroOverlay'

interface HeroStackProps {
  videoId: string | null
  introHeading?: string
  introText: PortableTextBlock[]
}

// Owns the one bit of state the video and the intro text need to share —
// whether the user has manually hidden the text — since HeroVideo (which
// hosts the "Aa" toggle button) and HeroIntroOverlay (which reacts to it)
// are siblings here, not one component that could hold its own state.
export default function HeroStack({ videoId, introHeading, introText }: HeroStackProps) {
  const [textHidden, setTextHidden] = useState(false)
  const hasIntro = introText && introText.length > 0

  return (
    <HeroSection>
      <div className="absolute inset-0 overflow-hidden">
        {videoId && (
          <HeroVideo
            videoId={videoId}
            showTextToggle={hasIntro}
            textVisible={!textHidden}
            onToggleText={() => setTextHidden((h) => !h)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
      </div>

      {/* ── INTRO TEXT ───────────────────────────────────────────
          Overlays the hero's own viewport rather than living in its own
          scroll section — it beams in on its own shortly after load, and
          the very next scroll goes straight to About. Deliberately not in
          SideNav's SECTIONS list, so it's not a menu destination. */}
      {hasIntro && (
        <HeroIntroOverlay
          heading={introHeading}
          text={introText}
          textHidden={textHidden}
          onDismiss={() => setTextHidden(true)}
        />
      )}
    </HeroSection>
  )
}
