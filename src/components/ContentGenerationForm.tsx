import React, { useState, useEffect } from 'react'
import {
  ContentGenerationRequest,
  ResearchSourceConfig,
  ResearchSource,
} from '@/types/aiGeneration'
import { EngineerRole } from '@/types/roles'
import {
  defaultResearchSources,
  addGenerationRequest,
  getGenerationProgress,
  updateGenerationProgress,
} from '@/data/aiGeneratedCourses'
import { aiContentService } from '@/services/aiContentService'
import { contentResearchEngine } from '@/services/contentResearchEngine'

interface ContentGenerationFormProps {
  onGenerationStarted: () => void
  onBack: () => void
}

interface FormData {
  keywords: string[]
  selectedSources: ResearchSourceConfig[]
  targetRoles: EngineerRole[]
  includeCodeExamples: boolean
  includeScenarios: boolean
  generateLearningPath: boolean
}

const roleOptions: { id: EngineerRole; label: string; description: string; icon: string }[] = [
  {
    id: 'frontend',
    label: 'Frontend Developer',
    description: 'React, JavaScript, user experience',
    icon: '🎨',
  },
  {
    id: 'backend',
    label: 'Backend Engineer',
    description: 'APIs, databases, server-side',
    icon: '🔧',
  },
  {
    id: 'fullstack',
    label: 'Full-stack Developer',
    description: 'End-to-end development',
    icon: '🚀',
  },
  {
    id: 'sre',
    label: 'SRE/DevOps',
    description: 'Infrastructure, reliability',
    icon: '⚡',
  },
  {
    id: 'ai-ml',
    label: 'AI/ML Engineer',
    description: 'Machine learning, data pipelines',
    icon: '🤖',
  },
  {
    id: 'pm-manager',
    label: 'PM/Engineering Manager',
    description: 'Metrics, insights, team coordination',
    icon: '📊',
  },
]

export const ContentGenerationForm: React.FC<ContentGenerationFormProps> = ({
  onGenerationStarted,
  onBack,
}) => {
  const [formData, setFormData] = useState<FormData>({
    keywords: [],
    selectedSources: defaultResearchSources,
    targetRoles: [],
    includeCodeExamples: true,
    includeScenarios: true,
    generateLearningPath: false,
  })

  const [keywordInput, setKeywordInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<{
    status: string
    currentStep: string
    progress: number
    logs?: string[]
    error?: string
  } | null>(null)
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null)

  // Poll for generation progress
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (currentRequestId && isGenerating) {
      interval = setInterval(() => {
        const progress = getGenerationProgress(currentRequestId)
        if (progress) {
          setGenerationProgress(progress)

          if (['review-needed', 'approved', 'rejected', 'error'].includes(progress.status)) {
            console.log('ContentGenerationForm: Generation completed with status:', progress.status)
            setIsGenerating(false)
            setCurrentRequestId(null)
            onGenerationStarted()
          }
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentRequestId, isGenerating, onGenerationStarted])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required'
    }

    if (formData.targetRoles.length === 0) {
      newErrors.targetRoles = 'At least one target role is required'
    }

    if (formData.selectedSources.filter(s => s.enabled).length === 0) {
      newErrors.sources = 'At least one research source must be enabled'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase()
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword],
      }))
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }))
  }

  const handleRoleToggle = (roleId: EngineerRole) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(roleId)
        ? prev.targetRoles.filter(r => r !== roleId)
        : [...prev.targetRoles, roleId],
    }))
  }

  const handleSourceToggle = (source: ResearchSource) => {
    setFormData(prev => ({
      ...prev,
      selectedSources: prev.selectedSources.map(s =>
        s.source === source ? { ...s, enabled: !s.enabled } : s
      ),
    }))
  }

  const handleSourcePriorityChange = (source: ResearchSource, priority: number) => {
    setFormData(prev => ({
      ...prev,
      selectedSources: prev.selectedSources.map(s =>
        s.source === source ? { ...s, priority } : s
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsGenerating(true)
    setErrors({})

    try {
      // Create generation request
      const request: ContentGenerationRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        keywords: formData.keywords,
        selectedSources: formData.selectedSources.filter(s => s.enabled),
        targetRoles: formData.targetRoles,
        includeCodeExamples: formData.includeCodeExamples,
        includeScenarios: formData.includeScenarios,
        generateLearningPath: formData.generateLearningPath,
        createdAt: new Date(),
        createdBy: 'admin', // In a real app, this would be the current user
      }

      // Add to store and start tracking
      addGenerationRequest(request)
      setCurrentRequestId(request.id)

      // Start research process
      updateGenerationProgress(request.id, {
        status: 'researching',
        currentStep: 'Starting content research',
        progress: 5,
        logs: ['Generation request created', 'Starting research phase'],
      })

      // Trigger research (this will run in background)
      await contentResearchEngine.researchSentryContent(
        request.keywords,
        request.selectedSources,
        request.id
      )

      // Start AI generation
      const response = await aiContentService.startContentGeneration(request)

      if (!response.success) {
        throw new Error(response.error || 'Failed to start content generation')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setIsGenerating(false)
      setErrors({ submit: error instanceof Error ? error.message : 'Generation failed' })

      if (currentRequestId) {
        updateGenerationProgress(currentRequestId, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          logs: [`Error: ${error}`],
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      keywords: [],
      selectedSources: defaultResearchSources,
      targetRoles: [],
      includeCodeExamples: true,
      includeScenarios: true,
      generateLearningPath: false,
    })
    setKeywordInput('')
    setErrors({})
    setIsGenerating(false)
    setGenerationProgress(null)
    setCurrentRequestId(null)
  }

  if (isGenerating && generationProgress) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Generating Course Content</h2>
            <p className="mt-2 text-gray-600">
              Creating course content for: {formData.keywords.join(', ')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>{generationProgress.currentStep}</span>
              <span>{generationProgress.progress}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${generationProgress.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                generationProgress.status === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {generationProgress.status.replace('-', ' ')}
            </span>
          </div>

          {/* Logs */}
          {generationProgress.logs && generationProgress.logs.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Progress Log</h3>
              <div className="max-h-40 overflow-y-auto rounded-lg bg-gray-50 p-3">
                {generationProgress.logs.slice(-5).map((log: string, index: number) => (
                  <div key={index} className="mb-1 text-sm text-gray-600">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {generationProgress.error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{generationProgress.error}</p>
            </div>
          )}

          {/* Cancel Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsGenerating(false)
                setCurrentRequestId(null)
                resetForm()
              }}
              className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
            >
              Cancel Generation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generate AI Course Content</h2>
            <p className="mt-1 text-gray-600">
              Create comprehensive course content by researching Sentry resources
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Keywords Section */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Sentry Concepts & Keywords *
            </label>

            {/* Keyword Input */}
            <div className="mb-3 flex space-x-2">
              <input
                type="text"
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="Enter a Sentry concept (e.g., profiling, insights)"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Selected Keywords */}
            {formData.keywords.length > 0 && (
              <div>
                <p className="mb-2 text-sm text-gray-600">Selected keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {errors.keywords && <p className="mt-1 text-sm text-red-600">{errors.keywords}</p>}
          </div>

          {/* Target Roles Section */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Target Engineer Roles *
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {roleOptions.map(role => (
                <div
                  key={role.id}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                    formData.targetRoles.includes(role.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={e => {
                    e.preventDefault()
                    handleRoleToggle(role.id)
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{role.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{role.label}</p>
                      <p className="text-xs text-gray-600">{role.description}</p>
                    </div>
                    {formData.targetRoles.includes(role.id) && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {errors.targetRoles && (
              <p className="mt-1 text-sm text-red-600">{errors.targetRoles}</p>
            )}
          </div>

          {/* Content Configuration */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Content Configuration
            </label>
            <div className="space-y-4">
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeCodeExamples}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, includeCodeExamples: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include code examples</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeScenarios}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, includeScenarios: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include scenarios</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.generateLearningPath}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, generateLearningPath: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Generate learning path</span>
                </label>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <span>{showAdvanced ? '▼' : '▶'}</span>
              <span>Advanced Research Settings</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Research Sources
                </label>
                <div className="space-y-3">
                  {formData.selectedSources.map(sourceConfig => (
                    <div
                      key={sourceConfig.source}
                      className="flex items-center justify-between rounded border bg-white p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={sourceConfig.enabled}
                          onChange={() => handleSourceToggle(sourceConfig.source)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {sourceConfig.source.replace('https://', '').replace(/\/$/, '')}
                          </p>
                          <p className="text-sm text-gray-600">{sourceConfig.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Priority:</label>
                        <select
                          value={sourceConfig.priority}
                          onChange={e =>
                            handleSourcePriorityChange(
                              sourceConfig.source,
                              parseInt(e.target.value)
                            )
                          }
                          disabled={!sourceConfig.enabled}
                          className={`min-w-[50px] rounded border px-2 py-1 text-sm ${
                            !sourceConfig.enabled
                              ? 'border-gray-200 bg-gray-50 text-gray-400'
                              : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          }`}
                        >
                          {Array.from(
                            { length: defaultResearchSources.length },
                            (_, i) => i + 1
                          ).map(priority => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.sources && <p className="mt-2 text-sm text-red-600">{errors.sources}</p>}
              </div>
            )}
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t pt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
            >
              Reset Form
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Course Content'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
