import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import type { IronuPost } from '@/types/sanity'

interface IronuPreviewProps {
  posts: IronuPost[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function IronuPreview({ posts }: IronuPreviewProps) {
  const latestPost = posts[0]
  const coverUrl = latestPost?.coverImage
    ? urlFor(latestPost.coverImage).width(1200).height(900).fit('crop').auto('format').url()
    : null

  return (
    <section className="home-section z-ironu relative sticky top-0 overflow-visible px-4 pb-6 pt-10 sm:px-6 md:px-8 md:pt-14 lg:px-10 xl:px-12">
      <div className="home-section-inner relative z-10 mx-auto grid w-full max-w-[140rem] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(36rem,1.15fr)] lg:gap-16 xl:gap-24">
        <div className="max-w-[54rem] text-left">
          <h2 className="type-title text-[#F3F1EB]">
            Notes from the work
          </h2>
          <p className="type-body mt-6 max-w-[43rem] text-[#F3F1EB]/84">
            Ìrònú is a space for reflections, fragments, research, and writing around the body, memory, heritage, and the questions that move through Ikùn&apos;s practice.
          </p>
        </div>

        <div className="w-full lg:pt-16">
          {latestPost ? (
            <>
              <Link
                href={`/ironu/${latestPost.slug.current}`}
                data-cursor-tone="warm"
                className="spotlight-hover editorial-frame group block w-full bg-[#0B0B0B]/10 shadow-[0_24px_80px_-72px_rgba(160,107,67,0.7)] transition-transform duration-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70"
                aria-label={`Read latest Ìrònú post: ${latestPost.title}`}
              >
                <div className="grid min-h-[22rem] md:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
                  <div className="flex flex-col justify-end p-6 md:p-8 lg:p-10">
                    <p className="type-meta mb-4 text-[#A06B43]/62">
                      Latest post&nbsp;&nbsp; / &nbsp;&nbsp;{formatDate(latestPost.date)}
                    </p>
                    <h3 className="type-title text-[#F3F1EB] transition-colors duration-500 group-hover:text-[#A06B43]">
                      {latestPost.title}
                    </h3>
                    <p className="type-label mt-5 inline-flex items-center gap-3 text-[#A06B43]/86 transition-colors duration-300 group-hover:text-[#F3F1EB]">
                      Read
                    </p>
                  </div>

                  <div className="relative min-h-[18rem] bg-[#0B0B0B] md:min-h-full">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={latestPost.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 18rem"
                        className="object-cover opacity-70 grayscale-[18%] transition-[opacity,filter] duration-700 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="type-display text-[#A06B43]/18" aria-hidden="true">
                          Ì
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.58)_0%,transparent_58%)]" />
                  </div>
                </div>
              </Link>
              <div className="mt-6 flex justify-end">
                <Link
                  href="/ironu"
                  data-cursor-tone="warm"
                  className="type-label group inline-flex items-center gap-2 text-[#A06B43] transition-colors duration-300 hover:text-[#F3F1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06B43]/60"
                >
                  See all posts
                  <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                    <path d="M4 10h11M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <p className="editorial-frame bg-[#0B0B0B]/12 px-6 py-10 text-sm uppercase tracking-widest text-[#8B5F3C]/45">
              No posts yet.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
