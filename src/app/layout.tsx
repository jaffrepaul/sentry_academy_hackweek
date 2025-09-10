import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sentry Academy',
  description: 'Learn application monitoring and error tracking with Sentry',
  keywords: ['Sentry', 'error monitoring', 'application observability', 'performance monitoring'],
  authors: [{ name: 'Sentry Academy Team' }],
  creator: 'Sentry Academy',
  publisher: 'Sentry',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
