'use client'

import React, { Suspense } from 'react'
import LoadingSpinner from './ui/LoadingSpinner'

interface SuspenseBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

const DefaultFallback: React.FC = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading content...</p>
      </div>
    </div>
  )
}

const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({
  children,
  fallback,
  className = '',
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback || <DefaultFallback />}>{children}</Suspense>
    </div>
  )
}

export default SuspenseBoundary
