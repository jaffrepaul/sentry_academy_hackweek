import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { getCourses, getCourseBySlug } from '@/lib/actions/course-actions'
import { generateSEO } from '@/lib/seo'
import LoadingCard from '@/components/ui/LoadingCard'

// Dynamic import for CourseDetailClient to reduce initial bundle size
const CourseDetailClient = dynamic(() => import('./CourseDetailClient'), {
  loading: () => <CourseDetailSkeleton />,
  ssr: true // Keep SSR for better SEO
})

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for common courses
export async function generateStaticParams() {
  const courses = await getCourses({ limit: 20 })
  
  // Generate params for published courses
  return courses.map((course) => ({
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
  const course = await getCourseBySlug(slug)
  
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
  const course = await getCourseBySlug(slug)
  
  if (!course) {
    return generateSEO({
      title: 'Course Not Found',
      description: 'The requested course could not be found.',
      url: `/courses/${slug}`,
    })
  }

  const seoData: any = {
    title: course.title,
    description: course.description || `Learn ${course.title} with this comprehensive Sentry course. Master ${course.category?.toLowerCase() || 'advanced'} concepts with hands-on experience.`,
    keywords: [course.category, course.difficulty, 'Sentry course', course.title, 'tutorial', 'training'].filter(Boolean) as string[],
    url: `/courses/${slug}`,
    type: 'article' as const,
  }
  
  if (course.category) {
    seoData.section = course.category
  }
  
  return generateSEO(seoData)
}

// Enable ISR for course pages
export const revalidate = 3600 // 1 hour