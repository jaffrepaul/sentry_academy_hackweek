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

  // Smart Sentry-based recommendation logic
  const getNextRecommendation = (): NextContentRecommendation | null => {
    if (!userProgress.role) return null;

    const completedModules = userProgress.completedModules;

    // EVERYONE starts with Sentry Fundamentals - the foundation of error tracking
    if (!completedModules.includes('sentry-fundamentals')) {
      return {
        moduleId: 'sentry-fundamentals',
        stepId: 'foundation',
        priority: 10,
        reasoning: 'Start with Sentry Fundamentals to learn error tracking - the core of application monitoring',
        timeEstimate: '45 minutes'
      };
    }

    // After fundamentals, recommend based on role
    switch (userProgress.role) {
      case 'frontend':
        // Frontend: Fundamentals → Performance (Core Web Vitals) → Session Replay
        if (!completedModules.includes('performance-monitoring')) {
          return {
            moduleId: 'performance-monitoring',
            stepId: 'frontend-performance',
            priority: 9,
            reasoning: 'Learn performance monitoring to track Core Web Vitals and optimize user experience',
            timeEstimate: '1 hour'
          };
        }
        if (!completedModules.includes('react-error-boundaries')) {
          return {
            moduleId: 'react-error-boundaries',
            stepId: 'frontend-debugging',
            priority: 8,
            reasoning: 'Master Session Replay to see exactly what users experienced during errors',
            timeEstimate: '45 minutes'
          };
        }
        break;

      case 'backend':
        // Backend: Fundamentals → Node.js Integration → Performance/Tracing → Dashboards
        if (!completedModules.includes('nodejs-integration')) {
          return {
            moduleId: 'nodejs-integration',
            stepId: 'backend-integration',
            priority: 9,
            reasoning: 'Set up Sentry in your Node.js services to capture server-side errors and exceptions',
            timeEstimate: '1 hour'
          };
        }
        if (!completedModules.includes('performance-monitoring')) {
          return {
            moduleId: 'performance-monitoring',
            stepId: 'backend-performance',
            priority: 8,
            reasoning: 'Add distributed tracing to track requests across your microservices and find bottlenecks',
            timeEstimate: '1.5 hours'
          };
        }
        if (!completedModules.includes('custom-dashboards')) {
          return {
            moduleId: 'custom-dashboards',
            stepId: 'backend-monitoring',
            priority: 7,
            reasoning: 'Create dashboards to monitor API performance and set up proactive alerts',
            timeEstimate: '1 hour'
          };
        }
        break;

      case 'sre':
        // SRE: Fundamentals → Node.js (infrastructure) → Performance/Tracing → Dashboards/Alerts → Team Workflows
        if (!completedModules.includes('nodejs-integration')) {
          return {
            moduleId: 'nodejs-integration',
            stepId: 'sre-infrastructure',
            priority: 9,
            reasoning: 'Set up Sentry across your infrastructure to aggregate errors from all services',
            timeEstimate: '1 hour'
          };
        }
        if (!completedModules.includes('performance-monitoring')) {
          return {
            moduleId: 'performance-monitoring',
            stepId: 'sre-tracing',
            priority: 8,
            reasoning: 'Implement distributed tracing to understand request flows across your entire system',
            timeEstimate: '1.5 hours'
          };
        }
        if (!completedModules.includes('custom-dashboards')) {
          return {
            moduleId: 'custom-dashboards',
            stepId: 'sre-dashboards',
            priority: 7,
            reasoning: 'Build infrastructure health dashboards and integrate with your existing monitoring stack',
            timeEstimate: '1 hour'
          };
        }
        if (!completedModules.includes('team-workflows')) {
          return {
            moduleId: 'team-workflows',
            stepId: 'sre-workflows',
            priority: 6,
            reasoning: 'Set up automated alerting and integrate with PagerDuty/Slack for incident response',
            timeEstimate: '45 minutes'
          };
        }
        break;

      case 'fullstack':
        // Full-stack: Fundamentals → React (frontend) → Node.js (backend) → Performance → Workflows
        if (!completedModules.includes('react-error-boundaries')) {
          return {
            moduleId: 'react-error-boundaries',
            stepId: 'fullstack-frontend',
            priority: 9,
            reasoning: 'Set up React error boundaries to catch frontend errors and see user interactions',
            timeEstimate: '45 minutes'
          };
        }
        if (!completedModules.includes('nodejs-integration')) {
          return {
            moduleId: 'nodejs-integration',
            stepId: 'fullstack-backend',
            priority: 8,
            reasoning: 'Add Sentry to your backend to connect frontend and backend errors for complete visibility',
            timeEstimate: '1 hour'
          };
        }
        if (!completedModules.includes('performance-monitoring')) {
          return {
            moduleId: 'performance-monitoring',
            stepId: 'fullstack-performance',
            priority: 7,
            reasoning: 'Monitor performance across your entire stack from user clicks to database queries',
            timeEstimate: '1.5 hours'
          };
        }
        if (!completedModules.includes('team-workflows')) {
          return {
            moduleId: 'team-workflows',
            stepId: 'fullstack-workflows',
            priority: 6,
            reasoning: 'Set up release monitoring to catch regressions across your entire stack',
            timeEstimate: '45 minutes'
          };
        }
        break;
    }

    // If all core modules are done, suggest advanced topics
    if (!completedModules.includes('custom-dashboards') && completedModules.length >= 3) {
      return {
        moduleId: 'custom-dashboards',
        stepId: 'advanced',
        priority: 5,
        reasoning: 'Create custom dashboards to get deeper insights into your application performance',
        timeEstimate: '1 hour'
      };
    }

    // All done!
    return null;
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