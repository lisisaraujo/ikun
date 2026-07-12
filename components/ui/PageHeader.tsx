import Container from '@/components/layout/Container'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="pt-2 pb-2 border-b border-[#C9C9C9]/10">
      <Container>
    
        {subtitle && (
          <p className="text-[#C9C9C9]/60 text-sm md:text-base max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </Container>
    </div>
  )
}
