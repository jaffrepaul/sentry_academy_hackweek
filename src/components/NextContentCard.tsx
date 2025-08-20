import React from 'react';
import { ArrowRight, Clock, Target, Lightbulb } from 'lucide-react';
import { NextContentRecommendation, PersonalizedContent } from '../types/roles';
import { useRole } from '../contexts/RoleContext';

interface NextContentCardProps {
  recommendation: NextContentRecommendation;
  personalizedContent?: PersonalizedContent | null;
  className?: string;
  onStartLearning?: (moduleId: string) => void;
}

const NextContentCard: React.FC<NextContentCardProps> = ({ 
  recommendation, 
  personalizedContent,
  className = '',
  onStartLearning 
}) => {
  const { userProgress } = useRole();

  const handleStartLearning = () => {
    if (onStartLearning) {
      onStartLearning(recommendation.moduleId);
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (priority >= 5) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'High Priority';
    if (priority >= 5) return 'Medium Priority';
    return 'Recommended';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 
      shadow-sm hover:shadow-md transition-all duration-200 p-6 ${className}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Next Recommended
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Module: {recommendation.moduleId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
            {getPriorityLabel(recommendation.priority)}
          </span>
          {personalizedContent && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(personalizedContent.difficultyForRole)}`}>
              {personalizedContent.difficultyForRole}
            </span>
          )}
        </div>
      </div>

      {/* Time Estimate */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Estimated time: {recommendation.timeEstimate}
        </span>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {recommendation.reasoning}
        </p>
      </div>

      {/* Role-Specific Content */}
      {personalizedContent && (
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
          {/* Why Relevant */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Why this matters for {userProgress.role} engineers:
              </span>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
              {personalizedContent.whyRelevantToRole}
            </p>
          </div>

          {/* Next Step Nudge */}
          {personalizedContent.nextStepNudge && (
            <div className="border-t border-purple-200 dark:border-purple-700 pt-3">
              <p className="text-xs text-purple-700 dark:text-purple-300 italic">
                💡 {personalizedContent.nextStepNudge}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleStartLearning}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg 
                 font-medium transition-colors duration-200 flex items-center justify-center gap-2
                 hover:shadow-lg transform hover:scale-[1.02]"
      >
        <span>Start Learning</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Step Context */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Part of step: {recommendation.stepId}
        </p>
      </div>
    </div>
  );
};

export default NextContentCard;