import type { PortableTextBlock } from '@portabletext/types'

// A dedicated short-blurb field no longer exists on the project schema —
// this derives a plain-text excerpt from the (now required) portable text
// `description` instead, for places that need a short string: card blurbs,
// <meta description> tags, etc.
export function portableTextToPlainText(blocks: PortableTextBlock[] | undefined, maxLength?: number): string {
  if (!blocks?.length) return ''

  const text = blocks
    .filter((block) => block._type === 'block' && Array.isArray(block.children))
    .map((block) =>
      (block.children as { text?: string }[])
        .map((child) => child.text ?? '')
        .join('')
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (maxLength && text.length > maxLength) {
    return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`
  }
  return text
}
