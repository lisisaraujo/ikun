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
import { SITE_EMAIL } from '@/constants/site'

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
    <div className="detail-page bg-[#8B5F3C] min-h-screen">
      {/* Hero — clickable cover that opens gallery lightbox */}
      <ProjectGalleryHero
        title={project.title}
        coverImage={project.coverImage ?? null}
        images={project.images ?? []}
        backHref="/#projects"
        backLabel="Back"
      />

      {/* Body */}
      <Container className="project-detail-content py-20 md:py-28">
        <header className="project-detail-header mb-14 grid gap-5 border-b border-[#1C2433]/20 pb-10 md:mb-20 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10 md:pb-14">
          {project.year && (
            <p className="type-meta pt-2 text-[#1C2433]/70">
              {project.year}
            </p>
          )}
          <h1 className="type-display max-w-5xl text-[#1C2433]">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-start-2">
            <p className="type-meta text-[#1C2433]/58">Selected work / {project.year}</p>
            <a
              href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(`Enquiry about ${project.title}`)}`}
              className="type-label text-[#1C2433] transition-colors duration-200 hover:text-[#37C6F4]"
            >
              Enquire about this work <span aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(15rem,0.7fr)] lg:gap-20">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured note — a highlighted recognition (e.g. an Aerowaves
                selection), set apart from the main description below it */}
            {project.featuredNote && (
              <div className="border-l-2 border-[#37C6F4] pl-5 type-body italic text-[#1C2433]/80">
                <PortableText
                  value={project.featuredNote}
                  className="[&_a]:text-[#1C2433] [&_strong]:text-[#1C2433] [&_blockquote]:border-[#1C2433]"
                />
              </div>
            )}

            {/* Description */}
            <PortableText
              value={project.description}
              className="type-body text-[#1C2433]/80 [&_a]:text-[#1C2433] [&_strong]:text-[#1C2433] [&_blockquote]:border-[#1C2433]"
            />

            {/* Video */}
            {project.videoUrl && (
              <section>
                <h2 className="type-label mb-6 text-[#1C2433]">
                  Video
                </h2>
                <YoutubeEmbed url={project.videoUrl} title={project.title} />
              </section>
            )}

            {/* Performance dates */}
            {project.performanceDates && project.performanceDates.length > 0 && (
              <section>
                <h2 className="type-label mb-6 text-[#1C2433]">
                  Performance Dates
                </h2>
                <ul className="divide-y divide-[#1C2433]/20">
                  {project.performanceDates.map((pd) => (
                    <li key={pd._key} className="py-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <span className="type-feature text-[#1C2433]">{pd.label}</span>
                        <time className="type-small whitespace-nowrap text-[#1C2433]/55 tabular-nums">
                          {formatPerformanceDate(pd)}
                        </time>
                      </div>
                      {(pd.venue || pd.city || pd.country) && (
                        <p className="type-small mt-1 text-[#1C2433]/60">
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
              <section className="border-t border-[#1C2433]/20 pt-6">
                <h2 className="type-label mb-6 text-[#1C2433]">
                  Credits
                </h2>
                <dl className="space-y-3">
                  {project.credits.map((credit) => (
                    <div key={credit._key} className="flex flex-col gap-0.5">
                      <dt className="type-meta text-[#1C2433]/50">
                        {credit.role}
                      </dt>
                      <dd className="type-small text-[#1C2433]">{credit.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* Commissioned / produced by */}
            {project.commissionedBy && (
              <section className="border-t border-[#1C2433]/20 pt-6">
                <h2 className="type-label mb-6 text-[#1C2433]">
                  Commissioned / Produced By
                </h2>
                <PortableText
                  value={project.commissionedBy}
                  className="type-small text-[#1C2433]/70 [&_a]:text-[#1C2433] [&_strong]:text-[#1C2433] [&_blockquote]:border-[#1C2433]"
                />
              </section>
            )}
          </aside>
        </div>
      </Container>

      {/* Prev / Next — same pattern as the Ìrònú detail page, in place of a
          redundant second "back" link (the hero above already has one). */}
      <div className="mt-4 bg-[#8B5F3C] text-[#1C2433]">
        <Container className="py-14">
          <div className="project-detail-nav grid grid-cols-2 gap-8">
            <div>
              {olderProject && (
                <Link href={`/projects/${olderProject.slug.current}`} className="group block pt-4 transition-colors duration-200">
                  <p className="type-meta mb-2 text-[#1C2433]/65 transition-colors duration-200 group-hover:text-[#37C6F4]">
                    ← Older
                  </p>
                  <p className="type-heading text-[#1C2433] transition-colors duration-200 group-hover:text-[#F3F1EB] line-clamp-2">
                    {olderProject.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="text-right">
              {newerProject && (
                <Link href={`/projects/${newerProject.slug.current}`} className="group block pt-4 transition-colors duration-200">
                  <p className="type-meta mb-2 text-[#1C2433]/65 transition-colors duration-200 group-hover:text-[#37C6F4]">
                    Newer →
                  </p>
                  <p className="type-heading text-[#1C2433] transition-colors duration-200 group-hover:text-[#F3F1EB] line-clamp-2">
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
