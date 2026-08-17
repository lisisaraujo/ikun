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

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects(),
  ])

  if (!project) notFound()

  // Ordered `year desc` (see getAllProjects), same convention as the
  // Ìrònú detail page's Older/Newer nav.
  const idx         = allProjects.findIndex((p) => p.slug.current === slug)
  const olderProject = idx < allProjects.length - 1 ? allProjects[idx + 1] : null
  const newerProject = idx > 0                       ? allProjects[idx - 1] : null

  return (
    <div className="bg-[#8B5F3C] min-h-screen">
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
              <div className="border-l-2 border-[#37C6F4] pl-5 text-[#1C2433]/80 italic">
                <PortableText
                  value={project.featuredNote}
                  className="[&_a]:text-[#1C2433] [&_strong]:text-[#1C2433] [&_blockquote]:border-[#1C2433]"
                />
              </div>
            )}

            {/* Description */}
            <PortableText
              value={project.description}
              className="text-[#1C2433]/80 text-lg [&_a]:text-[#1C2433] [&_strong]:text-[#1C2433] [&_blockquote]:border-[#1C2433]"
            />

            {/* Video */}
            {project.videoUrl && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#1C2433] mb-6">
                  Video
                </h2>
                <YoutubeEmbed url={project.videoUrl} title={project.title} />
              </section>
            )}

            {/* Performance dates */}
            {project.performanceDates && project.performanceDates.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#1C2433] mb-6">
                  Performance Dates
                </h2>
                <ul className="divide-y divide-[#1C2433]/20">
                  {project.performanceDates.map((pd) => (
                    <li key={pd._key} className="py-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <span className="text-[#1C2433] font-medium">{pd.label}</span>
                        <time className="text-sm text-[#1C2433]/40 tabular-nums whitespace-nowrap">
                          {formatPerformanceDate(pd)}
                        </time>
                      </div>
                      {(pd.venue || pd.city || pd.country) && (
                        <p className="mt-1 text-sm text-[#1C2433]/60">
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
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#1C2433] mb-6">
                  Credits
                </h2>
                <dl className="space-y-3">
                  {project.credits.map((credit) => (
                    <div key={credit._key} className="flex flex-col gap-0.5">
                      <dt className="text-xs uppercase tracking-widest text-[#1C2433]/40 font-medium">
                        {credit.role}
                      </dt>
                      <dd className="text-sm text-[#1C2433]">{credit.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Commissioned / produced by */}
            {project.commissionedBy && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-[#1C2433] mb-6">
                  Commissioned / Produced By
                </h2>
                <PortableText
                  value={project.commissionedBy}
                  className="text-[#1C2433]/70 text-sm [&_a]:text-[#1C2433] [&_strong]:text-[#1C2433] [&_blockquote]:border-[#1C2433]"
                />
              </section>
            )}
          </aside>
        </div>
      </Container>

      {/* Prev / Next — same pattern as the Ìrònú detail page, in place of a
          redundant second "back" link (the hero above already has one). */}
      <div className="border-t border-[#1C2433]/20 mt-4">
        <Container className="py-14">
          <div className="grid grid-cols-2 gap-8">
            <div>
              {olderProject && (
                <Link href={`/projects/${olderProject.slug.current}`} className="group block">
                  <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] [@media(hover:hover)]:opacity-50 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                    ← Older
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-base text-[#37C6F4] [@media(hover:hover)]:opacity-70 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 leading-snug">
                    {olderProject.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="text-right">
              {newerProject && (
                <Link href={`/projects/${newerProject.slug.current}`} className="group block">
                  <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] [@media(hover:hover)]:opacity-50 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                    Newer →
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-base text-[#37C6F4] [@media(hover:hover)]:opacity-70 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 leading-snug">
                    {newerProject.title}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}
