'use client'

import type { PortableTextBlock } from '@portabletext/types'
import HeroSection from './HeroSection'
import HeroVideo from './HeroVideo'

interface HeroStackProps {
  playbackId: string | null
  introText?: PortableTextBlock[]
}

export default function HeroStack({ playbackId }: HeroStackProps) {
  return (
    <HeroSection>
      <div className="absolute inset-0 overflow-hidden">
        {playbackId && <HeroVideo playbackId={playbackId} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
      </div>
    </HeroSection>
  )
}
