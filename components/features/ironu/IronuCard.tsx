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
    ? urlFor(post.coverImage).width(800).height(520).fit('crop').auto('format').url()
    : null

  return (
    <Link href={`/ironu/${post.slug.current}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1C2433]/8 mb-5">
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </>
        ) : (
          /* Placeholder — a simple tonal rectangle */
          <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-br from-[#1C2433]/6 to-[#1C2433]/12">
            <span
              className="font-[family-name:var(--font-heading)] text-6xl leading-none text-[#1C2433]/8 select-none"
              aria-hidden="true"
            >
              Ì
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <p className="text-[10px] uppercase tracking-widest text-[#8B5F3C]/35 mb-2">
        {formatDate(post.date)}
      </p>

      {/* Title */}
      <h3 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl text-[#1C2433] leading-snug group-hover:text-[#37C6F4] transition-colors duration-300">
        {post.title}
      </h3>

      {/* Read indicator */}
      <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8B5F3C]/30 group-hover:text-[#37C6F4] transition-colors duration-300">
        <span>Read</span>
        <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none" strokeWidth={2} aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  )
}
