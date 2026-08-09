import Container from '@/components/layout/Container'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="pt-16 pb-8 md:pt-24 md:pb-10 border-b border-[#C9C9C9]/10">
      <Container>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-light text-[#8B5F3C] mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#C9C9C9]/70 text-sm md:text-base max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </Container>
    </div>
  )
}
