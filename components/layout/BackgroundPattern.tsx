// Fixed, viewport-pinned background for the whole site: a stone-toned base
// with thicker, more legible carved marks in the spirit of Yorùbá adire
// cloth stitching, then a translucent brand-brown wash layered on top of
// that — so the marks read as if actually engraved into the surface
// beneath, seen through a warm brown overlay, rather than sitting flat on
// top of a solid color. Rays, dots and strokes are all deliberately
// slightly irregular in length/angle/weight, and each mark sits at its own
// rotation, so the tile repeat doesn't read as obviously stamped. Sits
// behind every section, fixed while content scrolls over it.

// Small hand-picked (not random, so it doesn't reshuffle on every render)
// per-ray jitter: [length multiplier, angle offset in radians, weight]
const RAY_JITTER_9 = [
  [1, 0.02, 2.4], [0.85, -0.05, 1.7], [1.1, 0.03, 2.1], [0.75, -0.02, 1.6],
  [1.05, 0.06, 2.2], [0.9, -0.04, 1.7], [1, 0.02, 1.9], [0.8, 0.05, 1.6],
  [1.15, -0.03, 2.4],
] as const

const RAY_JITTER_11 = [
  [1, -0.03, 2.6], [0.8, 0.04, 1.6], [1.1, -0.02, 2.1], [0.7, 0.05, 1.6],
  [1, -0.04, 2.2], [0.9, 0.03, 1.7], [1.15, -0.02, 2.4], [0.75, 0.04, 1.6],
  [1.05, -0.05, 2.1], [0.85, 0.02, 1.6], [1, -0.03, 2.2],
] as const

function Starburst({ n, r, jitter }: { n: number; r: number; jitter: readonly (readonly number[])[] }) {
  return (
    <>
      {jitter.slice(0, n).map(([lenMul, angleOff, weight], i) => {
        const a = (i / n) * Math.PI * 2 + angleOff
        const len = r * lenMul
        return (
          <line
            key={i}
            x1={0}
            y1={0}
            x2={Math.cos(a) * len}
            y2={Math.sin(a) * len}
            strokeWidth={weight}
          />
        )
      })}
    </>
  )
}

export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-50" aria-hidden="true">
      {/* stone base the marks are "carved" into */}
      <div className="absolute inset-0 bg-[#4A3626]" />

      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="yoruba-motifs" width="1000" height="1000" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#F3F1EB" strokeOpacity={0.16} strokeWidth={2.2} strokeLinecap="round">
              {/* starburst, tilted, uneven rays */}
              <g transform="translate(130,150) rotate(17)">
                <Starburst n={9} r={27} jitter={RAY_JITTER_9} />
              </g>

              {/* ring-stitch dots — irregular blobs, not perfect circles */}
              <ellipse cx={370} cy={90} rx={6} ry={5} transform="rotate(-12 370 90)" />
              <ellipse cx={397} cy={113} rx={4.5} ry={5.2} transform="rotate(20 397 113)" />
              <ellipse cx={355} cy={127} rx={3.6} ry={3} transform="rotate(8 355 127)" />
              <ellipse cx={405} cy={75} rx={3.2} ry={3.8} transform="rotate(-25 405 75)" />

              {/* coil, rotated off-axis, slightly uneven weight */}
              <path
                d="M600,220 a16,15 0 1,1 -1.6,-16.4 a26,24.5 0 1,0 -3.4,26.3"
                transform="rotate(28 600 220)"
                strokeWidth={2.4}
              />

              {/* larger, fainter starburst further down the tile, own angle */}
              <g transform="translate(730,540) rotate(-24)" strokeOpacity={0.12}>
                <Starburst n={11} r={40} jitter={RAY_JITTER_11} />
              </g>

              {/* cross with a small hand-drawn diamond, steeply tilted, bowed strokes */}
              <g transform="translate(220,580) rotate(-33)">
                <path d="M-22,-22 Q-2,-5 22,22" strokeWidth={2.4} />
                <path d="M-22,23 Q0,3 23,-22" strokeWidth={2} />
                <path d="M-6,-5 L0,-7 L6,-5 L5,6 L-1,7 L-6,5 Z" strokeWidth={1.8} />
              </g>

              {/* a few short strokes, echoing woven stripe panels, uneven lengths */}
              <g transform="translate(540,760) rotate(19)">
                <path d="M0,-22 Q1,0 -1,23" strokeWidth={2.1} />
                <path d="M9,-19 Q8,1 10,22" strokeWidth={1.7} />
                <path d="M18,-23 Q17,-1 19,20" strokeWidth={2.4} />
              </g>

              {/* single ring-stitch, isolated, irregular */}
              <ellipse cx={840} cy={220} rx={5.5} ry={4.6} transform="rotate(15 840 220)" />

              {/* faint second coil, upper-right area, own angle */}
              <path
                d="M780,60 a13,12.3 0 1,1 -1.6,-13.4 a21,19.7 0 1,0 -2.7,21.4"
                transform="rotate(-41 780 60)"
                strokeOpacity={0.12}
                strokeWidth={2}
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#yoruba-motifs)" />
      </svg>

      {/* translucent brand-brown wash over the carved stone */}
      <div className="absolute inset-0 bg-[#8B5F3C]/80" />
    </div>
  )
}
