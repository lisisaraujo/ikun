import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import LogoMark from '@/components/layout/LogoMark'
import Footer from '@/components/layout/Footer'
import { SITE_NAME, SITE_TAGLINE } from '@/constants/site'

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: `${SITE_NAME} — ${SITE_TAGLINE}. Nigerian-Irish performer, choreographer and teacher based in Europe.`,
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_IE',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#F3F1EB] text-[#8B5F3C]" suppressHydrationWarning>
        <LogoMark />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
