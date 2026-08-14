// A section-local backdrop: a solid base color with the same engraved
// motifs as the site-wide BackgroundPattern, drawn directly on top of it,
// then a translucent wash of that same color over the top — the exact same
// three-layer recipe (base, engravings, wash) BackgroundPattern uses for
// brown, so the engravings end up dimmed to the same visual strength rather
// than sitting fully exposed. Fully opaque — the section itself is `sticky`,
// so the next section physically slides up and covers this one as you
// scroll, rather than the colors needing to blend into each other.
interface SectionBackdropProps {
  id: string
  color: string
  // Optional accent wash — a soft, off-center bloom of colour on top of the
  // flat backdrop, echoing Peeping Tom's single-colour glow. Kept separate
  // from `color` (the base fill) so each section can lean warm or cool
  // independent of its own base tone.
  glow?: string
}

export default function SectionBackdrop({ id, color, glow }: SectionBackdropProps) {
  const patternId = `engravings-${id}`

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: color }} />
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id={patternId} width="1000" height="1000" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#F3F1EB" strokeOpacity={0.14} strokeWidth={2.2} strokeLinecap="round">
              {/* starburst, tilted */}
              <g transform="translate(130,150) rotate(17)">
                {[
                  [1, 0.02, 1.6], [0.85, -0.05, 1.2], [1.1, 0.03, 1.4], [0.75, -0.02, 1.1],
                  [1.05, 0.06, 1.5], [0.9, -0.04, 1.2], [1, 0.02, 1.3], [0.8, 0.05, 1.1],
                  [1.15, -0.03, 1.6],
                ].map(([lenMul, angleOff, weight], i) => {
                  const a = (i / 9) * Math.PI * 2 + angleOff
                  const len = 27 * lenMul
                  return (
                    <line key={i} x1={0} y1={0} x2={Math.cos(a) * len} y2={Math.sin(a) * len} strokeWidth={weight} />
                  )
                })}
              </g>

              {/* ring-stitch dots — irregular blobs */}
              <ellipse cx={370} cy={90} rx={6} ry={5} transform="rotate(-12 370 90)" />
              <ellipse cx={397} cy={113} rx={4.5} ry={5.2} transform="rotate(20 397 113)" />
              <ellipse cx={355} cy={127} rx={3.6} ry={3} transform="rotate(8 355 127)" />
              <ellipse cx={405} cy={75} rx={3.2} ry={3.8} transform="rotate(-25 405 75)" />

              {/* coil, off-axis */}
              <path
                d="M600,220 a16,15 0 1,1 -1.6,-16.4 a26,24.5 0 1,0 -3.4,26.3"
                transform="rotate(28 600 220)"
                strokeWidth={2.4}
              />

              {/* larger, fainter starburst */}
              <g transform="translate(730,540) rotate(-24)" strokeOpacity={0.1}>
                {[
                  [1, -0.03, 1.8], [0.8, 0.04, 1.1], [1.1, -0.02, 1.4], [0.7, 0.05, 1.1],
                  [1, -0.04, 1.5], [0.9, 0.03, 1.2], [1.15, -0.02, 1.6], [0.75, 0.04, 1.1],
                  [1.05, -0.05, 1.4], [0.85, 0.02, 1.1], [1, -0.03, 1.5],
                ].map(([lenMul, angleOff, weight], i) => {
                  const a = (i / 11) * Math.PI * 2 + angleOff
                  const len = 40 * lenMul
                  return (
                    <line key={i} x1={0} y1={0} x2={Math.cos(a) * len} y2={Math.sin(a) * len} strokeWidth={weight} />
                  )
                })}
              </g>

              {/* cross with a small hand-drawn diamond, tilted, bowed strokes */}
              <g transform="translate(220,580) rotate(-33)">
                <path d="M-22,-22 Q-2,-5 22,22" strokeWidth={2.4} />
                <path d="M-22,23 Q0,3 23,-22" strokeWidth={2} />
                <path d="M-6,-5 L0,-7 L6,-5 L5,6 L-1,7 L-6,5 Z" strokeWidth={1.8} />
              </g>

              {/* a few short strokes */}
              <g transform="translate(540,760) rotate(19)">
                <path d="M0,-22 Q1,0 -1,23" strokeWidth={2.1} />
                <path d="M9,-19 Q8,1 10,22" strokeWidth={1.7} />
                <path d="M18,-23 Q17,-1 19,20" strokeWidth={2.4} />
              </g>

              {/* single ring-stitch, isolated */}
              <ellipse cx={840} cy={220} rx={5.5} ry={4.6} transform="rotate(15 840 220)" />

              {/* faint second coil */}
              <path
                d="M780,60 a13,12.3 0 1,1 -1.6,-13.4 a21,19.7 0 1,0 -2.7,21.4"
                transform="rotate(-41 780 60)"
                strokeOpacity={0.1}
                strokeWidth={2}
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      {/* wash — dims the engravings to the same effective strength as the
          brown backdrop, which uses this exact same base/engravings/wash recipe */}
      <div className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.8 }} />

      {/* accent glow — a single soft bloom, off-center so it reads as
          atmosphere drifting in from a corner rather than a centered spotlight */}
      {glow && (
        <div
          className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] rounded-full"
          style={{
            background: glow,
            opacity: 0.16,
            filter: 'blur(120px)',
          }}
        />
      )}

      {/* Bottom edge softened toward shadow rather than cutting flat into
          the next section — a quiet vignette, not a visible line (that's
          SectionSeam's job, untouched here). */}
      <div
        className="absolute inset-x-0 bottom-0 h-[14vh] bg-gradient-to-b from-transparent to-black/25"
      />
    </div>
  )
}
