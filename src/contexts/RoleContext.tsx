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
      setCurrentLearningPath(learningPath);
      
      // Map selected features to completed modules
      const completedModules: string[] = [];
      if (selectedFeatures.includes('error-tracking')) {
        // For different roles, error tracking means different starting modules
        if (role === 'frontend') {
          completedModules.push('sentry-fundamentals');
        } else if (role === 'backend' || role === 'sre') {
          completedModules.push('nodejs-integration');
        } else if (role === 'fullstack') {
          completedModules.push('sentry-fundamentals');
        }
      }
      if (selectedFeatures.includes('performance-monitoring')) {
        completedModules.push('performance-monitoring');
      }
      if (selectedFeatures.includes('session-replay')) {
        completedModules.push('react-error-boundaries');
      }
      if (selectedFeatures.includes('logging')) {
        completedModules.push('react-error-boundaries'); // Using this as logging course placeholder
      }
      if (selectedFeatures.includes('user-feedback') || selectedFeatures.includes('cron-monitoring') || selectedFeatures.includes('ai-agent-monitoring') || selectedFeatures.includes('mcp-monitoring')) {
        completedModules.push('team-workflows');
      }
      if (selectedFeatures.includes('profiling')) {
        completedModules.push('custom-dashboards');
      }

      setUserProgress(prev => ({
        ...prev,
        role,
        currentStep: 0,
        completedSteps: [],
        completedModules,
        lastActiveDate: new Date().toISOString()
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

  // Smart Sentry-based recommendation logic using the baseline paths
  const getNextRecommendation = (): NextContentRecommendation | null => {
    if (!userProgress.role) return null;

    const completedModules = userProgress.completedModules;

    // **Frontend Engineer Path**
    // Typical start: Error tracking (JS exceptions)
    // Next-best features: Performance monitoring (Web Vitals, LCP, FID), Session Replay, Release health
    if (userProgress.role === 'frontend') {
      // 1. Start with Error tracking (JS exceptions)
      if (!completedModules.includes('sentry-fundamentals')) {
        return {
          moduleId: 'sentry-fundamentals',
          stepId: 'frontend-error-tracking',
          priority: 10,
          reasoning: 'Start with error tracking to capture JavaScript exceptions and unhandled promise rejections',
          timeEstimate: '45 minutes'
        };
      }
      // 2. Performance monitoring (Web Vitals, LCP, FID)
      if (!completedModules.includes('performance-monitoring')) {
        return {
          moduleId: 'performance-monitoring',
          stepId: 'frontend-web-vitals',
          priority: 9,
          reasoning: 'Monitor Core Web Vitals (LCP, FID, CLS) to optimize user experience and SEO rankings',
          timeEstimate: '2 hours'
        };
      }
      // 3. Session Replay
      if (!completedModules.includes('react-error-boundaries')) {
        return {
          moduleId: 'react-error-boundaries',
          stepId: 'frontend-session-replay',
          priority: 8,
          reasoning: 'Add Session Replay to see exactly what users experienced when errors occurred',
          timeEstimate: '1.2 hours'
        };
      }
      // 4. Release health
      if (!completedModules.includes('team-workflows')) {
        return {
          moduleId: 'team-workflows',
          stepId: 'frontend-release-health',
          priority: 7,
          reasoning: 'Monitor release health to catch frontend regressions and deployment issues early',
          timeEstimate: '1 hour'
        };
      }
    }

    // **Backend Engineer Path**
    // Typical start: Error tracking (API failures, exceptions)
    // Next-best features: Tracing (latency hotspots), Performance (slow queries), Dashboards (service health)
    if (userProgress.role === 'backend') {
      // 1. Start with Error tracking (API failures, exceptions)
      if (!completedModules.includes('nodejs-integration')) {
        return {
          moduleId: 'nodejs-integration',
          stepId: 'backend-error-tracking',
          priority: 10,
          reasoning: 'Start with error tracking to capture API failures, database exceptions, and server-side errors',
          timeEstimate: '1.8 hours'
        };
      }
      // 2. Tracing (latency hotspots)
      if (!completedModules.includes('performance-monitoring')) {
        return {
          moduleId: 'performance-monitoring',
          stepId: 'backend-tracing',
          priority: 9,
          reasoning: 'Add distributed tracing to identify latency hotspots and slow database queries',
          timeEstimate: '2 hours'
        };
      }
      // 3. Performance (slow queries) - covered by tracing above
      // 4. Dashboards (service health)
      if (!completedModules.includes('custom-dashboards')) {
        return {
          moduleId: 'custom-dashboards',
          stepId: 'backend-service-health',
          priority: 8,
          reasoning: 'Create dashboards to monitor service health, API response times, and error rates',
          timeEstimate: '2.5 hours'
        };
      }
      // Optional: Fundamentals for conceptual understanding
      if (!completedModules.includes('sentry-fundamentals')) {
        return {
          moduleId: 'sentry-fundamentals',
          stepId: 'backend-fundamentals',
          priority: 7,
          reasoning: 'Learn Sentry fundamentals to deepen your understanding of application monitoring concepts',
          timeEstimate: '45 minutes'
        };
      }
    }

    // **SRE / DevOps / Infra Path**
    // Typical start: Error tracking signals from services
    // Next-best features: Dashboards (infrastructure-wide), Alerts/Notifications, Tracing for distributed systems, Integration with on-call tools
    if (userProgress.role === 'sre') {
      // 1. Start with Error tracking signals from services
      if (!completedModules.includes('nodejs-integration')) {
        return {
          moduleId: 'nodejs-integration',
          stepId: 'sre-error-signals',
          priority: 10,
          reasoning: 'Start with error tracking to aggregate error signals from all your services and infrastructure',
          timeEstimate: '1.8 hours'
        };
      }
      // 2. Dashboards (infrastructure-wide)
      if (!completedModules.includes('custom-dashboards')) {
        return {
          moduleId: 'custom-dashboards',
          stepId: 'sre-infrastructure-dashboards',
          priority: 9,
          reasoning: 'Build infrastructure-wide dashboards to monitor system health across all services',
          timeEstimate: '2.5 hours'
        };
      }
      // 3. Alerts/Notifications & Integration with on-call tools
      if (!completedModules.includes('team-workflows')) {
        return {
          moduleId: 'team-workflows',
          stepId: 'sre-alerting-oncall',
          priority: 8,
          reasoning: 'Set up automated alerts and integrate with on-call tools like PagerDuty and Slack',
          timeEstimate: '3 hours'
        };
      }
      // 4. Tracing for distributed systems
      if (!completedModules.includes('performance-monitoring')) {
        return {
          moduleId: 'performance-monitoring',
          stepId: 'sre-distributed-tracing',
          priority: 7,
          reasoning: 'Implement distributed tracing to understand request flows across microservices',
          timeEstimate: '2 hours'
        };
      }
      // Optional: Fundamentals
      if (!completedModules.includes('sentry-fundamentals')) {
        return {
          moduleId: 'sentry-fundamentals',
          stepId: 'sre-fundamentals',
          priority: 6,
          reasoning: 'Learn Sentry fundamentals to understand monitoring principles and best practices',
          timeEstimate: '45 minutes'
        };
      }
    }

    // **Full-stack Engineer Path**
    // Typical start: Error tracking on both frontend/backend
    // Next-best features: Cross-service tracing, Performance dashboards, Release health, Regression alerts
    if (userProgress.role === 'fullstack') {
      // 1. Start with Error tracking on both frontend/backend
      if (!completedModules.includes('sentry-fundamentals')) {
        return {
          moduleId: 'sentry-fundamentals',
          stepId: 'fullstack-error-tracking-foundation',
          priority: 10,
          reasoning: 'Start with error tracking fundamentals to monitor both frontend and backend errors',
          timeEstimate: '45 minutes'
        };
      }
      if (!completedModules.includes('nodejs-integration')) {
        return {
          moduleId: 'nodejs-integration',
          stepId: 'fullstack-backend-errors',
          priority: 9,
          reasoning: 'Add backend error tracking to connect frontend and server-side issues',
          timeEstimate: '1.8 hours'
        };
      }
      // 2. Cross-service tracing
      if (!completedModules.includes('performance-monitoring')) {
        return {
          moduleId: 'performance-monitoring',
          stepId: 'fullstack-cross-service-tracing',
          priority: 8,
          reasoning: 'Implement cross-service tracing to monitor performance from user interactions to database queries',
          timeEstimate: '2 hours'
        };
      }
      // 3. Performance dashboards
      if (!completedModules.includes('custom-dashboards')) {
        return {
          moduleId: 'custom-dashboards',
          stepId: 'fullstack-performance-dashboards',
          priority: 7,
          reasoning: 'Create performance dashboards that show the complete user journey across your stack',
          timeEstimate: '2.5 hours'
        };
      }
      // 4. Release health & Regression alerts
      if (!completedModules.includes('team-workflows')) {
        return {
          moduleId: 'team-workflows',
          stepId: 'fullstack-release-regression',
          priority: 6,
          reasoning: 'Set up release health monitoring and regression alerts for your entire stack',
          timeEstimate: '3 hours'
        };
      }
      // Optional: Session Replay for frontend insights
      if (!completedModules.includes('react-error-boundaries')) {
        return {
          moduleId: 'react-error-boundaries',
          stepId: 'fullstack-frontend-insights',
          priority: 5,
          reasoning: 'Add Session Replay to see user interactions and debug frontend issues more effectively',
          timeEstimate: '1.2 hours'
        };
      }
    }

    // All modules completed for this role
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