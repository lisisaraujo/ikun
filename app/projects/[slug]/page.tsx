import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getAllProjects, getProjectBySlug } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import PortableText from '@/components/ui/PortableText'
import YoutubeEmbed from '@/components/features/projects/YoutubeEmbed'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'
import Link from 'next/link'

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
    ? urlFor(project.coverImage).width(1200).height(700).fit('crop').auto('format').url()
    : null

  return (
    <>
      {/* Hero image */}
      {imageSrc && (
        <div className="relative h-[50vh] md:h-[60vh] bg-[#1C2433] overflow-hidden">
          <Image
            src={imageSrc}
            alt={project.title}
            fill
            priority
            className="object-cover opacity-80"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2433] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <Container className="pb-10">
              <p className="text-[#37C6F4] text-xs uppercase tracking-widest mb-2">
                {project.year}
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-800 text-[#F3F1EB]">
                {project.title}
              </h1>
            </Container>
          </div>
        </div>
      )}

      <Section className="bg-[#F3F1EB]">
        <Container>
          {!imageSrc && (
            <div className="pt-20 mb-10">
              <p className="text-[#37C6F4] text-xs uppercase tracking-widest mb-2">
                {project.year}
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-800 text-[#1C2433]">
                {project.title}
              </h1>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              {project.fullDescription ? (
                <PortableText value={project.fullDescription} />
              ) : (
                <p className="text-[#0B0B0B]/80 text-base leading-relaxed">
                  {project.shortDescription}
                </p>
              )}

              {/* YouTube embed */}
              {project.youtubeUrl && (
                <div className="mt-10">
                  <YoutubeEmbed url={project.youtubeUrl} title={project.title} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {project.collaborators && project.collaborators.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-[family-name:var(--font-heading)] text-sm font-700 uppercase tracking-widest text-[#1C2433] mb-3">
                    Collaborators
                  </h2>
                  <ul className="space-y-1">
                    {project.collaborators.map((c) => (
                      <li key={c} className="text-sm text-[#0B0B0B]/70">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link
                href="/projects"
                className="text-sm text-[#37C6F4] hover:underline underline-offset-2"
              >
                ← All projects
              </Link>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}
