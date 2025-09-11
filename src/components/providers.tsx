'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { RoleProvider } from '@/contexts/RoleContext'
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
 * Features:
 * - Error boundary protection for providers
 * - Proper provider nesting order
 * - Error logging and reporting
 */
export function Providers({ children }: ProvidersProps) {
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
        <ThemeProvider>
          <ErrorBoundary onError={handleProviderError}>
            <RoleProvider>
              {children}
            </RoleProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}