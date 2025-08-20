import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EngineerRole, UserProgress, LearningPath, LearningPathStep, NextContentRecommendation } from '../types/roles';
import { getLearningPathForRole, getPersonalizationForRole } from '../data/roles';
import { getNextContentRecommendation, updateProgressAfterCompletion } from '../utils/recommendations';

interface RoleContextType {
  userProgress: UserProgress;
  currentLearningPath: LearningPath | null;
  currentStep: LearningPathStep | null;
  setUserRole: (role: EngineerRole) => void;
  completeStep: (stepId: string) => void;
  completeModule: (moduleId: string) => void;
  unlockNextStep: () => void;
  resetProgress: () => void;
  completeOnboarding: () => void;
  getRoleSpecificContent: (moduleId: string) => {
    explanation: string;
    whyRelevant: string;
    nextStepNudge: string;
  } | null;
  getNextRecommendations: () => NextContentRecommendation | null;
  markOnboardingComplete: () => void;
  shouldShowOnboarding: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'sentry-academy-user-progress';

const defaultUserProgress: UserProgress = {
  role: null,
  currentStep: 0,
  completedSteps: [],
  completedModules: [],
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

  const setUserRole = (role: EngineerRole) => {
    const learningPath = getLearningPathForRole(role);
    if (learningPath) {
      setCurrentLearningPath(learningPath);
      setUserProgress(prev => ({
        ...prev,
        role,
        currentStep: 0,
        completedSteps: [],
        completedModules: []
      }));
    }
  };

  const completeStep = (stepId: string) => {
    setUserProgress(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, stepId]
    }));
  };

  const completeModule = (moduleId: string) => {
    setUserProgress(prev => {
      // Use the algorithm from recommendations.ts for proper progress tracking
      return updateProgressAfterCompletion(prev, moduleId);
    });
  };

  const unlockNextStep = () => {
    if (currentLearningPath && userProgress.currentStep < currentLearningPath.steps.length - 1) {
      setUserProgress(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    }
  };

  const resetProgress = () => {
    setUserProgress(defaultUserProgress);
    setCurrentLearningPath(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const completeOnboarding = () => {
    setUserProgress(prev => ({
      ...prev,
      onboardingCompleted: true
    }));
  };

  const getRoleSpecificContent = (moduleId: string) => {
    if (!userProgress.role) return null;
    
    const personalization = getPersonalizationForRole(userProgress.role);
    return personalization?.contentAdaptations[moduleId] || null;
  };

  const getNextRecommendations = () => {
    return getNextContentRecommendation(userProgress);
  };

  const markOnboardingComplete = () => {
    setUserProgress(prev => ({
      ...prev,
      hasSeenOnboarding: true,
      onboardingCompleted: true,
      lastActiveDate: new Date()
    }));
  };

  const shouldShowOnboarding = () => {
    return !userProgress.hasSeenOnboarding || !userProgress.role;
  };

  const currentStep = currentLearningPath?.steps[userProgress.currentStep] || null;

  const contextValue: RoleContextType = {
    userProgress,
    currentLearningPath,
    currentStep,
    setUserRole,
    completeStep,
    completeModule,
    unlockNextStep,
    resetProgress,
    completeOnboarding,
    getRoleSpecificContent,
    getNextRecommendations,
    markOnboardingComplete,
    shouldShowOnboarding
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