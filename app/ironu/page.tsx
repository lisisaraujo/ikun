import type { Metadata } from 'next'
import { getAllIronuPosts } from '@/lib/sanity/queries'
import IronuCard from '@/components/features/ironu/IronuCard'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'Irònú',
  description: 'Personal reflections and essays by Mufutau Yusuf.',
}

export default async function IronuPage() {
  const posts = await getAllIronuPosts()

  return (
    <>
      <PageHeader
        title="Irònú"
        subtitle="Personal reflections and essays by Mufutau Yusuf."
      />
      <Section className="bg-[#F3F1EB]">
        <Container>
          {posts.length === 0 ? (
            <p className="text-[#0B0B0B]/50 text-sm">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl">
              {posts.map((post) => (
                <IronuCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
