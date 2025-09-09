import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

// Mock course data for now
const mockCourse = {
  id: 1,
  slug: 'sentry-fundamentals',
  title: 'Sentry Fundamentals',
  description: 'Learn the basics of error monitoring with Sentry',
  content: '<p>Introduction to Sentry and error monitoring concepts...</p>',
  difficulty: 'Beginner',
  duration: '2 hours',
  category: 'Fundamentals',
  imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const course = mockCourse
  
  if (!course || course.slug !== slug) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>{course.difficulty}</span>
            <span>{course.duration}</span>
            <span>{course.category}</span>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: course.content }} />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const course = mockCourse
  
  if (!course || course.slug !== slug) {
    return {
      title: 'Course Not Found',
    }
  }

  return {
    title: `${course.title} | Sentry Academy`,
    description: course.description,
  }
}
