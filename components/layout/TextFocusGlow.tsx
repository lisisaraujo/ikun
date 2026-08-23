interface TextFocusGlowProps {
  className?: string
}

export default function TextFocusGlow({ className = '' }: TextFocusGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,95,60,0.34)_0%,rgba(139,95,60,0.18)_32%,rgba(55,198,244,0.055)_58%,transparent_76%)] blur-2xl ${className}`}
    />
  )
}
