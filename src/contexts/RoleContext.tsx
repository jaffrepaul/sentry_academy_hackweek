import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EngineerRole, UserProgress, LearningPath, LearningPathStep, NextContentRecommendation } from '../types/roles';
import { getLearningPathForRole, getPersonalizationForRole } from '../data/roles';

interface RoleContextType {
  userProgress: UserProgress;
  currentLearningPath: LearningPath | null;
  currentStep: LearningPathStep | null;
  setUserRole: (role: EngineerRole) => void;
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

  // Simple next recommendation logic
  const getNextRecommendation = (): NextContentRecommendation | null => {
    if (!userProgress.role || !currentLearningPath) return null;

    // Find the next step that hasn't been completed
    const nextStep = currentLearningPath.steps.find(step => 
      !userProgress.completedSteps.includes(step.id)
    );

    if (!nextStep) return null;

    // Find the next module within the step that hasn't been completed
    const nextModule = nextStep.modules.find(moduleId => 
      !userProgress.completedModules.includes(moduleId)
    );

    if (!nextModule) return null;

    return {
      moduleId: nextModule,
      stepId: nextStep.id,
      priority: 1,
      reasoning: `Continue your ${userProgress.role} learning path with ${nextModule}`,
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