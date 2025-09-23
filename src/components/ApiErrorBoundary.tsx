'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
// Theme handled automatically by Tailwind dark: classes

interface ApiErrorProps {
  error: Error
  onRetry?: () => void
  className?: string
}

/**
 * API Error Component
 *
 * Displays user-friendly error messages for different types of API errors
 * with appropriate retry options.
 */
const ApiErrorBoundary: React.FC<ApiErrorProps> = ({ error, onRetry, className = '' }) => {
  // Theme handled automatically by Tailwind dark: classes

  const getErrorDetails = (error: Error) => {
    const message = error.message.toLowerCase()

    if (message.includes('network') || message.includes('fetch')) {
      return {
        icon: WifiOff,
        title: 'Connection Error',
        description: 'Unable to connect to our servers. Please check your internet connection.',
        canRetry: true,
      }
    }

    if (message.includes('timeout')) {
      return {
        icon: Wifi,
        title: 'Request Timeout',
        description: 'The request is taking longer than expected. Please try again.',
        canRetry: true,
      }
    }

    if (message.includes('404') || message.includes('not found')) {
      return {
        icon: AlertTriangle,
        title: 'Content Not Found',
        description: 'The requested content could not be found.',
        canRetry: false,
      }
    }

    if (message.includes('500') || message.includes('server')) {
      return {
        icon: AlertTriangle,
        title: 'Server Error',
        description: 'Our servers are experiencing issues. Please try again later.',
        canRetry: true,
      }
    }

    return {
      icon: AlertTriangle,
      title: 'Something went wrong',
      description: 'An unexpected error occurred while loading the content.',
      canRetry: true,
    }
  }

  const errorDetails = getErrorDetails(error)
  const Icon = errorDetails.icon

  return (
    <div className={`flex min-h-[200px] items-center justify-center ${className}`}>
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-400">
          <Icon className="h-full w-full" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {errorDetails.title}
        </h3>

        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">{errorDetails.description}</p>

        {errorDetails.canRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </button>
        )}

        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300 dark:text-gray-500">
              Debug Info
            </summary>
            <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-100 p-2 text-xs text-red-600 dark:bg-slate-800 dark:text-red-300">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default ApiErrorBoundary
