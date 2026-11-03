'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface FooterVisibilityProps {
  children: ReactNode
}

export default function FooterVisibility({ children }: FooterVisibilityProps) {
  const pathname = usePathname()
  const isDetailPage = pathname.startsWith('/projects/') || pathname.startsWith('/ironu/')

  return (
    <div className={isDetailPage ? 'footer-detail-shell' : 'footer-home-shell'}>
      {children}
    </div>
  )
}
