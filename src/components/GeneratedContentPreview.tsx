import React, { useState } from 'react';
import { 
  AIGeneratedCourse
} from '@/types/aiGeneration';
import { Course } from '@/data/courses';
import { EngineerRole } from '@/types/roles';
import { aiGeneratedCoursesStore } from '@/data/aiGeneratedCourses';

interface GeneratedContentPreviewProps {
  course: AIGeneratedCourse;
  comparisonCourse?: Course;
  onClose: () => void;
  onApprove: (course: AIGeneratedCourse) => void;
  onReject: (course: AIGeneratedCourse, reason: string) => void;
  onEdit?: (course: AIGeneratedCourse) => void;
}

type PreviewTab = 'overview' | 'modules' | 'personalizations' | 'comparison';

export const GeneratedContentPreview: React.FC<GeneratedContentPreviewProps> = ({
  course,
  comparisonCourse,
  onClose,
  onApprove,
  onReject,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('overview');
  const [selectedRole, setSelectedRole] = useState<EngineerRole>(course.rolePersonalizations[0]?.roleId || 'frontend');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');




  const handleApprove = () => {
    const updatedCourse = {
      ...course,
      approvedAt: new Date(),
      approvedBy: 'admin' // In a real app, this would be the current user
    };
    
    // Update the course
    aiGeneratedCoursesStore.updateCourse(course.id, updatedCourse);
    
    // Update the generation progress status to "approved"
    aiGeneratedCoursesStore.updateGenerationProgress(course.generationRequest.id, {
      status: 'approved',
      currentStep: 'Course approved and published',
      progress: 100,
      logs: [`Course approved by admin at ${new Date().toISOString()}`]
    });
    

    
    onApprove(updatedCourse);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    
    // Update the course with rejection notes
    aiGeneratedCoursesStore.updateCourse(course.id, {
      reviewNotes: rejectReason
    });
    
    // Update the generation progress status to "rejected"
    aiGeneratedCoursesStore.updateGenerationProgress(course.generationRequest.id, {
      status: 'rejected',
      currentStep: 'Course rejected by admin',
      progress: 100,
      logs: [`Course rejected by admin: ${rejectReason}`]
    });
    
    onReject(course, rejectReason);
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const getQualityScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string): string => {
    const colors = {
      'low': 'text-blue-600 bg-blue-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'high': 'text-orange-600 bg-orange-100',
      'critical': 'text-red-600 bg-red-100'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const renderTabs = () => (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'modules', label: 'Modules', icon: '📚' },
          { id: 'personalizations', label: 'Role Personalizations', icon: '👥' },

          ...(comparisonCourse ? [{ id: 'comparison', label: 'Comparison', icon: '⚖️' }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PreviewTab)}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {course.level}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {course.duration}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {course.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getQualityScoreColor(course.qualityScore)}`}>
              Quality: {(course.qualityScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Generation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 border rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Generation Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Keywords:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {course.generationRequest.keywords.map(keyword => (
                  <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Target Roles:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {course.generationRequest.targetRoles.map(role => (
                  <span key={role} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
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

        <div className="bg-white p-4 border rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Research Sources</h3>
          <div className="space-y-2">
            {course.researchSources.slice(0, 5).map((source, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 truncate flex-1" title={source.title}>
                  {source.title}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  source.relevanceScore > 0.7 ? 'bg-green-100 text-green-700' :
                  source.relevanceScore > 0.5 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
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
      <div className="bg-white p-4 border rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Content Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Key Concepts</h4>
            <ul className="space-y-1">
              {course.synthesizedContent.mainConcepts.slice(0, 4).map((concept, index) => (
                <li key={index} className="text-gray-600">• {concept}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Best Practices</h4>
            <ul className="space-y-1">
              {course.synthesizedContent.bestPractices.slice(0, 4).map((practice, index) => (
                <li key={index} className="text-gray-600">• {practice}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Use Cases</h4>
            <ul className="space-y-1">
              {course.synthesizedContent.useCases.slice(0, 4).map((useCase, index) => (
                <li key={index} className="text-gray-600">• {useCase}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Course Modules ({course.generatedModules.length})
        </h3>
        <span className="text-sm text-gray-600">
          Total estimated time: {course.duration}
        </span>
      </div>

      {course.generatedModules.map((module, index) => (
        <div key={module.id} className="bg-white p-6 border rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {index + 1}. {module.title}
              </h4>
              <p className="text-gray-700 mb-3">{module.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>⏱️ {module.duration}</span>
                <span className={`px-2 py-1 rounded text-xs ${getQualityScoreColor(module.confidence)}`}>
                  Confidence: {(module.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Key Takeaways</h5>
            <ul className="space-y-1">
              {module.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="text-gray-700 text-sm">• {takeaway}</li>
              ))}
            </ul>
          </div>

          {/* Scenario */}
          {module.scenario && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">💼 Scenario</h5>
              <p className="text-blue-800 text-sm">{module.scenario}</p>
            </div>
          )}

          {/* Code Example */}
          {module.codeExample && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">💻 Code Example</h5>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
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
  );

  const renderPersonalizations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Role Personalizations</h3>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as EngineerRole)}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
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
          <div key={personalization.roleId} className="bg-white p-6 border rounded-lg">
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {personalization.roleId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                personalization.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                personalization.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {personalization.difficulty}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📖 Explanation</h4>
                <p className="text-gray-700">{personalization.explanation}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎯 Why It's Relevant</h4>
                <p className="text-gray-700">{personalization.whyRelevant}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">➡️ Next Steps</h4>
                <p className="text-gray-700">{personalization.nextStepNudge}</p>
              </div>

              {personalization.roleSpecificExamples.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">💡 Role-Specific Examples</h4>
                  <ul className="space-y-1">
                    {personalization.roleSpecificExamples.map((example, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">• {example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {personalization.roleSpecificUseCases.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">🔧 Use Cases</h4>
                  <ul className="space-y-1">
                    {personalization.roleSpecificUseCases.map((useCase, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">• {useCase}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  const renderValidation = () => (
    <div className="space-y-6">
      {validationResult && (
        <>
          {/* Overall Score */}
          <div className="bg-white p-6 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
              <div className={`px-4 py-2 rounded-lg font-medium ${
                validationResult.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {validationResult.isValid ? '✅ Valid' : '❌ Needs Improvement'}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Overall Score</span>
                  <span>{(validationResult.score * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      validationResult.score >= 0.8 ? 'bg-green-500' :
                      validationResult.score >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${validationResult.score * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues */}
          {validationResult.issues.length > 0 && (
            <div className="bg-white p-6 border rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Issues Found ({validationResult.issues.length})</h4>
              <div className="space-y-3">
                {validationResult.issues.map((issue, index) => (
                  <div key={index} className="border-l-4 border-orange-400 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className="text-sm text-gray-600">{issue.type}</span>
                    </div>
                    <p className="text-gray-900 font-medium">{issue.message}</p>
                    {issue.field && (
                      <p className="text-sm text-gray-600">Field: {issue.field}</p>
                    )}
                    {issue.suggestedFix && (
                      <p className="text-sm text-blue-600 mt-1">💡 {issue.suggestedFix}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {validationResult.suggestions.length > 0 && (
            <div className="bg-white p-6 border rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Improvement Suggestions</h4>
              <ul className="space-y-2">
                {validationResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">💡</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderComparison = () => (
    comparisonCourse ? (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Comparison with Similar Course</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Generated Course */}
          <div className="bg-white p-6 border rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4">🤖 AI Generated Course</h4>
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
                <span><strong>Duration:</strong> {course.duration}</span>
                <span><strong>Level:</strong> {course.level}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Modules:</span>
                <span className="ml-2">{course.generatedModules.length}</span>
              </div>
            </div>
          </div>

          {/* Existing Course */}
          <div className="bg-white p-6 border rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4">📚 Existing Course</h4>
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
                <span><strong>Duration:</strong> {comparisonCourse.duration}</span>
                <span><strong>Level:</strong> {comparisonCourse.level}</span>
              </div>
              <div className="flex space-x-4">
                <span><strong>Rating:</strong> {comparisonCourse.rating}</span>
                <span><strong>Students:</strong> {comparisonCourse.students.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h5 className="font-medium text-yellow-800 mb-2">📊 Analysis</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• The AI-generated course provides more detailed module breakdown</li>
            <li>• Content includes role-specific personalizations not found in existing course</li>
            <li>• Generated content incorporates recent Sentry features and best practices</li>
            <li>• May complement existing course or serve as advanced follow-up content</li>
          </ul>
        </div>
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-600">No comparison course available</p>
      </div>
    )
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'modules':
        return renderModules();
      case 'personalizations':
        return renderPersonalizations();

      case 'comparison':
        return renderComparison();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Course Preview</h1>
          <p className="text-gray-600 text-sm">Review and approve AI-generated content</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6">
        {renderTabs()}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        {renderContent()}
      </div>

      {/* Footer Actions */}
      <div className="border-t p-6 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            {onEdit && (
              <button
                onClick={() => onEdit(course)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ✏️ Edit
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowRejectDialog(true);
              }}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              ❌ Reject
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleApprove();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ✅ Approve & Publish
            </button>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Course</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this course content:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this content needs improvement..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowRejectDialog(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleReject();
                }}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};