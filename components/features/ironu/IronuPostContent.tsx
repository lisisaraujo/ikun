import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import PortableText from '@/components/ui/PortableText'
import YoutubeEmbed from '@/components/features/projects/YoutubeEmbed'
import type { IronuPost } from '@/types/sanity'

interface IronuPostContentProps {
  post: IronuPost
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function IronuPostContent({ post }: IronuPostContentProps) {
  const imageSrc = post.coverImage
    ? urlFor(post.coverImage).width(1400).height(700).fit('crop').auto('format').url()
    : null

  return (
    <article>
      {/* Cover image — full width, constrained height */}
      {imageSrc && (
        <div className="relative w-full aspect-[2/1] max-h-[60vh] overflow-hidden bg-[#1C2433] mb-14">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F3F1EB]/30" />
        </div>
      )}

      <div className={`mx-auto max-w-2xl px-6 md:px-0 ${imageSrc ? '' : 'pt-28'}`}>
        {/* Section label */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B5F3C] mb-3 font-medium">
          Ìrònú
        </p>

        {/* Date */}
        <p className="text-xs uppercase tracking-widest text-[#8B5F3C]/40 mb-6">
          {formatDate(post.date)}
        </p>

        {/* Title */}
        <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-800 text-[#1C2433] leading-tight mb-12">
          {post.title}
        </h1>

        {/* Body */}
        {post.body && <PortableText value={post.body} />}

        {/* Video */}
        {post.videoUrl && (
          <div className="mt-14">
            <YoutubeEmbed url={post.videoUrl} title={post.title} />
          </div>
        )}
      </div>
    </article>
  )
}
