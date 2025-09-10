import { notFound } from 'next/navigation'
import { getMockCourses } from '@/lib/actions/course-actions'
import CourseDetailClient from './CourseDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const courses = await getMockCourses()
  const course = courses.find(c => c.slug === slug)
  
  if (!course) {
    notFound()
  }
  
  return <CourseDetailClient initialCourse={course} />
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const courses = await getMockCourses()
  const course = courses.find(c => c.slug === slug)
  
  if (!course) {
    return {
      title: 'Course Not Found',
    }
  }

  return {
    title: `${course.title} | Sentry Academy`,
    description: course.description,
  }
}