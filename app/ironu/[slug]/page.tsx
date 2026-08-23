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
    <div className="bg-[#8B5F3C] min-h-screen">
      {/* Back link — floats above content. Sits below the fixed logo's
          ~112px band on mobile, where the two would otherwise overlap. */}
      <div className="fixed top-28 md:top-16 left-0 right-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 pt-5">
          <Link
            href="/#ironu"
            className="pointer-events-auto inline-flex items-center gap-2 text-[#37C6F4] [@media(hover:hover)]:opacity-60 hover:opacity-100 text-[10px] uppercase tracking-widest transition-opacity duration-200"
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
        <Container className="py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
            <div className="w-full sm:w-[min(22rem,50%)]">
              {prevPost && (
                <Link
                  href={`/ironu/${prevPost.slug.current}`}
                  className="group block rounded-2xl bg-[#8B5F3C]/10 px-6 py-5 text-center transition-colors duration-300 hover:bg-[#8B5F3C]/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#A06B43]/70 transition-colors duration-200 group-hover:text-[#37C6F4] md:text-sm">
                    Older
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase leading-[1.05] tracking-normal text-[#A06B43] transition-colors duration-200 line-clamp-2 group-hover:text-[#37C6F4] md:text-2xl">
                    {prevPost.title}
                  </p>
                </Link>
              )}
            </div>
            <div className="w-full sm:w-[min(22rem,50%)]">
              {nextPost && (
                <Link
                  href={`/ironu/${nextPost.slug.current}`}
                  className="group block rounded-2xl bg-[#8B5F3C]/10 px-6 py-5 text-center transition-colors duration-300 hover:bg-[#8B5F3C]/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#A06B43]/70 transition-colors duration-200 group-hover:text-[#37C6F4] md:text-sm">
                    Newer
                  </p>
                  <p className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase leading-[1.05] tracking-normal text-[#A06B43] transition-colors duration-200 line-clamp-2 group-hover:text-[#37C6F4] md:text-2xl">
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
