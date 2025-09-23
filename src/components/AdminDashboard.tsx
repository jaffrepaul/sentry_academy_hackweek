import React, { useState, useEffect } from 'react'
import { AIGeneratedCourse, GenerationStatus } from '@/types/aiGeneration'
import { getGenerationStats, aiGeneratedCoursesStore } from '@/data/aiGeneratedCourses'
import { ContentGenerationForm } from '@/components/ContentGenerationForm'
import { GeneratedContentPreview } from '@/components/GeneratedContentPreview'
import { AIContentManager } from '@/components/AIContentManager'
// Theme handled automatically by Tailwind dark: classes
import {
  getBackgroundStyle,
  getCardClasses,
  getTextClasses,
  getButtonClasses,
} from '@/utils/styles'
import Header from '@/components/Header'

interface AdminDashboardProps {
  onClose?: () => void
}

type DashboardView = 'overview' | 'generate' | 'manage' | 'settings'

interface DashboardStats {
  totalRequests: number
  totalCourses: number
  approvedCourses: number
  pendingApprovals: number
  statusCounts: Record<string, number>
  roleDistribution: Record<string, number>
  averageQualityScore: number
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose: _onClose }) => {
  // Theme handled automatically by Tailwind dark: classes
  const [currentView, setCurrentView] = useState<DashboardView>('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCourses, setRecentCourses] = useState<AIGeneratedCourse[]>([])
  const [activeGenerations, setActiveGenerations] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState<AIGeneratedCourse | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [refreshTrigger])

  const loadDashboardData = () => {
    try {
      const dashboardStats = getGenerationStats()
      setStats(dashboardStats)

      const allCourses = aiGeneratedCoursesStore.getAllCourses()
      const sortedCourses = allCourses
        .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
        .slice(0, 10)
      setRecentCourses(sortedCourses)

      // Get active generations (courses with pending/in-progress status)
      const activeIds = allCourses
        .filter(course => {
          const progress = aiGeneratedCoursesStore.getGenerationProgress(
            course.generationRequest.id
          )
          return progress && ['pending', 'researching', 'generating'].includes(progress.status)
        })
        .map(course => course.id)
      setActiveGenerations(activeIds)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const refreshData = () => {
    console.log('AdminDashboard: refreshData called')
    setRefreshTrigger(prev => prev + 1)
  }

  const getStatusColor = (status: GenerationStatus): string => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      researching: 'bg-blue-100 text-blue-800',
      generating: 'bg-purple-100 text-purple-800',
      'review-needed': 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-emerald-100 text-emerald-800',
      error: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${getTextClasses('primary')}`}>
            AI Content Generation
          </h1>
          <p className={`mt-1 ${getTextClasses('secondary')}`}>
            Manage AI-generated course content and workflows
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Refresh clicked')
              refreshData()
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${getButtonClasses('secondary')}`}
          >
            🔄 Refresh
          </button>
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Generate clicked')
              setCurrentView('generate')
            }}
            className={`rounded-lg px-4 py-2 font-medium ${getButtonClasses('primary')}`}
          >
            ✨ Generate New Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className={`${getCardClasses()} p-6`}>
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses('secondary')}`}>
                  Total Requests
                </p>
                <p className={`text-2xl font-bold ${getTextClasses('primary')}`}>
                  {stats.totalRequests}
                </p>
              </div>
            </div>
          </div>

          <div className={`${getCardClasses()} p-6`}>
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses('secondary')}`}>
                  Approved Courses
                </p>
                <p className={`text-2xl font-bold ${getTextClasses('primary')}`}>
                  {stats.approvedCourses}
                </p>
              </div>
            </div>
          </div>

          <div className={`${getCardClasses()} p-6`}>
            <div className="flex items-center">
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses('secondary')}`}>
                  Pending Review
                </p>
                <p className={`text-2xl font-bold ${getTextClasses('primary')}`}>
                  {stats.pendingApprovals}
                </p>
              </div>
            </div>
          </div>

          <div className={`${getCardClasses()} p-6`}>
            <div className="flex items-center">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses('secondary')}`}>Avg Quality</p>
                <p className={`text-2xl font-bold ${getTextClasses('primary')}`}>
                  {(stats.averageQualityScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Generations */}
      {activeGenerations.length > 0 && (
        <div className={`${getCardClasses(false)} p-6`}>
          <h2 className={`mb-4 text-lg font-semibold ${getTextClasses('primary')}`}>
            Active Generations
          </h2>
          <div className="space-y-3">
            {activeGenerations.slice(0, 5).map(courseId => {
              const course = aiGeneratedCoursesStore.getCourse(courseId)
              const progress = course
                ? aiGeneratedCoursesStore.getGenerationProgress(course.generationRequest.id)
                : null

              if (!course || !progress) return null

              return (
                <div
                  key={courseId}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-slate-700/50 dark:bg-slate-800/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(progress.status)}`}
                      >
                        {progress.status}
                      </span>
                      <span className={`font-medium ${getTextClasses('primary')}`}>
                        {course.generationRequest.keywords.join(', ')}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${getTextClasses('secondary')}`}>
                      {progress.currentStep}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300 dark:bg-purple-500"
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                    <span className={`w-12 text-sm ${getTextClasses('secondary')}`}>
                      {progress.progress}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Courses */}
      <div className={`${getCardClasses(false)} p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${getTextClasses('primary')}`}>Recent Courses</h2>
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              console.log('View All clicked')
              setCurrentView('manage')
            }}
            className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            View All →
          </button>
        </div>

        {recentCourses.length === 0 ? (
          <div className="py-8 text-center">
            <span className="mb-4 block text-4xl">📚</span>
            <p className={getTextClasses('secondary')}>No courses generated yet</p>
            <button
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Generate first course clicked')
                setCurrentView('generate')
              }}
              className="mt-2 font-medium text-purple-600 transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Generate your first course
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCourses.slice(0, 5).map(course => {
              const progress = aiGeneratedCoursesStore.getGenerationProgress(
                course.generationRequest.id
              )

              return (
                <div
                  key={course.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50 dark:border-slate-700/50 dark:bg-slate-800/30 dark:hover:bg-slate-700/30"
                  onClick={e => {
                    e.preventDefault()
                    setSelectedCourse(course)
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          progress ? getStatusColor(progress.status) : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {progress?.status || 'unknown'}
                      </span>
                      <span className={`font-medium ${getTextClasses('primary')}`}>
                        {course.title}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${getTextClasses('secondary')}`}>
                      {course.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${getTextClasses('secondary')}`}>
                      Quality: {(course.qualityScore * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-400">
                      {course.generatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderNavigation = () => (
    <nav className="mb-6 border-b border-purple-300/30 bg-white/50 backdrop-blur-sm dark:border-purple-500/30 dark:bg-slate-950/50">
      <div className="flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'generate', label: 'Generate', icon: '✨' },
          { id: 'manage', label: 'Manage', icon: '📚' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Navigation clicked:', tab.id)
              setCurrentView(tab.id as DashboardView)
            }}
            className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              currentView === tab.id
                ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                : `border-transparent ${getTextClasses('secondary')} hover:${getTextClasses('primary')} hover:border-purple-300 dark:hover:border-purple-500/50`
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview()
      case 'generate':
        return (
          <ContentGenerationForm
            onGenerationStarted={refreshData}
            onBack={() => setCurrentView('overview')}
          />
        )
      case 'manage':
        return <AIContentManager onCourseSelect={setSelectedCourse} onDataChange={refreshData} />
      case 'settings':
        return renderSettings()
      default:
        return renderOverview()
    }
  }

  const renderSettings = () => (
    <div className={`${getCardClasses(false)} p-6`}>
      <h2 className={`mb-4 text-lg font-semibold ${getTextClasses('primary')}`}>
        AI Generation Settings
      </h2>
      <div className="space-y-4">
        <div>
          <label className={`mb-2 block text-sm font-medium ${getTextClasses('primary')}`}>
            OpenAI API Key
          </label>
          <input
            type="password"
            placeholder="sk-..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-purple-500 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-white dark:placeholder-gray-400"
          />
          <p className={`mt-1 text-xs ${getTextClasses('secondary')}`}>
            Required for AI content generation. Your key is stored securely.
          </p>
        </div>

        <div className={`text-sm ${getTextClasses('secondary')}`}>
          <p>Settings panel for future configuration options.</p>
          <p className="mt-2">Currently all course approvals require manual review.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={getBackgroundStyle()}>
      <Header />

      {/* Main Content */}
      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {renderNavigation()}
          {renderContent()}
        </div>
      </main>

      {/* Course Preview Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          style={{ zIndex: 10000 }}
        >
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white dark:bg-slate-900">
            <GeneratedContentPreview
              course={selectedCourse}
              onClose={() => setSelectedCourse(null)}
              onApprove={() => {
                // Handle approval
                setSelectedCourse(null)
                refreshData()
              }}
              onReject={() => {
                // Handle rejection
                setSelectedCourse(null)
                refreshData()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
