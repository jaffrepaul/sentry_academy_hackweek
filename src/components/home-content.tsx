'use client'

import { useMemo, useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getBackgroundStyle, handleHashNavigation } from '@/utils/styles'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CourseGrid from '@/components/CourseGrid'
import LearningPaths from '@/components/LearningPaths'
import StatsSection from '@/components/StatsSection'
import Footer from '@/components/Footer'

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
  const { isDark } = useTheme()

  // Handle hash fragments for direct URLs like /#courses
  useEffect(() => {
    handleHashNavigation(window.location.hash)
  }, [])

  // Memoize background styles to prevent recalculation on every render
  const backgroundStyle = useMemo(() => getBackgroundStyle(isDark), [isDark])

  // Memoize gradient classes for better performance
  const gradientClasses = useMemo(() => ({
    primary: isDark 
      ? 'bg-gradient-to-r from-purple-500/10 via-transparent to-violet-500/10' 
      : 'bg-gradient-to-r from-purple-200/20 via-transparent to-pink-200/20',
    accent1: isDark ? 'bg-purple-500/10' : 'bg-purple-300/20',
    accent2: isDark ? 'bg-violet-500/10' : 'bg-pink-300/20'
  }), [isDark])

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
        {/* Animated background elements */}
        <div className={`absolute inset-0 ${gradientClasses.primary}`} style={{ pointerEvents: 'none' }} />
        <div 
          className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${gradientClasses.accent1}`}
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'auto',
            pointerEvents: 'none'
          }}
        />
        <div 
          className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl ${gradientClasses.accent2}`}
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