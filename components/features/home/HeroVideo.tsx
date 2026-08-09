'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroVideoProps {
  videoId: string
}

export default function HeroVideo({ videoId }: HeroVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Tracks whether the current paused state was caused by scrolling away
  // (vs. the user clicking pause), so scrolling back never overrides a manual pause
  const autoPaused = useRef(false)

  // Schedule the cover to lift after `delay` ms, cancelling any prior pending reveal
  const scheduleReveal = (delay: number) => {
    if (revealTimer.current) clearTimeout(revealTimer.current)
    revealTimer.current = setTimeout(() => setRevealed(true), delay)
  }

  useEffect(() => {
    // 4 s covers YouTube's "now playing" title card (~3 s) and the center overlay on first load
    scheduleReveal(4000)
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendCommand = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*'
    )
  }

  const togglePlay = () => {
    if (playing) {
      sendCommand('pauseVideo')
      setPlaying(false)
      autoPaused.current = false
    } else {
      // Re-apply the cover briefly so the resume title card is never visible
      setRevealed(false)
      scheduleReveal(1500)
      sendCommand('playVideo')
      setPlaying(true)
    }
  }

  // Stops playback once the hero has scrolled fully out of view (it's sticky,
  // so it would otherwise keep playing behind every other section forever),
  // and resumes it if scrolled back — unless the user paused it themselves
  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY >= window.innerHeight

      if (pastHero && playing) {
        sendCommand('pauseVideo')
        setPlaying(false)
        autoPaused.current = true
      } else if (!pastHero && !playing && autoPaused.current) {
        setRevealed(false)
        scheduleReveal(1500)
        sendCommand('playVideo')
        setPlaying(true)
        autoPaused.current = false
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  // All params baked into the URL so controls=0 is guaranteed to be applied.
  // disablekb/fs/cc_load_policy strip the remaining interactive chrome; the
  // click-blocking overlay below stops any of it (or YouTube's own hover
  // watermark) from ever receiving pointer events in the first place.
  const src =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}` +
    `&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3` +
    `&disablekb=1&fs=0&cc_load_policy=0` +
    `&enablejsapi=1&playsinline=1`

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 16:9 iframe scaled to cover the full viewport */}
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: '177.77vh',
          height: '100vh',
          minWidth: '100%',
          minHeight: '56.25vw',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media"
          title="Hero background video"
          tabIndex={-1}
        />
      </div>

      {/* Blocks pointer events (mouse, touch, keyboard focus) from ever reaching
          YouTube's own UI inside the iframe, so no hover watermark, title card,
          or "watch on YouTube" link can be triggered or clicked */}
      <div className="absolute inset-0 z-10 pointer-events-auto" />

      {/* Black cover — lifted after the YouTube title/overlay has cleared */}
      <div
        className={`absolute inset-0 z-20 bg-[#0B0B0B] transition-opacity duration-700 ${
          revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Sits where SideNav appears once scrolled past the hero — z-[51] puts this above the fixed Navbar at z-50 */}
      <button
        onClick={togglePlay}
        aria-label={playing ? 'Pause video' : 'Play video'}
        className="absolute top-6 right-6 md:right-10 lg:right-14 z-[51] flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-[#F3F1EB] hover:bg-black/60 transition-colors"
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
  )
}
