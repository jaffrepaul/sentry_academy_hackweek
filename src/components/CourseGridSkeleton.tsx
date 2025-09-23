'use client'

import React from 'react'
import LoadingCard from './ui/LoadingCard'

interface CourseGridSkeletonProps {
  count?: number
}

const CourseGridSkeleton: React.FC<CourseGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          {/* Title skeleton */}
          <div className="mx-auto mb-6 h-8 w-64 animate-pulse rounded bg-gray-300/50" />
          {/* Subtitle skeleton */}
          <div className="mx-auto h-4 w-96 animate-pulse rounded bg-gray-300/50" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, index) => (
            <LoadingCard key={index} lines={4} />
          ))}
        </div>

        <div className="mt-12 text-center">
          {/* Button skeleton */}
          <div className="mx-auto h-12 w-48 animate-pulse rounded-xl bg-gray-300/50" />
        </div>
      </div>
    </section>
  )
}

export default CourseGridSkeleton
