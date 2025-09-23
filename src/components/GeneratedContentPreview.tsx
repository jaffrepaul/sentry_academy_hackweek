import React, { useState } from 'react'
import { AIGeneratedCourse } from '@/types/aiGeneration'
import { Course } from '@/data/courses'
import { EngineerRole } from '@/types/roles'
import { aiGeneratedCoursesStore } from '@/data/aiGeneratedCourses'

interface GeneratedContentPreviewProps {
  course: AIGeneratedCourse
  comparisonCourse?: Course
  onClose: () => void
  onApprove: (course: AIGeneratedCourse) => void
  onReject: (course: AIGeneratedCourse, reason: string) => void
  onEdit?: (course: AIGeneratedCourse) => void
}

type PreviewTab = 'overview' | 'modules' | 'personalizations' | 'validation' | 'comparison'

export const GeneratedContentPreview: React.FC<GeneratedContentPreviewProps> = ({
  course,
  comparisonCourse,
  onClose,
  onApprove,
  onReject,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('overview')
  const [selectedRole, setSelectedRole] = useState<EngineerRole>(
    course.rolePersonalizations[0]?.roleId || 'frontend'
  )
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  // Mock validation result - in a real app this would come from the course validation
  const validationResult = {
    is_valid: course.qualityScore > 0.7,
    score: course.qualityScore,
    issues: [],
    suggestions: [],
  }

  const handleApprove = () => {
    const updatedCourse = {
      ...course,
      approvedAt: new Date(),
      approvedBy: 'admin', // In a real app, this would be the current user
    }

    // Update the course
    aiGeneratedCoursesStore.updateCourse(course.id, updatedCourse)

    // Update the generation progress status to "approved"
    aiGeneratedCoursesStore.updateGenerationProgress(course.generationRequest.id, {
      status: 'approved',
      currentStep: 'Course approved and published',
      progress: 100,
      logs: [`Course approved by admin at ${new Date().toISOString()}`],
    })

    onApprove(updatedCourse)
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return

    // Update the course with rejection notes
    aiGeneratedCoursesStore.updateCourse(course.id, {
      reviewNotes: rejectReason,
    })

    // Update the generation progress status to "rejected"
    aiGeneratedCoursesStore.updateGenerationProgress(course.generationRequest.id, {
      status: 'rejected',
      currentStep: 'Course rejected by admin',
      progress: 100,
      logs: [`Course rejected by admin: ${rejectReason}`],
    })

    onReject(course, rejectReason)
    setShowRejectDialog(false)
    setRejectReason('')
  }

  const getQualityScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSeverityColor = (severity: string): string => {
    const colors = {
      low: 'text-blue-600 bg-blue-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100',
    }
    return colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  }

  const renderTabs = () => (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'modules', label: 'Modules', icon: '📚' },
          { id: 'personalizations', label: 'Role Personalizations', icon: '👥' },
          { id: 'validation', label: 'Validation', icon: '✅' },
          ...(comparisonCourse ? [{ id: 'comparison', label: 'Comparison', icon: '⚖️' }] : []),
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PreviewTab)}
            className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">{course.title}</h2>
            <p className="mb-4 text-gray-700">{course.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                {course.level}
              </span>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                {course.duration}
              </span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                {course.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getQualityScoreColor(course.qualityScore)}`}
            >
              Quality: {(course.qualityScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Generation Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">Generation Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Keywords:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {course.generationRequest.keywords.map(keyword => (
                  <span
                    key={keyword}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Target Roles:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {course.generationRequest.targetRoles.map(role => (
                  <span key={role} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Generated:</span>
              <span className="ml-2 text-gray-900">{course.generatedAt.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 font-semibold text-gray-900">Research Sources</h3>
          <div className="space-y-2">
            {course.researchSources.slice(0, 5).map((source, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="flex-1 truncate text-gray-700" title={source.title}>
                  {source.title}
                </span>
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    source.relevanceScore > 0.7
                      ? 'bg-green-100 text-green-700'
                      : source.relevanceScore > 0.5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {(source.relevanceScore * 100).toFixed(0)}%
                </span>
              </div>
            ))}
            {course.researchSources.length > 5 && (
              <p className="text-xs text-gray-500">
                +{course.researchSources.length - 5} more sources
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Synthesized Content Summary */}
      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-3 font-semibold text-gray-900">Content Summary</h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
          <div>
            <h4 className="mb-2 font-medium text-gray-700">Key Concepts</h4>
            <ul className="space-y-1">
              {course.synthesizedContent.mainConcepts
                .slice(0, 4)
                .map((concept: string, index: number) => (
                  <li key={index} className="text-gray-600">
                    • {concept}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-gray-700">Best Practices</h4>
            <ul className="space-y-1">
              {course.synthesizedContent.bestPractices
                .slice(0, 4)
                .map((practice: string, index: number) => (
                  <li key={index} className="text-gray-600">
                    • {practice}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-gray-700">Use Cases</h4>
            <ul className="space-y-1">
              {course.synthesizedContent.useCases
                .slice(0, 4)
                .map((useCase: string, index: number) => (
                  <li key={index} className="text-gray-600">
                    • {useCase}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Course Modules ({course.generatedModules.length})
        </h3>
        <span className="text-sm text-gray-600">Total estimated time: {course.duration}</span>
      </div>

      {course.generatedModules.map((module: any, index: number) => (
        <div key={module.id} className="rounded-lg border bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h4 className="mb-2 text-lg font-semibold text-gray-900">
                {index + 1}. {module.title}
              </h4>
              <p className="mb-3 text-gray-700">{module.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>⏱️ {module.duration}</span>
                <span
                  className={`rounded px-2 py-1 text-xs ${getQualityScoreColor(module.confidence)}`}
                >
                  Confidence: {(module.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mb-4">
            <h5 className="mb-2 font-medium text-gray-900">Key Takeaways</h5>
            <ul className="space-y-1">
              {module.key_takeaways.map((takeaway: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700">
                  • {takeaway}
                </li>
              ))}
            </ul>
          </div>

          {/* Scenario */}
          {module.scenario && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <h5 className="mb-2 font-medium text-blue-900">💼 Scenario</h5>
              <p className="text-sm text-blue-800">{module.scenario}</p>
            </div>
          )}

          {/* Code Example */}
          {module.codeExample && (
            <div className="mb-4">
              <h5 className="mb-2 font-medium text-gray-900">💻 Code Example</h5>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-sm text-gray-100">
                <code>{module.codeExample}</code>
              </pre>
            </div>
          )}

          {/* Content Config */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {module.contentConfig.hasHandsOn && <span>✋ Hands-on</span>}
            {module.contentConfig.hasScenario && <span>📝 Scenario-based</span>}
            {module.contentConfig.hasCodeExample && <span>💻 Code examples</span>}
            <span>📖 {module.contentConfig.estimatedReadingTime} min read</span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderPersonalizations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Role Personalizations</h3>
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value as EngineerRole)}
          className="rounded border border-gray-300 px-3 py-1 text-sm"
        >
          {course.rolePersonalizations.map(rp => (
            <option key={rp.roleId} value={rp.roleId}>
              {rp.roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {course.rolePersonalizations
        .filter(rp => rp.roleId === selectedRole)
        .map(personalization => (
          <div key={personalization.roleId} className="rounded-lg border bg-white p-6">
            <div className="mb-4">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {personalization.roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span
                className={`ml-2 rounded px-2 py-1 text-xs ${
                  personalization.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-700'
                    : personalization.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {personalization.difficulty}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-gray-900">📖 Explanation</h4>
                <p className="text-gray-700">{personalization.explanation}</p>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-900">🎯 Why It's Relevant</h4>
                <p className="text-gray-700">{personalization.whyRelevant}</p>
              </div>

              <div>
                <h4 className="mb-2 font-medium text-gray-900">➡️ Next Steps</h4>
                <p className="text-gray-700">{personalization.nextStepNudge}</p>
              </div>

              {personalization.roleSpecificExamples.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">💡 Role-Specific Examples</h4>
                  <ul className="space-y-1">
                    {personalization.roleSpecificExamples.map((example: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {personalization.roleSpecificUseCases.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">🔧 Use Cases</h4>
                  <ul className="space-y-1">
                    {personalization.roleSpecificUseCases.map((useCase: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )

  const renderValidation = () => (
    <div className="space-y-6">
      {validationResult && (
        <>
          {/* Overall Score */}
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
              <div
                className={`rounded-lg px-4 py-2 font-medium ${
                  validationResult.is_valid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {validationResult.is_valid ? '✅ Valid' : '❌ Needs Improvement'}
              </div>
            </div>

            <div className="mb-4 flex items-center space-x-4">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-sm text-gray-600">
                  <span>Overall Score</span>
                  <span>{(validationResult.score * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      validationResult.score >= 0.8
                        ? 'bg-green-500'
                        : validationResult.score >= 0.6
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${validationResult.score * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues */}
          {validationResult.issues.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h4 className="mb-4 font-semibold text-gray-900">
                Issues Found ({validationResult.issues.length})
              </h4>
              <div className="space-y-3">
                {validationResult.issues.map((issue: any, index: number) => (
                  <div key={index} className="border-l-4 border-orange-400 pl-4">
                    <div className="mb-1 flex items-center space-x-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${getSeverityColor(issue.severity)}`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-sm text-gray-600">{issue.type}</span>
                    </div>
                    <p className="font-medium text-gray-900">{issue.message}</p>
                    {issue.field && <p className="text-sm text-gray-600">Field: {issue.field}</p>}
                    {issue.suggestedFix && (
                      <p className="mt-1 text-sm text-blue-600">💡 {issue.suggestedFix}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {validationResult.suggestions.length > 0 && (
            <div className="rounded-lg border bg-white p-6">
              <h4 className="mb-4 font-semibold text-gray-900">Improvement Suggestions</h4>
              <ul className="space-y-2">
                {validationResult.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="mt-1 text-blue-500">💡</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )

  const renderComparison = () =>
    comparisonCourse ? (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Comparison with Similar Course</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* AI Generated Course */}
          <div className="rounded-lg border bg-white p-6">
            <h4 className="mb-4 font-semibold text-blue-900">🤖 AI Generated Course</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <p className="text-gray-900">{course.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-600">{course.description}</p>
              </div>
              <div className="flex space-x-4">
                <span>
                  <strong>Duration:</strong> {course.duration}
                </span>
                <span>
                  <strong>Level:</strong> {course.level}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Modules:</span>
                <span className="ml-2">{course.generatedModules.length}</span>
              </div>
            </div>
          </div>

          {/* Existing Course */}
          <div className="rounded-lg border bg-white p-6">
            <h4 className="mb-4 font-semibold text-gray-900">📚 Existing Course</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Title:</span>
                <p className="text-gray-900">{comparisonCourse.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-600">{comparisonCourse.description}</p>
              </div>
              <div className="flex space-x-4">
                <span>
                  <strong>Duration:</strong> {comparisonCourse.duration}
                </span>
                <span>
                  <strong>Level:</strong> {comparisonCourse.level}
                </span>
              </div>
              <div className="flex space-x-4">
                <span>
                  <strong>Rating:</strong> {comparisonCourse.rating}
                </span>
                <span>
                  <strong>Students:</strong> {comparisonCourse.students.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-yellow-50 p-4">
          <h5 className="mb-2 font-medium text-yellow-800">📊 Analysis</h5>
          <ul className="space-y-1 text-sm text-yellow-700">
            <li>• The AI-generated course provides more detailed module breakdown</li>
            <li>• Content includes role-specific personalizations not found in existing course</li>
            <li>• Generated content incorporates recent Sentry features and best practices</li>
            <li>• May complement existing course or serve as advanced follow-up content</li>
          </ul>
        </div>
      </div>
    ) : (
      <div className="py-8 text-center">
        <p className="text-gray-600">No comparison course available</p>
      </div>
    )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'modules':
        return renderModules()
      case 'personalizations':
        return renderPersonalizations()
      case 'validation':
        return renderValidation()
      case 'comparison':
        return renderComparison()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Course Preview</h1>
          <p className="text-sm text-gray-600">Review and approve AI-generated content</p>
        </div>
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }}
          className="p-2 text-gray-400 transition-colors hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6">{renderTabs()}</div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6">{renderContent()}</div>

      {/* Footer Actions */}
      <div className="border-t bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {onEdit && (
              <button
                onClick={() => onEdit(course)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={e => {
                e.preventDefault()
                setShowRejectDialog(true)
              }}
              className="rounded-lg border border-red-300 px-4 py-2 text-red-700 transition-colors hover:bg-red-50"
            >
              ❌ Reject
            </button>
            <button
              onClick={e => {
                e.preventDefault()
                handleApprove()
              }}
              className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
            >
              ✅ Approve & Publish
            </button>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          style={{ zIndex: 10000 }}
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Reject Course</h3>
            <p className="mb-4 text-gray-600">
              Please provide a reason for rejecting this course content:
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Explain why this content needs improvement..."
              className="h-24 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={e => {
                  e.preventDefault()
                  setShowRejectDialog(false)
                }}
                className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={e => {
                  e.preventDefault()
                  handleReject()
                }}
                disabled={!rejectReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
