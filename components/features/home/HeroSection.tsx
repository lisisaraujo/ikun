import { forwardRef, type ReactNode } from 'react'

const HeroSection = forwardRef<HTMLElement, { children: ReactNode }>(function HeroSection({ children }, ref) {
  return (
    <section
      ref={ref}
      id="hero"
      className="sticky top-0 z-30 h-[min(100svh,52rem)] bg-[#0B0B0B] will-change-[transform]"
    >
      {children}
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
