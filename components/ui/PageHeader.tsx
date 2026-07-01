import Container from '@/components/layout/Container'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-[#1C2433] pt-32 pb-14">
      <Container>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-800 text-[#F3F1EB] mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#C9C9C9] text-base md:text-lg max-w-xl">{subtitle}</p>
        )}
      </Container>
    </div>
  )
}
