'use client'

import { useMemo, useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
// Theme handled automatically by Tailwind dark: classes
import { getBackgroundStyle, handleHashNavigation } from '@/utils/styles'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CourseGrid from '@/components/CourseGrid'
import StatsSection from '@/components/StatsSection'
import Footer from '@/components/Footer'

// Dynamic imports for heavy components
const LearningPaths = dynamic(() => import('@/components/LearningPaths'), {
  loading: () => (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="animate-pulse bg-gray-300/50 dark:bg-gray-600/50 h-8 w-64 mx-auto rounded mb-6" />
          <div className="animate-pulse bg-gray-300/50 dark:bg-gray-600/50 h-4 w-96 mx-auto rounded" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-300/50 dark:bg-gray-600/50 h-64 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: true
})

interface Course {
  id: number
  slug: string
  title: string
  description: string
  duration: string
  level: string
  rating: number
  students: number
  category: string
  isPopular?: boolean
  difficulty?: string
}

interface HomeContentProps {
  courses: Course[]
}

// Home page content component that handles client-side interactions
const HomePageContent = ({ courses }: HomeContentProps) => {
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
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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
        className="min-h-screen relative"
        style={{
          ...backgroundStyle,
          contain: 'layout style paint'
        }}
      >
        {/* Animated background elements using Tailwind dark: classes */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-transparent to-pink-200/20 dark:from-purple-500/10 dark:via-transparent dark:to-violet-500/10" style={{ pointerEvents: 'none' }} />
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-300/20 dark:bg-purple-500/10"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'auto',
            pointerEvents: 'none'
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl bg-pink-300/20 dark:bg-violet-500/10"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
            willChange: 'auto',
            pointerEvents: 'none'
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