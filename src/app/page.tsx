import { getMockCourses } from '@/lib/actions/course-actions'
import HomeContent from '@/components/home-content'

/**
 * Home page - Server Component
 * 
 * This page leverages Next.js App Router by:
 * 1. Server-side data fetching at build/request time
 * 2. Passing data to client components that need interactivity
 * 3. Keeping the page itself as a Server Component for better performance
 */
export default async function HomePage() {
  // Server-side data fetching - runs at build time or request time
  // No loading states needed here since it's server-rendered
  const courses = await getMockCourses()

  return (
    <HomeContent courses={courses} />
  )
}
