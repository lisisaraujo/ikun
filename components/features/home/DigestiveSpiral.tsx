interface DigestiveSpiralProps {
  className?: string
  variant?: 'simple' | 'segmented' | 'original'
}

function SimpleDigestiveSpiral({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <defs>
        <filter id="digestive-core-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g fill="none" stroke="#8B5F3C" strokeLinecap="round">
        <path
          d="M72 36c35-18 82-1 96 38 15 42-6 86-46 100-37 13-80-2-96-38-13-31 0-68 31-83 28-14 63-5 78 21 15 25 8 57-15 73-21 14-51 11-68-8"
          strokeOpacity={0.34}
          strokeWidth={5.8}
        />
        <path
          d="M91 70c22-4 44 11 48 33 4 23-11 46-34 51-20 4-40-7-48-25"
          strokeOpacity={0.24}
          strokeWidth={9}
        />
        <path
          d="M52 120c-8-24 3-52 26-64"
          strokeOpacity={0.18}
          strokeWidth={12}
        />
      </g>
      <path
        d="M82 88c17-17 47-11 58 10 12 24-5 53-32 57-21 3-42-10-48-29-5-14 3-29 22-38Z"
        fill="#8B5F3C"
        opacity={0.07}
        filter="url(#digestive-core-blur)"
      />
      <path
        d="M96 99c10-9 27-5 33 7 6 13-3 28-18 31-12 2-24-5-28-16-3-8 2-17 13-22Z"
        fill="#37C6F4"
        opacity={0.035}
        filter="url(#digestive-core-blur)"
      />
    </svg>
  )
}

function SegmentedDigestiveSpiral({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      <g fill="none" stroke="#8B5F3C" strokeLinecap="round">
        <path
          d="M52 101C52 72 74 49 105 48c30-1 55 20 56 49 1 35-28 58-61 58-26 0-47-17-48-40-.8-20 15-35 36-36 20-1 36 11 37 28 .8 16-11 27-27 28-12 .8-23-7-24-18-.7-10 7-18 18-19"
          strokeOpacity={0.42}
          strokeWidth={3.6}
          strokeDasharray="22 16 9 18"
        />
        <path
          d="M34 96c5-36 36-68 78-66 38 2 68 31 70 68 2 45-35 81-81 80-40-.8-73-29-77-68"
          strokeOpacity={0.26}
          strokeWidth={5}
          strokeDasharray="34 22 12 24"
        />
        <path
          d="M70 134c15 19 46 21 66 5 22-17 25-49 7-71-15-18-42-23-64-12"
          strokeOpacity={0.3}
          strokeWidth={7}
          strokeDasharray="18 28"
        />
      </g>
      <g fill="#8B5F3C" opacity={0.18}>
        <ellipse cx={62} cy={58} rx={6} ry={18} transform="rotate(42 62 58)" />
        <ellipse cx={143} cy={72} rx={7} ry={23} transform="rotate(-28 143 72)" />
        <ellipse cx={154} cy={143} rx={8} ry={27} transform="rotate(38 154 143)" />
        <ellipse cx={82} cy={154} rx={7} ry={22} transform="rotate(-35 82 154)" />
      </g>
      <path
        d="M96 94c8-6 19-4 25 4 5 8 3 19-6 24-9 6-22 1-25-9-2-7 0-14 6-19Z"
        fill="#8B5F3C"
        opacity={0.14}
      />
    </svg>
  )
}

function OriginalSpiral({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={className}>
      {[24, 43, 64].map((r, index) => (
        <circle
          key={r}
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke="#8B5F3C"
          strokeOpacity={0.65}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={index === 0 ? '4 9' : index === 1 ? '3 6 7 9' : '5 10 3 8'}
        />
      ))}
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

export default function DigestiveSpiral({ className = '', variant = 'simple' }: DigestiveSpiralProps) {
  if (variant === 'original') return <OriginalSpiral className={className} />
  if (variant === 'segmented') return <SegmentedDigestiveSpiral className={className} />
  return <SimpleDigestiveSpiral className={className} />
}
