'use client'

import { useCallback, useState } from 'react'
import type { PortableTextBlock } from '@portabletext/types'
import HeroSection from './HeroSection'
import HeroVideo from './HeroVideo'
import HeroIntroOverlay from './HeroIntroOverlay'
import HeroOrbitText from './HeroOrbitText'

interface HeroStackProps {
  videoId: string | null
  introText: PortableTextBlock[]
}

// Owns the one bit of state the video and the intro text need to share —
// whether the user has manually hidden the text — since HeroVideo (which
// hosts the "Aa" toggle button) and HeroIntroOverlay (which reacts to it)
// are siblings here, not one component that could hold its own state.
export default function HeroStack({ videoId, introText }: HeroStackProps) {
  const [textHidden, setTextHidden] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  const [revealImmediately, setRevealImmediately] = useState(false)
  const hasIntro = introText && introText.length > 0
  const handleToggleText = useCallback(() => {
    // Once the reader uses Aa, subsequent reveals show the complete text as
    // one composition instead of replaying the word-by-word introduction.
    setRevealImmediately(true)
    setTextHidden((hidden) => !hidden)
  }, [])
  const handleDismissText = useCallback(() => setTextHidden(true), [])
  const handleVideoVisible = useCallback(() => setVideoVisible(true), [])

  return (
    <HeroSection>
      <div className="absolute inset-0 overflow-hidden">
        {videoId && (
          <HeroVideo
            videoId={videoId}
            showTextToggle={hasIntro}
            textVisible={!textHidden}
            onToggleText={handleToggleText}
            onVideoVisible={handleVideoVisible}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
      </div>

      {/* Sits outside the video's overflow-hidden wrapper on purpose — its
          radius reaches above the viewport's top edge around the logo, and
          would get clipped if it were nested inside that wrapper. */}
      <HeroOrbitText />

      {/* ── INTRO TEXT ───────────────────────────────────────────
          Overlays the hero's own viewport rather than living in its own
          scroll section — it beams in on its own shortly after load, and
          the very next scroll goes straight to About. Deliberately not in
          SideNav's SECTIONS list, so it's not a menu destination. */}
      {hasIntro && (
        <HeroIntroOverlay
          text={introText}
          started={!videoId || videoVisible}
          textHidden={textHidden}
          revealImmediately={revealImmediately}
          onDismiss={handleDismissText}
        />
      )}
    </HeroSection>
  )
}
