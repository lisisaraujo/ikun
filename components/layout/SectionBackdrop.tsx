// A section-local backdrop — a flat base fill, nothing else. The engraved
// motif, glow bloom, and bottom vignette this used to layer on top were
// removed so every section reads as one plain, uninterrupted color; the
// only motion left in these sections' backgrounds is the spinning spirals
// (SectionOrbitBackground, ProjectsAmbient), which live elsewhere.
interface SectionBackdropProps {
  color: string
}

export default function SectionBackdrop({ color }: SectionBackdropProps) {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true" style={{ backgroundColor: color }} />
  )
}
