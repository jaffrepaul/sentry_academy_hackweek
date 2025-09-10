'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

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
const ApiErrorBoundary: React.FC<ApiErrorProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  const { isDark } = useTheme()

  const getErrorDetails = (error: Error) => {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        icon: WifiOff,
        title: 'Connection Error',
        description: 'Unable to connect to our servers. Please check your internet connection.',
        canRetry: true
      }
    }
    
    if (message.includes('timeout')) {
      return {
        icon: Wifi,
        title: 'Request Timeout',
        description: 'The request is taking longer than expected. Please try again.',
        canRetry: true
      }
    }
    
    if (message.includes('404') || message.includes('not found')) {
      return {
        icon: AlertTriangle,
        title: 'Content Not Found',
        description: 'The requested content could not be found.',
        canRetry: false
      }
    }
    
    if (message.includes('500') || message.includes('server')) {
      return {
        icon: AlertTriangle,
        title: 'Server Error',
        description: 'Our servers are experiencing issues. Please try again later.',
        canRetry: true
      }
    }
    
    return {
      icon: AlertTriangle,
      title: 'Something went wrong',
      description: 'An unexpected error occurred while loading the content.',
      canRetry: true
    }
  }

  const errorDetails = getErrorDetails(error)
  const Icon = errorDetails.icon

  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="text-center max-w-sm">
        <div className={`w-12 h-12 mx-auto mb-4 ${
          isDark ? 'text-red-400' : 'text-red-500'
        }`}>
          <Icon className="w-full h-full" />
        </div>
        
        <h3 className={`text-lg font-semibold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {errorDetails.title}
        </h3>
        
        <p className={`text-sm mb-6 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {errorDetails.description}
        </p>
        
        {errorDetails.canRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </button>
        )}
        
        {/* Error details for development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className={`cursor-pointer text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            } hover:text-gray-300`}>
              Debug Info
            </summary>
            <pre className={`mt-2 p-2 rounded text-xs overflow-auto max-h-32 ${
              isDark ? 'bg-slate-800 text-red-300' : 'bg-gray-100 text-red-600'
            }`}>
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default ApiErrorBoundary