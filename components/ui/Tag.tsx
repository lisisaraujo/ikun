interface TagProps {
  label: string
  variant?: 'blue' | 'navy' | 'brown'
}

const variantClasses: Record<NonNullable<TagProps['variant']>, string> = {
  blue:  'bg-[#37C6F4]/10 text-[#37C6F4] border-[#37C6F4]/30',
  navy:  'bg-[#1C2433]/10 text-[#1C2433] border-[#1C2433]/30',
  brown: 'bg-[#8B5F3C]/10 text-[#8B5F3C] border-[#8B5F3C]/30',
}

export default function Tag({ label, variant = 'blue' }: TagProps) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium uppercase tracking-wider ${variantClasses[variant]}`}
    >
      {label}
    </span>
  )
}
