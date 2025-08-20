import { NextContentRecommendation, LearningPath, UserProgress, EngineerRole } from '../types/roles';
import { getLearningPathForRole } from '../data/roles';

/**
 * Role-Based Recommendation Engine
 * 
 * Algorithm:
 * 1. Input: User's role, completed modules, current step in path
 * 2. Logic: 
 *    - If no role selected → return null (triggers onboarding)
 *    - If role selected → get pre-baked path for role
 *    - Filter completed modules from path
 *    - Return next unlocked step + reasoning
 * 3. Output: Next recommended content with role-specific explanation
 */
export function getNextContentRecommendation(
  userProgress: UserProgress
): NextContentRecommendation | null {
  // If no role selected, trigger onboarding
  if (!userProgress.role) {
    return null;
  }

  const learningPath = getLearningPathForRole(userProgress.role);
  if (!learningPath) {
    return null;
  }

  // Find the next step that hasn't been completed
  const nextStep = learningPath.steps.find(step => 
    !userProgress.completedSteps.includes(step.id)
  );

  if (!nextStep) {
    // All steps completed
    return null;
  }

  // Find the next module within the step that hasn't been completed
  const nextModule = nextStep.modules.find(moduleId => 
    !userProgress.completedModules.includes(moduleId)
  );

  if (!nextModule) {
    // All modules in current step completed, but step not marked complete
    return {
      moduleId: nextStep.modules[0], // Return first module for step completion
      stepId: nextStep.id,
      priority: 1,
      reasoning: `Complete this step to unlock the next phase of your ${getRoleDisplayName(userProgress.role)} learning path.`,
      timeEstimate: nextStep.estimatedTime
    };
  }

  return {
    moduleId: nextModule,
    stepId: nextStep.id,
    priority: calculatePriority(nextStep, userProgress),
    reasoning: generateReasoning(nextStep, userProgress.role, nextModule),
    timeEstimate: calculateModuleTimeEstimate(nextStep.estimatedTime, nextStep.modules.length)
  };
}

/**
 * Content Personalization Algorithm
 * 
 * 1. Input: Module ID, user role, current context
 * 2. Logic:
 *    - Lookup role personalization data
 *    - Generate role-specific explanation ("Why this matters for your role")
 *    - Create contextual next-step nudge
 * 3. Output: Personalized content object with explanation, relevance, and nudge
 */
export function getPersonalizedContent(
  moduleId: string,
  role: EngineerRole,
  completedModules: string[]
): {
  roleSpecificExplanation: string;
  whyRelevantToRole: string;
  nextStepNudge: string;
  difficultyForRole: 'beginner' | 'intermediate' | 'advanced';
} | null {
  const personalizations = getRolePersonalizations();
  const personalization = personalizations[role]?.[moduleId];
  
  if (!personalization) {
    return null;
  }

  return {
    roleSpecificExplanation: personalization.explanation,
    whyRelevantToRole: personalization.whyRelevant,
    nextStepNudge: personalization.nextStepNudge,
    difficultyForRole: calculateDifficultyForRole(moduleId, role, completedModules)
  };
}

/**
 * Progress Tracking Algorithm
 * 
 * 1. Input: Completed module/step, user progress state
 * 2. Logic:
 *    - Mark current step complete
 *    - Check if all modules in step are done
 *    - Unlock next step in learning path
 *    - Update localStorage persistence
 * 3. Output: Updated progress state
 */
export function updateProgressAfterCompletion(
  userProgress: UserProgress,
  completedModuleId: string
): UserProgress {
  const newCompletedModules = [...userProgress.completedModules];
  if (!newCompletedModules.includes(completedModuleId)) {
    newCompletedModules.push(completedModuleId);
  }

  const learningPath = getLearningPathForRole(userProgress.role!);
  if (!learningPath) {
    return { ...userProgress, completedModules: newCompletedModules };
  }

  // Check if any steps should be marked as completed
  const newCompletedSteps = [...userProgress.completedSteps];
  
  for (const step of learningPath.steps) {
    const allModulesCompleted = step.modules.every(moduleId => 
      newCompletedModules.includes(moduleId)
    );
    
    if (allModulesCompleted && !newCompletedSteps.includes(step.id)) {
      newCompletedSteps.push(step.id);
    }
  }

  return {
    ...userProgress,
    completedModules: newCompletedModules,
    completedSteps: newCompletedSteps,
    lastActiveDate: new Date()
  };
}

// Helper functions

function getRoleDisplayName(role: EngineerRole): string {
  const roleNames = {
    backend: 'Backend Engineering',
    frontend: 'Frontend Engineering', 
    sre: 'SRE/DevOps',
    fullstack: 'Full-Stack Engineering'
  };
  return roleNames[role];
}

function calculatePriority(step: any, userProgress: UserProgress): number {
  // Higher priority for earlier steps and steps that unlock others
  const stepIndex = userProgress.currentStep;
  return Math.max(1, 10 - stepIndex);
}

function generateReasoning(step: any, role: EngineerRole, moduleId: string): string {
  const roleSpecificReasons = {
    backend: {
      'sentry-fundamentals': 'Essential for tracking API and service errors that affect multiple users.',
      'performance-monitoring': 'Critical for monitoring API response times and database performance.',
      'nodejs-integration': 'Specifically designed for backend Node.js services and APIs.',
      'custom-dashboards': 'Helps you monitor service health and get alerted to performance issues.'
    },
    frontend: {
      'sentry-fundamentals': 'Crucial for catching JavaScript errors that break user experiences.',
      'performance-monitoring': 'Monitors Core Web Vitals that impact SEO and user satisfaction.',
      'react-error-boundaries': 'Provides visual context for debugging frontend issues.',
      'custom-dashboards': 'Tracks user experience metrics and conversion impacts.'
    },
    sre: {
      'sentry-fundamentals': 'Aggregates errors across your entire infrastructure for incident response.',
      'performance-monitoring': 'Monitors service latency and helps maintain SLOs.',
      'custom-dashboards': 'Integrates with your existing monitoring and alerting workflows.',
      'team-workflows': 'Connects with PagerDuty and Slack for incident management.'
    },
    fullstack: {
      'sentry-fundamentals': 'Provides end-to-end visibility from frontend to backend.',
      'performance-monitoring': 'Tracks complete user journeys across your entire stack.',
      'react-error-boundaries': 'Connects frontend errors with backend performance data.',
      'team-workflows': 'Monitors releases and catches regressions across the full stack.'
    }
  };

  return roleSpecificReasons[role]?.[moduleId] || 
    `This is the next step in your ${getRoleDisplayName(role)} learning path.`;
}

function calculateModuleTimeEstimate(stepTime: string, moduleCount: number): string {
  // Simple estimation: divide step time by number of modules
  const timeMatch = stepTime.match(/(\d+(?:\.\d+)?)\s*hours?/);
  if (timeMatch) {
    const hours = parseFloat(timeMatch[1]);
    const moduleHours = hours / moduleCount;
    if (moduleHours < 1) {
      return `${Math.round(moduleHours * 60)} minutes`;
    }
    return `${moduleHours.toFixed(1)} hours`;
  }
  return '30 minutes'; // Default fallback
}

function calculateDifficultyForRole(
  moduleId: string, 
  role: EngineerRole, 
  completedModules: string[]
): 'beginner' | 'intermediate' | 'advanced' {
  // Simple heuristic based on module and role
  const advancedModules = ['custom-dashboards', 'team-workflows'];
  const intermediateModules = ['performance-monitoring', 'react-error-boundaries'];
  
  if (advancedModules.includes(moduleId)) {
    return 'advanced';
  }
  
  if (intermediateModules.includes(moduleId)) {
    return 'intermediate';
  }
  
  return 'beginner';
}

function getRolePersonalizations() {
  // This should ideally come from the data layer, but for now we'll define it here
  // to avoid circular dependencies
  return {
    backend: {
      'sentry-fundamentals': {
        explanation: 'Error tracking helps you catch API failures, database connection issues, and service exceptions before users complain.',
        whyRelevant: 'As a backend engineer, you need visibility into server-side errors that can affect multiple users and downstream services.',
        nextStepNudge: 'Next, we\'ll add distributed tracing to help you find slow database queries and bottlenecks between services.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring shows you API response times, database query performance, and service throughput metrics.',
        whyRelevant: 'Your APIs are the backbone of the application - slow backend performance directly impacts user experience.',
        nextStepNudge: 'Let\'s set up dashboards so you can monitor service health and get alerted to performance regressions.'
      },
      'custom-dashboards': {
        explanation: 'Dashboards give you a centralized view of service health, error rates, and performance metrics across your backend infrastructure.',
        whyRelevant: 'As someone responsible for backend reliability, you need proactive monitoring to catch issues before they cascade.',
        nextStepNudge: 'You\'re building a robust monitoring foundation that will help you maintain high service availability.'
      }
    },
    frontend: {
      'sentry-fundamentals': {
        explanation: 'Error tracking captures JavaScript exceptions, promise rejections, and React component errors that break the user experience.',
        whyRelevant: 'Frontend errors directly impact users and can lead to lost conversions, frustrated users, and negative app store reviews.',
        nextStepNudge: 'Next, we\'ll monitor your app\'s performance to ensure fast loading times and smooth user interactions.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring tracks Core Web Vitals like LCP, FID, and CLS that Google uses for search rankings and user experience.',
        whyRelevant: 'Slow frontend performance hurts user engagement, SEO rankings, and conversion rates - especially on mobile devices.',
        nextStepNudge: 'Let\'s add session replay so you can see exactly what users experienced when they encountered issues.'
      },
      'react-error-boundaries': {
        explanation: 'Session replay shows you the exact user interactions that led to errors, giving you visual context for debugging.',
        whyRelevant: 'Frontend bugs are often hard to reproduce - session replay lets you see the user\'s perspective and debug with confidence.',
        nextStepNudge: 'You\'re building comprehensive frontend monitoring that will help you deliver exceptional user experiences.'
      }
    },
    sre: {
      'sentry-fundamentals': {
        explanation: 'Error monitoring aggregates issues across your entire infrastructure, giving you visibility into service health and reliability.',
        whyRelevant: 'As an SRE, you\'re responsible for system reliability - error tracking helps you identify and respond to incidents quickly.',
        nextStepNudge: 'Next, we\'ll add distributed tracing to help you understand request flows and identify bottlenecks across microservices.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring shows you service latency, throughput, and dependency health across your distributed systems.',
        whyRelevant: 'Performance issues can cascade through distributed systems - you need visibility to maintain your SLOs and prevent outages.',
        nextStepNudge: 'Let\'s build dashboards and alerts that integrate with your existing on-call processes and incident response workflows.'
      },
      'custom-dashboards': {
        explanation: 'Dashboards centralize infrastructure health metrics and can integrate with your existing tools like PagerDuty, Slack, and Grafana.',
        whyRelevant: 'Unified dashboards help you correlate issues across services and provide critical context during incident response.',
        nextStepNudge: 'You\'re building a monitoring stack that will reduce MTTR and help you maintain high system reliability.'
      }
    },
    fullstack: {
      'sentry-fundamentals': {
        explanation: 'Error tracking connects frontend and backend errors, giving you end-to-end visibility into user journeys and system health.',
        whyRelevant: 'As a full-stack engineer, you need to understand how frontend issues relate to backend problems and vice versa.',
        nextStepNudge: 'Next, we\'ll add performance monitoring to track user experiences from browser interactions to database queries.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring shows you the complete user journey - from page load times to API response times to database queries.',
        whyRelevant: 'Full-stack performance issues require understanding both client-side rendering and server-side processing bottlenecks.',
        nextStepNudge: 'Let\'s set up release monitoring so you can catch regressions across your entire stack before they impact users.'
      },
      'team-workflows': {
        explanation: 'Release monitoring tracks deployment health across frontend and backend, helping you identify which changes introduce issues.',
        whyRelevant: 'When you deploy full-stack changes, you need visibility into how they affect the entire user experience.',
        nextStepNudge: 'You\'re building comprehensive observability that covers your entire technology stack.'
      }
    }
  };
}