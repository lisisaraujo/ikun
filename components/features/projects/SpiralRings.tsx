// Concentric rings — irregular dash rhythm per ring so it reads as
// hand-worked rather than a machine-uniform pattern. Shared between the
// per-card spinner dial in ProjectsCarousel and the smaller ambient
// spirals floating in the section background.
export const SPIRAL_RINGS = [
  { r: 24, dasharray: '4 9' },
  { r: 43, dasharray: '3 6 7 9' },
  { r: 64, dasharray: '5 10 3 8' },
]

export default function SpiralRings({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      {SPIRAL_RINGS.map(({ r, dasharray }) => (
        <circle
          key={r}
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke="#37C6F4"
          strokeOpacity={0.45}
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
        fill="#37C6F4"
        fillOpacity={0.55}
      />
    </svg>
  )
}
