'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EngineerRole, UserProgress, LearningPath, LearningPathStep, NextContentRecommendation } from '../types/roles';
import { getLearningPathForRole, getPersonalizationForRole } from '../data/roles';

interface RoleContextType {
  userProgress: UserProgress;
  currentLearningPath: LearningPath | null;
  currentStep: LearningPathStep | null;
  setUserRole: (role: EngineerRole, selectedFeatures?: string[]) => void;
  completeModule: (moduleId: string) => void;
  resetProgress: () => void;
  getNextRecommendation: () => NextContentRecommendation | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'sentry-academy-user-progress';

const defaultUserProgress: UserProgress = {
  role: null,
  currentStep: 0,
  completedSteps: [],
  completedModules: [],
  completedFeatures: [],
  onboardingCompleted: false,
  lastActiveDate: new Date(),
  preferredContentType: 'mixed',
  hasSeenOnboarding: false
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultUserProgress);
  const [currentLearningPath, setCurrentLearningPath] = useState<LearningPath | null>(null);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setUserProgress(parsed);
        if (parsed.role) {
          const path = getLearningPathForRole(parsed.role);
          setCurrentLearningPath(path || null);
        }
      } catch (error) {
        console.error('Failed to parse saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
  }, [userProgress]);

  const setUserRole = (role: EngineerRole, selectedFeatures: string[] = []) => {
    const learningPath = getLearningPathForRole(role);
    if (learningPath) {
      // Map selected features to completed features and modules
      const completedModules: string[] = [];
      const completedFeatures: string[] = [];
      const completedStepIds: string[] = [];
      
      // If user selected ANY feature other than error-tracking, or explicitly selected error-tracking,
      // we assume they have basic Sentry setup and thus error tracking is complete
      const hasOtherFeatures = selectedFeatures.length > 0 && 
        (selectedFeatures.includes('error-tracking') || 
         selectedFeatures.some(f => f !== 'error-tracking'));
         
      if (hasOtherFeatures) {
        completedFeatures.push('error-tracking');
        // For different roles, error tracking means different starting modules
        if (role === 'frontend') {
          completedModules.push('sentry-fundamentals');
          completedStepIds.push('frontend-error-tracking');
        } else if (role === 'backend') {
          completedModules.push('nodejs-integration');
          completedStepIds.push('backend-error-tracking');
        } else if (role === 'sre') {
          completedModules.push('nodejs-integration');
          completedStepIds.push('sre-error-tracking');
        } else if (role === 'ai-ml') {
          completedModules.push('nodejs-integration');
          completedStepIds.push('ai-ml-error-tracking');
        } else if (role === 'fullstack') {
          completedModules.push('sentry-fundamentals');
          completedStepIds.push('fullstack-error-tracking');
        } else if (role === 'pm-manager') {
          // PM/Manager doesn't have an error tracking step since they focus on metrics insights
          // but we still mark the feature as understood
        }
      }
      if (selectedFeatures.includes('performance-monitoring')) {
        completedFeatures.push('performance-monitoring');
        completedModules.push('performance-monitoring');
        // Add corresponding step IDs based on role
        if (role === 'frontend') completedStepIds.push('frontend-performance');
        else if (role === 'backend') completedStepIds.push('backend-performance');
        else if (role === 'fullstack') completedStepIds.push('fullstack-performance');
        else if (role === 'sre') completedStepIds.push('sre-performance-tracing');
        else if (role === 'ai-ml') completedStepIds.push('ai-ml-performance');
      }
      if (selectedFeatures.includes('session-replay')) {
        completedFeatures.push('session-replay');
        completedModules.push('react-error-boundaries');
        if (role === 'frontend') completedStepIds.push('frontend-session-replay');
        else if (role === 'fullstack') completedStepIds.push('fullstack-session-replay');
      }
      if (selectedFeatures.includes('logging')) {
        completedFeatures.push('logging');
        completedModules.push('react-error-boundaries'); // Using this as logging course placeholder
        if (role === 'frontend') completedStepIds.push('frontend-logging');
        else if (role === 'backend') completedStepIds.push('backend-logging');
        else if (role === 'fullstack') completedStepIds.push('fullstack-logging');
        else if (role === 'sre') completedStepIds.push('sre-logging');
        else if (role === 'ai-ml') completedStepIds.push('ai-ml-logging');
      }
      if (selectedFeatures.includes('distributed-tracing')) {
        completedFeatures.push('distributed-tracing');
        completedModules.push('distributed-tracing');
        if (role === 'backend') completedStepIds.push('backend-distributed-tracing');
        else if (role === 'fullstack') completedStepIds.push('fullstack-distributed-tracing');
        else if (role === 'sre') completedStepIds.push('sre-performance-tracing');
        else if (role === 'ai-ml') completedStepIds.push('ai-ml-distributed-tracing');
      }
      if (selectedFeatures.includes('release-health')) {
        completedFeatures.push('release-health');
        completedModules.push('release-health');
        if (role === 'backend') completedStepIds.push('backend-release-health');
        else if (role === 'sre') completedStepIds.push('sre-release-health');
      }
      if (selectedFeatures.includes('dashboards-alerts')) {
        completedFeatures.push('dashboards-alerts');
        completedModules.push('custom-dashboards');
        if (role === 'frontend') completedStepIds.push('frontend-dashboards-alerts');
        else if (role === 'backend') completedStepIds.push('backend-dashboards-alerts');
        else if (role === 'fullstack') completedStepIds.push('fullstack-dashboards-alerts');
        else if (role === 'sre') completedStepIds.push('sre-dashboards');
        else if (role === 'ai-ml') completedStepIds.push('ai-ml-dashboards-alerts');
      }
      if (selectedFeatures.includes('integrations')) {
        completedFeatures.push('integrations');
        completedModules.push('team-workflows');
        if (role === 'frontend') completedStepIds.push('frontend-integrations');
        else if (role === 'sre') completedStepIds.push('sre-integrations');
      }
      if (selectedFeatures.includes('user-feedback')) {
        completedFeatures.push('user-feedback');
        completedModules.push('user-feedback');
        if (role === 'frontend') completedStepIds.push('frontend-user-feedback');
      }
      if (selectedFeatures.includes('seer-mcp')) {
        completedFeatures.push('seer-mcp');
        completedModules.push('seer-mcp');
        if (role === 'ai-ml') completedStepIds.push('ai-ml-seer-mcp');
      }
      if (selectedFeatures.includes('custom-metrics')) {
        completedFeatures.push('custom-metrics');
        completedModules.push('custom-metrics');
        if (role === 'ai-ml') completedStepIds.push('ai-ml-custom-metrics');
      }
      if (selectedFeatures.includes('metrics-insights')) {
        completedFeatures.push('metrics-insights');
        completedModules.push('metrics-insights');
        if (role === 'pm-manager') completedStepIds.push('pm-understanding-metrics');
      }
      if (selectedFeatures.includes('stakeholder-reporting')) {
        completedFeatures.push('stakeholder-reporting');
        completedModules.push('stakeholder-dashboards');
        if (role === 'pm-manager') completedStepIds.push('pm-stakeholder-reporting');
      }

      // Create updated learning path with completed steps marked and proper unlocking
      const updatedPath = {
        ...learningPath,
        steps: learningPath.steps.map((step) => {
          const isCompleted = completedStepIds.includes(step.id);
          const isFirstIncompleteStep = !isCompleted && 
            learningPath.steps
              .filter(s => s.priority < step.priority)
              .every(s => completedStepIds.includes(s.id));
          
          return {
            ...step,
            isCompleted,
            isUnlocked: isCompleted || isFirstIncompleteStep || step.priority === 1
          };
        })
      };
      
      setCurrentLearningPath(updatedPath);

      setUserProgress(prev => ({
        ...prev,
        role,
        currentStep: 0,
        completedSteps: completedStepIds,
        completedModules,
        completedFeatures,
        lastActiveDate: new Date()
      }));
    }
  };

  const completeModule = (moduleId: string) => {
    setUserProgress(prev => {
      const newCompletedModules = [...prev.completedModules];
      if (!newCompletedModules.includes(moduleId)) {
        newCompletedModules.push(moduleId);
      }
      return {
        ...prev,
        completedModules: newCompletedModules,
        lastActiveDate: new Date()
      };
    });
  };

  const resetProgress = () => {
    setUserProgress(defaultUserProgress);
    setCurrentLearningPath(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Feature-based recommendation logic using the new persona-specific learning paths
  const getNextRecommendation = (): NextContentRecommendation | null => {
    if (!userProgress.role || !currentLearningPath) return null;

    // Find the next uncompleted step in priority order that is also unlocked
    const nextStep = currentLearningPath.steps
      .filter(step => !step.isCompleted && step.isUnlocked)
      .sort((a, b) => a.priority - b.priority)[0];

    if (!nextStep) return null; // All steps completed or no unlocked steps

    // Get the primary module for this step
    const primaryModule = nextStep.modules[0];
    
    return {
      moduleId: primaryModule,
      stepId: nextStep.id,
      priority: nextStep.priority,
      reasoning: nextStep.description,
      timeEstimate: nextStep.estimatedTime
    };
  };

  const currentStep = currentLearningPath?.steps[userProgress.currentStep] || null;

  const contextValue: RoleContextType = {
    userProgress,
    currentLearningPath,
    currentStep,
    setUserRole,
    completeModule,
    resetProgress,
    getNextRecommendation
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};