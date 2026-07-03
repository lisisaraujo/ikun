import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllProjects, getProjectBySlug } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import PortableText from '@/components/ui/PortableText'
import YoutubeEmbed from '@/components/features/projects/YoutubeEmbed'
import ReviewsCarousel from '@/components/features/projects/ReviewsCarousel'
import ImageGallery from '@/components/features/projects/ImageGallery'
import Container from '@/components/layout/Container'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.shortDescription,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const imageSrc = project.coverImage
    ? urlFor(project.coverImage).width(1600).height(900).fit('crop').auto('format').url()
    : null

  return (
    <div className="bg-[#F3F1EB] min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[75vh] bg-[#1C2433] overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            priority
            className="object-cover opacity-75"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1C2433]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-[#0B0B0B]/20 to-transparent" />

        {/* Back link */}
        <div className="absolute top-24 left-0 right-0">
          <Container>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[#37C6F4] opacity-60 hover:opacity-100 text-xs uppercase tracking-widest transition-opacity duration-200"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2" aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All projects
            </Link>
          </Container>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <Container>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-4">
              {project.year && (
                <span className="text-[#8B5F3C] text-xs uppercase tracking-widest">
                  {project.year}
                </span>
              )}
              {project.location && (
                <span className="text-[#F3F1EB]/50 text-xs uppercase tracking-widest">
                  {project.location}
                </span>
              )}
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl lg:text-7xl font-800 text-[#F3F1EB] leading-tight">
              {project.title}
            </h1>
          </Container>
        </div>
      </div>

      {/* Body */}
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {project.fullDescription ? (
              <div className="prose prose-lg max-w-none text-[#0B0B0B]/80 leading-relaxed">
                <PortableText value={project.fullDescription} />
              </div>
            ) : project.shortDescription ? (
              <p className="text-[#0B0B0B]/80 text-lg leading-relaxed">
                {project.shortDescription}
              </p>
            ) : null}

            {/* Performance dates */}
            {project.performanceDates && project.performanceDates.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-6">
                  Performance Dates
                </h2>
                <ul className="divide-y divide-[#C9C9C9]/40">
                  {project.performanceDates.map((pd) => (
                    <li key={pd._key} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                      <span className="text-[#0B0B0B] font-light">
                        {pd.venue && <span className="font-medium">{pd.venue}</span>}
                        {pd.venue && pd.city && <span className="text-[#0B0B0B]/40 mx-2">·</span>}
                        {pd.city && <span className="text-[#0B0B0B]/60">{pd.city}</span>}
                      </span>
                      {pd.date && (
                        <time className="text-sm text-[#0B0B0B]/40 tabular-nums whitespace-nowrap">
                          {new Date(pd.date).toLocaleDateString('en-IE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </time>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Video */}
            {project.youtubeUrl && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-6">
                  Video
                </h2>
                <YoutubeEmbed url={project.youtubeUrl} title={project.title} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-10">
            {/* Credits */}
            {project.credits && project.credits.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-6">
                  Credits
                </h2>
                <dl className="space-y-3">
                  {project.credits.map((credit) => (
                    <div key={credit._key} className="flex flex-col gap-0.5">
                      <dt className="text-xs uppercase tracking-widest text-[#0B0B0B]/40 font-medium">
                        {credit.role}
                      </dt>
                      <dd className="text-sm text-[#0B0B0B]">{credit.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Legacy collaborators */}
            {!project.credits?.length && project.collaborators && project.collaborators.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-6">
                  Collaborators
                </h2>
                <ul className="space-y-1">
                  {project.collaborators.map((c) => (
                    <li key={c} className="text-sm text-[#0B0B0B]/70">{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </Container>

      {/* Reviews — light bg with top border */}
      {project.reviews && project.reviews.length > 0 && (
        <section className="bg-[#F3F1EB] border-t border-[#C9C9C9]/40 py-20 md:py-28">
          <Container>
            <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-10">
              Reviews
            </h2>
            <ReviewsCarousel reviews={project.reviews} />
          </Container>
        </section>
      )}

      {/* Image gallery — dark bg */}
      {project.images && project.images.length > 0 && (
        <section className="bg-[#0B0B0B]">
          <div className="py-10 md:py-14">
            <Container className="mb-8">
              <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C]">
                Gallery
              </h2>
            </Container>
            <ImageGallery images={project.images} />
          </div>
        </section>
      )}

      {/* Footer nav */}
      <div className="border-t border-[#C9C9C9]/40 py-10">
        <Container>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[#37C6F4] opacity-60 hover:opacity-100 text-xs uppercase tracking-widest transition-opacity duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to projects
          </Link>
        </Container>
      </div>
    </div>
  )
}
