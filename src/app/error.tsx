'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary component for the home page
 *
 * This catches errors in the page and provides a user-friendly
 * error message with recovery options.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Home page error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="max-w-md text-center">
        {/* Error icon */}
        <div className="mx-auto mb-6 h-16 w-16 text-red-400">
          <AlertCircle className="h-full w-full" />
        </div>

        {/* Error message */}
        <h2 className="mb-4 text-2xl font-bold text-white">Oops! Something went wrong</h2>

        <p className="mb-8 text-gray-400">
          We encountered an error while loading Sentry Academy. This might be a temporary issue.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
              Error Details
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-slate-800 p-4 text-xs text-red-300">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {/* Action buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center rounded-lg bg-slate-700 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-600"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to home
          </button>
        </div>
      </div>
    </div>
  )
}
