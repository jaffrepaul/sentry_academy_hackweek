'use client'

import React from 'react'

interface LoadingCardProps {
  className?: string
  lines?: number
}

const LoadingCard: React.FC<LoadingCardProps> = ({ 
  className = '', 
  lines = 3 
}) => {
  const cardClasses = 'backdrop-blur-sm border rounded-2xl p-6 bg-white/75 border-purple-400/40 dark:bg-slate-900/40 dark:border-purple-500/30'
  const skeletonClasses = 'animate-pulse rounded bg-gray-300/50 dark:bg-slate-700/50'

  return (
    <div className={`${cardClasses} ${className}`} aria-label="Loading content">
      {/* Header skeleton */}
      <div className={`h-4 w-3/4 ${skeletonClasses} mb-4`} />
      
      {/* Content lines skeleton */}
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`h-3 ${skeletonClasses} mb-2 ${
            index === lines - 1 ? 'w-1/2' : 'w-full'
          }`} 
        />
      ))}
      
      {/* Button skeleton */}
      <div className={`h-10 w-24 ${skeletonClasses} mt-4`} />
    </div>
  )
}

export default LoadingCard