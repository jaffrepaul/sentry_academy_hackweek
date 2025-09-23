'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
// Theme handled automatically by Tailwind dark: classes
import { getTextClasses } from '@/utils/styles'
import { getCourses } from '@/lib/actions/course-actions'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  Trophy,
  CheckCircle,
  Circle,
  Code,
  FileText,
  Lightbulb,
  Monitor,
  Github,
  ArrowRight,
} from 'lucide-react'
import { Arcade } from '@/components/Arcade'
import StructuredData from '@/components/StructuredData'
import { generateCourseStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo'

// Course modules data based on course type
const getCourseModules = (slug: string) => {
  switch (slug) {
    case 'sentry-fundamentals':
      return [
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
    case 'sentry-logging':
      return [
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
    default:
      return [
        {
          title: 'Course Introduction',
          description:
            "Overview of the course objectives and what you'll learn throughout this comprehensive training.",
          duration: '10 min',
          isCompleted: true,
        },
        {
          title: 'Core Concepts',
          description:
            'Learn the fundamental concepts and principles that form the foundation of this course.',
          duration: '15 min',
          isCompleted: false,
        },
        {
          title: 'Practical Implementation',
          description: "Apply what you've learned with hands-on exercises and real-world examples.",
          duration: '20 min',
          isCompleted: false,
        },
        {
          title: 'Best Practices',
          description:
            'Discover industry best practices and common patterns used by experienced professionals.',
          duration: '12 min',
          isCompleted: false,
        },
        {
          title: 'Next Steps',
          description:
            'Explore advanced topics and recommendations for continuing your learning journey.',
          duration: '8 min',
          isCompleted: false,
        },
      ]
  }
}

// Course content configurations
const getCourseContent = (slug: string) => {
  switch (slug) {
    case 'sentry-fundamentals':
      return {
        videoUrl: 'https://www.youtube.com/embed/6NuusWkjvlw',
        arcadeUrl: 'https://demo.arcade.software/4z9l5xNZfpXFGAFc03az?embed',
        keyTakeaways: [
          'Automatic error detection and exception tracking across your application',
          'Performance monitoring with distributed tracing and custom spans',
          'Session replay captures user interactions to debug issues faster',
          'User feedback widgets collect context directly from affected users',
        ],
        scenario: {
          title: 'Critical Production Bug Hunt',
          description:
            'Your e-commerce app suddenly experiences a 40% drop in conversions. Users report the checkout button "doesn\'t work" but traditional monitoring shows no obvious errors or server issues.',
          solution:
            'Sentry\'s monitoring stack reveals the full picture: Session Replay shows repeated checkout clicks, error monitoring catches JavaScript exceptions, performance monitoring identifies slow APIs, and user feedback confirms "loading forever" experiences.',
          result:
            'Instead of hours of guesswork, you identify and fix the root cause in 15 minutes, preventing thousands in lost revenue and customer frustration.',
        },
        codeExample: {
          title: 'Next.js Sentry Setup',
          filename: 'instrumentation.ts',
          code: `import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  
  sendDefaultPii: true,
  
  integrations: [
    // Performance monitoring
    Sentry.browserTracingIntegration(),
    // Session replay
    Sentry.replayIntegration(),
    // User feedback
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],
  
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});`,
        },
      }
    case 'sentry-logging':
      return {
        videoUrl: 'https://www.youtube.com/embed/06_whBhgPB0',
        arcadeUrl: 'https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true',
        keyTakeaways: [
          'Structured logs provide context beyond just errors',
          'Sentry.logger API supports multiple log levels and attributes',
          'Logs can be searched, filtered, and used for alerts',
          'Console logging integration captures existing logs automatically',
        ],
        scenario: {
          title: 'E-commerce Checkout Process',
          description:
            'Your online store processes hundreds of orders daily. When payment processing starts failing intermittently, traditional logs only show generic "payment failed" messages without context.',
          solution:
            'With Sentry structured logging: You can capture user ID, cart value, payment method, and session state. This allows you to quickly identify that the issue only affects credit card payments over $500 for users in specific regions.',
          result:
            'What would have taken hours of investigation now takes minutes, preventing revenue loss and improving customer experience.',
        },
        codeExample: {
          title: 'Sentry Logging Setup',
          filename: 'sentry.client.config.ts',
          code: `import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: '<Your Sentry DSN>',
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Enable logs to be sent to Sentry
  _experiments: {
    enableLogs: true,
  },
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});

// Usage examples
Sentry.logger.info('User started checkout', {
  userId: '12345',
  cartValue: 125.50,
  items: 3
});`,
        },
      }
    default:
      return {
        videoUrl: 'https://www.youtube.com/embed/6NuusWkjvlw',
        arcadeUrl: 'https://demo.arcade.software/4z9l5xNZfpXFGAFc03az?embed',
        keyTakeaways: [
          'Learn fundamental concepts and principles',
          'Apply knowledge through practical exercises',
          'Understand best practices and common patterns',
          'Gain confidence to implement in real projects',
        ],
        scenario: {
          title: 'Real-World Application',
          description:
            "Apply the concepts learned in this course to solve common challenges you'll encounter in production environments.",
          solution:
            "Through guided examples and hands-on practice, you'll develop the skills needed to implement these concepts effectively.",
          result: 'Build confidence and expertise that you can immediately apply to your work.',
        },
        codeExample: {
          title: 'Code Example',
          filename: 'example.js',
          code: `// Example implementation
console.log('Hello, World!');`,
        },
      }
  }
}

// Content Module Component
const ContentModule = ({
  title,
  description,
  duration,
  isCompleted = false,
  isActive = false,
  onClick,
}: {
  title: string
  description: string
  duration: string
  isCompleted?: boolean
  isActive?: boolean
  onClick: () => void
}) => {
  // Theme handled automatically by Tailwind dark: classes

  const cardClasses = useMemo(() => {
    if (isActive) {
      return 'border-purple-400/80 bg-white/80 shadow-lg shadow-purple-300/25 dark:bg-slate-900/80 dark:shadow-purple-500/25'
    }
    return 'border-purple-300/30 bg-white/60 hover:border-purple-400/60 hover:bg-white/80 dark:border-purple-500/30 dark:bg-slate-900/40 dark:hover:border-purple-400/60 dark:hover:bg-slate-900/60'
  }, [isActive])

  return (
    <div
      className={`cursor-pointer transition-all duration-200 ${
        isActive ? 'scale-105 transform' : 'hover:scale-[1.02] hover:transform'
      }`}
      onClick={onClick}
    >
      <div
        className={`rounded-2xl border p-6 backdrop-blur-sm transition-all duration-200 ${cardClasses}`}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-400" />
            ) : (
              <Circle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
            <h3 className={`text-lg font-bold ${getTextClasses('primary')}`}>{title}</h3>
          </div>
          <div className={`flex items-center space-x-1 text-sm ${getTextClasses('secondary')}`}>
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
        <p className={getTextClasses('secondary')}>{description}</p>
      </div>
    </div>
  )
}

// Course Navigation Component
const CourseNavigation = ({ currentCourse }: { currentCourse: any }) => {
  // Theme handled automatically by Tailwind dark: classes
  const router = useRouter()
  const [allCourses, setAllCourses] = useState<any[]>([])

  useEffect(() => {
    getCourses()
      .then(setAllCourses)
      .catch(error => {
        console.error('Error fetching courses for navigation:', error)
        setAllCourses([])
      })
  }, [])

  const getNavigationContext = () => {
    const currentCourseIndex = allCourses.findIndex(course => course.slug === currentCourse.slug)

    if (currentCourseIndex === -1) {
      return { previousCourse: null, nextCourse: null }
    }

    const previousCourse = currentCourseIndex > 0 ? allCourses[currentCourseIndex - 1] : null
    const nextCourse =
      currentCourseIndex < allCourses.length - 1 ? allCourses[currentCourseIndex + 1] : null

    return { previousCourse, nextCourse }
  }

  const { previousCourse, nextCourse } = getNavigationContext()

  return (
    <div className="mt-8 border-t border-purple-500/20 pt-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Previous Course */}
        <div>
          {previousCourse ? (
            <button
              onClick={() => router.push(`/courses/${previousCourse.slug}`)}
              className="h-32 w-full transform rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-gray-300 hover:bg-gray-100 hover:shadow-lg dark:border-slate-600/50 dark:bg-slate-800/50 dark:hover:border-slate-500/70 dark:hover:bg-slate-700/50"
            >
              <div className="flex h-full items-start space-x-3">
                <ArrowLeft className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <div className="min-h-0 flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Previous Course
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {previousCourse.title}
                  </div>
                  <div className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {previousCourse.description}
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <div className="h-32 w-full rounded-xl border border-gray-200/50 bg-gray-50/50 p-4 dark:border-slate-700/30 dark:bg-slate-800/30">
              <div className="flex h-full items-start space-x-3">
                <ArrowLeft className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-400 dark:text-gray-600">
                    First Course
                  </div>
                  <div className="mt-1 font-semibold text-gray-400 dark:text-gray-500">
                    Start of your learning path
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Course */}
        <div>
          {nextCourse ? (
            <button
              onClick={() => router.push(`/courses/${nextCourse.slug}`)}
              className="h-32 w-full transform rounded-xl border border-purple-300/40 bg-gradient-to-r from-purple-500/20 to-pink-400/20 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-purple-400/60 hover:from-purple-500/30 hover:to-pink-400/30 hover:shadow-xl dark:border-purple-500/40"
            >
              <div className="flex h-full items-start justify-between">
                <div className="min-h-0 flex-1">
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-300">
                    🎯 Recommended Next Course
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {nextCourse.title}
                  </div>
                  <div className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                    {nextCourse.description}
                  </div>
                </div>
                <ArrowRight className="ml-3 mt-1 h-5 w-5 flex-shrink-0 text-purple-500 dark:text-purple-400" />
              </div>
            </button>
          ) : (
            <div className="h-32 w-full rounded-xl border border-gray-200/50 bg-gray-50/50 p-4 dark:border-slate-700/30 dark:bg-slate-800/30">
              <div className="flex h-full items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-400 dark:text-gray-600">
                    Learning Path Complete
                  </div>
                  <div className="mt-1 font-semibold text-gray-400 dark:text-gray-500">
                    Great job finishing your path!
                  </div>
                </div>
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CourseDetailClientProps {
  initialCourse: any
}

export default function CourseDetailClient({ initialCourse }: CourseDetailClientProps) {
  // Theme handled automatically by Tailwind dark: classes
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeModule, setActiveModule] = useState(0)
  const course = initialCourse
  const modules = getCourseModules(course.slug)
  const contentConfig = getCourseContent(course.slug)
  const currentModule = modules[activeModule]

  // Determine where to navigate back to based on referrer or URL params
  const getBackPath = () => {
    const fromPath = searchParams.get('from')
    if (fromPath === 'learning-path') {
      return '/learning-paths'
    }
    // Default to homepage courses section
    return '/#courses'
  }

  const completedModules = modules.filter(m => m.isCompleted).length
  const progressPercent = Math.round((completedModules / modules.length) * 100)

  const handleModuleClick = (index: number) => {
    setActiveModule(index)
  }

  // Position page at top and add smooth content animations
  useEffect(() => {
    window.scrollTo(0, 0)

    setTimeout(() => {
      const contentSections = document.querySelectorAll('.course-content-section')
      contentSections.forEach((section, index) => {
        const element = section as HTMLElement
        element.style.opacity = '0'
        element.style.transform = 'translateY(20px)'
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'

        setTimeout(
          () => {
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
          },
          100 + index * 150
        )
      })
    }, 50)
  }, [course.slug])

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: course.title, url: `/courses/${course.slug}` },
  ]

  const courseStructuredData = generateCourseStructuredData({
    id: course.id,
    title: course.title,
    description: course.description,
    duration: course.duration,
    level: course.difficulty || course.level,
    category: course.category,
    rating: course.rating || 4.5,
    reviewCount: course.reviews?.length || 0,
  })

  return (
    <>
      <StructuredData
        data={[courseStructuredData, generateBreadcrumbStructuredData(breadcrumbItems)]}
      />
      <Header />
      {/* Main content with background matching home page */}
      <div className="relative min-h-screen pt-20" style={{ contain: 'layout style paint' }}>
        {/* Animated background elements using Tailwind dark: classes */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-200/20 via-transparent to-pink-200/20 dark:from-purple-500/10 dark:via-transparent dark:to-violet-500/10"
          style={{ pointerEvents: 'none' }}
        />
        <div
          className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'auto',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl dark:bg-violet-500/10"
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
            willChange: 'auto',
            pointerEvents: 'none',
          }}
        />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center space-x-4">
            <button
              onClick={() => router.push(getBackPath())}
              className="transform rounded-lg border border-purple-300/30 bg-gray-100/50 p-2 text-gray-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-purple-400/60 hover:bg-gray-200/50 hover:text-gray-900 hover:shadow-xl hover:shadow-purple-300/20 dark:border-purple-500/30 dark:bg-slate-800/50 dark:text-gray-300 dark:hover:bg-slate-700/50 dark:hover:text-white dark:hover:shadow-purple-500/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${getTextClasses('primary')}`}>{course.title}</h1>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className={`text-sm ${getTextClasses('secondary')}`}>
                    {course.rating || '4.5'}
                  </span>
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${getTextClasses('secondary')}`}
                >
                  <Users className="h-4 w-4" />
                  <span>{course.students?.toLocaleString() || '0'} students</span>
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${getTextClasses('secondary')}`}
                >
                  <Trophy className="h-4 w-4" />
                  <span>{course.level || course.difficulty || 'Beginner'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Content Modules Sidebar */}
            <div className="lg:col-span-1">
              <div className="course-content-section rounded-2xl border border-purple-300/30 bg-white/60 p-6 backdrop-blur-sm dark:border-purple-500/30 dark:bg-slate-900/40">
                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  Content Modules
                </h2>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <ContentModule
                      key={index}
                      title={module.title}
                      description={module.description}
                      duration={module.duration}
                      isCompleted={module.isCompleted}
                      isActive={activeModule === index}
                      onClick={() => handleModuleClick(index)}
                    />
                  ))}
                </div>

                <div className="mt-8 border-t border-purple-500/20 pt-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Progress: {completedModules} of {modules.length} completed
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-purple-300/30 bg-white/60 p-8 backdrop-blur-sm dark:border-purple-500/30 dark:bg-slate-900/40">
                {/* Video/Content Player */}
                <div className="course-content-section mb-8 aspect-video overflow-hidden rounded-xl bg-gray-100/50 dark:bg-slate-800/50">
                  <iframe
                    width="100%"
                    height="100%"
                    src={contentConfig.videoUrl}
                    title={`${course.title} - Demo`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="rounded-xl"
                  ></iframe>
                </div>

                {/* Module Content */}
                <div className="course-content-section space-y-6">
                  <div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                      {currentModule?.title || 'Module Title'}
                    </h3>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                      {currentModule?.description || 'Module description'}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div className="course-content-section rounded-xl border border-purple-300/30 bg-purple-50/30 p-6 dark:border-purple-500/30 dark:bg-slate-800/30">
                    <div className="mb-4 flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-purple-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Key Takeaways</h4>
                    </div>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      {contentConfig.keyTakeaways.map((takeaway, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real World Scenario */}
                  <div className="course-content-section rounded-xl border border-green-300/30 bg-green-50/30 p-6 dark:border-green-500/30 dark:bg-green-900/10">
                    <div className="mb-4 flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Real World Scenario
                      </h4>
                    </div>
                    <div className="space-y-4 text-gray-600 dark:text-gray-300">
                      <div className="rounded-lg bg-white/50 p-4 dark:bg-slate-800/30">
                        <h5 className="mb-2 font-semibold text-gray-900 dark:text-white">
                          {contentConfig.scenario.title}
                        </h5>
                        <p className="mb-3">{contentConfig.scenario.description}</p>
                        <div className="rounded border-l-4 border-green-400 bg-green-50 p-3 dark:bg-green-900/20">
                          <p className="text-sm">
                            <strong>Solution:</strong> {contentConfig.scenario.solution}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <strong>Result:</strong> {contentConfig.scenario.result}
                      </div>
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="course-content-section rounded-xl border border-purple-300/30 bg-gray-50/30 p-6 dark:border-purple-500/30 dark:bg-slate-800/30">
                    <div className="mb-4 flex items-center space-x-2">
                      <Code className="h-5 w-5 text-purple-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {contentConfig.codeExample.title}
                      </h4>
                    </div>
                    <div className="rounded-lg bg-white/50 p-4 font-mono text-sm text-green-600 dark:bg-slate-900/50 dark:text-green-400">
                      <div className="mb-2 text-gray-500 dark:text-gray-400">
                        // {contentConfig.codeExample.filename}
                      </div>
                      <pre className="whitespace-pre-wrap">{contentConfig.codeExample.code}</pre>
                    </div>
                  </div>

                  {/* Interactive Demo */}
                  <div className="course-content-section rounded-xl border border-blue-300/30 bg-blue-50/30 p-6 dark:border-blue-500/30 dark:bg-blue-900/10">
                    <div className="mb-4 flex items-center space-x-2">
                      <Monitor className="h-5 w-5 text-blue-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Interactive Sentry UI Demo
                      </h4>
                    </div>
                    <div className="space-y-4">
                      <div className="max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 dark:border-slate-700/50 dark:bg-slate-800/30">
                        <Arcade src={contentConfig.arcadeUrl} />
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        💡 <strong>Try it yourself:</strong> Explore the Sentry dashboard, view
                        error details with stack traces, watch session replays, and see how
                        performance monitoring identifies bottlenecks across your application.
                      </div>
                    </div>
                  </div>

                  {/* GitHub Repository Callout */}
                  <div className="course-content-section rounded-xl border border-green-300/30 bg-green-50/30 p-6 dark:border-green-500/30 dark:bg-green-900/10">
                    <div className="mb-4 flex items-center space-x-2">
                      <Github className="h-5 w-5 text-green-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Code Along with This Course
                      </h4>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">
                        Get hands-on experience with Sentry's complete monitoring stack. Fork this
                        repository to access working Next.js examples with error tracking,
                        performance monitoring, session replay, and user feedback.
                      </p>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                          href="https://github.com/getsentry/sentry-academy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex transform items-center justify-center space-x-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-green-700 hover:shadow-green-500/30"
                        >
                          <Github className="h-4 w-4" />
                          <span>Fork Repository</span>
                        </a>
                        <a
                          href="https://github.com/getsentry/sentry-academy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-lg border border-green-500/50 px-4 py-2 font-medium text-green-600 transition-all duration-200 hover:border-green-500/70 hover:bg-green-50 dark:text-green-400 dark:hover:border-green-400/70 dark:hover:bg-green-500/10"
                        >
                          View Repository
                        </a>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        💡 <strong>Repository includes:</strong> Complete Next.js Sentry setup,
                        error handling examples, custom tracing implementations, session replay
                        configuration, and user feedback integration.
                      </div>
                    </div>
                  </div>

                  {/* Customer Case Study - Rootly */}
                  <a
                    href="https://sentry.io/customers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="course-content-section block transition-all duration-200 hover:scale-[1.025] hover:transform"
                  >
                    <div className="cursor-pointer rounded-xl border border-orange-300/30 bg-orange-50/30 p-6 transition-all duration-200 hover:border-orange-400/50 hover:bg-orange-50/50 dark:border-orange-500/30 dark:bg-orange-900/10 dark:hover:border-orange-400/50 dark:hover:bg-orange-900/20">
                      <div className="mb-4 flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-orange-400" />
                        <h4 className="font-bold text-gray-900 dark:text-white">People Like Us!</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-slate-700/50 dark:bg-slate-800/50">
                            <Image
                              src="/logos/rootly-logo.svg"
                              alt="Rootly Logo"
                              width={120}
                              height={24}
                              className="h-6 w-auto dark:hidden"
                            />
                            <Image
                              src="/logos/rootly-logo-light.svg"
                              alt="Rootly Logo"
                              width={120}
                              height={24}
                              className="hidden h-6 w-auto dark:block"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            AI-native incident response platform
                          </span>
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                          How Rootly Reduces MTTR by 50% with Sentry's Complete Stack
                        </h5>
                        <div className="space-y-3 text-gray-600 dark:text-gray-300">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-500/20 dark:text-red-300">
                              Error Monitoring
                            </span>
                            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                              Performance Monitoring
                            </span>
                            <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                              Session Replay
                            </span>
                            <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-500/20 dark:text-green-300">
                              User Feedback
                            </span>
                          </div>
                          <p>
                            Rootly achieved <strong>50% faster MTTR</strong> and avoided{' '}
                            <strong>$100,000+ ARR impact</strong>
                            by leveraging Sentry's complete monitoring ecosystem—from automatic
                            error detection to session replay showing exactly what users experienced
                            during incidents.
                          </p>
                          <p className="text-sm italic">
                            "Sentry's session replay is game-changing. We can see exactly what users
                            experienced during an incident, making root cause analysis instantaneous
                            instead of guesswork." — Dan Sadler, VP of Engineering
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Course Navigation */}
                <CourseNavigation currentCourse={course} />
              </div>
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Close background div */}
      <Footer />
    </>
  )
}
