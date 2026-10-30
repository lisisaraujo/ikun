import type { ReactNode } from 'react'

export default function HeroSection({ children }: { children: ReactNode }) {
  return (
    <section
      id="hero"
      className="relative z-0 h-[min(100svh,52rem)] bg-[#0B0B0B]"
    >
      {children}
    </section>
  )
}
