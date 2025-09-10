'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { getTextClasses } from '@/utils/styles'
import { getMockCourses } from '@/lib/actions/course-actions'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, Users, Trophy, CheckCircle, Circle, Code, FileText, Lightbulb, Monitor, Github, ArrowRight } from 'lucide-react'
import { Arcade } from '@/components/Arcade'

// Course modules data based on course type
const getCourseModules = (slug: string) => {
  switch (slug) {
    case 'sentry-fundamentals':
      return [
        {
          title: "Install Sentry SDK",
          description: "Set up Sentry in your Next.js application using the installation wizard and configure error monitoring, tracing, and session replay.",
          duration: "8 min",
          isCompleted: true
        },
        {
          title: "Verify Your Setup",
          description: "Test your Sentry configuration by triggering sample errors and verifying data appears in your Sentry project dashboard.",
          duration: "12 min",
          isCompleted: true
        },
        {
          title: "Sending Logs",
          description: "Learn to capture exceptions, send custom messages, and add context to your error reports for better debugging.",
          duration: "15 min",
          isCompleted: false
        },
        {
          title: "Customizing Session Replay",
          description: "Configure session replay settings, privacy controls, and sampling rates to capture meaningful user interactions.",
          duration: "12 min",
          isCompleted: false
        },
        {
          title: "Distributed Tracing",
          description: "Implement performance monitoring with custom spans, trace API calls, and monitor user interactions across your application.",
          duration: "18 min",
          isCompleted: false
        }
      ]
    case 'sentry-logging':
      return [
        {
          title: "Introduction to Sentry Logs",
          description: "Understanding structured logging and why logs are essential for debugging applications beyond errors.",
          duration: "8 min",
          isCompleted: true
        },
        {
          title: "Setting Up Sentry Logging",
          description: "Learn how to enable logging in your Sentry SDK configuration and start capturing logs from your applications.",
          duration: "12 min",
          isCompleted: true
        },
        {
          title: "Structured Logging with Sentry.logger",
          description: "Master the Sentry.logger API including trace, debug, info, warn, error, and fatal log levels with practical examples.",
          duration: "18 min",
          isCompleted: false
        },
        {
          title: "Advanced Logging Features",
          description: "Explore console logging integration, Winston integration, and the beforeSendLog callback for filtering logs.",
          duration: "15 min",
          isCompleted: false
        },
        {
          title: "Viewing and Searching Logs in Sentry",
          description: "Learn to navigate the Sentry Logs UI, search by text and properties, create alerts, and build dashboard widgets.",
          duration: "19 min",
          isCompleted: false
        }
      ]
    default:
      return [
        {
          title: "Course Introduction",
          description: "Overview of the course objectives and what you'll learn throughout this comprehensive training.",
          duration: "10 min",
          isCompleted: true
        },
        {
          title: "Core Concepts",
          description: "Learn the fundamental concepts and principles that form the foundation of this course.",
          duration: "15 min",
          isCompleted: false
        },
        {
          title: "Practical Implementation",
          description: "Apply what you've learned with hands-on exercises and real-world examples.",
          duration: "20 min",
          isCompleted: false
        },
        {
          title: "Best Practices",
          description: "Discover industry best practices and common patterns used by experienced professionals.",
          duration: "12 min",
          isCompleted: false
        },
        {
          title: "Next Steps",
          description: "Explore advanced topics and recommendations for continuing your learning journey.",
          duration: "8 min",
          isCompleted: false
        }
      ]
  }
}

// Course content configurations
const getCourseContent = (slug: string) => {
  switch (slug) {
    case 'sentry-fundamentals':
      return {
        videoUrl: "https://www.youtube.com/embed/6NuusWkjvlw",
        arcadeUrl: "https://demo.arcade.software/4z9l5xNZfpXFGAFc03az?embed",
        keyTakeaways: [
          "Automatic error detection and exception tracking across your application",
          "Performance monitoring with distributed tracing and custom spans",
          "Session replay captures user interactions to debug issues faster",
          "User feedback widgets collect context directly from affected users"
        ],
        scenario: {
          title: "Critical Production Bug Hunt",
          description: "Your e-commerce app suddenly experiences a 40% drop in conversions. Users report the checkout button \"doesn't work\" but traditional monitoring shows no obvious errors or server issues.",
          solution: "Sentry's monitoring stack reveals the full picture: Session Replay shows repeated checkout clicks, error monitoring catches JavaScript exceptions, performance monitoring identifies slow APIs, and user feedback confirms \"loading forever\" experiences.",
          result: "Instead of hours of guesswork, you identify and fix the root cause in 15 minutes, preventing thousands in lost revenue and customer frustration."
        },
        codeExample: {
          title: "Next.js Sentry Setup",
          filename: "instrumentation.ts",
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
});`
        }
      }
    case 'sentry-logging':
      return {
        videoUrl: "https://www.youtube.com/embed/06_whBhgPB0",
        arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
        keyTakeaways: [
          "Structured logs provide context beyond just errors",
          "Sentry.logger API supports multiple log levels and attributes",
          "Logs can be searched, filtered, and used for alerts",
          "Console logging integration captures existing logs automatically"
        ],
        scenario: {
          title: "E-commerce Checkout Process",
          description: "Your online store processes hundreds of orders daily. When payment processing starts failing intermittently, traditional logs only show generic \"payment failed\" messages without context.",
          solution: "With Sentry structured logging: You can capture user ID, cart value, payment method, and session state. This allows you to quickly identify that the issue only affects credit card payments over $500 for users in specific regions.",
          result: "What would have taken hours of investigation now takes minutes, preventing revenue loss and improving customer experience."
        },
        codeExample: {
          title: "Sentry Logging Setup",
          filename: "sentry.client.config.ts",
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
});`
        }
      }
    default:
      return {
        videoUrl: "https://www.youtube.com/embed/6NuusWkjvlw",
        arcadeUrl: "https://demo.arcade.software/4z9l5xNZfpXFGAFc03az?embed",
        keyTakeaways: [
          "Learn fundamental concepts and principles",
          "Apply knowledge through practical exercises",
          "Understand best practices and common patterns",
          "Gain confidence to implement in real projects"
        ],
        scenario: {
          title: "Real-World Application",
          description: "Apply the concepts learned in this course to solve common challenges you'll encounter in production environments.",
          solution: "Through guided examples and hands-on practice, you'll develop the skills needed to implement these concepts effectively.",
          result: "Build confidence and expertise that you can immediately apply to your work."
        },
        codeExample: {
          title: "Code Example",
          filename: "example.js",
          code: `// Example implementation
console.log('Hello, World!');`
        }
      }
  }
}

// Content Module Component
const ContentModule = ({ title, description, duration, isCompleted = false, isActive = false, onClick }: {
  title: string
  description: string
  duration: string
  isCompleted?: boolean
  isActive?: boolean
  onClick: () => void
}) => {
  const { isDark } = useTheme()

  const cardClasses = useMemo(() => {
    if (isActive) {
      return isDark 
        ? 'border-purple-400/80 bg-slate-900/80 shadow-lg shadow-purple-500/25'
        : 'border-purple-400/80 bg-white/80 shadow-lg shadow-purple-300/25'
    }
    return isDark
      ? 'border-purple-500/30 bg-slate-900/40 hover:border-purple-400/60 hover:bg-slate-900/60'
      : 'border-purple-300/30 bg-white/60 hover:border-purple-400/60 hover:bg-white/80'
  }, [isDark, isActive])

  return (
    <div 
      className={`cursor-pointer transition-all duration-200 ${
        isActive ? 'transform scale-105' : 'hover:transform hover:scale-[1.02]'
      }`}
      onClick={onClick}
    >
      <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-200 ${cardClasses}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <Circle className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
            <h3 className={`text-lg font-bold ${getTextClasses(isDark, 'primary')}`}>
              {title}
            </h3>
          </div>
          <div className={`flex items-center space-x-1 text-sm ${getTextClasses(isDark, 'secondary')}`}>
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <p className={getTextClasses(isDark, 'secondary')}>
          {description}
        </p>
      </div>
    </div>
  )
}

// Course Navigation Component
const CourseNavigation = ({ currentCourse }: { currentCourse: any }) => {
  const { isDark } = useTheme()
  const router = useRouter()
  const [allCourses, setAllCourses] = useState<any[]>([])

  useEffect(() => {
    getMockCourses().then(setAllCourses)
  }, [])

  const getNavigationContext = () => {
    const currentCourseIndex = allCourses.findIndex(course => course.slug === currentCourse.slug)
    
    if (currentCourseIndex === -1) {
      return { previousCourse: null, nextCourse: null }
    }

    const previousCourse = currentCourseIndex > 0 ? allCourses[currentCourseIndex - 1] : null
    const nextCourse = currentCourseIndex < allCourses.length - 1 ? allCourses[currentCourseIndex + 1] : null
    
    return { previousCourse, nextCourse }
  }

  const { previousCourse, nextCourse } = getNavigationContext()

  return (
    <div className="mt-8 pt-6 border-t border-purple-500/20">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Previous Course */}
        <div>
          {previousCourse ? (
            <button 
              onClick={() => router.push(`/courses/${previousCourse.slug}`)}
              className={`w-full h-32 p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                isDark
                  ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/70'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3 h-full">
                <ArrowLeft className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div className="flex-1 min-h-0">
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Previous Course
                  </div>
                  <div className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {previousCourse.title}
                  </div>
                  <div className={`text-sm mt-2 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {previousCourse.description}
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <div className={`w-full h-32 p-4 rounded-xl ${
              isDark ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-gray-50/50 border border-gray-200/50'
            }`}>
              <div className="flex items-start space-x-3 h-full">
                <ArrowLeft className={`w-5 h-5 mt-1 flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    First Course
                  </div>
                  <div className={`font-semibold mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
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
              className={`w-full h-32 p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl bg-gradient-to-r from-purple-500/20 to-pink-400/20 hover:from-purple-500/30 hover:to-pink-400/30 ${
                isDark
                  ? 'border border-purple-500/40 hover:border-purple-400/60'
                  : 'border border-purple-300/40 hover:border-purple-400/60'
              }`}
            >
              <div className="flex items-start justify-between h-full">
                <div className="flex-1 min-h-0">
                  <div className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                    🎯 Recommended Next Course
                  </div>
                  <div className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {nextCourse.title}
                  </div>
                  <div className={`text-sm mt-2 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {nextCourse.description}
                  </div>
                </div>
                <ArrowRight className={`w-5 h-5 mt-1 ${isDark ? 'text-purple-400' : 'text-purple-500'} flex-shrink-0 ml-3`} />
              </div>
            </button>
          ) : (
            <div className={`w-full h-32 p-4 rounded-xl ${
              isDark ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-gray-50/50 border border-gray-200/50'
            }`}>
              <div className="flex items-start justify-between h-full">
                <div className="flex-1">
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    Learning Path Complete
                  </div>
                  <div className={`font-semibold mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Great job finishing your path!
                  </div>
                </div>
                <CheckCircle className={`w-5 h-5 mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'} flex-shrink-0`} />
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
  const { isDark } = useTheme()
  const [activeModule, setActiveModule] = useState(0)
  const course = initialCourse
  const modules = getCourseModules(course.slug)
  const contentConfig = getCourseContent(course.slug)
  const currentModule = modules[activeModule]

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
        
        setTimeout(() => {
          element.style.opacity = '1'
          element.style.transform = 'translateY(0)'
        }, 100 + (index * 150))
      })
    }, 50)
  }, [course.slug])

  return (
    <div className="min-h-screen pt-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href="/courses"
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-lg backdrop-blur-sm hover:shadow-xl ${
              isDark
                ? 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 hover:shadow-purple-500/20'
                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900 border border-purple-300/30 hover:border-purple-400/60 hover:shadow-purple-300/20'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className={`text-3xl font-bold ${getTextClasses(isDark, 'primary')}`}>
              {course.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`text-sm ${getTextClasses(isDark, 'secondary')}`}>{course.rating}</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${getTextClasses(isDark, 'secondary')}`}>
                <Users className="w-4 h-4" />
                <span>{course.students.toLocaleString()} students</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${getTextClasses(isDark, 'secondary')}`}>
                <Trophy className="w-4 h-4" />
                <span>{course.level}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Modules Sidebar */}
          <div className="lg:col-span-1">
            <div className={`course-content-section backdrop-blur-sm border rounded-2xl p-6 ${
              isDark 
                ? 'bg-slate-900/40 border-purple-500/30'
                : 'bg-white/60 border-purple-300/30'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
              
              <div className="mt-8 pt-6 border-t border-purple-500/20">
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Progress: {completedModules} of {modules.length} completed
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className={`backdrop-blur-sm border rounded-2xl p-8 ${
              isDark 
                ? 'bg-slate-900/40 border-purple-500/30'
                : 'bg-white/60 border-purple-300/30'
            }`}>
              {/* Video/Content Player */}
              <div className={`course-content-section aspect-video rounded-xl mb-8 overflow-hidden ${
                isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'
              }`}>
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
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentModule.title}
                  </h3>
                  <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentModule.description}
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className={`course-content-section border rounded-xl p-6 ${
                  isDark 
                    ? 'border-purple-500/30 bg-slate-800/30'
                    : 'border-purple-300/30 bg-purple-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Key Takeaways
                    </h4>
                  </div>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {contentConfig.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real World Scenario */}
                <div className={`course-content-section border rounded-xl p-6 ${
                  isDark 
                    ? 'border-green-500/30 bg-green-900/10'
                    : 'border-green-300/30 bg-green-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-green-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Real World Scenario
                    </h4>
                  </div>
                  <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4`}>
                    <div className={`p-4 rounded-lg ${
                      isDark ? 'bg-slate-800/30' : 'bg-white/50'
                    }`}>
                      <h5 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {contentConfig.scenario.title}
                      </h5>
                      <p className="mb-3">
                        {contentConfig.scenario.description}
                      </p>
                      <div className={`p-3 rounded border-l-4 border-green-400 ${
                        isDark ? 'bg-green-900/20' : 'bg-green-50'
                      }`}>
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
                <div className={`course-content-section border rounded-xl p-6 ${
                  isDark 
                    ? 'border-purple-500/30 bg-slate-800/30'
                    : 'border-purple-300/30 bg-gray-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {contentConfig.codeExample.title}
                    </h4>
                  </div>
                  <div className={`rounded-lg p-4 font-mono text-sm ${
                    isDark ? 'bg-slate-900/50 text-green-400' : 'bg-white/50 text-green-600'
                  }`}>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>// {contentConfig.codeExample.filename}</div>
                    <pre className="whitespace-pre-wrap">{contentConfig.codeExample.code}</pre>
                  </div>
                </div>

                {/* Interactive Demo */}
                <div className={`course-content-section border rounded-xl p-6 ${
                  isDark 
                    ? 'border-blue-500/30 bg-blue-900/10'
                    : 'border-blue-300/30 bg-blue-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Interactive Sentry UI Demo
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <div className={`max-w-4xl border rounded-xl overflow-hidden ${
                      isDark 
                        ? 'border-slate-700/50 bg-slate-800/30' 
                        : 'border-gray-200 bg-gray-50/50'
                    }`}>
                      <Arcade 
                        src={contentConfig.arcadeUrl}
                      />
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      💡 <strong>Try it yourself:</strong> Explore the Sentry dashboard, view error details with stack traces, 
                      watch session replays, and see how performance monitoring identifies bottlenecks across your application.
                    </div>
                  </div>
                </div>

                {/* GitHub Repository Callout */}
                <div className={`course-content-section border rounded-xl p-6 ${
                  isDark 
                    ? 'border-green-500/30 bg-green-900/10'
                    : 'border-green-300/30 bg-green-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Github className="w-5 h-5 text-green-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Code Along with This Course
                    </h4>
                  </div>
                  <div className="space-y-4">
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Get hands-on experience with Sentry's complete monitoring stack. Fork this repository to access 
                      working Next.js examples with error tracking, performance monitoring, session replay, and user feedback.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="https://github.com/getsentry/sentry-academy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                          isDark
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30'
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30'
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        <span>Fork Repository</span>
                      </a>
                      <a
                        href="https://github.com/getsentry/sentry-academy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isDark
                            ? 'border border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400/70'
                            : 'border border-green-500/50 text-green-600 hover:bg-green-50 hover:border-green-500/70'
                        }`}
                      >
                        View Repository
                      </a>
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      💡 <strong>Repository includes:</strong> Complete Next.js Sentry setup, error handling examples, 
                      custom tracing implementations, session replay configuration, and user feedback integration.
                    </div>
                  </div>
                </div>

                {/* Customer Case Study - Rootly */}
                <a
                  href="https://sentry.io/customers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-content-section block transition-all duration-200 hover:transform hover:scale-[1.025]"
                >
                  <div className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                    isDark 
                      ? 'border-orange-500/30 bg-orange-900/10 hover:border-orange-400/50 hover:bg-orange-900/20'
                      : 'border-orange-300/30 bg-orange-50/30 hover:border-orange-400/50 hover:bg-orange-50/50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-4">
                      <FileText className="w-5 h-5 text-orange-400" />
                      <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        People Like Us!
                      </h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
                          isDark 
                            ? 'bg-slate-800/50 border border-slate-700/50' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <img 
                            src={isDark ? "/logos/rootly-logo-light.svg" : "/logos/rootly-logo.svg"}
                            alt="Rootly Logo" 
                            className="h-6 w-auto"
                          />
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          AI-native incident response platform
                        </span>
                      </div>
                      <h5 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        How Rootly Reduces MTTR by 50% with Sentry's Complete Stack
                      </h5>
                      <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-3`}>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                          }`}>Error Monitoring</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>Performance Monitoring</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                          }`}>Session Replay</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                          }`}>User Feedback</span>
                        </div>
                        <p>
                          Rootly achieved <strong>50% faster MTTR</strong> and avoided <strong>$100,000+ ARR impact</strong> 
                          by leveraging Sentry's complete monitoring ecosystem—from automatic error detection to session replay 
                          showing exactly what users experienced during incidents.
                        </p>
                        <p className="italic text-sm">
                          "Sentry's session replay is game-changing. We can see exactly what users experienced during an incident, 
                          making root cause analysis instantaneous instead of guesswork." — Dan Sadler, VP of Engineering
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
      
      <Footer />
    </div>
  )
}