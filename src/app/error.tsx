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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="text-center max-w-md">
        {/* Error icon */}
        <div className="w-16 h-16 mx-auto mb-6 text-red-400">
          <AlertCircle className="w-full h-full" />
        </div>
        
        {/* Error message */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-400 mb-8">
          We encountered an error while loading Sentry Academy. This might be a temporary issue.
        </p>
        
        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
              Error Details
            </summary>
            <pre className="mt-2 p-4 bg-slate-800 rounded-lg text-xs text-red-300 overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to home
          </button>
        </div>
      </div>
    </div>
  )
}