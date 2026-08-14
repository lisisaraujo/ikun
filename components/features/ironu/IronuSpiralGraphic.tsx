// The pure stitched-thread spiral graphic — Ìrònú's own equivalent of
// SpiralRings, used inside SectionOrbitBackground as the whole-section
// ambient mark behind the carousel. Sizing, positioning and rotation are
// all owned by SectionOrbitBackground; this component only draws the mark.
function buildSpiralPath(turns = 3, maxR = 92, cx = 100, cy = 100, steps = 200) {
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = t * turns * Math.PI * 2
    const r = t * maxR
    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `
  }
  return d.trim()
}
const SPIRAL_PATH = buildSpiralPath()

export default function IronuSpiralGraphic({ className = '', opacity = 0.4 }: { className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <path
        d={SPIRAL_PATH}
        fill="none"
        stroke="#37C6F4"
        strokeOpacity={opacity}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="4 7 2 9"
      />
    </svg>
  )
}
