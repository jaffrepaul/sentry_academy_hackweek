import { Suspense } from 'react'
import { getMockCourses } from '@/lib/actions/course-actions'
import HomeContent from '@/components/home-content'
import CourseGridSkeleton from '@/components/CourseGridSkeleton'

/**
 * Home page - Server Component
 * 
 * This page leverages Next.js App Router by:
 * 1. Server-side data fetching with proper caching
 * 2. Suspense boundaries for progressive loading
 * 3. Static generation for better performance
 */

// Static metadata for SEO
export const metadata = {
  title: 'Sentry Academy - Master Application Observability',
  description: 'Interactive learning platform to master Sentry\'s powerful observability tools through hands-on experience and personalized learning paths.',
  keywords: ['Sentry', 'error monitoring', 'application observability', 'performance monitoring', 'session replay'],
  openGraph: {
    title: 'Sentry Academy - Master Application Observability',
    description: 'Interactive learning platform to master Sentry\'s powerful observability tools.',
    type: 'website',
  },
}

// Server component that fetches data
async function CoursesData() {
  // This will be cached automatically by Next.js
  const courses = await getMockCourses()
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
