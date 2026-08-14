import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllProjects, getProjectBySlug } from '@/lib/sanity/queries'
import { portableTextToPlainText } from '@/lib/portableTextToPlainText'
import PortableText from '@/components/ui/PortableText'
import YoutubeEmbed from '@/components/features/projects/YoutubeEmbed'
import ProjectGalleryHero from '@/components/features/projects/ProjectGalleryHero'
import Container from '@/components/layout/Container'
import type { ProjectPerformanceDate } from '@/types/sanity'

interface Props {
  params: Promise<{ slug: string }>
}

function formatPerformanceDate({ startDate, endDate }: ProjectPerformanceDate) {
  const start = new Date(startDate).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  if (!endDate) return start
  const end = new Date(endDate).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${start} – ${end}`
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
    description: portableTextToPlainText(project.description, 160),
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <div className="bg-[#F3F1EB] min-h-screen">
      {/* Hero — clickable cover that opens gallery lightbox */}
      <ProjectGalleryHero
        title={project.title}
        year={project.year}
        coverImage={project.coverImage ?? null}
        images={project.images ?? []}
        backHref="/#projects"
        backLabel="Back"
      />

      {/* Body */}
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured note — a highlighted recognition (e.g. an Aerowaves
                selection), set apart from the main description below it */}
            {project.featuredNote && (
              <div className="border-l-2 border-[#37C6F4] pl-5 text-[#1C2433]/80 italic leading-relaxed">
                <PortableText value={project.featuredNote} />
              </div>
            )}

            {/* Description */}
            <div className="prose prose-lg max-w-none text-[#8B5F3C]/80 leading-relaxed">
              <PortableText value={project.description} />
            </div>

            {/* Video */}
            {project.videoUrl && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-6">
                  Video
                </h2>
                <YoutubeEmbed url={project.videoUrl} title={project.title} />
              </section>
            )}

            {/* Performance dates */}
            {project.performanceDates && project.performanceDates.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-6">
                  Performance Dates
                </h2>
                <ul className="divide-y divide-[#C9C9C9]/40">
                  {project.performanceDates.map((pd) => (
                    <li key={pd._key} className="py-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <span className="text-[#8B5F3C] font-medium">{pd.label}</span>
                        <time className="text-sm text-[#8B5F3C]/40 tabular-nums whitespace-nowrap">
                          {formatPerformanceDate(pd)}
                        </time>
                      </div>
                      {(pd.venue || pd.city || pd.country) && (
                        <p className="mt-1 text-sm text-[#8B5F3C]/60">
                          {[pd.venue, pd.city, pd.country].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
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
                      <dt className="text-xs uppercase tracking-widest text-[#8B5F3C]/40 font-medium">
                        {credit.role}
                      </dt>
                      <dd className="text-sm text-[#8B5F3C]">{credit.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Commissioned / produced by */}
            {project.commissionedBy && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#8B5F3C] mb-6">
                  Commissioned / Produced By
                </h2>
                <div className="prose prose-sm max-w-none text-[#8B5F3C]/70">
                  <PortableText value={project.commissionedBy} />
                </div>
              </section>
            )}
          </aside>
        </div>
      </Container>

      {/* Footer nav */}
      <div className="border-t border-[#C9C9C9]/40 py-10">
        <Container>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[#37C6F4] [@media(hover:hover)]:opacity-60 hover:opacity-100 text-xs uppercase tracking-widest transition-opacity duration-200"
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
