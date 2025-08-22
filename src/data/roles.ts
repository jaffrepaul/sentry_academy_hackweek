import { RoleInfo, LearningPath, RolePersonalization, EngineerRole } from '../types/roles';

export const roles: RoleInfo[] = [
  {
    id: 'frontend',
    title: 'Front-end Web Developer',
    description: 'Monitor client-side issues, analyze user experience, and incorporate user feedback for rapid debugging.',
    icon: '🎨',
    commonTasks: [
      'Building responsive React/Next.js applications',
      'Debugging user interaction issues and JavaScript errors',
      'Optimizing Core Web Vitals and page performance',
      'Implementing user feedback systems'
    ]
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    description: 'Gain deep visibility into backend errors, logging, and performance bottlenecks.',
    icon: '🔧',
    commonTasks: [
      'Building Python/Django APIs and microservices',
      'Monitoring API latency and database performance', 
      'Implementing distributed tracing across services',
      'Setting up structured logging and error tracking'
    ]
  },
  {
    id: 'fullstack',
    title: 'Full-stack Developer',
    description: 'Build a seamless, end-to-end observability pipeline across frontend and backend systems.',
    icon: '🚀',
    commonTasks: [
      'Building complete features end-to-end',
      'Implementing unified error tracking across layers',
      'Monitoring full-stack performance and user journeys',
      'Coordinating releases with comprehensive health tracking'
    ]
  },
  {
    id: 'sre',
    title: 'SRE/DevOps',
    description: 'Maintain high reliability and proactive alerting across distributed systems.',
    icon: '⚡',
    commonTasks: [
      'Managing infrastructure and deployment reliability',
      'Setting up intelligent alerting and on-call integration', 
      'Monitoring distributed system health and bottlenecks',
      'Automating observability workflows with Sentry API'
    ]
  },
  {
    id: 'ai-ml',
    title: 'AI/ML-Aware Developer',
    description: 'Debug AI pipelines and model performance with observability-first principles.',
    icon: '🤖',
    commonTasks: [
      'Monitoring AI training and inference workflows',
      'Implementing Seer for advanced AI debugging',
      'Tracking model performance and drift detection',
      'Using MCP to trace and debug ML models in production'
    ]
  },
  {
    id: 'pm-manager',
    title: 'Product Manager / Engineering Manager',
    description: 'Enable technical and non-technical stakeholders to analyze, interpret, and act on data from Sentry.',
    icon: '📊',
    commonTasks: [
      'Building dashboards for product quality metrics',
      'Analyzing user experience and performance trends',
      'Creating stakeholder reports from observability data',
      'Making data-driven decisions about product improvements'
    ]
  }
];

export const learningPaths: LearningPath[] = [
  // Frontend Developer (React/Next.js) Learning Path
  {
    id: 'frontend-path',
    roleId: 'frontend',
    title: 'Front-end Web Developer Learning Path',
    description: 'Monitor client-side issues, analyze user experience, and incorporate user feedback for rapid debugging',
    totalEstimatedTime: '8.5 hours',
    steps: [
      {
        id: 'frontend-error-tracking',
        title: 'Error Tracking (Core)',
        description: 'SDK setup with source maps - Capture unhandled exceptions and custom events',
        feature: 'error-tracking',
        modules: ['sentry-fundamentals'],
        outcomes: [
          'Install and configure Sentry SDK with source maps',
          'Capture JavaScript exceptions and unhandled promise rejections',
          'Set up custom error boundaries and context'
        ],
        estimatedTime: '1 hour',
        priority: 1,
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'frontend-performance',
        title: 'Performance Monitoring',
        description: 'Measure LCP, CLS, and route change performance',
        feature: 'performance-monitoring',
        modules: ['performance-monitoring'],
        outcomes: [
          'Monitor Core Web Vitals (LCP, FID, CLS)',
          'Track page load and route change performance',
          'Identify slow components and rendering bottlenecks'
        ],
        estimatedTime: '1.5 hours',
        priority: 2,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'frontend-logging',
        title: 'Logging',
        description: 'Integrate Sentry logging with console and custom breadcrumbs',
        feature: 'logging',
        modules: ['react-error-boundaries'],
        outcomes: [
          'Set up structured logging in frontend applications',
          'Integrate console logging with Sentry breadcrumbs',
          'Create custom logging for user interactions'
        ],
        estimatedTime: '1 hour',
        priority: 3,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'frontend-session-replay',
        title: 'Session Replay',
        description: 'Watch real sessions to diagnose interaction issues',
        feature: 'session-replay',
        modules: ['sentry-fundamentals'],
        outcomes: [
          'Configure session replay with privacy controls',
          'Debug user interactions and UI issues',
          'Correlate session replays with error events'
        ],
        estimatedTime: '1.5 hours',
        priority: 4,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'frontend-user-feedback',
        title: 'User Feedback',
        description: 'Implement feedback forms linked to issues for real-time UX insights',
        feature: 'user-feedback',
        modules: ['team-workflows'],
        outcomes: [
          'Implement user feedback forms',
          'Link feedback to specific error events',
          'Set up feedback-based alerting and triage'
        ],
        estimatedTime: '1.5 hours',
        priority: 5,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'frontend-dashboards-alerts',
        title: 'Dashboards & Alerts',
        description: 'Build dashboards for frontend KPIs - Alerts for spikes in frontend failures',
        feature: 'dashboards-alerts',
        modules: ['custom-dashboards'],
        outcomes: [
          'Create frontend-specific dashboards',
          'Set up alerts for error rate spikes',
          'Monitor Core Web Vitals trends'
        ],
        estimatedTime: '1.5 hours',
        priority: 6,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'frontend-integrations',
        title: 'Integrations',
        description: 'Slack, GitHub, and project management tools for streamlined triage',
        feature: 'integrations',
        modules: ['team-workflows'],
        outcomes: [
          'Integrate Sentry with Slack and GitHub',
          'Set up automated issue assignment',
          'Configure CI/CD integration for releases'
        ],
        estimatedTime: '0.5 hours',
        priority: 7,
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  
  // Backend Engineer (Python/Django) Learning Path
  {
    id: 'backend-path',
    roleId: 'backend',
    title: 'Backend Engineer Learning Path',
    description: 'Gain deep visibility into backend errors, logging, and performance bottlenecks',
    totalEstimatedTime: '9 hours',
    steps: [
      {
        id: 'backend-error-tracking',
        title: 'Error Tracking (Core)',
        description: 'Python/Django SDK setup - Capture exceptions and logging events with structured context',
        feature: 'error-tracking',
        modules: ['nodejs-integration'],
        outcomes: [
          'Install Sentry SDK in Python/Django applications',
          'Capture API exceptions and server errors',
          'Add structured context to error reports'
        ],
        estimatedTime: '1.5 hours',
        priority: 1,
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'backend-performance',
        title: 'Performance Monitoring',
        description: 'Monitor API latency and database query performance',
        feature: 'performance-monitoring',
        modules: ['performance-monitoring'],
        outcomes: [
          'Track API response times and throughput',
          'Monitor database query performance',
          'Identify slow endpoints and bottlenecks'
        ],
        estimatedTime: '2 hours',
        priority: 2,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'backend-logging',
        title: 'Logging',
        description: 'Use Sentry logging handlers to capture warnings, errors, and logs',
        feature: 'logging',
        modules: ['react-error-boundaries'],
        outcomes: [
          'Set up Sentry logging handlers',
          'Capture structured logs with context',
          'Integrate with Django logging framework'
        ],
        estimatedTime: '1.5 hours',
        priority: 3,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'backend-distributed-tracing',
        title: 'Distributed Tracing',
        description: 'Trace workflows across microservices and async workers',
        feature: 'distributed-tracing',
        modules: ['performance-monitoring'],
        outcomes: [
          'Implement distributed tracing across services',
          'Track async task performance',
          'Monitor service-to-service communication'
        ],
        estimatedTime: '2 hours',
        priority: 4,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'backend-release-health',
        title: 'Release Health',
        description: 'Track version stability, adoption, and regression detection',
        feature: 'release-health',
        modules: ['team-workflows'],
        outcomes: [
          'Set up release tracking and health monitoring',
          'Monitor deployment stability',
          'Detect regressions and performance degradation'
        ],
        estimatedTime: '1 hour',
        priority: 5,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'backend-dashboards-alerts',
        title: 'Dashboards & Alerts',
        description: 'Custom dashboards for API performance and error rates - Automated alerts for spikes or anomalies',
        feature: 'dashboards-alerts',
        modules: ['custom-dashboards'],
        outcomes: [
          'Create backend service health dashboards',
          'Set up intelligent alerting for anomalies',
          'Monitor SLIs and error budgets'
        ],
        estimatedTime: '1 hour',
        priority: 6,
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  
  // Full-stack Developer Learning Path
  {
    id: 'fullstack-path',
    roleId: 'fullstack',
    title: 'Full-stack Developer Learning Path',
    description: 'Build a seamless, end-to-end observability pipeline across frontend and backend systems',
    totalEstimatedTime: '10.5 hours',
    steps: [
      {
        id: 'fullstack-error-tracking',
        title: 'Error Tracking (Core)',
        description: 'Implement tracking on both frontend and backend',
        feature: 'error-tracking',
        modules: ['sentry-fundamentals', 'nodejs-integration'],
        outcomes: [
          'Set up unified error tracking across stack',
          'Correlate frontend and backend errors',
          'Implement error boundary strategies'
        ],
        estimatedTime: '2 hours',
        priority: 1,
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'fullstack-performance',
        title: 'Performance Monitoring',
        description: 'Measure end-to-end latency with connected traces',
        feature: 'performance-monitoring',
        modules: ['performance-monitoring'],
        outcomes: [
          'Track performance from browser to database',
          'Monitor full user journey latency',
          'Identify cross-layer performance bottlenecks'
        ],
        estimatedTime: '2.5 hours',
        priority: 2,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'fullstack-logging',
        title: 'Logging',
        description: 'Unify logs from both layers for cross-stack debugging',
        feature: 'logging',
        modules: ['react-error-boundaries'],
        outcomes: [
          'Implement unified logging across frontend and backend',
          'Correlate logs with user sessions',
          'Set up cross-stack debugging workflows'
        ],
        estimatedTime: '1.5 hours',
        priority: 3,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'fullstack-session-replay',
        title: 'Session Replay (Frontend)',
        description: 'Debug multi-layer issues by replaying user sessions',
        feature: 'session-replay',
        modules: ['sentry-fundamentals'],
        outcomes: [
          'Connect session replays to backend errors',
          'Debug complex multi-layer interactions',
          'Understand full user experience context'
        ],
        estimatedTime: '1.5 hours',
        priority: 4,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'fullstack-distributed-tracing',
        title: 'Distributed Tracing',
        description: 'Monitor microservice and API call chains',
        feature: 'distributed-tracing',
        modules: ['performance-monitoring'],
        outcomes: [
          'Trace requests from frontend to backend',
          'Monitor microservice communication',
          'Optimize end-to-end request flows'
        ],
        estimatedTime: '2 hours',
        priority: 5,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'fullstack-dashboards-alerts',
        title: 'Dashboards & Alerts',
        description: 'Unified dashboards to track full-stack performance - Advanced alert rules to detect regression patterns',
        feature: 'dashboards-alerts',
        modules: ['custom-dashboards'],
        outcomes: [
          'Create unified full-stack dashboards',
          'Set up regression detection alerts',
          'Monitor end-to-end health metrics'
        ],
        estimatedTime: '1 hour',
        priority: 6,
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  
  // SRE/DevOps/Infrastructure Learning Path
  {
    id: 'sre-path',
    roleId: 'sre',
    title: 'SRE/DevOps/Infrastructure Learning Path',
    description: 'Maintain high reliability and proactive alerting across distributed systems',
    totalEstimatedTime: '11 hours',
    steps: [
      {
        id: 'sre-error-tracking',
        title: 'Error Tracking (Core)',
        description: 'Integrate with core infrastructure services',
        feature: 'error-tracking',
        modules: ['nodejs-integration'],
        outcomes: [
          'Set up error tracking across all services',
          'Aggregate infrastructure-level errors',
          'Integrate with existing monitoring tools'
        ],
        estimatedTime: '1.5 hours',
        priority: 1,
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'sre-performance-tracing',
        title: 'Performance & Distributed Tracing',
        description: 'Trace latency, throughput, and bottlenecks across the stack',
        feature: 'distributed-tracing',
        modules: ['performance-monitoring'],
        outcomes: [
          'Implement infrastructure-wide tracing',
          'Monitor service dependencies and latency',
          'Identify system-level bottlenecks'
        ],
        estimatedTime: '2.5 hours',
        priority: 2,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'sre-logging',
        title: 'Logging',
        description: 'Use logging for structured incident data capture',
        feature: 'logging',
        modules: ['react-error-boundaries'],
        outcomes: [
          'Set up centralized logging for incident response',
          'Structure logs for automated analysis',
          'Integrate with existing log aggregation'
        ],
        estimatedTime: '1.5 hours',
        priority: 3,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'sre-dashboards',
        title: 'Dashboards (Infra-Wide)',
        description: 'Build custom infra-level dashboards for services and queues',
        feature: 'dashboards-alerts',
        modules: ['custom-dashboards'],
        outcomes: [
          'Create infrastructure health dashboards',
          'Monitor service-level indicators (SLIs)',
          'Visualize system capacity and utilization'
        ],
        estimatedTime: '2 hours',
        priority: 4,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'sre-alerts-notifications',
        title: 'Alerts & Notifications',
        description: 'Set intelligent thresholds and integrate with on-call systems',
        feature: 'dashboards-alerts',
        modules: ['team-workflows'],
        outcomes: [
          'Set up intelligent alerting with thresholds',
          'Integrate with PagerDuty and on-call systems',
          'Configure escalation policies'
        ],
        estimatedTime: '2 hours',
        priority: 5,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'sre-release-health',
        title: 'Release Health',
        description: 'Monitor stability across deployments',
        feature: 'release-health',
        modules: ['team-workflows'],
        outcomes: [
          'Track deployment stability and rollback triggers',
          'Monitor release adoption and health',
          'Set up automated canary analysis'
        ],
        estimatedTime: '1 hour',
        priority: 6,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'sre-integrations',
        title: 'Advanced Integrations',
        description: 'Leverage Sentry API for custom observability automation',
        feature: 'integrations',
        modules: ['team-workflows'],
        outcomes: [
          'Build custom automation with Sentry API',
          'Integrate with infrastructure as code',
          'Create self-healing system responses'
        ],
        estimatedTime: '0.5 hours',
        priority: 7,
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  
  // AI/ML-Aware Developer Learning Path
  {
    id: 'ai-ml-path',
    roleId: 'ai-ml',
    title: 'AI/ML-Aware Developer Learning Path',
    description: 'Debug AI pipelines and model performance with observability-first principles',
    totalEstimatedTime: '12 hours',
    steps: [
      {
        id: 'ai-ml-error-tracking',
        title: 'Error Tracking (Core)',
        description: 'Capture errors in training, inference, and deployment workflows',
        feature: 'error-tracking',
        modules: ['nodejs-integration'],
        outcomes: [
          'Track errors in ML training pipelines',
          'Monitor inference API failures',
          'Capture model deployment issues'
        ],
        estimatedTime: '1.5 hours',
        priority: 1,
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'ai-ml-performance',
        title: 'Performance Monitoring',
        description: 'Monitor inference latency and throughput',
        feature: 'performance-monitoring',
        modules: ['performance-monitoring'],
        outcomes: [
          'Track model inference latency',
          'Monitor throughput and concurrency',
          'Optimize model serving performance'
        ],
        estimatedTime: '2 hours',
        priority: 2,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'ai-ml-logging',
        title: 'Logging',
        description: 'Use structured logging for ML pipelines (data drift, feature issues, etc.)',
        feature: 'logging',
        modules: ['react-error-boundaries'],
        outcomes: [
          'Log training metrics and data quality',
          'Track feature drift and data issues',
          'Monitor model prediction confidence'
        ],
        estimatedTime: '1.5 hours',
        priority: 3,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'ai-ml-seer-mcp',
        title: 'Seer / MCP (Priority)',
        description: 'Implement Seer for advanced debugging of AI workflows - Use MCP to trace and debug ML models in production',
        feature: 'seer-mcp',
        modules: ['custom-dashboards'],
        outcomes: [
          'Implement Seer for AI-powered debugging',
          'Use MCP for model tracing and analysis',
          'Debug complex ML workflows automatically'
        ],
        estimatedTime: '3 hours',
        priority: 4,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'ai-ml-distributed-tracing',
        title: 'Distributed Tracing',
        description: 'Trace full ML lifecycle (ETL → Training → Deployment → Inference)',
        feature: 'distributed-tracing',
        modules: ['performance-monitoring'],
        outcomes: [
          'Trace end-to-end ML workflows',
          'Monitor data pipeline performance',
          'Track model lifecycle stages'
        ],
        estimatedTime: '2.5 hours',
        priority: 5,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'ai-ml-custom-metrics',
        title: 'Custom Metrics',
        description: 'Track domain-specific metrics like accuracy, model drift, or feature importance',
        feature: 'custom-metrics',
        modules: ['custom-dashboards'],
        outcomes: [
          'Track model accuracy and performance metrics',
          'Monitor feature importance and drift',
          'Set up custom ML-specific dashboards'
        ],
        estimatedTime: '1 hour',
        priority: 6,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'ai-ml-dashboards-alerts',
        title: 'Dashboards & Alerts',
        description: 'Build model health dashboards - Create alerts for anomalies in inference or performance degradation',
        feature: 'dashboards-alerts',
        modules: ['custom-dashboards'],
        outcomes: [
          'Create ML model health dashboards',
          'Set up anomaly detection alerts',
          'Monitor model performance degradation'
        ],
        estimatedTime: '0.5 hours',
        priority: 7,
        isCompleted: false,
        isUnlocked: false
      }
    ]
  },
  
  // Product Manager / Engineering Manager Learning Path
  {
    id: 'pm-manager-path',
    roleId: 'pm-manager',
    title: 'Metrics-Driven Insights with Sentry',
    description: 'Turn raw observability data into actionable insights for improving product quality, performance, and user experience',
    totalEstimatedTime: '4 hours',
    steps: [
      {
        id: 'pm-understanding-metrics',
        title: 'Understanding Sentry Metrics',
        description: 'Learn to interpret error rates, performance metrics, and user experience data without technical complexity',
        feature: 'metrics-insights',
        modules: ['custom-dashboards'],
        outcomes: [
          'Understand key Sentry metrics and what they mean for your product',
          'Interpret error rates, crash rates, and performance indicators',
          'Connect technical metrics to business impact and user experience'
        ],
        estimatedTime: '45 minutes',
        priority: 1,
        isCompleted: false,
        isUnlocked: true
      },
      {
        id: 'pm-building-dashboards',
        title: 'Building Effective Dashboards',
        description: 'Create executive and stakeholder dashboards that communicate product health and quality trends',
        feature: 'dashboards-alerts',
        modules: ['custom-dashboards'],
        outcomes: [
          'Build dashboards tailored for different stakeholder audiences',
          'Create executive summaries of product health and stability',
          'Design actionable views for product quality decisions'
        ],
        estimatedTime: '1.5 hours',
        priority: 2,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'pm-user-experience-analysis',
        title: 'User Experience Impact Analysis',
        description: 'Analyze how technical issues affect user behavior, retention, and product adoption',
        feature: 'performance-monitoring',
        modules: ['performance-monitoring'],
        outcomes: [
          'Correlate performance issues with user behavior patterns',
          'Identify which technical problems most impact user experience',
          'Quantify the business impact of performance and reliability issues'
        ],
        estimatedTime: '1 hour',
        priority: 3,
        isCompleted: false,
        isUnlocked: false
      },
      {
        id: 'pm-stakeholder-reporting',
        title: 'Stakeholder Reporting & Communication',
        description: 'Create regular reports and alerts that keep teams aligned on product quality goals',
        feature: 'stakeholder-reporting',
        modules: ['team-workflows'],
        outcomes: [
          'Set up automated reports for leadership and stakeholders',
          'Create alert systems for critical quality degradations',
          'Establish data-driven product quality review processes'
        ],
        estimatedTime: '45 minutes',
        priority: 4,
        isCompleted: false,
        isUnlocked: false
      }
    ]
  }
];

export const rolePersonalizations: RolePersonalization[] = [
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
        nextStepNudge: 'Let\'s add structured logging to capture user interactions and debugging context.'
      },
      'react-error-boundaries': {
        explanation: 'Structured logging captures user interactions, component state, and debugging context to help you understand error patterns.',
        whyRelevant: 'Frontend debugging requires understanding user context - logs help you trace user actions that lead to errors.',
        nextStepNudge: 'Next, we\'ll add session replay so you can see exactly what users experienced when they encountered issues.'
      },
      'user-feedback': {
        explanation: 'User feedback systems let users report issues directly, linking their reports to specific errors and sessions.',
        whyRelevant: 'Real user feedback helps you prioritize fixes and understand the business impact of frontend issues.',
        nextStepNudge: 'Let\'s set up dashboards and alerts to monitor your frontend KPIs and error trends.'
      }
    }
  },
  {
    roleId: 'backend',
    contentAdaptations: {
      'nodejs-integration': {
        explanation: 'Error tracking helps you catch API failures, database connection issues, and service exceptions before users complain.',
        whyRelevant: 'As a backend engineer, you need visibility into server-side errors that can affect multiple users and downstream services.',
        nextStepNudge: 'Next, we\'ll add performance monitoring to track API latency and database query performance.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring shows you API response times, database query performance, and service throughput metrics.',
        whyRelevant: 'Your APIs are the backbone of the application - slow backend performance directly impacts user experience.',
        nextStepNudge: 'Let\'s add structured logging to capture detailed context for debugging complex backend issues.'
      },
      'react-error-boundaries': {
        explanation: 'Structured logging captures request context, database queries, and application state for better debugging.',
        whyRelevant: 'Backend debugging requires detailed context - logs help you trace request flows and identify root causes.',
        nextStepNudge: 'Next, we\'ll implement distributed tracing to follow requests across your microservices.'
      },
      'distributed-tracing': {
        explanation: 'Distributed tracing tracks requests across microservices, helping you identify latency bottlenecks and service dependencies.',
        whyRelevant: 'In microservice architectures, understanding request flows is critical for identifying performance and reliability issues.',
        nextStepNudge: 'Let\'s set up release health monitoring to track deployment stability and catch regressions.'
      }
    }
  },
  {
    roleId: 'fullstack',
    contentAdaptations: {
      'sentry-fundamentals': {
        explanation: 'Error tracking connects frontend and backend errors, giving you end-to-end visibility into user journeys and system health.',
        whyRelevant: 'As a full-stack engineer, you need to understand how frontend issues relate to backend problems and vice versa.',
        nextStepNudge: 'Next, we\'ll add backend error tracking to complete your full-stack monitoring setup.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring shows you the complete user journey - from page load times to API response times to database queries.',
        whyRelevant: 'Full-stack performance issues require understanding both client-side rendering and server-side processing bottlenecks.',
        nextStepNudge: 'Let\'s add unified logging across both frontend and backend for comprehensive debugging.'
      },
      'react-error-boundaries': {
        explanation: 'Unified logging captures context from both frontend and backend, helping you debug complex cross-layer issues.',
        whyRelevant: 'Full-stack debugging requires correlating frontend user actions with backend processing and database queries.',
        nextStepNudge: 'Next, we\'ll add session replay to see the user perspective of full-stack interactions.'
      },
      'distributed-tracing': {
        explanation: 'Distributed tracing follows requests from frontend to backend, showing you the complete technology stack performance.',
        whyRelevant: 'Understanding end-to-end request flows helps you optimize performance across your entire application stack.',
        nextStepNudge: 'Let\'s set up unified dashboards to monitor your full-stack application health.'
      }
    }
  },
  {
    roleId: 'sre',
    contentAdaptations: {
      'nodejs-integration': {
        explanation: 'Error monitoring aggregates issues across your entire infrastructure, giving you visibility into service health and reliability.',
        whyRelevant: 'As an SRE, you\'re responsible for system reliability - error tracking helps you identify and respond to incidents quickly.',
        nextStepNudge: 'Next, we\'ll add distributed tracing to help you understand request flows and identify bottlenecks across microservices.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring shows you service latency, throughput, and dependency health across your distributed systems.',
        whyRelevant: 'Performance issues can cascade through distributed systems - you need visibility to maintain your SLOs and prevent outages.',
        nextStepNudge: 'Let\'s set up centralized logging for structured incident data capture and analysis.'
      },
      'react-error-boundaries': {
        explanation: 'Centralized logging aggregates data from all services, providing structured context for incident response and post-mortems.',
        whyRelevant: 'During incidents, you need quick access to correlated logs across all services to understand root causes and impact.',
        nextStepNudge: 'Next, we\'ll build infrastructure-wide dashboards to monitor system health at scale.'
      },
      'custom-dashboards': {
        explanation: 'Infrastructure dashboards centralize SLIs, service health metrics, and capacity utilization across your entire platform.',
        whyRelevant: 'Unified dashboards help you correlate issues across services and provide critical context during incident response.',
        nextStepNudge: 'Let\'s set up intelligent alerting that integrates with your on-call processes and escalation policies.'
      }
    }
  },
  {
    roleId: 'ai-ml',
    contentAdaptations: {
      'nodejs-integration': {
        explanation: 'Error tracking captures failures in ML training pipelines, inference APIs, and model deployment workflows.',
        whyRelevant: 'AI/ML systems have unique failure modes - model errors, data pipeline issues, and inference timeouts require specialized monitoring.',
        nextStepNudge: 'Next, we\'ll monitor inference latency and throughput to optimize your model serving performance.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring tracks model inference latency, throughput, and resource utilization for ML workloads.',
        whyRelevant: 'ML performance directly impacts user experience and infrastructure costs - you need visibility into model efficiency.',
        nextStepNudge: 'Let\'s add structured logging to capture training metrics, data quality issues, and model confidence scores.'
      },
      'react-error-boundaries': {
        explanation: 'Structured logging captures training metrics, data drift indicators, feature importance, and model prediction confidence.',
        whyRelevant: 'ML debugging requires domain-specific context - logs help you track data quality and model behavior over time.',
        nextStepNudge: 'Next, we\'ll implement Seer and MCP for AI-powered debugging of complex ML workflows.'
      },
      'custom-dashboards': {
        explanation: 'Seer provides AI-powered debugging for ML workflows, while MCP enables model tracing and performance analysis.',
        whyRelevant: 'Complex ML systems benefit from AI-assisted debugging - Seer and MCP help you understand model behavior automatically.',
        nextStepNudge: 'Let\'s add distributed tracing to monitor your complete ML lifecycle from data ingestion to inference.'
      },
      'distributed-tracing': {
        explanation: 'Distributed tracing follows data through your ML pipeline - from ETL to training to deployment to inference.',
        whyRelevant: 'ML workflows span multiple systems and processes - tracing helps you identify bottlenecks in your data and model pipelines.',
        nextStepNudge: 'Next, we\'ll set up custom metrics to track model accuracy, drift, and business-specific KPIs.'
      }
    }
  },
  {
    roleId: 'pm-manager',
    contentAdaptations: {
      'custom-dashboards': {
        explanation: 'Dashboards translate complex technical metrics into clear, actionable insights for product decisions and stakeholder communication.',
        whyRelevant: 'As a PM or Engineering Manager, you need to understand product health trends and communicate quality status to leadership and stakeholders.',
        nextStepNudge: 'Next, we\'ll learn to build executive dashboards that clearly communicate product quality and performance trends.'
      },
      'performance-monitoring': {
        explanation: 'Performance monitoring reveals how technical issues directly impact user experience, retention, and business metrics.',
        whyRelevant: 'Understanding the connection between performance and user behavior helps you prioritize engineering work and make data-driven product decisions.',
        nextStepNudge: 'Let\'s set up stakeholder reporting systems to keep your team aligned on product quality goals.'
      },
      'team-workflows': {
        explanation: 'Automated reporting and alert systems ensure critical quality issues are surfaced to the right people at the right time.',
        whyRelevant: 'Establishing systematic quality review processes helps maintain high product standards and prevents issues from impacting users.',
        nextStepNudge: 'You\'re building a comprehensive data-driven approach to product quality management.'
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

// AI Integration Functions
import { AIGeneratedCourse } from '../types/aiGeneration';
import { getApprovedAIGeneratedCourses } from './aiGeneratedCourses';

/**
 * Get enhanced learning path that includes AI-generated content
 */
export function getEnhancedLearningPathForRole(roleId: EngineerRole): LearningPath | undefined {
  const basePath = getLearningPathForRole(roleId);
  if (!basePath) return undefined;

  // Get approved AI courses for this role
  const aiCourses = getApprovedAIGeneratedCourses()
    .filter(course => course.generationRequest.targetRoles.includes(roleId));

  // Create AI-generated learning path steps
  const aiSteps: LearningPathStep[] = aiCourses.map((course, index) => {
    const suggestedPriority = basePath.steps.length + index + 1;
    
    return {
      id: `ai-step-${course.id}`,
      title: course.title,
      description: course.description,
      feature: determineFeatureFromKeywords(course.generationRequest.keywords),
      modules: [course.id],
      outcomes: course.synthesizedContent.keyTakeaways.slice(0, 3),
      estimatedTime: course.duration,
      isCompleted: false,
      isUnlocked: true, // AI courses are unlocked by default
      priority: suggestedPriority
    };
  });

  return {
    ...basePath,
    steps: [...basePath.steps, ...aiSteps].sort((a, b) => a.priority - b.priority),
    totalEstimatedTime: calculateTotalTime([...basePath.steps, ...aiSteps])
  };
}

/**
 * Add AI-generated learning path step to existing role path
 */
export function addAIGeneratedLearningPathStep(
  roleId: EngineerRole, 
  aiCourse: AIGeneratedCourse, 
  suggestedPosition?: number
): boolean {
  const existingPath = getLearningPathForRole(roleId);
  if (!existingPath) return false;

  const newStep: LearningPathStep = {
    id: `ai-step-${aiCourse.id}`,
    title: aiCourse.title,
    description: aiCourse.description,
    feature: determineFeatureFromKeywords(aiCourse.generationRequest.keywords),
    modules: [aiCourse.id],
    outcomes: aiCourse.synthesizedContent.keyTakeaways.slice(0, 3),
    estimatedTime: aiCourse.duration,
    isCompleted: false,
    isUnlocked: true,
    priority: suggestedPosition || existingPath.steps.length + 1
  };

  // In a real implementation, this would update the database
  console.log(`Added AI step "${newStep.title}" to ${roleId} learning path`);
  return true;
}

/**
 * Generate personalization for AI course based on role
 */
export function generatePersonalizationForAICourse(
  aiCourse: AIGeneratedCourse, 
  roleId: EngineerRole
): PersonalizedContent | undefined {
  const rolePersonalization = aiCourse.rolePersonalizations.find(rp => rp.roleId === roleId);
  if (!rolePersonalization) return undefined;

  return {
    roleSpecificExplanation: rolePersonalization.explanation,
    whyRelevantToRole: rolePersonalization.whyRelevant,
    nextStepNudge: rolePersonalization.nextStepNudge,
    difficultyForRole: rolePersonalization.difficulty
  };
}

/**
 * Get all learning paths enhanced with AI content
 */
export function getAllEnhancedLearningPaths(): LearningPath[] {
  return roles.map(role => getEnhancedLearningPathForRole(role.id)).filter(Boolean) as LearningPath[];
}

/**
 * Get role-specific recommendations including AI courses
 */
export function getRoleRecommendations(roleId: EngineerRole): {
  nextCourses: string[];
  aiCourses: string[];
  reasoning: string[];
} {
  const basePath = getLearningPathForRole(roleId);
  const aiCourses = getApprovedAIGeneratedCourses()
    .filter(course => course.generationRequest.targetRoles.includes(roleId));

  const nextCourses = basePath?.steps
    .filter(step => !step.isCompleted && step.isUnlocked)
    .slice(0, 3)
    .map(step => step.modules[0]) || [];

  const aiCourseIds = aiCourses
    .sort((a, b) => b.qualityScore - a.qualityScore) // Sort by quality
    .slice(0, 2)
    .map(course => course.id);

  const reasoning = [
    `Recommended based on ${roleId} role requirements`,
    'AI courses provide cutting-edge content',
    'Courses are ordered by relevance and quality'
  ];

  return {
    nextCourses,
    aiCourses: aiCourseIds,
    reasoning
  };
}

/**
 * Helper function to determine Sentry feature from keywords
 */
function determineFeatureFromKeywords(keywords: string[]): SentryFeature {
  const keywordToFeature: Record<string, SentryFeature> = {
    'error': 'error-tracking',
    'performance': 'performance-monitoring',
    'profiling': 'performance-monitoring',
    'logging': 'logging',
    'session': 'session-replay',
    'replay': 'session-replay',
    'tracing': 'distributed-tracing',
    'distributed': 'distributed-tracing',
    'release': 'release-health',
    'dashboard': 'dashboards-alerts',
    'alert': 'dashboards-alerts',
    'integration': 'integrations',
    'feedback': 'user-feedback',
    'seer': 'seer-mcp',
    'mcp': 'seer-mcp',
    'metric': 'custom-metrics',
    'insight': 'metrics-insights',
    'stakeholder': 'stakeholder-reporting'
  };

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    for (const [key, feature] of Object.entries(keywordToFeature)) {
      if (lowerKeyword.includes(key)) {
        return feature;
      }
    }
  }

  return 'error-tracking'; // Default fallback
}

/**
 * Helper function to calculate total estimated time
 */
function calculateTotalTime(steps: LearningPathStep[]): string {
  const totalMinutes = steps.reduce((total, step) => {
    const timeMatch = step.estimatedTime.match(/(\d+(?:\.\d+)?)\s*(min|hour|hr)/i);
    if (timeMatch) {
      const value = parseFloat(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      return total + (unit.startsWith('hour') || unit === 'hr' ? value * 60 : value);
    }
    return total + 60; // Default to 1 hour if parsing fails
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours}.${Math.round(minutes / 6)} hours`;
  }
}

/**
 * Get learning path statistics including AI content
 */
export function getLearningPathStatistics() {
  const allPaths = getAllEnhancedLearningPaths();
  const aiSteps = allPaths.flatMap(path => 
    path.steps.filter(step => step.id.startsWith('ai-step-'))
  );

  return {
    totalPaths: allPaths.length,
    totalSteps: allPaths.reduce((sum, path) => sum + path.steps.length, 0),
    aiGeneratedSteps: aiSteps.length,
    averagePathLength: allPaths.reduce((sum, path) => sum + path.steps.length, 0) / allPaths.length,
    rolesWithAIContent: allPaths.filter(path => 
      path.steps.some(step => step.id.startsWith('ai-step-'))
    ).length
  };
}