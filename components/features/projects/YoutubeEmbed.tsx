'use client'

import { useState } from 'react'
import Image from 'next/image'
import { extractYouTubeId } from '@/lib/youtube'

interface YoutubeEmbedProps {
  url: string
  title: string
}

export default function YoutubeEmbed({ url, title }: YoutubeEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const videoId = extractYouTubeId(url)
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className="group relative block w-full aspect-video overflow-hidden bg-[#0B0B0B]"
    >
      {/* Thumbnail */}
      <Image
        src={thumbnail}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 80vw"
        className="object-cover transition-opacity duration-500 group-hover:opacity-70"
      />

      {/* Dark vignette */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#F3F1EB]/80 bg-black/30 transition-all duration-300 group-hover:scale-110 group-hover:border-[#F3F1EB] group-hover:bg-black/50">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-[#F3F1EB] ml-1"
            aria-hidden="true"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      </div>

      {/* Title label at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
        <p className="font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.15em] text-[#F3F1EB]/70">
          {title}
        </p>
      </div>
    </button>
  )
}
