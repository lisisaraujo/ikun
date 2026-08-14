// Shared motion language for the Projects and Ìrònú carousels — one
// continuous function of a card's signed distance from center (in "card
// steps", not raw pixels), so cards physically travel through these values
// as the track scrolls rather than snapping between discrete states.
// Center = "on stage"; one step out = "waiting in the wings"; further out
// recedes toward the background.
export const CAROUSEL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

// A card reaches full "neighbor" treatment once it's this many card-steps
// from center, and full "background" recession by the second threshold.
const NEIGHBOR_AT = 0.65
const BACKGROUND_AT = 1.35

export interface CardMotion {
  scale: number
  opacity: number
  rotateDeg: number
  translateY: number
  blurPx: number
}

/**
 * `signedDist`: 0 at dead center, negative for cards on the "previous" side,
 * positive on the "next" side — normalized to card-steps (1 ≈ one card's
 * own pitch), not raw pixels, so it reads the same at every breakpoint.
 * `intensity`: 0–1 multiplier that scales rotation/vertical-offset down on
 * narrow viewports, where a full-strength tilt/sink would feel cramped.
 */
export function getCardMotion(signedDist: number, reducedMotion: boolean, intensity = 1): CardMotion {
  if (reducedMotion) {
    const isCenter = Math.abs(signedDist) < 0.1
    return {
      scale: isCenter ? 1 : 0.94,
      opacity: isCenter ? 1 : 0.65,
      rotateDeg: 0,
      translateY: 0,
      blurPx: 0,
    }
  }

  const dist = Math.abs(signedDist)
  const dir = signedDist === 0 ? 0 : signedDist < 0 ? -1 : 1
  const t = Math.min(dist / NEIGHBOR_AT, 1)
  const t2 = Math.min(Math.max((dist - NEIGHBOR_AT) / (BACKGROUND_AT - NEIGHBOR_AT), 0), 1)

  const scale = 1 - t * 0.15 - t2 * 0.2
  const opacity = 1 - t * 0.45 - t2 * 0.35
  const rotateDeg = dir * (t * 1.8 + t2 * 0.7) * intensity
  // Previous side sinks, next side lifts — the "opposite direction" rhythm
  // that keeps the row from reading as three cards lined up on a shelf.
  const translateY = -dir * (t * 55 + t2 * 15) * intensity
  const blurPx = t * 1.4 + t2 * 1.0

  return { scale, opacity, rotateDeg, translateY, blurPx }
}

// 0–1, how "in focus" a card is — used to scale companion elements like a
// spinner dial (full size at dead center, shrinking out toward the wings).
export function getCardFocus(signedDist: number): number {
  return Math.max(0, 1 - Math.min(Math.abs(signedDist) / NEIGHBOR_AT, 1))
}
