'use client'

import React from 'react'
import LoadingCard from './ui/LoadingCard'

interface CourseGridSkeletonProps {
  count?: number
}

const CourseGridSkeleton: React.FC<CourseGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Title skeleton */}
          <div className="animate-pulse bg-gray-300/50 h-8 w-64 mx-auto rounded mb-6" />
          {/* Subtitle skeleton */}
          <div className="animate-pulse bg-gray-300/50 h-4 w-96 mx-auto rounded" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <LoadingCard key={index} lines={4} />
          ))}
        </div>

        <div className="text-center mt-12">
          {/* Button skeleton */}
          <div className="animate-pulse bg-gray-300/50 h-12 w-48 mx-auto rounded-xl" />
        </div>
      </div>
    </section>
  )
}

export default CourseGridSkeleton