import { Suspense } from 'react'
import { getCourses } from '@/lib/actions/course-actions'
import HomeContent from '@/components/HomeContent'
import CourseGridSkeleton from '@/components/CourseGridSkeleton'

/**
 * Home page - Server Component
 * 
 * This page leverages Next.js App Router by:
 * 1. Server-side data fetching with proper caching
 * 2. Suspense boundaries for progressive loading
 * 3. Static generation for better performance
 */

import { generateSEO } from '@/lib/seo'

// Static metadata for SEO
export const metadata = generateSEO({
  title: 'Master Application Observability',
  description: 'Interactive learning platform to master Sentry\'s powerful observability tools through hands-on experience and personalized learning paths.',
  keywords: ['Sentry courses', 'error monitoring tutorials', 'application observability training', 'performance monitoring guide', 'session replay learning'],
  url: '/',
})

// Server component that fetches data
async function CoursesData() {
  // This will be cached automatically by Next.js
  const courses = await getCourses({ limit: 12 })
  return <HomeContent courses={courses} />
}

export default function HomePage() {
  return (
    <Suspense fallback={<CourseGridSkeleton />}>
      <CoursesData />
    </Suspense>
  )
}

// Enable static generation for better performance
export const revalidate = 3600 // Revalidate every hour
