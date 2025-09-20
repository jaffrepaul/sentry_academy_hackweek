'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trophy, ChevronRight, Star } from 'lucide-react'
// Theme handled automatically by Tailwind dark: classes
import { getCardClasses, getTextClasses, getButtonClasses } from '@/utils/styles'
import { formatRating } from '@/utils/ratingUtils'
import { Course } from '@/data/courses'

interface CourseCardProps extends Omit<Course, 'slug'> {
  slug: string;
  difficulty?: string;
}

const CourseCard: React.FC<CourseCardProps> = memo(({ 
  id: _id,
  slug,
  title, 
  description, 
  duration, 
  level, 
  rating, 
  students, 
  category,
  difficulty,
  isPopular = false
}) => {
  // Theme handled automatically by Tailwind dark: classes
  const router = useRouter()

  const handleCardClick = useCallback(() => {
    if (slug) {
      router.push(`/courses/${slug}`)
    }
  }, [slug, router])

  const cardClasses = useMemo(() => getCardClasses(), [])
  
  return (
    <div className="group cursor-pointer relative transition-smooth hover:scale-[1.02]" onClick={handleCardClick}>
      {isPopular && (
        <div className="absolute -top-3 -right-3 z-10 transition-smooth group-hover:scale-110">
          <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Popular
          </div>
        </div>
      )}
      
      <div className={`${cardClasses} p-6 h-full group-hover:shadow-2xl flex flex-col`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full text-purple-700 bg-purple-200/60 dark:text-purple-300 dark:bg-purple-500/20">
            {category || 'General'}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {rating ? formatRating(rating, true) : '4.5'}
            </span>
          </div>
        </div>

        <h3 className={`text-xl font-bold mb-3 transition-smooth group-hover:text-purple-400 group-hover:translate-x-1 ${getTextClasses('primary')}`}>
          {title}
        </h3>

        <p className={`mb-6 leading-relaxed line-clamp-3 flex-grow ${getTextClasses('secondary')}`}>
          {description || 'Course description not available.'}
        </p>

        <div className={`flex items-center justify-between text-sm mb-6 ${getTextClasses('secondary')}`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{duration || '30 min'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>{level || difficulty || 'Beginner'}</span>
            </div>
          </div>
          <span className="text-xs">{students?.toLocaleString() || '0'} students</span>
        </div>

        <div className={`flex items-center justify-between pt-4 border-t mt-auto ${
          'border-gray-200/50 dark:border-slate-700/50'
        }`}>
          <span className={`font-medium transition-colors ${getTextClasses('accent')}`}>
            Start Course
          </span>
          <ChevronRight className={`w-5 h-5 group-hover:translate-x-2 transition-all duration-300 ease-out ${getTextClasses('secondary')} group-hover:${getTextClasses('accent')}`} />
        </div>
      </div>
    </div>
  )
})

CourseCard.displayName = 'CourseCard'

interface CourseGridProps {
  courses: (Course & { slug: string })[]
  showFilters?: boolean
}

const CourseGrid: React.FC<CourseGridProps> = memo(({ courses, showFilters: _showFilters = false }) => {
  // Theme handled automatically by Tailwind dark: classes

  const titleClasses = useMemo(() => getTextClasses('primary'), [])
  const subtitleClasses = useMemo(() => getTextClasses('secondary'), [])
  const buttonClasses = useMemo(() => getButtonClasses('secondary'), [])

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
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
