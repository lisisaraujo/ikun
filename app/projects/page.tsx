import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/sanity/queries'
import ProjectsClient from '@/components/features/projects/ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Past and current works and performances by IKUN Mufutau Yusuf.',
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  return <ProjectsClient projects={projects} />
}
