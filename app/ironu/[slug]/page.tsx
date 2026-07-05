import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllIronuPosts, getIronuPostBySlug } from '@/lib/sanity/queries'
import IronuPostContent from '@/components/features/ironu/IronuPostContent'
import Container from '@/components/layout/Container'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllIronuPosts()
  return posts.map((p) => ({ slug: p.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getIronuPostBySlug(slug)
  if (!post) return {}
  return { title: `${post.title} — Ìrònú` }
}

export default async function IronuPostPage({ params }: Props) {
  const { slug } = await params

  const [post, allPosts] = await Promise.all([
    getIronuPostBySlug(slug),
    getAllIronuPosts(),
  ])

  if (!post) notFound()

  const idx      = allPosts.findIndex((p) => p.slug.current === slug)
  const prevPost = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const nextPost = idx > 0                    ? allPosts[idx - 1] : null

  return (
    <div className="bg-[#F3F1EB] min-h-screen">
      {/* Back link — floats above content */}
      <div className="fixed top-16 left-0 right-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 pt-5">
          <Link
            href="/ironu"
            className="pointer-events-auto inline-flex items-center gap-2 text-[#37C6F4] [@media(hover:hover)]:opacity-60 hover:opacity-100 text-[10px] uppercase tracking-widest transition-opacity duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth={2} aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ìrònú
          </Link>
        </div>
      </div>

      {/* Post content */}
      <Container className="py-0">
        <IronuPostContent post={post} />
      </Container>

      {/* Prev / Next */}
      <div className="border-t border-[#C9C9C9]/40 mt-20">
        <Container className="py-14">
          <div className="max-w-2xl grid grid-cols-2 gap-8">
            <div>
              {prevPost && (
                <Link href={`/ironu/${prevPost.slug.current}`} className="group block">
                  <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] [@media(hover:hover)]:opacity-50 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                    ← Older
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-base text-[#37C6F4] [@media(hover:hover)]:opacity-70 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 leading-snug">
                    {prevPost.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="text-right">
              {nextPost && (
                <Link href={`/ironu/${nextPost.slug.current}`} className="group block">
                  <p className="text-[10px] uppercase tracking-widest text-[#37C6F4] [@media(hover:hover)]:opacity-50 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                    Newer →
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-base text-[#37C6F4] [@media(hover:hover)]:opacity-70 group-hover:opacity-100 transition-opacity duration-200 line-clamp-2 leading-snug">
                    {nextPost.title}
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
