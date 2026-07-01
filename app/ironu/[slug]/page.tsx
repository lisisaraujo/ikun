import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAllIronuPosts, getIronuPostBySlug } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/image'
import PortableText from '@/components/ui/PortableText'
import Container from '@/components/layout/Container'
import Section from '@/components/layout/Section'

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
  return { title: post.title }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function IronuPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getIronuPostBySlug(slug)

  if (!post) notFound()

  const imageSrc = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(600).fit('crop').auto('format').url()
    : null

  return (
    <>
      {/* Cover image */}
      {imageSrc && (
        <div className="relative h-[40vh] md:h-[50vh] bg-[#1C2433] overflow-hidden mt-20">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            priority
            className="object-cover opacity-70"
            sizes="100vw"
          />
        </div>
      )}

      <Section className={`bg-[#F3F1EB] ${!imageSrc ? 'pt-32' : ''}`}>
        <Container>
          <div className="max-w-2xl">
            {/* Back link */}
            <Link
              href="/ironu"
              className="text-sm text-[#8B5F3C] hover:underline underline-offset-2 mb-8 block"
            >
              ← Irònú
            </Link>

            {/* Meta */}
            <p className="text-xs font-medium uppercase tracking-widest text-[#8B5F3C] mb-3">
              {formatDate(post.date)}
            </p>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-800 text-[#1C2433] mb-10 leading-tight">
              {post.title}
            </h1>

            {/* Body */}
            <PortableText value={post.body} />
          </div>
        </Container>
      </Section>
    </>
  )
}
