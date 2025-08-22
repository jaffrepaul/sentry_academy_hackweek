import React, { useState, useEffect } from 'react';
import { 
  ContentGenerationRequest, 
  ResearchSourceConfig, 
  ResearchSource
} from '../types/aiGeneration';
import { EngineerRole } from '../types/roles';
import { 
  defaultResearchSources, 
  addGenerationRequest,
  getGenerationProgress,
  updateGenerationProgress
} from '../data/aiGeneratedCourses';
import { aiContentService } from '../services/aiContentService';
import { contentResearchEngine } from '../services/contentResearchEngine';

interface ContentGenerationFormProps {
  onGenerationStarted: () => void;
  onBack: () => void;
}

interface FormData {
  keywords: string[];
  selectedSources: ResearchSourceConfig[];
  targetRoles: EngineerRole[];
  contentType: 'beginner' | 'intermediate' | 'advanced';
  includeCodeExamples: boolean;
  includeScenarios: boolean;
  generateLearningPath: boolean;
}

const roleOptions: { id: EngineerRole; label: string; description: string; icon: string }[] = [
  {
    id: 'frontend',
    label: 'Frontend Developer',
    description: 'React, JavaScript, user experience',
    icon: '🎨'
  },
  {
    id: 'backend',
    label: 'Backend Engineer',
    description: 'APIs, databases, server-side',
    icon: '🔧'
  },
  {
    id: 'fullstack',
    label: 'Full-stack Developer',
    description: 'End-to-end development',
    icon: '🚀'
  },
  {
    id: 'sre',
    label: 'SRE/DevOps',
    description: 'Infrastructure, reliability',
    icon: '⚡'
  },
  {
    id: 'ai-ml',
    label: 'AI/ML Engineer',
    description: 'Machine learning, data pipelines',
    icon: '🤖'
  },
  {
    id: 'pm-manager',
    label: 'PM/Engineering Manager',
    description: 'Metrics, insights, team coordination',
    icon: '📊'
  }
];

const popularKeywords = [
  'profiling', 'insights', 'cron monitoring', 'uptime monitoring',
  'session replay', 'distributed tracing', 'alerts', 'dashboards',
  'release health', 'user feedback', 'logging', 'performance',
  'error tracking', 'integrations', 'custom metrics'
];

export const ContentGenerationForm: React.FC<ContentGenerationFormProps> = ({
  onGenerationStarted,
  onBack
}) => {
  const [formData, setFormData] = useState<FormData>({
    keywords: [],
    selectedSources: defaultResearchSources,
    targetRoles: [],
    contentType: 'intermediate',
    includeCodeExamples: true,
    includeScenarios: true,
    generateLearningPath: false
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{status: string, currentStep: string, progress: number, logs?: string[], error?: string} | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  // Poll for generation progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentRequestId && isGenerating) {
      interval = setInterval(() => {
        const progress = getGenerationProgress(currentRequestId);
        if (progress) {
          setGenerationProgress(progress);
          
          if (['review-needed', 'approved', 'rejected', 'error'].includes(progress.status)) {
            setIsGenerating(false);
            setCurrentRequestId(null);
            onGenerationStarted();
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentRequestId, isGenerating, onGenerationStarted]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }

    if (formData.targetRoles.length === 0) {
      newErrors.targetRoles = 'At least one target role is required';
    }

    if (formData.selectedSources.filter(s => s.enabled).length === 0) {
      newErrors.sources = 'At least one research source must be enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase();
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleAddPopularKeyword = (keyword: string) => {
    if (!formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
    }
  };

  const handleRoleToggle = (roleId: EngineerRole) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(roleId)
        ? prev.targetRoles.filter(r => r !== roleId)
        : [...prev.targetRoles, roleId]
    }));
  };

  const handleSourceToggle = (source: ResearchSource) => {
    setFormData(prev => ({
      ...prev,
      selectedSources: prev.selectedSources.map(s =>
        s.source === source ? { ...s, enabled: !s.enabled } : s
      )
    }));
  };

  const handleSourcePriorityChange = (source: ResearchSource, priority: number) => {
    setFormData(prev => ({
      ...prev,
      selectedSources: prev.selectedSources.map(s =>
        s.source === source ? { ...s, priority } : s
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsGenerating(true);
    setErrors({});

    try {
      // Create generation request
      const request: ContentGenerationRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        keywords: formData.keywords,
        selectedSources: formData.selectedSources.filter(s => s.enabled),
        targetRoles: formData.targetRoles,
        contentType: formData.contentType,
        includeCodeExamples: formData.includeCodeExamples,
        includeScenarios: formData.includeScenarios,
        generateLearningPath: formData.generateLearningPath,
        createdAt: new Date(),
        createdBy: 'admin' // In a real app, this would be the current user
      };

      // Add to store and start tracking
      addGenerationRequest(request);
      setCurrentRequestId(request.id);

      // Start research process
      updateGenerationProgress(request.id, {
        status: 'researching',
        currentStep: 'Starting content research',
        progress: 5,
        logs: ['Generation request created', 'Starting research phase']
      });

      // Trigger research (this will run in background)
      await contentResearchEngine.researchSentryContent(
        request.keywords,
        request.selectedSources,
        request.id
      );

      // Start AI generation
      const response = await aiContentService.startContentGeneration(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to start content generation');
      }

    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      setErrors({ submit: error instanceof Error ? error.message : 'Generation failed' });
      
      if (currentRequestId) {
        updateGenerationProgress(currentRequestId, {
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          logs: [`Error: ${error}`]
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      keywords: [],
      selectedSources: defaultResearchSources,
      targetRoles: [],
      contentType: 'intermediate',
      includeCodeExamples: true,
      includeScenarios: true,
      generateLearningPath: false
    });
    setKeywordInput('');
    setErrors({});
    setIsGenerating(false);
    setGenerationProgress(null);
    setCurrentRequestId(null);
  };

  if (isGenerating && generationProgress) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Generating Course Content</h2>
            <p className="text-gray-600 mt-2">
              Creating course content for: {formData.keywords.join(', ')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{generationProgress.currentStep}</span>
              <span>{generationProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${generationProgress.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              generationProgress.status === 'error' 
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {generationProgress.status.replace('-', ' ')}
            </span>
          </div>

          {/* Logs */}
          {generationProgress.logs && generationProgress.logs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Progress Log</h3>
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                {generationProgress.logs.slice(-5).map((log: string, index: number) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {generationProgress.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{generationProgress.error}</p>
            </div>
          )}

          {/* Cancel Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsGenerating(false);
                setCurrentRequestId(null);
                resetForm();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel Generation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generate AI Course Content</h2>
            <p className="text-gray-600 mt-1">
              Create comprehensive course content by researching Sentry resources
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Keywords Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sentry Concepts & Keywords *
            </label>
            
            {/* Keyword Input */}
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="Enter a Sentry concept (e.g., profiling, insights)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Popular Keywords */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Popular keywords:</p>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map(keyword => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => handleAddPopularKeyword(keyword)}
                    disabled={formData.keywords.includes(keyword)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.keywords.includes(keyword)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Keywords */}
            {formData.keywords.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Selected keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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

            {errors.keywords && (
              <p className="text-sm text-red-600 mt-1">{errors.keywords}</p>
            )}
          </div>

          {/* Target Roles Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Engineer Roles *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {roleOptions.map(role => (
                <div
                  key={role.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.targetRoles.includes(role.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRoleToggle(role.id);
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
              <p className="text-sm text-red-600 mt-1">{errors.targetRoles}</p>
            )}
          </div>

          {/* Content Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Configuration
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Skill Level</label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    contentType: e.target.value as 'beginner' | 'intermediate' | 'advanced' 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Beginner - New to Sentry</option>
                  <option value="intermediate">Intermediate - Some Sentry experience</option>
                  <option value="advanced">Advanced - Experienced with Sentry</option>
                </select>
              </div>

              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeCodeExamples}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeCodeExamples: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include code examples</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.includeScenarios}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeScenarios: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include scenarios</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.generateLearningPath}
                    onChange={(e) => setFormData(prev => ({ ...prev, generateLearningPath: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Research Sources
                </label>
                <div className="space-y-3">
                  {formData.selectedSources.map(sourceConfig => (
                    <div key={sourceConfig.source} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={sourceConfig.enabled}
                          onChange={() => handleSourceToggle(sourceConfig.source)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {sourceConfig.source.replace('https://', '').replace('/', '')}
                          </p>
                          <p className="text-sm text-gray-600">{sourceConfig.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Priority:</label>
                        <select
                          value={sourceConfig.priority}
                          onChange={(e) => handleSourcePriorityChange(sourceConfig.source, parseInt(e.target.value))}
                          disabled={!sourceConfig.enabled}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {[1, 2, 3, 4, 5].map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.sources && (
                  <p className="text-sm text-red-600 mt-2">{errors.sources}</p>
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset Form
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate Course Content'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};