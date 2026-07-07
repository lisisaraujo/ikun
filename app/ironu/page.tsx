import type { Metadata } from 'next'
import { getAllIronuPosts } from '@/lib/sanity/queries'
import IronuCard from '@/components/features/ironu/IronuCard'
import PageHeader from '@/components/ui/PageHeader'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'

export const metadata: Metadata = {
  title: 'Ìrònú',
  description: 'Personal reflections and essays by Mufutau Yusuf.',
}

export default async function IronuPage() {
  const posts = await getAllIronuPosts()

  return (
    <>
      <PageHeader
        title="Ìrònú"
        subtitle="Personal reflections and essays."
      />
      <Section className="bg-[#F3F1EB]">
        <Container>
          {posts.length === 0 ? (
            <p className="text-[#8B5F3C]/40 text-sm uppercase tracking-widest">
              No posts yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
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
