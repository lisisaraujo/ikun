import type { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
}

export default function Section({ children, className = '', as: Tag = 'section' }: SectionProps) {
  return <Tag className={`py-16 md:py-24 ${className}`}>{children}</Tag>
}
