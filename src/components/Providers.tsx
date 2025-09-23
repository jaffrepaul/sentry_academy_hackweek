'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { PersonalizedLearningProvider } from '@/contexts/PersonalizedLearningContext'
import ErrorBoundary from './ErrorBoundary'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Client-side providers wrapper component with error boundaries.
 * This component handles all context providers that require client-side functionality.
 * By separating providers into their own client component, we keep the root layout
 * as a server component, following Next.js App Router best practices.
 * 
 * Provider Hierarchy:
 * - SessionProvider: Authentication and user sessions
 * - ThemeProvider: UI theme management (client-only state)
 * - PersonalizedLearningProvider: Engineer roles, learning paths, and progress tracking
 * 
 * Features:
 * - Error boundary protection for providers
 * - Proper provider nesting order
 * - Single responsibility: complete personalized learning journey
 * - Error logging and reporting
 */
export default function Providers({ children }: ProvidersProps) {
  const handleProviderError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Provider error:', error, errorInfo)

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error, { context: 'providers', ...errorInfo })
    }
  }

  return (
    <ErrorBoundary onError={handleProviderError}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <PersonalizedLearningProvider>
            {children}
          </PersonalizedLearningProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
