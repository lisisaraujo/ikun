'use client'

import { useEffect, useState } from 'react'

// Shared by ActiveEntryLabel (mobile, external) and ActiveImageMetadata
// (desktop, on the image) — both need "reset when the active entry
// changes, then release a couple of frames later" and nothing else.
export function useEntryReveal(entryKey: string, reducedMotion: boolean) {
  const [revealed, setRevealed] = useState(reducedMotion)

  // Resetting on entry change must happen synchronously with that change
  // (React's documented "adjust state during render" pattern) — an effect
  // would apply it a render late. Only the *timed* release back to true
  // needs an effect, since that's inherently async.
  const [prevKey, setPrevKey] = useState(entryKey)
  if (prevKey !== entryKey) {
    setPrevKey(entryKey)
    setRevealed(reducedMotion)
  }

  useEffect(() => {
    if (reducedMotion) return
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRevealed(true))
    })
    return () => cancelAnimationFrame(raf)
  }, [entryKey, reducedMotion])

  return revealed
}
