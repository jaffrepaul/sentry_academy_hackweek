import { Suspense } from 'react'
import { getCourses } from '@/lib/actions/course-actions'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CourseGrid from '@/components/CourseGrid'
import CourseGridSkeleton from '@/components/CourseGridSkeleton'

interface SearchParams {
  category?: string
  difficulty?: string
  search?: string
}

// Static metadata
export const metadata = {
  title: 'All Courses | Sentry Academy',
  description: 'Explore our comprehensive collection of Sentry courses for all skill levels.',
}

// Server component for fetching courses with filters
async function FilteredCourses({ searchParams }: { searchParams: SearchParams }) {
  const courses = await getCourses({
    category: searchParams.category,
    difficulty: searchParams.difficulty,
    search: searchParams.search,
  })

  return <CourseGrid courses={courses} showFilters={true} />
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              All Courses
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Explore our comprehensive collection of courses designed to master Sentry's observability tools
            </p>
          </div>

          <Suspense fallback={<CourseGridSkeleton count={9} />}>
            <FilteredCourses searchParams={params} />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

// Enable ISR for filtered course pages
export const revalidate = 1800 // 30 minutes
