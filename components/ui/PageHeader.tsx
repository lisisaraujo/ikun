import Container from '@/components/layout/Container'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="pt-16 pb-8 md:pt-24 md:pb-10 border-b border-[#C9C9C9]/10">
      <Container>
        <h1 className="type-display mb-4 font-light text-[#8B5F3C]">
          {title}
        </h1>
        {subtitle && (
          <p className="type-body max-w-xl text-[#C9C9C9]/70">{subtitle}</p>
        )}
      </Container>
    </div>
  )
}
