import { MetadataRoute } from 'next'
import { getCourses } from '@/lib/actions/course-actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses()
  
  // Static pages
  const staticPages = [
    {
      url: 'https://sentry-academy.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: 'https://sentry-academy.vercel.app/courses',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: 'https://sentry-academy.vercel.app/concepts',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: 'https://sentry-academy.vercel.app/learning-paths',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic course pages
  const coursePages = courses.map((course) => ({
    url: `https://sentry-academy.vercel.app/courses/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...coursePages]
}