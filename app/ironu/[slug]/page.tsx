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
    <div className="detail-page bg-[#8B5F3C] min-h-screen">
      {/* Back link shares the top navigation row with the logo and menu. */}
      <div className="fixed left-0 right-0 top-5 z-40 pointer-events-none md:top-4">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
          <Link
            href="/#ironu"
            className="type-meta pointer-events-auto inline-flex items-center gap-2 text-[#37C6F4] [@media(hover:hover)]:opacity-60 transition-opacity duration-200 hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth={2} aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      {/* Post content */}
      <Container className="py-0">
        <IronuPostContent post={post} />
      </Container>

      {/* Prev / Next */}
      <div className="border-t border-[#1C2433]/20 mt-20">
        <Container className="py-14 md:py-16">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="w-full">
              {prevPost && (
                <Link
                  href={`/ironu/${prevPost.slug.current}`}
                  className="group block border-t border-[#1C2433]/25 px-1 py-5 transition-colors duration-300 hover:border-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#A06B43]/70 transition-colors duration-200 group-hover:text-[#37C6F4] md:text-sm">
                    Older
                  </p>
                  <p className="type-heading text-[#1C2433] transition-colors duration-200 line-clamp-2 group-hover:text-[#37C6F4]">
                    {prevPost.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="w-full text-left sm:text-right">
              {nextPost && (
                <Link
                  href={`/ironu/${nextPost.slug.current}`}
                  className="group block border-t border-[#1C2433]/25 px-1 py-5 transition-colors duration-300 hover:border-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#A06B43]/70 transition-colors duration-200 group-hover:text-[#37C6F4] md:text-sm">
                    Newer
                  </p>
                  <p className="type-heading text-[#1C2433] transition-colors duration-200 line-clamp-2 group-hover:text-[#37C6F4]">
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
