'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
// Theme handled automatically by Tailwind dark: classes
import { useRole } from '@/contexts/RoleContext'
import {
  CheckCircle,
  Circle,
  Lock,
  ArrowRight,
  Clock,
  Target,
  AlertTriangle,
  BarChart3,
  FileText,
  Play,
  GitBranch,
  Bell,
  Puzzle,
  MessageSquare,
  Bot,
  TrendingUp,
  RotateCcw,
  Settings,
  Presentation,
  Users,
} from 'lucide-react'
import { SentryFeature } from '@/types/roles'

// Map features to icons
const featureIcons: Record<SentryFeature, React.ReactNode> = {
  'error-tracking': <AlertTriangle className="h-5 w-5" />,
  'performance-monitoring': <BarChart3 className="h-5 w-5" />,
  logging: <FileText className="h-5 w-5" />,
  'session-replay': <Play className="h-5 w-5" />,
  'distributed-tracing': <GitBranch className="h-5 w-5" />,
  'release-health': <Target className="h-5 w-5" />,
  'dashboards-alerts': <Bell className="h-5 w-5" />,
  integrations: <Puzzle className="h-5 w-5" />,
  'user-feedback': <MessageSquare className="h-5 w-5" />,
  'seer-mcp': <Bot className="h-5 w-5" />,
  'custom-metrics': <TrendingUp className="h-5 w-5" />,
  'metrics-insights': <Presentation className="h-5 w-5" />,
  'stakeholder-reporting': <Users className="h-5 w-5" />,
}

// Map features to colors
const featureColors: Record<SentryFeature, string> = {
  'error-tracking': 'from-red-500 to-orange-500',
  'performance-monitoring': 'from-blue-500 to-cyan-500',
  logging: 'from-green-500 to-emerald-500',
  'session-replay': 'from-purple-500 to-violet-500',
  'distributed-tracing': 'from-indigo-500 to-blue-500',
  'release-health': 'from-pink-500 to-rose-500',
  'dashboards-alerts': 'from-yellow-500 to-orange-500',
  integrations: 'from-teal-500 to-cyan-500',
  'user-feedback': 'from-violet-500 to-purple-500',
  'seer-mcp': 'from-emerald-500 to-teal-500',
  'custom-metrics': 'from-orange-500 to-red-500',
  'metrics-insights': 'from-purple-500 to-pink-500',
  'stakeholder-reporting': 'from-blue-500 to-purple-500',
}

const PersonaPathDisplay: React.FC = () => {
  // Theme handled automatically by Tailwind dark: classes;
  const { currentLearningPath, userProgress, resetProgress } = useRole()
  const router = useRouter()
  const [showResetConfirm, setShowResetConfirm] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)

  // Trigger entrance animation on component mount
  React.useEffect(() => {
    // Immediate entrance - no delay
    setIsVisible(true)
  }, [])

  // Handle escape key to close modal and prevent body scroll
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showResetConfirm) {
        setShowResetConfirm(false)
      }
    }

    if (showResetConfirm) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showResetConfirm])

  // Handle scroll positioning when component mounts or updates
  React.useEffect(() => {
    if (currentLearningPath && userProgress.role && isVisible) {
      // Check if we should scroll to a specific position based on progress
      // This will help users see their current position in the learning path
      setTimeout(() => {
        const completedSteps = currentLearningPath.steps
          .filter(step => step.isCompleted)
          .sort((a, b) => b.priority - a.priority) // Sort by priority descending to get last completed

        if (completedSteps.length > 0) {
          // Position the last completed step with margin above
          const lastCompletedStep = completedSteps[0]
          if (lastCompletedStep) {
            const stepElement = document.getElementById(`step-${lastCompletedStep.id}`)
            if (stepElement) {
              const rect = stepElement.getBoundingClientRect()
              const absoluteTop = rect.top + window.scrollY
              const offset = Math.max(0, absoluteTop - 100) // Position with 100px margin above, but not negative
              window.scrollTo({
                top: offset,
                behavior: 'smooth',
              })
            }
          }
        }
      }, 200) // Small delay to ensure all elements are rendered and visible
    }
  }, [currentLearningPath, userProgress.role, isVisible])

  if (!currentLearningPath || !userProgress.role) {
    return null
  }

  const handleStartModule = (moduleId: string) => {
    // Navigate to the course detail page using the module slug, indicating we came from learning path
    router.push(`/courses/${moduleId}?from=learning-path`)
  }

  const handleResetPath = () => {
    resetProgress()
    setShowResetConfirm(false)
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div
        className={`mb-12 text-center transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 transform opacity-100' : 'translate-y-6 transform opacity-0'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex-1">
            <h2
              id="learning-path-title"
              className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl lg:flex lg:h-24 lg:items-center lg:justify-center lg:leading-tight"
            >
              {currentLearningPath.title}
            </h2>
          </div>
          <div className="flex flex-1 justify-end">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center space-x-2 rounded-xl border border-gray-300/50 bg-gray-100/80 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-200/90 dark:border-slate-600/50 dark:bg-slate-700/60 dark:text-gray-300 dark:hover:bg-slate-600/80"
              title="Reset learning path"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Path</span>
            </button>
          </div>
        </div>

        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300 lg:mx-auto lg:flex lg:h-14 lg:max-w-2xl lg:items-center lg:justify-center lg:leading-relaxed">
          {currentLearningPath.description}
        </p>
        <div className="inline-flex items-center space-x-2 rounded-full bg-purple-100/80 px-4 py-2 text-purple-700 dark:bg-slate-800/60 dark:text-purple-300">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            Total: {currentLearningPath.totalEstimatedTime}
          </span>
        </div>
      </div>

      {/* Learning Path Steps */}
      <div className="space-y-6">
        {currentLearningPath.steps
          .sort((a, b) => a.priority - b.priority)
          .map((step, index) => {
            const isCompleted = step.isCompleted
            const isCurrentNext = !isCompleted && step.isUnlocked
            const isLocked = !step.isUnlocked && !isCompleted
            const featureIcon = featureIcons[step.feature]
            const featureColor = featureColors[step.feature]

            return (
              <div
                key={step.id}
                id={`step-${step.id}`}
                style={{
                  transitionDelay: isVisible ? `${index * 80}ms` : '0ms',
                }}
                className={`duration-600 rounded-2xl border p-6 backdrop-blur-sm transition-all ease-out hover:scale-[1.01] ${
                  isVisible
                    ? 'translate-y-0 transform opacity-100'
                    : 'translate-y-8 transform opacity-0'
                } ${
                  isCompleted
                    ? 'border-emerald-300/60 bg-emerald-50/80 dark:border-emerald-500/40 dark:bg-emerald-900/20'
                    : isCurrentNext
                      ? 'border-purple-300/60 bg-purple-50/80 shadow-lg shadow-purple-400/20 dark:border-purple-500/40 dark:bg-purple-900/20 dark:shadow-purple-500/20'
                      : 'border-gray-300/40 bg-gray-50/80 dark:border-slate-600/30 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Step Number & Status */}
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrentNext
                            ? `bg-gradient-to-r ${featureColor} text-white`
                            : 'bg-gray-200/80 text-gray-500 dark:bg-slate-700/60 dark:text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : isLocked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{step.priority}</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`rounded-lg p-2 ${
                            isCompleted
                              ? 'bg-emerald-100/80 text-emerald-700'
                              : isCurrentNext
                                ? `bg-gradient-to-r ${featureColor} bg-opacity-10 text-current`
                                : 'bg-gray-100/80 text-gray-500 dark:bg-slate-700/40 dark:text-gray-400'
                          }`}
                        >
                          {featureIcon}
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-bold ${
                              isCompleted
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : isCurrentNext
                                  ? 'text-purple-700 dark:text-purple-300'
                                  : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p className={`text-sm ${'text-gray-600 dark:text-gray-400'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span className={`${'text-gray-600 dark:text-gray-400'}`}>
                          {step.estimatedTime}
                        </span>
                      </div>
                    </div>

                    {/* Outcomes */}
                    <div className="mb-4">
                      <h4
                        className={`mb-2 text-sm font-medium ${'text-gray-700 dark:text-gray-300'}`}
                      >
                        What you'll learn:
                      </h4>
                      <ul className="space-y-1">
                        {step.outcomes.map((outcome, outcomeIndex) => (
                          <li
                            key={outcomeIndex}
                            className={`flex items-start space-x-2 text-sm ${'text-gray-600 dark:text-gray-400'}`}
                          >
                            <Circle className="mt-1 h-3 w-3 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    {isCurrentNext && step.modules[0] && (
                      <button
                        onClick={() => handleStartModule(step.modules[0]!)}
                        className={`inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r px-6 py-3 font-medium shadow-lg transition-all duration-300 ease-out hover:scale-105 ${featureColor} text-white hover:shadow-xl`}
                      >
                        <span>Start Learning</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}

                    {isCompleted && (
                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                        <div className="inline-flex items-center space-x-2 rounded-lg bg-emerald-100/80 px-4 py-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                        {step.modules[0] && (
                          <button
                            onClick={() => handleStartModule(step.modules[0]!)}
                            className={`text-sm transition-all duration-300 hover:underline ${'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
                          >
                            Review course content →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* Progress Summary */}
      <div
        style={{
          transitionDelay: isVisible ? `${currentLearningPath.steps.length * 80 + 100}ms` : '0ms',
        }}
        className={`duration-600 mt-12 rounded-2xl border p-6 backdrop-blur-sm transition-all ease-out ${
          isVisible ? 'translate-y-0 transform opacity-100' : 'translate-y-8 transform opacity-0'
        } border-gray-300/40 bg-white/60 dark:border-slate-600/30 dark:bg-slate-900/40`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`mb-2 text-lg font-bold ${'text-gray-900 dark:text-white'}`}>
              Progress Overview
            </h3>
            <p className={`mb-3 text-sm ${'text-gray-600 dark:text-gray-400'}`}>
              {currentLearningPath.steps.filter(s => s.isCompleted).length} of{' '}
              {currentLearningPath.steps.length} features completed
            </p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className={`inline-flex items-center space-x-1 text-sm transition-colors duration-200 hover:underline ${'text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200'}`}
            >
              <RotateCcw className="h-3 w-3" />
              <span>Start over or switch persona</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-right ${'text-gray-700 dark:text-gray-300'}`}>
              <div className="text-2xl font-bold">
                {Math.round(
                  (currentLearningPath.steps.filter(s => s.isCompleted).length /
                    currentLearningPath.steps.length) *
                    100
                )}
                %
              </div>
              <div className="text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="w-full max-w-md transform rounded-2xl border border-gray-300/50 bg-white/95 p-6 transition-all dark:border-slate-600/50 dark:bg-slate-900/95">
              <div className="text-center">
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl ${'bg-orange-100/80 dark:bg-orange-900/30'}`}
                >
                  <RotateCcw className={`h-8 w-8 ${'text-orange-600 dark:text-orange-300'}`} />
                </div>

                <h3 className={`mb-4 text-xl font-bold ${'text-gray-900 dark:text-white'}`}>
                  Reset Learning Path?
                </h3>

                <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  This will reset your progress and return you to the persona selection. You'll be
                  able to choose a different role or restart your current path from the beginning.
                </p>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={handleResetPath}
                    className="inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/30"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Yes, Reset Path</span>
                  </button>

                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="inline-flex transform items-center space-x-2 rounded-xl border border-gray-300/50 bg-gray-100/80 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-200/90 dark:border-slate-600/50 dark:bg-slate-700/60 dark:text-gray-300 dark:hover:bg-slate-600/80"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonaPathDisplay
