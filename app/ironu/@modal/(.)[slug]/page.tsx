import { notFound } from 'next/navigation'
import { getIronuPostBySlug, getAllIronuPosts } from '@/lib/sanity/queries'
import IronuModal from '@/components/features/ironu/IronuModal'
import IronuPostContent from '@/components/features/ironu/IronuPostContent'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function IronuModalPage({ params }: Props) {
  const { slug } = await params

  const [post, allPosts] = await Promise.all([
    getIronuPostBySlug(slug),
    getAllIronuPosts(),
  ])

  if (!post) notFound()

  const postsMeta = allPosts.map((p) => ({
    _id:   p._id,
    title: p.title,
    slug:  p.slug,
  }))

  return (
    <IronuModal key={slug} allPosts={postsMeta} currentSlug={slug}>
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 pt-20 pb-10">
        <IronuPostContent post={post} />
      </div>
    </IronuModal>
  )
}
