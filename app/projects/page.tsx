import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/sanity/queries'
import ProjectCard from '@/components/features/projects/ProjectCard'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Past and current works and performances by IKUN Mufutau Yusuf.',
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="A selection of past and current works, performances and creations."
      />
      <Section className="bg-[#F3F1EB]">
        <Container>
          {projects.length === 0 ? (
            <p className="text-[#0B0B0B]/50 text-sm">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
