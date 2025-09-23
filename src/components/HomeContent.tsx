'use client'

import { useMemo, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { getBackgroundStyle, handleHashNavigation } from '@/utils/styles'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CourseGrid from '@/components/CourseGrid'
import StatsSection from '@/components/StatsSection'
import Footer from '@/components/Footer'
import { Course as DBCourse } from '@/types/database'
import { Course } from '@/data/courses'

// Transform database course to frontend course
const transformCourse = (dbCourse: DBCourse): Course & { slug: string } => ({
  id: dbCourse.id.toString(),
  slug: dbCourse.slug || dbCourse.id.toString(), // Fallback to id if slug is missing
  title: dbCourse.title,
  description: dbCourse.description || '',
  duration: dbCourse.duration || '30 min',
  level: dbCourse.level || dbCourse.difficulty || 'Beginner',
  rating: dbCourse.rating || 45, // Default 4.5 stars
  students: dbCourse.students || 0,
  category: dbCourse.category || 'General',
  isPopular: dbCourse.is_popular || false,
})

// Dynamic imports for heavy components
const LearningPaths = dynamic(() => import('@/components/LearningPaths'), {
  loading: () => (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mx-auto mb-6 h-8 w-64 animate-pulse rounded bg-gray-300/50 dark:bg-gray-600/50" />
          <div className="mx-auto h-4 w-96 animate-pulse rounded bg-gray-300/50 dark:bg-gray-600/50" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-xl bg-gray-300/50 dark:bg-gray-600/50"
            />
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: true,
})

interface HomeContentProps {
  courses: DBCourse[]
}

// Home page content component that handles client-side interactions
const HomePageContent = ({ courses: dbCourses }: HomeContentProps) => {
  const courses = useMemo(() => dbCourses.map(transformCourse), [dbCourses])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay then fade in for smooth transition
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`transition-fade ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <Hero />
      <CourseGrid courses={courses} />
      <LearningPaths />
      <StatsSection />
      <Footer />
    </div>
  )
}

export default function HomeContent({ courses }: HomeContentProps) {
  // Handle hash fragments for direct URLs like /#courses
  useEffect(() => {
    handleHashNavigation(window.location.hash)
  }, [])

  // Background styles now use CSS custom properties that work with dark mode
  const backgroundStyle = useMemo(() => getBackgroundStyle(), [])

  return (
    <>
      {/* Header positioned outside main layout flow */}
      <Header />

      {/* Main content with background */}
      <div
        className="relative min-h-screen"
        style={{
          ...backgroundStyle,
          contain: 'layout style paint',
        }}
      >
        {/* Animated background elements using Tailwind dark: classes */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-transparent to-pink-200/20 dark:from-purple-500/10 dark:via-transparent dark:to-violet-500/10"
          style={{ pointerEvents: 'none' }}
        />
        <div
          className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'auto',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl dark:bg-violet-500/10"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
            willChange: 'auto',
            pointerEvents: 'none',
          }}
        />

        {/* Content with top padding for header */}
        <div className="pt-20">
          <HomePageContent courses={courses} />
        </div>
      </div>
    </>
  )
}
