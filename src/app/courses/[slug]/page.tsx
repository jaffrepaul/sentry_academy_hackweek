import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getMockCourses } from '@/lib/actions/course-actions'
import CourseDetailClient from './CourseDetailClient'
import LoadingCard from '@/components/ui/LoadingCard'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for common courses
export async function generateStaticParams() {
  const courses = await getMockCourses()
  
  // Generate params for the most popular courses
  return courses
    .filter(course => course.isPopular)
    .map((course) => ({
      slug: course.slug,
    }))
}

// Loading fallback for course detail
function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="animate-pulse bg-gray-300/50 h-8 w-3/4 rounded mb-4" />
          <div className="animate-pulse bg-gray-300/50 h-4 w-full rounded mb-2" />
          <div className="animate-pulse bg-gray-300/50 h-4 w-2/3 rounded" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LoadingCard lines={8} className="h-96" />
          </div>
          <div className="space-y-4">
            <LoadingCard lines={4} />
            <LoadingCard lines={6} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Server component to fetch course data
async function CourseData({ slug }: { slug: string }) {
  const courses = await getMockCourses()
  const course = courses.find(c => c.slug === slug)
  
  if (!course) {
    notFound()
  }
  
  return <CourseDetailClient initialCourse={course} />
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  
  return (
    <Suspense fallback={<CourseDetailSkeleton />}>
      <CourseData slug={slug} />
    </Suspense>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const courses = await getMockCourses()
  const course = courses.find(c => c.slug === slug)
  
  if (!course) {
    return {
      title: 'Course Not Found | Sentry Academy',
      description: 'The requested course could not be found.',
    }
  }

  return {
    title: `${course.title} | Sentry Academy`,
    description: course.description,
    keywords: [course.category, course.difficulty, 'Sentry', course.title],
    openGraph: {
      title: `${course.title} | Sentry Academy`,
      description: course.description,
      type: 'website',
    },
  }
}

// Enable ISR for course pages
export const revalidate = 3600 // 1 hour