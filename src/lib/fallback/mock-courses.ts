/**
 * Fallback mock course data
 * This data is used when the database is unavailable or empty
 * It matches the structure of the database courses table
 */

import { CourseFilters } from '@/types/api'

// Mock courses data that matches the original structure
const mockCoursesData = [
  {
    id: 1,
    slug: 'sentry-fundamentals',
    title: 'Sentry Fundamentals',
    description: 'See Sentry in action through a comprehensive 10-minute demo. Learn how to efficiently identify and resolve errors and performance issues using Sentry\'s platform.',
    content: 'Complete course content for Sentry Fundamentals covering SDK installation, error tracking, and basic monitoring setup.',
    difficulty: 'Beginner',
    duration: '10 min',
    category: 'Foundation', 
    level: 'Beginner',
    rating: 49,
    students: 12500,
    is_popular: true,
    image_url: '/course-thumbnails/sentry-fundamentals.jpg',
    is_published: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: 2,
    slug: 'sentry-logging',
    title: 'Sentry Logging',
    description: 'Master structured logging with Sentry. Learn to send, view, and query logs from your applications for better debugging and monitoring.',
    content: 'In-depth coverage of Sentry logging features, structured logging patterns, and log analysis.',
    difficulty: 'Intermediate',
    duration: '1.2 hrs',
    category: 'Monitoring',
    level: 'Intermediate',
    rating: 48,
    students: 8900,
    is_popular: false,
    image_url: '/course-thumbnails/sentry-logging.jpg',
    is_published: true,
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-02'),
  },
  {
    id: 3,
    slug: 'performance-monitoring',
    title: 'Performance Monitoring',
    description: 'Deep dive into performance tracking, Core Web Vitals, and optimizing your application\'s speed and user experience.',
    content: 'Comprehensive guide to performance monitoring, Web Vitals tracking, and performance optimization strategies.',
    difficulty: 'Advanced',
    duration: '2.1 hrs',
    category: 'Performance',
    level: 'Advanced',
    rating: 47,
    students: 6400,
    is_popular: false,
    image_url: '/course-thumbnails/performance-monitoring.jpg',
    is_published: true,
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-01-03'),
  },
  {
    id: 4,
    slug: 'nodejs-integration',
    title: 'Node.js Integration',
    description: 'Complete backend monitoring setup, express middleware integration, and tracking server-side errors effectively.',
    content: 'Complete Node.js integration guide covering Express middleware, error tracking, and backend monitoring.',
    difficulty: 'Intermediate',
    duration: '1.8 hrs',
    category: 'Backend',
    level: 'Intermediate',
    rating: 48,
    students: 7200,
    is_popular: false,
    image_url: '/course-thumbnails/nodejs-integration.jpg',
    is_published: true,
    created_at: new Date('2024-01-04'),
    updated_at: new Date('2024-01-04'),
  },
  {
    id: 5,
    slug: 'custom-dashboards',
    title: 'Custom Dashboards',
    description: 'Create powerful custom dashboards, set up alerts, and build monitoring workflows that fit your team\'s needs.',
    content: 'Learn to build custom dashboards, configure alerts, and create monitoring workflows.',
    difficulty: 'Advanced',
    duration: '2.5 hrs',
    category: 'Advanced',
    level: 'Advanced',
    rating: 46,
    students: 4100,
    is_popular: false,
    image_url: '/course-thumbnails/custom-dashboards.jpg',
    is_published: true,
    created_at: new Date('2024-01-05'),
    updated_at: new Date('2024-01-05'),
  },
  {
    id: 6,
    slug: 'team-workflows',
    title: 'Team Workflows',
    description: 'Establish team protocols, manage releases, and implement CI/CD integration for seamless development workflows.',
    content: 'Team collaboration features, release management, and CI/CD integration patterns.',
    difficulty: 'Expert',
    duration: '3.2 hrs',
    category: 'Enterprise',
    level: 'Expert',
    rating: 49,
    students: 3800,
    is_popular: true,
    image_url: '/course-thumbnails/team-workflows.jpg',
    is_published: true,
    created_at: new Date('2024-01-06'),
    updated_at: new Date('2024-01-06'),
  },
  {
    id: 7,
    slug: 'distributed-tracing',
    title: 'Distributed Tracing',
    description: 'Master distributed tracing across microservices, trace request flows, and identify performance bottlenecks in complex systems.',
    content: 'Advanced distributed tracing concepts, microservice monitoring, and trace analysis.',
    difficulty: 'Advanced',
    duration: '2.8 hrs',
    category: 'Performance',
    level: 'Advanced',
    rating: 47,
    students: 3200,
    is_popular: false,
    image_url: '/course-thumbnails/distributed-tracing.jpg',
    is_published: true,
    created_at: new Date('2024-01-07'),
    updated_at: new Date('2024-01-07'),
  },
  {
    id: 8,
    slug: 'release-health',
    title: 'Release Health & Deployment Monitoring',
    description: 'Track release stability, monitor deployment health, and set up automated rollback triggers for safer deployments.',
    content: 'Release health monitoring, deployment tracking, and automated rollback strategies.',
    difficulty: 'Intermediate',
    duration: '2.0 hrs',
    category: 'DevOps',
    level: 'Intermediate',
    rating: 48,
    students: 4500,
    is_popular: false,
    image_url: '/course-thumbnails/release-health.jpg',
    is_published: true,
    created_at: new Date('2024-01-08'),
    updated_at: new Date('2024-01-08'),
  },
  {
    id: 9,
    slug: 'user-feedback',
    title: 'User Feedback Integration',
    description: 'Implement user feedback systems, link feedback to errors, and create feedback-driven debugging workflows.',
    content: 'User feedback integration, error correlation, and feedback-driven development workflows.',
    difficulty: 'Intermediate',
    duration: '1.5 hrs',
    category: 'UX',
    level: 'Intermediate',
    rating: 46,
    students: 2800,
    is_popular: false,
    image_url: '/course-thumbnails/user-feedback.jpg',
    is_published: true,
    created_at: new Date('2024-01-09'),
    updated_at: new Date('2024-01-09'),
  },
  {
    id: 10,
    slug: 'seer-mcp',
    title: 'Seer & MCP for AI/ML',
    description: 'Leverage Sentry\'s AI-powered debugging with Seer and implement Model Context Protocol (MCP) for ML observability.',
    content: 'Advanced AI-powered debugging with Seer, MCP implementation, and ML observability patterns.',
    difficulty: 'Advanced',
    duration: '3.5 hrs',
    category: 'AI/ML',
    level: 'Advanced',
    rating: 49,
    students: 1200,
    is_popular: true,
    image_url: '/course-thumbnails/seer-mcp.jpg',
    is_published: true,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10'),
  },
  {
    id: 11,
    slug: 'stakeholder-dashboards',
    title: 'Building Effective Dashboards for Stakeholders',
    description: 'Learn to create compelling dashboards that translate technical metrics into business insights for PMs, executives, and cross-functional teams.',
    content: 'Dashboard design for non-technical stakeholders, metrics communication, and business impact visualization.',
    difficulty: 'Beginner',
    duration: '2.0 hrs',
    category: 'Management',
    level: 'Beginner',
    rating: 48,
    students: 3400,
    is_popular: true,
    image_url: '/course-thumbnails/stakeholder-dashboards.jpg',
    is_published: true,
    created_at: new Date('2024-01-11'),
    updated_at: new Date('2024-01-11'),
  },
  {
    id: 12,
    slug: 'metrics-insights',
    title: 'Metrics-Driven Product Insights',
    description: 'Master the art of interpreting Sentry data to make informed product decisions, prioritize engineering work, and communicate impact to stakeholders.',
    content: 'Product management with Sentry data, metrics interpretation, and data-driven decision making.',
    difficulty: 'Beginner',
    duration: '1.5 hrs',
    category: 'Management',
    level: 'Beginner',
    rating: 49,
    students: 2800,
    is_popular: false,
    image_url: '/course-thumbnails/metrics-insights.jpg',
    is_published: true,
    created_at: new Date('2024-01-12'),
    updated_at: new Date('2024-01-12'),
  }
]

/**
 * Get mock courses with filtering support
 */
export const getMockCourses = async (filters: CourseFilters & { limit?: number } = {}) => {
  console.log('🔄 Using fallback mock data for courses')
  
  let filtered = [...mockCoursesData]
  
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
}

/**
 * Get a single mock course by slug
 */
export const getMockCourseBySlug = async (slug: string) => {
  console.log(`🔄 Using fallback mock data for course: ${slug}`)
  const courses = await getMockCourses()
  return courses.find(course => course.slug === slug) || null
}

/**
 * Mock course modules data (for when course modules can't be fetched from DB)
 */
export const getMockCourseModules = async (courseId: number) => {
  console.log(`🔄 Using fallback mock data for course modules: ${courseId}`)
  
  // Return some basic modules that would work for any course
  return [
    {
      id: courseId * 100 + 1,
      course_id: courseId,
      title: 'Introduction',
      content: 'Introduction to the course topic and learning objectives.',
      order: 1,
      duration: '10 min',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: courseId * 100 + 2,
      course_id: courseId,
      title: 'Getting Started',
      content: 'Step-by-step setup and initial configuration.',
      order: 2,
      duration: '15 min',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: courseId * 100 + 3,
      course_id: courseId,
      title: 'Advanced Topics',
      content: 'Deep dive into advanced features and best practices.',
      order: 3,
      duration: '20 min',
      created_at: new Date(),
      updated_at: new Date(),
    }
  ]
}

/**
 * Mock learning paths data
 */
export const getMockLearningPaths = async () => {
  console.log('🔄 Using fallback mock data for learning paths')
  
  return [
    {
      id: 1,
      slug: 'frontend-path',
      title: 'Frontend Web Developer Learning Path',
      description: 'Monitor client-side issues, analyze user experience, and incorporate user feedback for rapid debugging',
      role: 'frontend',
      courses: [1, 3, 2, 10, 9, 5, 6],
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      slug: 'backend-path',
      title: 'Backend Engineer Learning Path',
      description: 'Gain deep visibility into backend errors, logging, and performance bottlenecks',
      role: 'backend',
      courses: [4, 3, 2, 7, 6, 5],
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      slug: 'fullstack-path',
      title: 'Full-stack Developer Learning Path',
      description: 'Build a seamless, end-to-end observability pipeline across frontend and backend systems',
      role: 'fullstack',
      courses: [1, 4, 3, 2, 10, 7, 5],
      created_at: new Date(),
      updated_at: new Date(),
    }
  ]
}