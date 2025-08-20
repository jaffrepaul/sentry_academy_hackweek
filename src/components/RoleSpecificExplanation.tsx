import React from 'react';
import { Lightbulb, Target, ArrowRight, User } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useNextContent } from '../hooks/useNextContent';
import { getRoleById } from '../data/roles';

interface RoleSpecificExplanationProps {
  moduleId: string;
  className?: string;
  showNextStepNudge?: boolean;
}

const RoleSpecificExplanation: React.FC<RoleSpecificExplanationProps> = ({ 
  moduleId, 
  className = '',
  showNextStepNudge = true 
}) => {
  const { userProgress, getRoleSpecificContent } = useRole();
  const { getPersonalizedContentForModule } = useNextContent();

  const roleInfo = userProgress.role ? getRoleById(userProgress.role) : null;
  const roleSpecificContent = getRoleSpecificContent(moduleId);
  const personalizedContent = getPersonalizedContentForModule(moduleId);

  if (!userProgress.role || (!roleSpecificContent && !personalizedContent)) {
    return null;
  }

  const explanation = roleSpecificContent?.explanation || personalizedContent?.roleSpecificExplanation;
  const whyRelevant = roleSpecificContent?.whyRelevant || personalizedContent?.whyRelevantToRole;
  const nextStepNudge = roleSpecificContent?.nextStepNudge || personalizedContent?.nextStepNudge;

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-900 dark:text-purple-100">
            For {roleInfo?.title}s
          </h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Personalized to your role
          </p>
        </div>
        <div className="ml-auto text-2xl">
          {roleInfo?.icon}
        </div>
      </div>

      {/* Role-Specific Explanation */}
      {explanation && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              What this means for you:
            </span>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed pl-6">
            {explanation}
          </p>
        </div>
      )}

      {/* Why Relevant */}
      {whyRelevant && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Why this matters:
            </span>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed pl-6">
            {whyRelevant}
          </p>
        </div>
      )}

      {/* Next Step Nudge */}
      {showNextStepNudge && nextStepNudge && (
        <div className="border-t border-purple-200 dark:border-purple-700 pt-4">
          <div className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100 block mb-1">
                What's next:
              </span>
              <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                {nextStepNudge}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Indicator */}
      {personalizedContent?.difficultyForRole && (
        <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-700 dark:text-purple-300">
              Difficulty for {roleInfo?.title}s:
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              personalizedContent.difficultyForRole === 'beginner' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : personalizedContent.difficultyForRole === 'intermediate'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              {personalizedContent.difficultyForRole}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSpecificExplanation;