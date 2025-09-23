/**
 * Database seeding script
 * Run this to populate the database with initial course data
 */

import { db } from './db'
import { courses, course_modules, learning_paths, users } from './db/schema'

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create sample users
    console.log('📝 Creating sample users...')
    const sampleUsers = await db
      .insert(users)
      .values([
        {
          id: 'admin-1',
          email: 'admin@sentry.io',
          name: 'Sentry Admin',
          role: 'admin',
        },
        {
          id: 'instructor-1',
          email: 'instructor@sentry.io',
          name: 'Course Instructor',
          role: 'instructor',
        },
        {
          id: 'student-1',
          email: 'student@example.com',
          name: 'Sample Student',
          role: 'student',
        },
      ])
      .returning()

    console.log(`✅ Created ${sampleUsers.length} sample users`)

    // Create sample courses
    console.log('📚 Creating sample courses...')
    const sampleCourses = await db
      .insert(courses)
      .values([
        {
          slug: 'sentry-fundamentals',
          title: 'Sentry Fundamentals',
          description:
            "See Sentry in action through a comprehensive 10-minute demo. Learn how to efficiently identify and resolve errors and performance issues using Sentry's platform.",
          content: '<p>Introduction to Sentry and error monitoring concepts...</p>',
          difficulty: 'Beginner',
          duration: '10 min',
          category: 'Foundation',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
          is_published: true,
        },
        {
          slug: 'sentry-logging',
          title: 'Sentry Logging',
          description:
            'Master structured logging with Sentry. Learn to send, view, and query logs from your applications for better debugging and monitoring.',
          content: '<p>Deep dive into Sentry logging...</p>',
          difficulty: 'Intermediate',
          duration: '1.2 hrs',
          category: 'Monitoring',
          image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500',
          is_published: true,
        },
        {
          slug: 'performance-monitoring',
          title: 'Performance Monitoring',
          description:
            "Deep dive into performance tracking, Core Web Vitals, and optimizing your application's speed and user experience.",
          content: '<p>Performance monitoring best practices...</p>',
          difficulty: 'Advanced',
          duration: '2.1 hrs',
          category: 'Performance',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
          is_published: true,
        },
        {
          slug: 'nodejs-integration',
          title: 'Node.js Integration',
          description:
            'Complete backend monitoring setup, express middleware integration, and tracking server-side errors effectively.',
          content: '<p>Node.js integration patterns...</p>',
          difficulty: 'Intermediate',
          duration: '1.8 hrs',
          category: 'Backend',
          image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500',
          is_published: true,
        },
        {
          slug: 'custom-dashboards',
          title: 'Custom Dashboards',
          description:
            "Create powerful custom dashboards, set up alerts, and build monitoring workflows that fit your team's needs.",
          content: '<p>Dashboard creation fundamentals...</p>',
          difficulty: 'Advanced',
          duration: '2.5 hrs',
          category: 'Advanced',
          image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
          is_published: true,
        },
        {
          slug: 'team-workflows',
          title: 'Team Workflows',
          description:
            'Establish team protocols, manage releases, and implement CI/CD integration for seamless development workflows.',
          content: '<p>Team workflow patterns...</p>',
          difficulty: 'Expert',
          duration: '3.2 hrs',
          category: 'Enterprise',
          image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500',
          is_published: true,
        },
        {
          slug: 'distributed-tracing',
          title: 'Distributed Tracing',
          description:
            'Master distributed tracing across microservices, trace request flows, and identify performance bottlenecks in complex systems.',
          content: '<p>Distributed tracing concepts...</p>',
          difficulty: 'Advanced',
          duration: '2.8 hrs',
          category: 'Performance',
          image_url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500',
          is_published: true,
        },
        {
          slug: 'release-health',
          title: 'Release Health & Deployment Monitoring',
          description:
            'Track release stability, monitor deployment health, and set up automated rollback triggers for safer deployments.',
          content: '<p>Release monitoring strategies...</p>',
          difficulty: 'Intermediate',
          duration: '2.0 hrs',
          category: 'DevOps',
          image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          is_published: true,
        },
        {
          slug: 'user-feedback',
          title: 'User Feedback Integration',
          description:
            'Implement user feedback systems, link feedback to errors, and create feedback-driven debugging workflows.',
          content: '<p>User feedback integration...</p>',
          difficulty: 'Intermediate',
          duration: '1.5 hrs',
          category: 'UX',
          image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
          is_published: true,
        },
        {
          slug: 'seer-mcp',
          title: 'Seer & MCP for AI/ML',
          description:
            "Leverage Sentry's AI-powered debugging with Seer and implement Model Context Protocol (MCP) for ML observability.",
          content: '<p>AI/ML monitoring with Sentry...</p>',
          difficulty: 'Advanced',
          duration: '3.5 hrs',
          category: 'AI/ML',
          image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500',
          is_published: true,
        },
        {
          slug: 'stakeholder-dashboards',
          title: 'Building Effective Dashboards for Stakeholders',
          description:
            'Learn to create compelling dashboards that translate technical metrics into business insights for PMs, executives, and cross-functional teams.',
          content: '<p>Stakeholder dashboard strategies...</p>',
          difficulty: 'Beginner',
          duration: '2.0 hrs',
          category: 'Management',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
          is_published: true,
        },
        {
          slug: 'metrics-insights',
          title: 'Metrics-Driven Product Insights',
          description:
            'Master the art of interpreting Sentry data to make informed product decisions, prioritize engineering work, and communicate impact to stakeholders.',
          content: '<p>Product insights with Sentry data...</p>',
          difficulty: 'Beginner',
          duration: '1.5 hrs',
          category: 'Management',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
          is_published: true,
        },
      ])
      .returning()

    console.log(`✅ Created ${sampleCourses.length} sample courses`)

    // Create course modules for the first few courses
    console.log('🧩 Creating course modules...')
    const moduleData = [
      // Sentry Fundamentals modules
      {
        course_id: sampleCourses[0]?.id ?? 1,
        title: 'Introduction to Error Monitoring',
        content: '<h2>Welcome to Sentry</h2><p>Learn the basics of error monitoring...</p>',
        order: 1,
        duration: '5 min',
      },
      {
        course_id: sampleCourses[0]?.id ?? 1,
        title: 'Setting Up Your First Project',
        content:
          '<h2>Project Setup</h2><p>Follow along as we create your first Sentry project...</p>',
        order: 2,
        duration: '5 min',
      },
      // Performance Monitoring modules
      {
        course_id: sampleCourses[2]?.id ?? 3,
        title: 'Performance Monitoring Basics',
        content: '<h2>Understanding Performance</h2><p>Learn about key performance metrics...</p>',
        order: 1,
        duration: '30 min',
      },
      {
        course_id: sampleCourses[2]?.id ?? 3,
        title: 'Core Web Vitals',
        content: '<h2>Core Web Vitals</h2><p>Deep dive into LCP, FID, and CLS...</p>',
        order: 2,
        duration: '45 min',
      },
      {
        course_id: sampleCourses[2]?.id ?? 3,
        title: 'Advanced Performance Optimization',
        content:
          '<h2>Optimization Techniques</h2><p>Learn advanced performance optimization strategies...</p>',
        order: 3,
        duration: '60 min',
      },
    ]

    const createdModules = await db.insert(course_modules).values(moduleData).returning()
    console.log(`✅ Created ${createdModules.length} course modules`)

    // Create learning paths
    console.log('🛤️ Creating learning paths...')
    const learningPathData = [
      {
        slug: 'beginner-path',
        title: "Beginner's Journey",
        description:
          'Start your Sentry learning journey with fundamental concepts and basic implementations.',
        role: 'beginner',
        courses: [
          sampleCourses[0]?.id ?? 1,
          sampleCourses[10]?.id ?? 11,
          sampleCourses[11]?.id ?? 12,
        ], // Fundamentals, Stakeholder Dashboards, Metrics Insights
      },
      {
        slug: 'developer-path',
        title: 'Developer Mastery',
        description:
          'Comprehensive path for developers to master error monitoring, performance tracking, and integrations.',
        role: 'developer',
        courses: [
          sampleCourses[0]?.id ?? 1,
          sampleCourses[1]?.id ?? 2,
          sampleCourses[2]?.id ?? 3,
          sampleCourses[3]?.id ?? 4,
          sampleCourses[8]?.id ?? 9,
        ], // Fundamentals, Logging, Performance, Node.js, User Feedback
      },
      {
        slug: 'devops-path',
        title: 'DevOps Excellence',
        description:
          'Advanced monitoring strategies for DevOps engineers and infrastructure teams.',
        role: 'devops',
        courses: [
          sampleCourses[5]?.id ?? 6,
          sampleCourses[6]?.id ?? 7,
          sampleCourses[7]?.id ?? 8,
          sampleCourses[4]?.id ?? 5,
        ], // Team Workflows, Distributed Tracing, Release Health, Custom Dashboards
      },
      {
        slug: 'advanced-path',
        title: 'Advanced Practitioner',
        description: 'Expert-level courses for senior developers and technical leads.',
        role: 'advanced',
        courses: [
          sampleCourses[2]?.id ?? 3,
          sampleCourses[4]?.id ?? 5,
          sampleCourses[5]?.id ?? 6,
          sampleCourses[6]?.id ?? 7,
          sampleCourses[9]?.id ?? 10,
        ], // Performance, Custom Dashboards, Team Workflows, Distributed Tracing, AI/ML
      },
    ]

    const createdPaths = await db.insert(learning_paths).values(learningPathData).returning()
    console.log(`✅ Created ${createdPaths.length} learning paths`)

    console.log('🎉 Database seeding completed successfully!')

    return {
      users: sampleUsers.length,
      courses: sampleCourses.length,
      modules: createdModules.length,
      paths: createdPaths.length,
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Check if we should seed the database
export async function shouldSeedDatabase(): Promise<boolean> {
  try {
    const existingCourses = await db.select().from(courses).limit(1)
    return existingCourses.length === 0
  } catch {
    console.log('Database might not be initialized yet')
    return true
  }
}

// Auto-seed function that can be called safely
export async function autoSeedIfNeeded() {
  try {
    if (await shouldSeedDatabase()) {
      console.log('🔍 Database appears to be empty, seeding with initial data...')
      await seedDatabase()
    } else {
      console.log('✅ Database already contains data, skipping seed')
    }
  } catch (error) {
    console.error('Warning: Could not seed database:', error)
  }
}
