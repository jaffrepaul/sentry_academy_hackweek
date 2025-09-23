'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Trophy, ChevronRight, Star } from 'lucide-react'
// Theme handled automatically by Tailwind dark: classes
import { getCardClasses, getTextClasses, getButtonClasses } from '@/utils/styles'
import { formatRating } from '@/utils/ratingUtils'
import { Course } from '@/data/courses'

interface CourseCardProps extends Omit<Course, 'slug'> {
  slug: string
  difficulty?: string
}

const CourseCard: React.FC<CourseCardProps> = memo(
  ({
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
    isPopular = false,
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
      <div
        className="transition-smooth group relative cursor-pointer hover:scale-[1.02]"
        onClick={handleCardClick}
      >
        {isPopular && (
          <div className="transition-smooth absolute -right-3 -top-3 z-10 group-hover:scale-110">
            <div className="rounded-full bg-gradient-to-r from-orange-400 to-pink-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
              Popular
            </div>
          </div>
        )}

        <div className={`${cardClasses} flex h-full flex-col p-6 group-hover:shadow-2xl`}>
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-purple-200/60 px-2 py-1 text-xs font-medium uppercase tracking-wider text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
              {category || 'General'}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {rating ? formatRating(rating, true) : '4.5'}
              </span>
            </div>
          </div>

          <h3
            className={`transition-smooth mb-3 text-xl font-bold group-hover:translate-x-1 group-hover:text-purple-400 ${getTextClasses('primary')}`}
          >
            {title}
          </h3>

          <p
            className={`mb-6 line-clamp-3 flex-grow leading-relaxed ${getTextClasses('secondary')}`}
          >
            {description || 'Course description not available.'}
          </p>

          <div
            className={`mb-6 flex items-center justify-between text-sm ${getTextClasses('secondary')}`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{duration || '30 min'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>{level || difficulty || 'Beginner'}</span>
              </div>
            </div>
            <span className="text-xs">{students?.toLocaleString() || '0'} students</span>
          </div>

          <div
            className={`mt-auto flex items-center justify-between border-t pt-4 ${'border-gray-200/50 dark:border-slate-700/50'}`}
          >
            <span className={`font-medium transition-colors ${getTextClasses('accent')}`}>
              Start Course
            </span>
            <ChevronRight
              className={`h-5 w-5 transition-all duration-300 ease-out group-hover:translate-x-2 ${getTextClasses('secondary')} group-hover:${getTextClasses('accent')}`}
            />
          </div>
        </div>
      </div>
    )
  }
)

CourseCard.displayName = 'CourseCard'

interface CourseGridProps {
  courses: (Course & { slug: string })[]
  showFilters?: boolean
}

const CourseGrid: React.FC<CourseGridProps> = memo(
  ({ courses, showFilters: _showFilters = false }) => {
    // Theme handled automatically by Tailwind dark: classes

    const titleClasses = useMemo(() => getTextClasses('primary'), [])
    const subtitleClasses = useMemo(() => getTextClasses('secondary'), [])
    const buttonClasses = useMemo(() => getButtonClasses('secondary'), [])

    return (
      <section id="courses" className="relative py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={`mb-6 text-3xl font-bold md:text-5xl ${titleClasses}`}>
              Featured{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className={`mx-auto max-w-2xl text-xl ${subtitleClasses}`}>
              Handpicked courses designed to build real-world expertise
            </p>
          </div>

          <div className="grid gap-8 px-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className={`${buttonClasses} rounded-xl px-8 py-3 font-medium`}>
              View All Courses
            </button>
          </div>
        </div>
      </section>
    )
  }
)

CourseGrid.displayName = 'CourseGrid'
export default CourseGrid
