import type { PressItem } from '@/types/sanity'

interface PressLinksProps {
  items?: PressItem[]
}

export default function PressLinks({ items = [] }: PressLinksProps) {
  if (items.length === 0) return null

  return (
    <div className="mt-12 max-w-[42rem]">
      <p className="type-meta mb-4 text-[#A06B43]/70">In the press</p>
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => {
          const content = (
            <>
              <span className="type-small text-[#F3F1EB]/82">{item.headline}</span>
              <span className="type-meta shrink-0 text-[#A06B43]/70">{item.publication}</span>
            </>
          )

          return item.url ? (
            <a
              key={item._key}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline justify-between gap-4 transition-colors duration-200 hover:text-[#37C6F4]"
            >
              {content}
            </a>
          ) : (
            <div key={item._key} className="flex items-baseline justify-between gap-4">
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
