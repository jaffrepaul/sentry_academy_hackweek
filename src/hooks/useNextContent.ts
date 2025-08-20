import { useMemo } from 'react';
import { useRole } from '../contexts/RoleContext';
import { getNextContentRecommendation, getPersonalizedContent } from '../utils/recommendations';
import { NextContentRecommendation, PersonalizedContent } from '../types/roles';

/**
 * Hook for getting personalized content recommendations
 * 
 * Returns:
 * - nextRecommendation: The next content the user should consume
 * - personalizedContent: Role-specific explanations for a given module
 * - hasNextContent: Whether there is more content available
 * - refreshRecommendations: Function to recalculate recommendations
 */
export function useNextContent() {
  const { userProgress, currentLearningPath } = useRole();

  // Calculate next content recommendation
  const nextRecommendation = useMemo(() => {
    return getNextContentRecommendation(userProgress);
  }, [userProgress.role, userProgress.completedSteps, userProgress.completedModules]);

  // Check if there's more content available
  const hasNextContent = useMemo(() => {
    if (!currentLearningPath || !userProgress.role) return false;
    
    // Check if all steps are completed
    const allStepsCompleted = currentLearningPath.steps.every(step =>
      userProgress.completedSteps.includes(step.id)
    );
    
    return !allStepsCompleted;
  }, [currentLearningPath, userProgress.completedSteps]);

  // Function to get personalized content for a specific module
  const getPersonalizedContentForModule = (moduleId: string): PersonalizedContent | null => {
    if (!userProgress.role) return null;
    
    return getPersonalizedContent(
      moduleId,
      userProgress.role,
      userProgress.completedModules
    );
  };

  // Get personalized content for the current recommendation
  const currentPersonalizedContent = useMemo(() => {
    if (!nextRecommendation) return null;
    
    return getPersonalizedContentForModule(nextRecommendation.moduleId);
  }, [nextRecommendation, userProgress.role, userProgress.completedModules]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!currentLearningPath) return 0;
    
    const totalSteps = currentLearningPath.steps.length;
    const completedSteps = userProgress.completedSteps.length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  }, [currentLearningPath, userProgress.completedSteps]);

  // Get remaining steps count
  const remainingSteps = useMemo(() => {
    if (!currentLearningPath) return 0;
    
    return currentLearningPath.steps.length - userProgress.completedSteps.length;
  }, [currentLearningPath, userProgress.completedSteps]);

  // Get all upcoming recommendations (next 3 items)
  const upcomingRecommendations = useMemo(() => {
    if (!currentLearningPath || !userProgress.role) return [];
    
    const recommendations: NextContentRecommendation[] = [];
    
    // Find uncompleted steps
    const uncompletedSteps = currentLearningPath.steps.filter(step =>
      !userProgress.completedSteps.includes(step.id)
    );
    
    // Get next few modules from uncompleted steps
    for (const step of uncompletedSteps.slice(0, 3)) {
      const uncompletedModules = step.modules.filter(moduleId =>
        !userProgress.completedModules.includes(moduleId)
      );
      
      if (uncompletedModules.length > 0) {
        recommendations.push({
          moduleId: uncompletedModules[0],
          stepId: step.id,
          priority: 1,
          reasoning: `Part of ${step.title}`,
          timeEstimate: step.estimatedTime
        });
      }
    }
    
    return recommendations;
  }, [currentLearningPath, userProgress.completedSteps, userProgress.completedModules]);

  return {
    nextRecommendation,
    personalizedContent: currentPersonalizedContent,
    hasNextContent,
    progressPercentage,
    remainingSteps,
    upcomingRecommendations,
    getPersonalizedContentForModule
  };
}

/**
 * Hook specifically for getting recommendations for the current user's path
 */
export function usePathRecommendations() {
  const { currentLearningPath, userProgress } = useRole();
  
  const pathProgress = useMemo(() => {
    if (!currentLearningPath) return null;
    
    return currentLearningPath.steps.map(step => ({
      ...step,
      isCompleted: userProgress.completedSteps.includes(step.id),
      completedModules: step.modules.filter(moduleId =>
        userProgress.completedModules.includes(moduleId)
      ),
      progress: step.modules.filter(moduleId =>
        userProgress.completedModules.includes(moduleId)
      ).length / step.modules.length
    }));
  }, [currentLearningPath, userProgress.completedSteps, userProgress.completedModules]);
  
  return {
    pathProgress,
    totalSteps: currentLearningPath?.steps.length || 0,
    completedSteps: userProgress.completedSteps.length,
    currentLearningPath
  };
}