'use client'

import React, { Component, ReactNode } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      return (
        <DefaultErrorFallback
          error={this.state.error || new Error('Unknown error occurred')}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
  onRetry: () => void
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ error, onRetry }) => {
  return (
    <div className="flex min-h-[400px] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 h-16 w-16 text-red-400">
          <AlertCircle className="h-full w-full" />
        </div>

        <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong</h2>

        <p className="mb-8 text-gray-400">
          We encountered an unexpected error. This might be a temporary issue.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
              Error Details
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-slate-800 p-4 text-xs text-red-300">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={onRetry}
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

export default ErrorBoundary
