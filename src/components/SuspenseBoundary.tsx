'use client'

import React, { Suspense } from 'react'
import LoadingSpinner from './ui/LoadingSpinner'
import { useTheme } from '@/contexts/ThemeContext'

interface SuspenseBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

const DefaultFallback: React.FC = () => {
  const { isDark } = useTheme()
  
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading content...
        </p>
      </div>
    </div>
  )
}

const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({ 
  children, 
  fallback,
  className = '' 
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback || <DefaultFallback />}>
        {children}
      </Suspense>
    </div>
  )
}

export default SuspenseBoundary