// Fixed, viewport-pinned background for the whole site — the brand brown
// base with a sparse scatter of thin engraved marks in the spirit of Yorùbá
// adire cloth stitching (starbursts, ring-stitches, a coil, a fine cross,
// a few short strokes). Rays, dots and strokes are all deliberately slightly
// irregular in length/angle/weight — a perfectly even mark reads as printed,
// not carved — and each mark sits at its own rotation so the tile repeat
// doesn't read as obviously stamped. Sits behind every section, fixed while
// content scrolls over it.

// Small hand-picked (not random, so it doesn't reshuffle on every render)
// per-ray jitter: [length multiplier, angle offset in radians, weight]
const RAY_JITTER_9 = [
  [1, 0.02, 1.5], [0.85, -0.05, 1.1], [1.1, 0.03, 1.3], [0.75, -0.02, 1],
  [1.05, 0.06, 1.4], [0.9, -0.04, 1.1], [1, 0.02, 1.2], [0.8, 0.05, 1],
  [1.15, -0.03, 1.5],
] as const

const RAY_JITTER_11 = [
  [1, -0.03, 1.6], [0.8, 0.04, 1], [1.1, -0.02, 1.3], [0.7, 0.05, 1],
  [1, -0.04, 1.4], [0.9, 0.03, 1.1], [1.15, -0.02, 1.5], [0.75, 0.04, 1],
  [1.05, -0.05, 1.3], [0.85, 0.02, 1], [1, -0.03, 1.4],
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
    <div className="fixed inset-0 -z-50 bg-[#8B5F3C]" aria-hidden="true">
      <svg className="w-full h-full">
        <defs>
          <pattern id="yoruba-motifs" width="1000" height="1000" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#F3F1EB" strokeOpacity={0.1} strokeWidth={1.4} strokeLinecap="round">
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
                strokeWidth={1.5}
              />

              {/* larger, fainter starburst further down the tile, own angle */}
              <g transform="translate(730,540) rotate(-24)" strokeOpacity={0.08}>
                <Starburst n={11} r={40} jitter={RAY_JITTER_11} />
              </g>

              {/* cross with a small hand-drawn diamond, steeply tilted, bowed strokes */}
              <g transform="translate(220,580) rotate(-33)">
                <path d="M-22,-22 Q-2,-5 22,22" strokeWidth={1.5} />
                <path d="M-22,23 Q0,3 23,-22" strokeWidth={1.2} />
                <path d="M-6,-5 L0,-7 L6,-5 L5,6 L-1,7 L-6,5 Z" />
              </g>

              {/* a few short strokes, echoing woven stripe panels, uneven lengths */}
              <g transform="translate(540,760) rotate(19)">
                <path d="M0,-22 Q1,0 -1,23" strokeWidth={1.3} />
                <path d="M9,-19 Q8,1 10,22" strokeWidth={1.1} />
                <path d="M18,-23 Q17,-1 19,20" strokeWidth={1.5} />
              </g>

              {/* single ring-stitch, isolated, irregular */}
              <ellipse cx={840} cy={220} rx={5.5} ry={4.6} transform="rotate(15 840 220)" />

              {/* faint second coil, upper-right area, own angle */}
              <path
                d="M780,60 a13,12.3 0 1,1 -1.6,-13.4 a21,19.7 0 1,0 -2.7,21.4"
                transform="rotate(-41 780 60)"
                strokeOpacity={0.08}
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#yoruba-motifs)" />
      </svg>
    </div>
  )
}
