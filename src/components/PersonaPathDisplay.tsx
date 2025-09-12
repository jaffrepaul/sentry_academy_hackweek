'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
// Theme handled automatically by Tailwind dark: classes
import { useRole } from '../contexts/RoleContext';
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
  Users
} from 'lucide-react';
import { SentryFeature } from '../types/roles';

// Map features to icons
const featureIcons: Record<SentryFeature, React.ReactNode> = {
  'error-tracking': <AlertTriangle className="w-5 h-5" />,
  'performance-monitoring': <BarChart3 className="w-5 h-5" />,
  'logging': <FileText className="w-5 h-5" />,
  'session-replay': <Play className="w-5 h-5" />,
  'distributed-tracing': <GitBranch className="w-5 h-5" />,
  'release-health': <Target className="w-5 h-5" />,
  'dashboards-alerts': <Bell className="w-5 h-5" />,
  'integrations': <Puzzle className="w-5 h-5" />,
  'user-feedback': <MessageSquare className="w-5 h-5" />,
  'seer-mcp': <Bot className="w-5 h-5" />,
  'custom-metrics': <TrendingUp className="w-5 h-5" />,
  'metrics-insights': <Presentation className="w-5 h-5" />,
  'stakeholder-reporting': <Users className="w-5 h-5" />
};

// Map features to colors
const featureColors: Record<SentryFeature, string> = {
  'error-tracking': 'from-red-500 to-orange-500',
  'performance-monitoring': 'from-blue-500 to-cyan-500',
  'logging': 'from-green-500 to-emerald-500',
  'session-replay': 'from-purple-500 to-violet-500',
  'distributed-tracing': 'from-indigo-500 to-blue-500',
  'release-health': 'from-pink-500 to-rose-500',
  'dashboards-alerts': 'from-yellow-500 to-orange-500',
  'integrations': 'from-teal-500 to-cyan-500',
  'user-feedback': 'from-violet-500 to-purple-500',
  'seer-mcp': 'from-emerald-500 to-teal-500',
  'custom-metrics': 'from-orange-500 to-red-500',
  'metrics-insights': 'from-purple-500 to-pink-500',
  'stakeholder-reporting': 'from-blue-500 to-purple-500'
};

const PersonaPathDisplay: React.FC = () => {
  // Theme handled automatically by Tailwind dark: classes;
  const { currentLearningPath, userProgress, resetProgress } = useRole();
  const router = useRouter();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Trigger entrance animation on component mount
  React.useEffect(() => {
    // Immediate entrance - no delay
    setIsVisible(true);
  }, []);

  // Handle escape key to close modal and prevent body scroll
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showResetConfirm) {
        setShowResetConfirm(false);
      }
    };

    if (showResetConfirm) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showResetConfirm]);

  // Handle scroll positioning when component mounts or updates
  React.useEffect(() => {
    if (currentLearningPath && userProgress.role && isVisible) {
      // Check if we should scroll to a specific position based on progress
      // This will help users see their current position in the learning path
      setTimeout(() => {
        const completedSteps = currentLearningPath.steps
          .filter(step => step.isCompleted)
          .sort((a, b) => b.priority - a.priority); // Sort by priority descending to get last completed

        if (completedSteps.length > 0) {
          // Position the last completed step with margin above
          const lastCompletedStep = completedSteps[0];
          const stepElement = document.getElementById(`step-${lastCompletedStep.id}`);
          if (stepElement) {
            const rect = stepElement.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            const offset = Math.max(0, absoluteTop - 100); // Position with 100px margin above, but not negative
            window.scrollTo({
              top: offset,
              behavior: 'smooth'
            });
          }
        }
      }, 200); // Small delay to ensure all elements are rendered and visible
    }
  }, [currentLearningPath, userProgress.role, isVisible]);

  if (!currentLearningPath || !userProgress.role) {
    return null;
  }

  const handleStartModule = (moduleId: string) => {
    // Navigate to the course detail page using the module slug
    router.push(`/courses/${moduleId}`);
  };

  const handleResetPath = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className={`text-center mb-12 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1" />
          <div className="flex-1">
            <h2 
              id="learning-path-title"
              className="text-3xl md:text-4xl font-bold mb-4 lg:leading-tight lg:h-24 lg:flex lg:items-center lg:justify-center text-gray-900 dark:text-white"
            >
              {currentLearningPath.title}
            </h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 bg-gray-100/80 text-gray-700 hover:bg-gray-200/90 border border-gray-300/50 dark:bg-slate-700/60 dark:text-gray-300 dark:hover:bg-slate-600/80 dark:border-slate-600/50"
              title="Reset learning path"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Path</span>
            </button>
          </div>
        </div>
        
        <p className="text-lg mb-6 lg:leading-relaxed lg:h-14 lg:flex lg:items-center lg:justify-center lg:max-w-2xl lg:mx-auto text-gray-600 dark:text-gray-300">
          {currentLearningPath.description}
        </p>
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-100/80 text-purple-700 dark:bg-slate-800/60 dark:text-purple-300">
          <Clock className="w-4 h-4" />
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
          const isCompleted = step.isCompleted;
          const isCurrentNext = !isCompleted && step.isUnlocked;
          const isLocked = !step.isUnlocked && !isCompleted;
          const featureIcon = featureIcons[step.feature];
          const featureColor = featureColors[step.feature];

          return (
            <div
              key={step.id}
              id={`step-${step.id}`}
              style={{ 
                transitionDelay: isVisible ? `${index * 80}ms` : '0ms' 
              }}
              className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-600 ease-out hover:scale-[1.01] ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              } ${
                isCompleted
                  ? 'bg-emerald-50/80 border-emerald-300/60 dark:bg-emerald-900/20 dark:border-emerald-500/40'
                  : isCurrentNext
                  ? 'bg-purple-50/80 border-purple-300/60 shadow-lg shadow-purple-400/20 dark:bg-purple-900/20 dark:border-purple-500/40 dark:shadow-purple-500/20'
                  : 'bg-gray-50/80 border-gray-300/40 dark:bg-slate-900/40 dark:border-slate-600/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Step Number & Status */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isCurrentNext
                      ? `bg-gradient-to-r ${featureColor} text-white`
                      : 'bg-gray-200/80 text-gray-500 dark:bg-slate-700/60 dark:text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{step.priority}</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isCompleted
                          ? 'bg-emerald-100/80 text-emerald-700'
                          : isCurrentNext
                          ? `bg-gradient-to-r ${featureColor} bg-opacity-10 text-current`
                          : 'bg-gray-100/80 text-gray-500 dark:bg-slate-700/40 dark:text-gray-400'
                      }`}>
                        {featureIcon}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${
                          isCompleted
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : isCurrentNext
                            ? 'text-purple-700 dark:text-purple-300'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm ${
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span className={`${
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {step.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mb-4">
                    <h4 className={`text-sm font-medium mb-2 ${
                      'text-gray-700 dark:text-gray-300'
                    }`}>
                      What you'll learn:
                    </h4>
                    <ul className="space-y-1">
                      {step.outcomes.map((outcome, outcomeIndex) => (
                        <li
                          key={outcomeIndex}
                          className={`text-sm flex items-start space-x-2 ${
                            'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <Circle className="w-3 h-3 mt-1 flex-shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  {isCurrentNext && (
                    <button
                      onClick={() => handleStartModule(step.modules[0])}
                      className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out transform hover:scale-105 shadow-lg bg-gradient-to-r ${featureColor} text-white hover:shadow-xl`}
                    >
                      <span>Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {isCompleted && (
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <button
                        onClick={() => handleStartModule(step.modules[0])}
                        className={`text-sm hover:underline transition-all duration-300 ${
                          'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        Review course content →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div 
        style={{ 
          transitionDelay: isVisible ? `${(currentLearningPath.steps.length) * 80 + 100}ms` : '0ms' 
        }}
        className={`mt-12 p-6 rounded-2xl backdrop-blur-sm border transition-all duration-600 ease-out ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        } bg-white/60 border-gray-300/40 dark:bg-slate-900/40 dark:border-slate-600/30`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold mb-2 ${
              'text-gray-900 dark:text-white'
            }`}>
              Progress Overview
            </h3>
            <p className={`text-sm mb-3 ${
              'text-gray-600 dark:text-gray-400'
            }`}>
              {currentLearningPath.steps.filter(s => s.isCompleted).length} of {currentLearningPath.steps.length} features completed
            </p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className={`text-sm inline-flex items-center space-x-1 hover:underline transition-colors duration-200 ${
                'text-orange-600 hover:text-orange-700 dark:text-orange-300 dark:hover:text-orange-200'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Start over or switch persona</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-right ${
              'text-gray-700 dark:text-gray-300'
            }`}>
              <div className="text-2xl font-bold">
                {Math.round((currentLearningPath.steps.filter(s => s.isCompleted).length / currentLearningPath.steps.length) * 100)}%
              </div>
              <div className="text-sm">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="max-w-md w-full rounded-2xl p-6 border bg-white/95 border-gray-300/50 dark:bg-slate-900/95 dark:border-slate-600/50"
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto ${
                'bg-orange-100/80 dark:bg-orange-900/30'
              }`}>
                <RotateCcw className={`w-8 h-8 ${
                  'text-orange-600 dark:text-orange-300'
                }`} />
              </div>
              
              <h3 className={`text-xl font-bold mb-4 ${
                'text-gray-900 dark:text-white'
              }`}>
                Reset Learning Path?
              </h3>
              
              <p className="text-sm mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                This will reset your progress and return you to the persona selection. 
                You'll be able to choose a different role or restart your current path from the beginning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button
                  onClick={handleResetPath}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30 inline-flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Yes, Reset Path</span>
                </button>
                
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2 bg-gray-100/80 text-gray-700 hover:bg-gray-200/90 border border-gray-300/50 dark:bg-slate-700/60 dark:text-gray-300 dark:hover:bg-slate-600/80 dark:border-slate-600/50"
                >
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaPathDisplay;