import { RoleInfo, LearningPath, RolePersonalization, EngineerRole } from '../types/roles';

export const roles: RoleInfo[] = [
  {
    id: 'backend',
    title: 'Backend Engineer',
    description: 'You build APIs, services, and server-side logic. Focus on reliability, performance, and data integrity.',
    icon: '🔧',
    commonTasks: [
      'Building REST APIs and microservices',
      'Database optimization and queries', 
      'Server performance monitoring',
      'Service-to-service communication'
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend Engineer', 
    description: 'You create user interfaces and experiences. Focus on performance, accessibility, and user satisfaction.',
    icon: '🎨',
    commonTasks: [
      'Building responsive web applications',
      'Optimizing page load performance',
      'Debugging user interaction issues',
      'Cross-browser compatibility'
    ]
  },
  {
    id: 'sre',
    title: 'SRE / DevOps',
    description: 'You maintain infrastructure and ensure system reliability. Focus on uptime, scalability, and incident response.',
    icon: '⚡',
    commonTasks: [
      'Managing infrastructure and deployments',
      'Setting up monitoring and alerting', 
      'Incident response and on-call',
      'System capacity planning'
    ]
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Engineer',
    description: 'You work across the entire stack. Focus on end-to-end user experiences and system integration.',
    icon: '🚀',
    commonTasks: [
      'Building complete features end-to-end',
      'Integrating frontend and backend systems',
      'Debugging across multiple layers',
      'Coordinating releases and deployments'
    ]
  }
];

export const learningPaths: LearningPath[] = [
  {
    id: 'backend-path',
    roleId: 'backend',
    title: 'Backend Engineer Learning Path',
    description: 'Master error tracking, tracing, and performance monitoring for server-side applications',
    totalEstimatedTime: '4.5 hours',
    steps: [
      {
        id: 'backend-step-1',
        title: 'Error Tracking Foundation',
        description: 'Capture and understand exceptions in your APIs and services',
        modules: ['sentry-fundamentals', 'nodejs-integration'],
        outcomes: [
          'Install Sentry SDK in your backend services',
          'Capture API exceptions and server errors',
          'Set up context for better debugging'
        ],
        estimatedTime: '1.5 hours',
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'backend-step-2', 
        title: 'Distributed Tracing',
        description: 'Track requests across services to find latency bottlenecks',
        modules: ['performance-monitoring'],
        outcomes: [
          'Instrument APIs with distributed tracing',
          'Follow requests across microservices',
          'Identify slow database queries and external calls'
        ],
        estimatedTime: '2 hours',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'backend-step-3',
        title: 'Performance Monitoring',
        description: 'Monitor API performance and set up proactive alerts',
        modules: ['custom-dashboards'],
        outcomes: [
          'Track API response times and throughput',
          'Set up performance alerts for slow endpoints',
          'Monitor database and cache performance'
        ],
        estimatedTime: '1 hour',
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'frontend-path',
    roleId: 'frontend',
    title: 'Frontend Engineer Learning Path', 
    description: 'Optimize user experience with error tracking, performance monitoring, and session replay',
    totalEstimatedTime: '5 hours',
    steps: [
      {
        id: 'frontend-step-1',
        title: 'JavaScript Error Tracking',
        description: 'Capture and debug client-side errors and exceptions',
        modules: ['sentry-fundamentals', 'react-error-boundaries'],
        outcomes: [
          'Install Sentry in your frontend application',
          'Capture JavaScript exceptions and unhandled promises',
          'Add user context for better error debugging'
        ],
        estimatedTime: '1.5 hours',
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'frontend-step-2',
        title: 'Web Performance Monitoring',
        description: 'Measure and optimize Core Web Vitals and page performance',
        modules: ['performance-monitoring'],
        outcomes: [
          'Track LCP, FID, and CLS metrics',
          'Monitor page load performance',
          'Identify slow components and renders'
        ],
        estimatedTime: '2 hours',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'frontend-step-3',
        title: 'Session Replay & Debugging',
        description: 'See exactly what users experienced when errors occurred',
        modules: ['sentry-fundamentals'],
        outcomes: [
          'Enable session replay for error context',
          'Debug user interactions and UI issues',
          'Understand user behavior patterns'
        ],
        estimatedTime: '1.5 hours',
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'sre-path',
    roleId: 'sre',
    title: 'SRE/DevOps Learning Path',
    description: 'Build comprehensive monitoring, alerting, and incident response workflows',
    totalEstimatedTime: '6 hours',
    steps: [
      {
        id: 'sre-step-1',
        title: 'Infrastructure Error Monitoring',
        description: 'Aggregate errors across all services and infrastructure',
        modules: ['sentry-fundamentals', 'nodejs-integration'],
        outcomes: [
          'Monitor errors across multiple services',
          'Set up service-level error tracking',
          'Integrate with existing infrastructure monitoring'
        ],
        estimatedTime: '1.5 hours',
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'sre-step-2',
        title: 'Distributed System Tracing',
        description: 'Trace requests across microservices and infrastructure',
        modules: ['performance-monitoring'],
        outcomes: [
          'Implement end-to-end request tracing',
          'Monitor service dependencies and latency',
          'Identify bottlenecks in distributed systems'
        ],
        estimatedTime: '2 hours',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'sre-step-3',
        title: 'Dashboards & Incident Response',
        description: 'Create dashboards and integrate with on-call workflows',
        modules: ['custom-dashboards', 'team-workflows'],
        outcomes: [
          'Build infrastructure health dashboards',
          'Set up automated alerting and escalation',
          'Integrate with PagerDuty and Slack'
        ],
        estimatedTime: '2.5 hours',
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  {
    id: 'fullstack-path',
    roleId: 'fullstack',
    title: 'Full-Stack Engineer Learning Path',
    description: 'Monitor complete user journeys from frontend to backend with comprehensive observability',
    totalEstimatedTime: '7 hours',
    steps: [
      {
        id: 'fullstack-step-1',
        title: 'End-to-End Error Tracking',
        description: 'Connect frontend and backend errors for complete visibility',
        modules: ['sentry-fundamentals', 'nodejs-integration', 'react-error-boundaries'],
        outcomes: [
          'Track errors across frontend and backend',
          'Correlate user actions with server errors',
          'Set up unified error reporting'
        ],
        estimatedTime: '2.5 hours',
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'fullstack-step-2',
        title: 'Cross-Service Performance',
        description: 'Monitor performance from user interaction to database',
        modules: ['performance-monitoring'],
        outcomes: [
          'Trace user interactions through full stack',
          'Monitor both client and server performance',
          'Identify performance bottlenecks across layers'
        ],
        estimatedTime: '2 hours',
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'fullstack-step-3',
        title: 'Release & Deployment Monitoring',
        description: 'Monitor releases and catch regressions across the stack',
        modules: ['team-workflows', 'custom-dashboards'],
        outcomes: [
          'Track release health across frontend and backend',
          'Set up deployment monitoring and rollback alerts',
          'Create unified dashboards for stack health'
        ],
        estimatedTime: '2.5 hours',
        isCompleted: false,
        isUnlocked: false
      }
    ]
  }
];

export const rolePersonalizations: RolePersonalization[] = [
  {
    roleId: 'backend',
    contentAdaptations: {
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
    }
  },
  {
    roleId: 'frontend', 
    contentAdaptations: {
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
    }
  },
  {
    roleId: 'sre',
    contentAdaptations: {
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
    }
  },
  {
    roleId: 'fullstack',
    contentAdaptations: {
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
  }
];

export function getRoleById(roleId: EngineerRole): RoleInfo | undefined {
  return roles.find(role => role.id === roleId);
}

export function getLearningPathForRole(roleId: EngineerRole): LearningPath | undefined {
  return learningPaths.find(path => path.roleId === roleId);
}

export function getPersonalizationForRole(roleId: EngineerRole): RolePersonalization | undefined {
  return rolePersonalizations.find(p => p.roleId === roleId);
}