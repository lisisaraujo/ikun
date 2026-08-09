// Static stitched divider marking the boundary between two page sections —
// sits at the top edge of the section it's placed in, which must be
// `relative`-positioned. Purely decorative, always visible, no scroll logic.
export default function SectionSeam() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 -translate-y-1/2 pointer-events-none"
    >
      {/* thread */}
      <div
        className="h-px bg-[#37C6F4]/35"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      />
      {/* stitches — the cursor accent mark, tiled */}
      <div
        className="absolute inset-x-0 -top-2.5 h-5"
        style={{
          backgroundImage: 'url(/cursor-accent.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: '18px 22px',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      />
    </div>
  )
}
