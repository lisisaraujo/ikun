import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { IronuPost } from '@/types/sanity'

interface IronuCardProps {
  post: IronuPost
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function IronuCard({ post }: IronuCardProps) {
  const imageSrc = post.coverImage
    ? urlFor(post.coverImage).width(600).height(340).fit('crop').auto('format').url()
    : null

  return (
    <Link
      href={`/ironu/${post.slug.current}`}
      className="group block overflow-hidden rounded-sm bg-white transition-shadow hover:shadow-lg"
    >
      {imageSrc && (
        <div className="relative aspect-[16/9] overflow-hidden bg-[#C9C9C9]">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <p className="text-xs font-medium text-[#8B5F3C] mb-2 uppercase tracking-wider">
          {formatDate(post.date)}
        </p>
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-700 text-[#1C2433] leading-snug group-hover:text-[#37C6F4] transition-colors">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}
