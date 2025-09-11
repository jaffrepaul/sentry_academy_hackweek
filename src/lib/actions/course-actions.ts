'use server'

import { cache } from 'react'
import { db } from '@/lib/db'
import { courses, learningPaths, courseModules } from '@/lib/db/schema'
import { eq, like, and, desc } from 'drizzle-orm'
import { CourseFilters } from '@/types/api'

// Cached version of course fetching for better performance
export const getCourses = cache(async (filters: CourseFilters & { limit?: number } = {}) => {
  try {
    const query = db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.isPublished, true),
          filters.category ? eq(courses.category, filters.category) : undefined,
          filters.difficulty ? eq(courses.difficulty, filters.difficulty) : undefined,
          filters.search ? like(courses.title, `%${filters.search}%`) : undefined
        )
      )
      .orderBy(desc(courses.createdAt))
    
    if (filters.limit) {
      query.limit(filters.limit)
    }
    
    const dbCourses = await query.execute()
    
    // If database is empty, fall back to mock data for development
    if (dbCourses.length === 0) {
      console.log('No courses found in database, using mock data')
      return await getMockCourses(filters)
    }
    
    return dbCourses
  } catch (error) {
    console.error('Error fetching courses from database, falling back to mock data:', error)
    return await getMockCourses(filters)
  }
})

// Cached version of single course fetching
export const getCourseBySlug = cache(async (slug: string) => {
  try {
    const course = await db
      .select()
      .from(courses)
      .where(and(eq(courses.slug, slug), eq(courses.isPublished, true)))
      .limit(1)
    
    const dbCourse = course[0] || null
    
    // If course not found in database, fall back to mock data
    if (!dbCourse) {
      console.log(`Course ${slug} not found in database, checking mock data`)
      return await getMockCourseBySlug(slug)
    }
    
    return dbCourse
  } catch (error) {
    console.error(`Error fetching course from database, falling back to mock data:`, error)
    return await getMockCourseBySlug(slug)
  }
})

// Cached course modules fetching
export const getCourseModules = cache(async (courseId: number) => {
  try {
    return await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.order)
  } catch (error) {
    console.error('Error fetching course modules:', error)
    throw new Error(`Failed to fetch modules for course: ${courseId}`)
  }
})

// Cached learning paths fetching
export const getLearningPaths = cache(async () => {
  try {
    return await db
      .select()
      .from(learningPaths)
      .orderBy(learningPaths.title)
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    throw new Error('Failed to fetch learning paths')
  }
})

// Cached mock data functions (temporary until database is set up)
export const getMockCourses = cache(async (filters: CourseFilters & { limit?: number } = {}) => {
  const mockCourses = [
    {
      id: 1,
      slug: 'sentry-fundamentals',
      title: 'Sentry Fundamentals',
      description: 'See Sentry in action through a comprehensive 10-minute demo. Learn how to efficiently identify and resolve errors and performance issues using Sentry\'s platform.',
      content: '<p>Introduction to Sentry and error monitoring concepts...</p>',
      difficulty: 'Beginner',
      duration: '10 min',
      category: 'Foundation', 
      level: 'Beginner',
      rating: 4.9,
      students: 12500,
      isPopular: true,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      slug: 'sentry-logging',
      title: 'Sentry Logging',
      description: 'Master structured logging with Sentry. Learn to send, view, and query logs from your applications for better debugging and monitoring.',
      content: '<p>Deep dive into Sentry logging...</p>',
      difficulty: 'Intermediate',
      duration: '1.2 hrs',
      category: 'Monitoring',
      level: 'Intermediate',
      rating: 4.8,
      students: 8900,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      slug: 'performance-monitoring',
      title: 'Performance Monitoring',
      description: 'Deep dive into performance tracking, Core Web Vitals, and optimizing your application\'s speed and user experience.',
      content: '<p>Performance monitoring best practices...</p>',
      difficulty: 'Advanced',
      duration: '2.1 hrs',
      category: 'Performance',
      level: 'Advanced',
      rating: 4.7,
      students: 6400,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      slug: 'nodejs-integration',
      title: 'Node.js Integration',
      description: 'Complete backend monitoring setup, express middleware integration, and tracking server-side errors effectively.',
      content: '<p>Node.js integration patterns...</p>',
      difficulty: 'Intermediate',
      duration: '1.8 hrs',
      category: 'Backend',
      level: 'Intermediate',
      rating: 4.8,
      students: 7200,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      slug: 'custom-dashboards',
      title: 'Custom Dashboards',
      description: 'Create powerful custom dashboards, set up alerts, and build monitoring workflows that fit your team\'s needs.',
      content: '<p>Dashboard creation fundamentals...</p>',
      difficulty: 'Advanced',
      duration: '2.5 hrs',
      category: 'Advanced',
      level: 'Advanced',
      rating: 4.6,
      students: 4100,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      slug: 'team-workflows',
      title: 'Team Workflows',
      description: 'Establish team protocols, manage releases, and implement CI/CD integration for seamless development workflows.',
      content: '<p>Team workflow patterns...</p>',
      difficulty: 'Expert',
      duration: '3.2 hrs',
      category: 'Enterprise',
      level: 'Expert',
      rating: 4.9,
      students: 3800,
      isPopular: true,
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      slug: 'distributed-tracing',
      title: 'Distributed Tracing',
      description: 'Master distributed tracing across microservices, trace request flows, and identify performance bottlenecks in complex systems.',
      content: '<p>Distributed tracing concepts...</p>',
      difficulty: 'Advanced',
      duration: '2.8 hrs',
      category: 'Performance',
      level: 'Advanced',
      rating: 4.7,
      students: 3200,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 8,
      slug: 'release-health',
      title: 'Release Health & Deployment Monitoring',
      description: 'Track release stability, monitor deployment health, and set up automated rollback triggers for safer deployments.',
      content: '<p>Release monitoring strategies...</p>',
      difficulty: 'Intermediate',
      duration: '2.0 hrs',
      category: 'DevOps',
      level: 'Intermediate',
      rating: 4.8,
      students: 4500,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 9,
      slug: 'user-feedback',
      title: 'User Feedback Integration',
      description: 'Implement user feedback systems, link feedback to errors, and create feedback-driven debugging workflows.',
      content: '<p>User feedback integration...</p>',
      difficulty: 'Intermediate',
      duration: '1.5 hrs',
      category: 'UX',
      level: 'Intermediate',
      rating: 4.6,
      students: 2800,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 10,
      slug: 'seer-mcp',
      title: 'Seer & MCP for AI/ML',
      description: 'Leverage Sentry\'s AI-powered debugging with Seer and implement Model Context Protocol (MCP) for ML observability.',
      content: '<p>AI/ML monitoring with Sentry...</p>',
      difficulty: 'Advanced',
      duration: '3.5 hrs',
      category: 'AI/ML',
      level: 'Advanced',
      rating: 4.9,
      students: 1200,
      isPopular: true,
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 11,
      slug: 'stakeholder-dashboards',
      title: 'Building Effective Dashboards for Stakeholders',
      description: 'Learn to create compelling dashboards that translate technical metrics into business insights for PMs, executives, and cross-functional teams.',
      content: '<p>Stakeholder dashboard strategies...</p>',
      difficulty: 'Beginner',
      duration: '2.0 hrs',
      category: 'Management',
      level: 'Beginner',
      rating: 4.8,
      students: 3400,
      isPopular: true,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 12,
      slug: 'metrics-insights',
      title: 'Metrics-Driven Product Insights',
      description: 'Master the art of interpreting Sentry data to make informed product decisions, prioritize engineering work, and communicate impact to stakeholders.',
      content: '<p>Product insights with Sentry data...</p>',
      difficulty: 'Beginner',
      duration: '1.5 hrs',
      category: 'Management',
      level: 'Beginner',
      rating: 4.9,
      students: 2800,
      isPopular: false,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]
  
  let filtered = mockCourses
  
  if (filters.category) {
    filtered = filtered.filter(c => c.category === filters.category)
  }
  
  if (filters.difficulty) {
    filtered = filtered.filter(c => c.difficulty === filters.difficulty)
  }
  
  if (filters.search) {
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
      c.description.toLowerCase().includes(filters.search!.toLowerCase())
    )
  }
  
  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit)
  }
  
  return filtered
})

// Export a function to get a single course by slug for the mock data
export const getMockCourseBySlug = cache(async (slug: string) => {
  const courses = await getMockCourses()
  return courses.find(course => course.slug === slug) || null
})
