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

      return <DefaultErrorFallback error={this.state.error || new Error('Unknown error occurred')} onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
  onRetry: () => void
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ 
  error, 
  onRetry 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 text-red-400">
          <AlertCircle className="w-full h-full" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Something went wrong
        </h2>
        
        <p className="text-gray-400 mb-8">
          We encountered an unexpected error. This might be a temporary issue.
        </p>
        
        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
              Error Details
            </summary>
            <pre className="mt-2 p-4 bg-slate-800 rounded-lg text-xs text-red-300 overflow-auto max-h-40">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
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

export default ErrorBoundary