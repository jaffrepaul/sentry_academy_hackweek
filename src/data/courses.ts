export interface Course {
  id: string
  slug?: string // Optional for backward compatibility
  title: string
  description: string
  duration: string
  level: string
  rating: number // Will be stored as integer in DB (e.g., 49 for 4.9)
  students: number
  category: string
  isPopular?: boolean
}

// Extended interface for courses that includes AI-generated content
export interface EnhancedCourse extends Course {
  isAiGenerated?: boolean
  qualityScore?: number
  generatedAt?: Date
}

export const courses: Course[] = [
  {
    id: 'sentry-fundamentals',
    slug: 'sentry-fundamentals',
    title: 'Sentry Fundamentals',
    description:
      "See Sentry in action through a comprehensive 10-minute demo. Learn how to efficiently identify and resolve errors and performance issues using Sentry's platform.",
    duration: '10 min',
    level: 'Beginner',
    rating: 49, // Stored as integer (4.9 * 10)
    students: 12500,
    category: 'Foundation',
    isPopular: true,
  },
  {
    id: 'react-error-boundaries',
    slug: 'sentry-logging',
    title: 'Sentry Logging ',
    description:
      'Master structured logging with Sentry. Learn to send, view, and query logs from your applications for better debugging and monitoring.',
    duration: '1.2 hrs',
    level: 'Intermediate',
    rating: 48, // Stored as integer (4.8 * 10)
    students: 8900,
    category: 'Monitoring',
  },
  {
    id: 'performance-monitoring',
    slug: 'performance-monitoring',
    title: 'Performance Monitoring',
    description:
      "Deep dive into performance tracking, Core Web Vitals, and optimizing your application's speed and user experience.",
    duration: '2.1 hrs',
    level: 'Advanced',
    rating: 47, // Stored as integer (4.7 * 10)
    students: 6400,
    category: 'Performance',
  },
  {
    id: 'nodejs-integration',
    slug: 'nodejs-integration',
    title: 'Node.js Integration',
    description:
      'Complete backend monitoring setup, express middleware integration, and tracking server-side errors effectively.',
    duration: '1.8 hrs',
    level: 'Intermediate',
    rating: 48, // Stored as integer (4.8 * 10)
    students: 7200,
    category: 'Backend',
  },
  {
    id: 'custom-dashboards',
    slug: 'custom-dashboards',
    title: 'Custom Dashboards',
    description:
      "Create powerful custom dashboards, set up alerts, and build monitoring workflows that fit your team's needs.",
    duration: '2.5 hrs',
    level: 'Advanced',
    rating: 46, // Stored as integer (4.6 * 10)
    students: 4100,
    category: 'Advanced',
  },
  {
    id: 'team-workflows',
    slug: 'team-workflows',
    title: 'Team Workflows',
    description:
      'Establish team protocols, manage releases, and implement CI/CD integration for seamless development workflows.',
    duration: '3.2 hrs',
    level: 'Expert',
    rating: 49, // Stored as integer (4.9 * 10)
    students: 3800,
    category: 'Enterprise',
    isPopular: true,
  },
  {
    id: 'distributed-tracing',
    slug: 'distributed-tracing',
    title: 'Distributed Tracing',
    description:
      'Master distributed tracing across microservices, trace request flows, and identify performance bottlenecks in complex systems.',
    duration: '2.8 hrs',
    level: 'Advanced',
    rating: 47, // Stored as integer (4.7 * 10)
    students: 3200,
    category: 'Performance',
  },
  {
    id: 'release-health',
    slug: 'release-health',
    title: 'Release Health & Deployment Monitoring',
    description:
      'Track release stability, monitor deployment health, and set up automated rollback triggers for safer deployments.',
    duration: '2.0 hrs',
    level: 'Intermediate',
    rating: 48, // Stored as integer (4.8 * 10)
    students: 4500,
    category: 'DevOps',
  },
  {
    id: 'user-feedback',
    slug: 'user-feedback',
    title: 'User Feedback Integration',
    description:
      'Implement user feedback systems, link feedback to errors, and create feedback-driven debugging workflows.',
    duration: '1.5 hrs',
    level: 'Intermediate',
    rating: 46, // Stored as integer (4.6 * 10)
    students: 2800,
    category: 'UX',
  },
  {
    id: 'seer-mcp',
    slug: 'seer-mcp',
    title: 'Seer & MCP for AI/ML',
    description:
      "Leverage Sentry's AI-powered debugging with Seer and implement Model Context Protocol (MCP) for ML observability.",
    duration: '3.5 hrs',
    level: 'Advanced',
    rating: 49, // Stored as integer (4.9 * 10)
    students: 1200,
    category: 'AI/ML',
    isPopular: true,
  },

  {
    id: 'stakeholder-dashboards',
    slug: 'stakeholder-dashboards',
    title: 'Building Effective Dashboards for Stakeholders',
    description:
      'Learn to create compelling dashboards that translate technical metrics into business insights for PMs, executives, and cross-functional teams.',
    duration: '2.0 hrs',
    level: 'Beginner',
    rating: 48, // Stored as integer (4.8 * 10)
    students: 3400,
    category: 'Management',
    isPopular: true,
  },
  {
    id: 'metrics-insights',
    slug: 'metrics-insights',
    title: 'Metrics-Driven Product Insights',
    description:
      'Master the art of interpreting Sentry data to make informed product decisions, prioritize engineering work, and communicate impact to stakeholders.',
    duration: '1.5 hrs',
    level: 'Beginner',
    rating: 49, // Stored as integer (4.9 * 10)
    students: 2800,
    category: 'Management',
  },
]

export interface CourseModule {
  title: string
  description: string
  duration: string
  isCompleted: boolean
}

// Sentry Fundamentals modules
export const sentryFundamentalsModules: CourseModule[] = [
  {
    title: 'Install Sentry SDK',
    description:
      'Set up Sentry in your Next.js application using the installation wizard and configure error monitoring, tracing, and session replay.',
    duration: '8 min',
    isCompleted: true,
  },
  {
    title: 'Verify Your Setup',
    description:
      'Test your Sentry configuration by triggering sample errors and verifying data appears in your Sentry project dashboard.',
    duration: '12 min',
    isCompleted: true,
  },
  {
    title: 'Sending Logs',
    description:
      'Learn to capture exceptions, send custom messages, and add context to your error reports for better debugging.',
    duration: '15 min',
    isCompleted: false,
  },
  {
    title: 'Customizing Session Replay',
    description:
      'Configure session replay settings, privacy controls, and sampling rates to capture meaningful user interactions.',
    duration: '12 min',
    isCompleted: false,
  },
  {
    title: 'Distributed Tracing',
    description:
      'Implement performance monitoring with custom spans, trace API calls, and monitor user interactions across your application.',
    duration: '18 min',
    isCompleted: false,
  },
]

// Sentry Logging modules
export const sentryLoggingModules: CourseModule[] = [
  {
    title: 'Introduction to Sentry Logs',
    description:
      'Understanding structured logging and why logs are essential for debugging applications beyond errors.',
    duration: '8 min',
    isCompleted: true,
  },
  {
    title: 'Setting Up Sentry Logging',
    description:
      'Learn how to enable logging in your Sentry SDK configuration and start capturing logs from your applications.',
    duration: '12 min',
    isCompleted: true,
  },
  {
    title: 'Structured Logging with Sentry.logger',
    description:
      'Master the Sentry.logger API including trace, debug, info, warn, error, and fatal log levels with practical examples.',
    duration: '18 min',
    isCompleted: false,
  },
  {
    title: 'Advanced Logging Features',
    description:
      'Explore console logging integration, Winston integration, and the beforeSendLog callback for filtering logs.',
    duration: '15 min',
    isCompleted: false,
  },
  {
    title: 'Viewing and Searching Logs in Sentry',
    description:
      'Learn to navigate the Sentry Logs UI, search by text and properties, create alerts, and build dashboard widgets.',
    duration: '19 min',
    isCompleted: false,
  },
]

// Default modules for backward compatibility
export const courseModules: CourseModule[] = sentryFundamentalsModules

// AI Integration Functions
import { AIGeneratedCourse } from '../types/aiGeneration'
import { getApprovedAIGeneratedCourses } from './aiGeneratedCourses'
import { dbRatingToDisplay } from '../utils/ratingUtils'

/**
 * Get all courses including both manual and approved AI-generated courses
 */
export function getAllCourses(): EnhancedCourse[] {
  const manualCourses: EnhancedCourse[] = courses.map(course => ({
    ...course,
    isAiGenerated: false,
  }))

  const aiCourses: EnhancedCourse[] = getApprovedAIGeneratedCourses().map(aiCourse => ({
    id: aiCourse.id,
    title: aiCourse.title,
    description: aiCourse.description,
    duration: aiCourse.duration,
    level: aiCourse.level,
    rating: aiCourse.rating,
    students: aiCourse.students,
    category: aiCourse.category,
    isPopular: aiCourse.isPopular || false,
    isAiGenerated: true,
    qualityScore: aiCourse.qualityScore,
    generatedAt: aiCourse.generatedAt,
  }))

  return [...manualCourses, ...aiCourses]
}

/**
 * Add an AI-generated course to the course catalog
 */
export function addAIGeneratedCourse(aiCourse: AIGeneratedCourse): void {
  // This function is primarily handled by the AI courses store
  // but can be used for additional integration logic if needed
  console.log(`AI course "${aiCourse.title}" has been integrated into the course catalog`)
}

/**
 * Get courses by category, including AI-generated ones
 */
export function getCoursesByCategory(category: string): EnhancedCourse[] {
  return getAllCourses().filter(course => course.category === category)
}

/**
 * Get popular courses, including AI-generated ones
 */
export function getPopularCourses(): EnhancedCourse[] {
  return getAllCourses().filter(course => course.isPopular)
}

/**
 * Search courses by title or description
 */
export function searchCourses(query: string): EnhancedCourse[] {
  const lowercaseQuery = query.toLowerCase()
  return getAllCourses().filter(
    course =>
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Get course by ID from both manual and AI-generated courses
 */
export function getCourseById(id: string): EnhancedCourse | undefined {
  return getAllCourses().find(course => course.id === id)
}

/**
 * Get courses by level
 */
export function getCoursesByLevel(level: string): EnhancedCourse[] {
  return getAllCourses().filter(course => course.level === level)
}

/**
 * Get recently added courses (including AI-generated)
 */
export function getRecentCourses(limit: number = 10): EnhancedCourse[] {
  const allCourses = getAllCourses()

  // Sort by generated date for AI courses, or use a default for manual courses
  return allCourses
    .sort((a, b) => {
      const dateA = a.generatedAt || new Date('2024-01-01') // Default date for manual courses
      const dateB = b.generatedAt || new Date('2024-01-01')
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, limit)
}

/**
 * Get course statistics including AI-generated courses
 */
export function getCourseStatistics() {
  const allCourses = getAllCourses()
  const aiCourses = allCourses.filter(course => course.isAiGenerated)
  const manualCourses = allCourses.filter(course => !course.isAiGenerated)

  return {
    total: allCourses.length,
    manual: manualCourses.length,
    aiGenerated: aiCourses.length,
    average_rating: dbRatingToDisplay(
      allCourses.reduce((sum, course) => sum + course.rating, 0) / allCourses.length
    ),
    totalStudents: allCourses.reduce((sum, course) => sum + course.students, 0),
    categories: [...new Set(allCourses.map(course => course.category))],
    levels: [...new Set(allCourses.map(course => course.level))],
    averageQualityScore:
      aiCourses.length > 0
        ? aiCourses.reduce((sum, course) => sum + (course.qualityScore || 0), 0) / aiCourses.length
        : null,
  }
}
