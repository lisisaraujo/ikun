import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { portableTextToPlainText } from '@/lib/portableTextToPlainText'
import type { SanityProject } from '@/types/sanity'

interface ProjectCardProps {
  project: SanityProject
  dark?: boolean
}

export default function ProjectCard({ project, dark = false }: ProjectCardProps) {
  const imageSrc = project.coverImage
    ? urlFor(project.coverImage).width(600).height(400).fit('crop').auto('format').url()
    : null
  const excerpt = portableTextToPlainText(project.description, 140)

  return (
    <Link
      href={`/projects/${project.slug.current}`}
      className={`group block overflow-hidden rounded-2xl transition-shadow hover:shadow-xl ${
        dark ? 'bg-[#0B0B0B]/40' : 'bg-[#F3F1EB]'
      }`}
    >
      {/* Cover image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-[#1C2433]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={project.coverImage?.alt || project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#C9C9C9] text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-medium text-[#8B5F3C] mb-1 uppercase tracking-wider">
          {project.year}
        </p>
        <h3
          className={`font-[family-name:var(--font-heading)] text-lg font-700 leading-snug mb-2 group-hover:text-[#37C6F4] transition-colors ${
            dark ? 'text-[#F3F1EB]' : 'text-[#1C2433]'
          }`}
        >
          {project.title}
        </h3>
        <p className={`text-sm leading-relaxed line-clamp-3 ${dark ? 'text-[#C9C9C9]' : 'text-[#8B5F3C]/70'}`}>
          {excerpt}
        </p>
      </div>
    </Link>
  )
}
