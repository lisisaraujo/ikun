'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroVideoProps {
  videoId: string
  showTextToggle?: boolean
  textVisible?: boolean
  onToggleText?: () => void
  onVideoVisible?: () => void
}

export default function HeroVideo({ videoId, showTextToggle, textVisible, onToggleText, onVideoVisible }: HeroVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Tracks whether the current paused state was caused by scrolling away
  // (vs. the user clicking pause), so scrolling back never overrides a manual pause
  const autoPaused = useRef(false)

  // The story begins when the protective YouTube cover has lifted and the
  // moving image is actually visible, rather than racing ahead on mount.
  useEffect(() => {
    if (revealed) onVideoVisible?.()
  }, [onVideoVisible, revealed])

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
  // and resumes it if scrolled back — unless the user paused it themselves.
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

      {/* Media controls cluster — sits where SideNav appears once scrolled
          past the hero — z-[51] puts this above the fixed Navbar at z-50 */}
      <div className="absolute top-6 right-6 md:right-10 lg:right-14 z-[51] flex items-center gap-2">
        {showTextToggle && (
          // A plain-language label rather than an icon-plus-tooltip — the
          // button always says what it does, so meaning never depends on
          // hover/focus to be discovered.
          <button
            onClick={onToggleText}
            aria-pressed={textVisible}
            className={`flex items-center justify-center h-10 rounded-full border px-4 text-[11px] font-semibold tracking-wide transition-[transform,background-color,border-color,color,opacity] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70 ${
              textVisible
                ? 'scale-100 bg-[#37C6F4] border-[#37C6F4] text-[#0B0B0B] hover:bg-[#F3F1EB]'
                : 'scale-[0.92] bg-black/30 border-[#37C6F4]/35 text-[#37C6F4]/70 hover:bg-black/60 hover:text-[#37C6F4]'
            }`}
          >
            <span className="font-heading select-none">
              {textVisible ? 'Hide intro' : 'Show intro'}
            </span>
          </button>
        )}
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
