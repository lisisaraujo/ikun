// One large stitched-thread spiral spinning slowly behind the whole Ìrònú
// section — a background mark, not a foreground UI element, so it sits low
// in opacity and doesn't compete with the section's text. Pure CSS
// animation, no client-side JS needed.

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

export default function IronuSpiral() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-[680px] h-[680px] sm:w-[820px] sm:h-[820px] md:w-[960px] md:h-[960px] animate-spin-slow"
        style={{ animationDuration: '40s' }}
      >
        <path
          d={SPIRAL_PATH}
          fill="none"
          stroke="#37C6F4"
          strokeOpacity={0.14}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="4 7 2 9"
        />
      </svg>
    </div>
  )
}
