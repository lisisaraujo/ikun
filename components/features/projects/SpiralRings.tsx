// Concentric rings — irregular dash rhythm per ring so it reads as
// hand-worked rather than a machine-uniform pattern. Shared between the
// per-card spinner dial in ProjectsCarousel and the smaller ambient
// spirals floating in the section background.
export const SPIRAL_RINGS = [
  { r: 24, dasharray: '4 9' },
  { r: 43, dasharray: '3 6 7 9' },
  { r: 64, dasharray: '5 10 3 8' },
]

export default function SpiralRings({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className} style={style}>
      {SPIRAL_RINGS.map(({ r, dasharray }) => (
        <circle
          key={r}
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke=" #8B5F3C"
          strokeOpacity={0.65}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={dasharray}
        />
      ))}
      {/* centered seal mark — a bounded medallion, not an empty coil */}
      <rect
        x={95}
        y={95}
        width={10}
        height={10}
        transform="rotate(45 100 100)"
        fill="#8B5F3C"
        fillOpacity={0.65}
      />
    </svg>
  )
}
