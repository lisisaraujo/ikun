'use client'

import YouTube from 'react-youtube'
import { extractYouTubeId } from '@/components/features/home/HeroVideo'

interface YoutubeEmbedProps {
  url: string
  title: string
}

export default function YoutubeEmbed({ url, title }: YoutubeEmbedProps) {
  const videoId = extractYouTubeId(url)

  return (
    <div className="overflow-hidden rounded-sm aspect-video">
      <YouTube
        videoId={videoId}
        title={title}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: { rel: 0, modestbranding: 1 },
        }}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  )
}
