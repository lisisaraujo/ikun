'use client'

import { useEffect, useRef, useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import type { MuxPlayerRefAttributes, MuxPlayerCSSProperties } from '@mux/mux-player-react'

interface HeroVideoProps {
  playbackId: string
}

// Hides Mux's own control bar entirely and makes the video fill its
// container edge-to-edge (like object-fit: cover on a real <video>) —
// className alone can't reach inside the player's shadow DOM.
const playerStyle: MuxPlayerCSSProperties = {
  '--controls': 'none',
  '--media-object-fit': 'cover',
  '--media-object-position': 'center',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
}

export default function HeroVideo({ playbackId }: HeroVideoProps) {
  const playerRef = useRef<MuxPlayerRefAttributes>(null)
  const [playing, setPlaying] = useState(true)
  const [revealed, setRevealed] = useState(false)
  // Tracks whether the current paused state was caused by scrolling away
  // (vs. the user clicking pause), so scrolling back never overrides a manual pause
  const autoPaused = useRef(false)

  const togglePlay = () => {
    if (playing) {
      playerRef.current?.pause()
      setPlaying(false)
      autoPaused.current = false
    } else {
      playerRef.current?.play()
      setPlaying(true)
    }
  }

  // Stops playback once the hero has scrolled fully out of view (it's sticky,
  // so it would otherwise keep playing behind every other section forever),
  // and resumes it if scrolled back — unless the user paused it themselves.
  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY >= window.innerHeight

      if (pastHero && playing) {
        playerRef.current?.pause()
        setPlaying(false)
        autoPaused.current = true
      } else if (!pastHero && !playing && autoPaused.current) {
        playerRef.current?.play()
        setPlaying(true)
        autoPaused.current = false
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [playing])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        autoPlay
        muted
        loop
        playsInline
        thumbnailTime={0}
        title="Hero background video"
        style={playerStyle}
        onPlaying={() => setRevealed(true)}
      />

      {/* Blocks pointer events (mouse, touch, keyboard focus) from ever reaching
          the player itself, so the only way to play/pause is the button below */}
      <div className="absolute inset-0 z-10 pointer-events-auto" />

      {/* Black cover — lifted once the video is actually visible */}
      <div
        className={`absolute inset-0 z-20 bg-[#0B0B0B] transition-opacity duration-700 ${
          revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Media controls cluster — sits where SideNav appears once scrolled
          past the hero — z-[51] puts this above the fixed Navbar at z-50 */}
      <div className="absolute top-6 right-6 md:right-10 lg:right-14 z-[51] flex items-center gap-2">
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-[#F3F1EB] hover:bg-black/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
