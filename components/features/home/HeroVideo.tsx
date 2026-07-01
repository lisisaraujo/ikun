'use client'

import YouTube from 'react-youtube'
import { useCallback, useRef } from 'react'
import type { YouTubePlayer, YouTubeEvent } from 'react-youtube'

interface HeroVideoProps {
  videoId: string
}

// Extract YouTube video ID from a full URL or bare ID
export function extractYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : url
}

export default function HeroVideo({ videoId }: HeroVideoProps) {
  const playerRef = useRef<YouTubePlayer | null>(null)

  const onReady = useCallback((e: YouTubeEvent) => {
    playerRef.current = e.target
    e.target.mute()
    e.target.playVideo()
  }, [])

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1 as const,
      mute: 1 as const,
      controls: 0 as const,
      loop: 1 as const,
      playlist: videoId,
      rel: 0 as const,
      showinfo: 0 as const,
      modestbranding: 1 as const,
    },
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: '177.77vh', // 16:9 aspect
          height: '100vh',
          minWidth: '100%',
          minHeight: '56.25vw',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          className="w-full h-full"
          iframeClassName="w-full h-full"
        />
      </div>
    </div>
  )
}
