import React from 'react';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useNextContent, usePathRecommendations } from '../hooks/useNextContent';
import PathProgress from './PathProgress';
import NextContentCard from './NextContentCard';
import { getRoleById } from '../data/roles';

interface PersonalizedPathProps {
  className?: string;
  onStartLearning?: (moduleId: string) => void;
}

const PersonalizedPath: React.FC<PersonalizedPathProps> = ({ 
  className = '',
  onStartLearning 
}) => {
  const { userProgress, currentLearningPath } = useRole();
  const { nextRecommendation, personalizedContent, progressPercentage, remainingSteps } = useNextContent();
  const { pathProgress } = usePathRecommendations();

  const roleInfo = userProgress.role ? getRoleById(userProgress.role) : null;

  if (!userProgress.role || !currentLearningPath || !pathProgress) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-8 text-center ${className}`}>
        <div className="text-gray-500 dark:text-gray-400">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Learning Path Selected</h3>
          <p className="text-sm">
            Complete the onboarding to get your personalized learning path.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{roleInfo?.icon}</div>
            <div>
              <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {currentLearningPath.title}
              </h2>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {currentLearningPath.description}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {progressPercentage}%
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300">
              Complete
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Completed
              </span>
            </div>
            <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
              {userProgress.completedSteps.length}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Remaining
              </span>
            </div>
            <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
              {remainingSteps}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                Total Time
              </span>
            </div>
            <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
              {currentLearningPath.totalEstimatedTime}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Next Recommendation */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recommended Next
          </h3>
          
          {nextRecommendation ? (
            <NextContentCard
              recommendation={nextRecommendation}
              personalizedContent={personalizedContent}
              onStartLearning={onStartLearning}
            />
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
              <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Congratulations! 🎉
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                You've completed your {roleInfo?.title} learning path. 
                Great job mastering the essentials!
              </p>
            </div>
          )}
        </div>

        {/* Path Progress */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Learning Path Progress
          </h3>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <PathProgress 
              steps={pathProgress}
              currentStepIndex={userProgress.currentStep}
            />
          </div>
        </div>
      </div>

      {/* Path Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About Your Learning Path
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              What You'll Learn
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentLearningPath.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Your Role Focus
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {roleInfo?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedPath;