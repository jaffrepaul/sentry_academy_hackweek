'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trophy, ChevronRight, Star } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getCardClasses, getTextClasses, getButtonClasses } from '@/utils/styles'

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

interface CourseCardProps extends Course {}

const CourseCard: React.FC<CourseCardProps> = memo(({ 
  id,
  slug,
  title, 
  description, 
  duration, 
  level, 
  rating, 
  students, 
  category,
  isPopular = false
}) => {
  const { isDark } = useTheme()
  const router = useRouter()

  const handleCardClick = useCallback(() => {
    if (slug) {
      router.push(`/courses/${slug}`)
    }
  }, [slug, router])

  const cardClasses = useMemo(() => getCardClasses(isDark), [isDark])
  
  return (
    <div className="group cursor-pointer relative transition-smooth hover:scale-[1.02]" onClick={handleCardClick}>
      {isPopular && (
        <div className="absolute -top-3 -right-3 z-10 transition-smooth group-hover:scale-110">
          <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Popular
          </div>
        </div>
      )}
      
      <div className={`${cardClasses} p-6 h-full transition-smooth group-hover:shadow-2xl`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full ${
            isDark 
              ? 'text-purple-300 bg-purple-500/20' 
              : 'text-purple-700 bg-purple-200/60'
          }`}>
            {category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{rating}</span>
          </div>
        </div>

        <h3 className={`text-xl font-bold mb-3 transition-smooth ${getTextClasses(isDark, 'primary')} group-hover:${getTextClasses(isDark, 'accent').replace('text-', 'text-')} group-hover:translate-x-1`}>
          {title}
        </h3>

        <p className={`mb-6 leading-relaxed line-clamp-3 ${getTextClasses(isDark, 'secondary')}`}>
          {description}
        </p>

        <div className={`flex items-center justify-between text-sm mb-6 ${getTextClasses(isDark, 'secondary')}`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>{level}</span>
            </div>
          </div>
          <span className="text-xs">{students.toLocaleString()} students</span>
        </div>

        <div className={`flex items-center justify-between pt-4 border-t ${
          isDark ? 'border-slate-700/50' : 'border-gray-200/50'
        }`}>
          <span className={`font-medium transition-colors ${getTextClasses(isDark, 'accent')}`}>
            Start Course
          </span>
          <ChevronRight className={`w-5 h-5 group-hover:translate-x-2 transition-smooth ${getTextClasses(isDark, 'secondary')} group-hover:${getTextClasses(isDark, 'accent').replace('text-', 'text-')}`} />
        </div>
      </div>
    </div>
  )
})

CourseCard.displayName = 'CourseCard'

interface CourseGridProps {
  courses: Course[]
  showFilters?: boolean
}

const CourseGrid: React.FC<CourseGridProps> = memo(({ courses, showFilters = false }) => {
  const { isDark } = useTheme()

  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark])
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark])
  const buttonClasses = useMemo(() => getButtonClasses(isDark, 'secondary'), [isDark])

  return (
    <section id="courses" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${titleClasses}`}>
            Featured{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${subtitleClasses}`}>
            Handpicked courses designed to build real-world expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className={`${buttonClasses} px-8 py-3 rounded-xl font-medium`}>
            View All Courses
          </button>
        </div>
      </div>
    </section>
  )
})

CourseGrid.displayName = 'CourseGrid'
export default CourseGrid
