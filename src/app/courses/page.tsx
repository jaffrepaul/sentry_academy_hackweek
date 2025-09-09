import { Suspense } from 'react'
import { getMockCourses } from '@/lib/actions/course-actions'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface SearchParams {
  category?: string
  difficulty?: string
  search?: string
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const courses = await getMockCourses({
    category: params.category,
    difficulty: params.difficulty,
    search: params.search,
  })

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Courses</h1>
          <p className="text-gray-600">
            Explore our comprehensive collection of courses
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.difficulty}</span>
                  <span>{course.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
