import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
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
  const { isDark } = useTheme();
  const { currentLearningPath, userProgress, resetProgress } = useRole();
  const navigate = useNavigate();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showResetConfirm) {
        setShowResetConfirm(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showResetConfirm]);

  if (!currentLearningPath || !userProgress.role) {
    return null;
  }

  const handleStartModule = (moduleId: string) => {
    navigate(`/course/${moduleId}`, { state: { from: 'learning-paths' } });
  };

  const handleResetPath = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1" />
          <div className="flex-1">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {currentLearningPath.title}
            </h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setShowResetConfirm(true)}
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isDark
                  ? 'bg-slate-700/60 text-gray-300 hover:bg-slate-600/80 border border-slate-600/50'
                  : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/90 border border-gray-300/50'
              }`}
              title="Reset learning path"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Path</span>
            </button>
          </div>
        </div>
        
        <p className={`text-lg mb-6 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {currentLearningPath.description}
        </p>
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
          isDark 
            ? 'bg-slate-800/60 text-purple-300' 
            : 'bg-purple-100/80 text-purple-700'
        }`}>
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
              className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                isCompleted
                  ? isDark
                    ? 'bg-emerald-900/20 border-emerald-500/40'
                    : 'bg-emerald-50/80 border-emerald-300/60'
                  : isCurrentNext
                  ? isDark
                    ? 'bg-purple-900/20 border-purple-500/40 shadow-lg shadow-purple-500/20'
                    : 'bg-purple-50/80 border-purple-300/60 shadow-lg shadow-purple-400/20'
                  : isDark
                  ? 'bg-slate-900/40 border-slate-600/30'
                  : 'bg-gray-50/80 border-gray-300/40'
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
                      : isDark
                      ? 'bg-slate-700/60 text-gray-400'
                      : 'bg-gray-200/80 text-gray-500'
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
                          : isDark
                          ? 'bg-slate-700/40 text-gray-400'
                          : 'bg-gray-100/80 text-gray-500'
                      }`}>
                        {featureIcon}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${
                          isCompleted
                            ? isDark ? 'text-emerald-300' : 'text-emerald-700'
                            : isCurrentNext
                            ? isDark ? 'text-purple-300' : 'text-purple-700'
                            : isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span className={`${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {step.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mb-4">
                    <h4 className={`text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      What you'll learn:
                    </h4>
                    <ul className="space-y-1">
                      {step.outcomes.map((outcome, outcomeIndex) => (
                        <li
                          key={outcomeIndex}
                          className={`text-sm flex items-start space-x-2 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
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
                      className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg bg-gradient-to-r ${featureColor} text-white hover:shadow-xl`}
                    >
                      <span>Start Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {isCompleted && (
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        isDark
                          ? 'bg-emerald-900/30 text-emerald-300'
                          : 'bg-emerald-100/80 text-emerald-700'
                      }`}>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <button
                        onClick={() => handleStartModule(step.modules[0])}
                        className={`text-sm hover:underline transition-colors duration-200 ${
                          isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
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
      <div className={`mt-12 p-6 rounded-2xl backdrop-blur-sm border ${
        isDark
          ? 'bg-slate-900/40 border-slate-600/30'
          : 'bg-white/60 border-gray-300/40'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Progress Overview
            </h3>
            <p className={`text-sm mb-3 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {currentLearningPath.steps.filter(s => s.isCompleted).length} of {currentLearningPath.steps.length} features completed
            </p>
            <button
              onClick={() => setShowResetConfirm(true)}
              className={`text-sm inline-flex items-center space-x-1 hover:underline transition-colors duration-200 ${
                isDark ? 'text-orange-300 hover:text-orange-200' : 'text-orange-600 hover:text-orange-700'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Start over or switch persona</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-right ${
              isDark ? 'text-gray-300' : 'text-gray-700'
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 border ${
            isDark
              ? 'bg-slate-900/95 border-slate-600/50'
              : 'bg-white/95 border-gray-300/50'
          }`}>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto ${
                isDark ? 'bg-orange-900/30' : 'bg-orange-100/80'
              }`}>
                <RotateCcw className={`w-8 h-8 ${
                  isDark ? 'text-orange-300' : 'text-orange-600'
                }`} />
              </div>
              
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Reset Learning Path?
              </h3>
              
              <p className={`text-sm mb-6 leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
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
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2 ${
                    isDark
                      ? 'bg-slate-700/60 text-gray-300 hover:bg-slate-600/80 border border-slate-600/50'
                      : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/90 border border-gray-300/50'
                  }`}
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