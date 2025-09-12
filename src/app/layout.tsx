import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import StructuredData from '@/components/StructuredData'
import { generateSEO, generateOrganizationStructuredData, generateWebsiteStructuredData } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = generateSEO()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData 
          data={[
            generateOrganizationStructuredData(),
            generateWebsiteStructuredData()
          ]} 
        />
      </head>
      <body className="antialiased min-h-screen" style={{ backgroundColor: 'var(--bg-main, rgb(251 251 253))' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
