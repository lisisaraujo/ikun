'use client'

// A minimal, module-scoped pub/sub so a carousel can nudge the ambient
// decorations sitting behind it without wiring up React context — they
// live in the same page but are otherwise unrelated components, and this
// is the only signal they ever need to share. Channeled by section name
// (e.g. "projects", "ironu") since several sections' carousels and ambient
// layers are all mounted simultaneously on the home page.
type Listener = (direction: 1 | -1) => void

const channels = new Map<string, Set<Listener>>()

export function emitCarouselNav(channel: string, direction: 1 | -1) {
  channels.get(channel)?.forEach((listener) => listener(direction))
}

export function subscribeCarouselNav(channel: string, listener: Listener) {
  let listeners = channels.get(channel)
  if (!listeners) {
    listeners = new Set()
    channels.set(channel, listeners)
  }
  listeners.add(listener)
  return () => {
    listeners!.delete(listener)
  }
}
