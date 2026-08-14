// A ring of text slowly circling in the hero's side margin — Ikun's own
// version of the rotating title effect on the Marseille reference, built
// with the same "circle of things, always spinning" idea already used for
// the spiral motif elsewhere (SpiralRings, ProjectsAmbient), just applied
// to words instead of rings. Sits in the open margin beside the centered
// intro text rather than around the logo — the logo's own band is too
// short for a ring this size not to clip against the viewport's top edge.
// Wide screens only: there's no equivalent open margin once the text
// column fills the width on narrower viewports.
const ORBIT_WORDS = ['CHOREOGRAPHY', 'PERFORMANCE', 'TEACHING', 'ÌKÙN']
const PATH_ID = 'hero-orbit-path'

export default function HeroOrbitText() {
  const text = `${ORBIT_WORDS.join('   ·   ')}   ·   `

  return (
    <div
      aria-hidden="true"
      className="hidden xl:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[260px] h-[260px] z-[15] opacity-[0.3] pointer-events-none animate-spin-slower"
    >
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <path id={PATH_ID} d="M 200,200 m -170,0 a 170,170 0 1,1 340,0 a 170,170 0 1,1 -340,0" />
        </defs>
        <text
          fill="#37C6F4"
          fontSize="13"
          letterSpacing="4"
          className="font-heading"
          style={{ fontWeight: 600 }}
        >
          <textPath href={`#${PATH_ID}`}>{text}</textPath>
        </text>
      </svg>
    </div>
  )
}
