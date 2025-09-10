import type { Metadata } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RoleProvider } from '@/contexts/RoleContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sentry Academy',
  description: 'Learn application monitoring and error tracking with Sentry',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <RoleProvider>
            {children}
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
