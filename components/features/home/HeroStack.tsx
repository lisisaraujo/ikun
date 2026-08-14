'use client'

import { useCallback, useRef, useState } from 'react'
import type { PortableTextBlock } from '@portabletext/types'
import HeroSection from './HeroSection'
import HeroVideo from './HeroVideo'
import HeroIntroOverlay from './HeroIntroOverlay'

interface HeroStackProps {
  videoId: string | null
  introText: PortableTextBlock[]
}

// The text layer's own exit/entrance animation runs this long (see
// HeroIntroOverlay's EXIT_DURATION/ENTER_DURATION) — toggles are ignored
// while one is still in flight, so mashing the Aa button can't stack
// competing animations or leave `textHidden` and the visible layer out of sync.
const ANIMATION_LOCK_MS = 650

// Owns the one bit of state the video and the intro text need to share —
// whether the user has manually hidden the text — since HeroVideo (which
// hosts the "Aa" toggle button) and HeroIntroOverlay (which reacts to it,
// and which the swipe gesture also lives inside) are siblings here, not one
// component that could hold its own state.
export default function HeroStack({ videoId, introText }: HeroStackProps) {
  const [textHidden, setTextHidden] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  const animatingRef = useRef(false)
  const hasIntro = introText && introText.length > 0

  const setTextVisibility = useCallback((hidden: boolean) => {
    if (animatingRef.current) return
    animatingRef.current = true
    setTextHidden(hidden)
    setTimeout(() => { animatingRef.current = false }, ANIMATION_LOCK_MS)
  }, [])

  const handleToggleText = useCallback(() => {
    if (animatingRef.current) return
    setTextVisibility(!textHidden)
  }, [setTextVisibility, textHidden])
  const handleDismissText = useCallback(() => setTextVisibility(true), [setTextVisibility])
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
          onDismiss={handleDismissText}
        />
      )}
    </HeroSection>
  )
}
