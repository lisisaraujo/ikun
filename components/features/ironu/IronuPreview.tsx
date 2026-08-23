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
    <section className="relative sticky top-0 z-40 min-h-screen overflow-visible px-4 pb-12 pt-28 sm:px-6 md:px-8 md:pt-32 lg:px-10 xl:px-12">
      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-10rem)] w-full max-w-[140rem] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(36rem,1.15fr)] lg:gap-16 xl:gap-24">
        <div className="max-w-[54rem] text-left">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A06B43]/62">Ìrònú</p>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(2.6rem,5.2vw,6.7rem)] font-bold uppercase leading-[0.9] tracking-normal text-[#A06B43]">
            Notes from the work
          </h2>
          <p className="mt-6 max-w-[43rem] text-base leading-[1.58] text-[#A06B43]/84 md:text-[1.08rem] xl:text-[1.16rem]">
            Ìrònú is a space for reflections, fragments, research, and writing around the body, memory, heritage, and the questions that move through Ikùn&apos;s practice.
          </p>
          <Link
            href="/ironu"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#8B5F3C]/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#A06B43] ring-1 ring-[#8B5F3C]/24 transition-colors duration-300 hover:text-[#37C6F4]"
          >
            See all posts
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="w-full lg:pt-28">
          {latestPost ? (
            <Link
              href={`/ironu/${latestPost.slug.current}`}
              className="group block w-full overflow-hidden rounded-2xl bg-[#0B0B0B]/10 shadow-[0_24px_80px_-72px_rgba(160,107,67,0.7)] transition-[background-color,transform] duration-500 hover:bg-[#A06B43]/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/70"
              aria-label={`Read latest Ìrònú post: ${latestPost.title}`}
            >
              <div className="grid min-h-[22rem] md:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="flex flex-col justify-end p-6 md:p-8 lg:p-10">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A06B43]/62">
                  Latest post&nbsp;&nbsp; / &nbsp;&nbsp;{formatDate(latestPost.date)}
                </p>
                <h3 className="font-[family-name:var(--font-heading)] text-[clamp(2rem,3.4vw,4.2rem)] font-bold uppercase leading-[0.92] tracking-normal text-[#A06B43] transition-colors duration-500 group-hover:text-[#37C6F4]">
                  {latestPost.title}
                </h3>
                <p className="mt-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#A06B43]/76 transition-colors duration-300 group-hover:text-[#37C6F4]">
                  Read
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>

              <div className="relative min-h-[18rem] bg-[#0B0B0B] md:min-h-full">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={latestPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 18rem"
                    className="object-cover opacity-70 grayscale-[18%] transition-[transform,opacity,filter] duration-700 group-hover:scale-[1.035] group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-heading)] text-7xl font-bold uppercase text-[#A06B43]/18" aria-hidden="true">
                      Ì
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.58)_0%,transparent_58%)]" />
                </div>
              </div>
            </Link>
          ) : (
            <p className="rounded-2xl bg-[#0B0B0B]/12 px-6 py-10 text-sm uppercase tracking-widest text-[#8B5F3C]/45">
              No posts yet.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
