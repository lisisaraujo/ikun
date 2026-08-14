import SpiralRings from './SpiralRings'

// Small background accents scattered around the section — the same ring
// motif as the focused card's spinner dial (kept at its own larger, fixed
// size in ProjectsCarousel), just smaller, dimmer, and drifting free in the
// background rather than tied to any one card. Percentage-based positions
// so they stay roughly in place across viewport sizes.
const FLOATING_SPIRALS = [
  { top: '6%',  left: '7%',   size: 60, opacity: 0.16, duration: 15 },
  { top: '12%', right: '9%',  size: 42, opacity: 0.13, duration: 19 },
  { top: '58%', left: '4%',   size: 50, opacity: 0.15, duration: 17 },
  { top: '80%', right: '6%',  size: 66, opacity: 0.18, duration: 13 },
  { top: '38%', left: '13%',  size: 34, opacity: 0.11, duration: 21 },
  { top: '88%', left: '44%',  size: 40, opacity: 0.13, duration: 16 },
]

// Small hand-drawn marks, echoing SectionBackdrop's engravings, that
// quietly fade in and out on a loop rather than spin — a second, subtler
// kind of ambient motion alongside the spirals.
const FLOATING_MARKS: { top: string; left?: string; right?: string; size: number; delay: number; duration: number; kind: 'coil' | 'dots' | 'cross' }[] = [
  { top: '20%', right: '22%', size: 30, delay: 0,   duration: 9,   kind: 'coil' },
  { top: '50%', right: '32%', size: 22, delay: 3,   duration: 11,  kind: 'dots' },
  { top: '28%', left: '25%',  size: 26, delay: 5.5, duration: 10,  kind: 'cross' },
  { top: '68%', left: '22%',  size: 20, delay: 1.5, duration: 8.5, kind: 'dots' },
  { top: '90%', right: '18%', size: 24, delay: 4,   duration: 12,  kind: 'coil' },
]

function CoilMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#37C6F4" strokeOpacity={0.4} strokeWidth={1.6} strokeLinecap="round">
      <path d="M28,17 a8,7.5 0 1,1 -0.8,-8.2 a13,12.3 0 1,0 -1.7,13.4" />
    </svg>
  )
}

function DotsMark() {
  return (
    <svg viewBox="0 0 40 40" fill="#37C6F4" fillOpacity={0.4}>
      <ellipse cx={12} cy={10} rx={3.4} ry={2.8} transform="rotate(-12 12 10)" />
      <ellipse cx={22} cy={16} rx={2.5} ry={3} transform="rotate(20 22 16)" />
      <ellipse cx={9} cy={22} rx={2} ry={1.7} transform="rotate(8 9 22)" />
    </svg>
  )
}

function CrossMark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="#37C6F4" strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round">
      <path d="M12,12 Q19,20 28,28" />
      <path d="M12,29 Q20,21 28,12" />
      <path d="M16,18 L20,16 L24,18 L23,23 L19,25 L15,23 Z" strokeWidth={1.2} />
    </svg>
  )
}

const MARK_COMPONENTS = { coil: CoilMark, dots: DotsMark, cross: CrossMark }

export default function ProjectsAmbient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {FLOATING_SPIRALS.map((s, i) => (
        <div
          key={i}
          className="absolute animate-spin-slow"
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
          }}
        >
          <SpiralRings className="w-full h-full" />
        </div>
      ))}
      {FLOATING_MARKS.map((m, i) => {
        const Mark = MARK_COMPONENTS[m.kind]
        return (
          <div
            key={i}
            className="absolute animate-ambient-fade"
            style={{
              top: m.top,
              left: m.left,
              right: m.right,
              width: m.size,
              height: m.size,
              animationDelay: `${m.delay}s`,
              animationDuration: `${m.duration}s`,
            }}
          >
            <Mark />
          </div>
        )
      })}
    </div>
  )
}
