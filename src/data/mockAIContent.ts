import { 
  AIGeneratedCourse, 
  ResearchedContent,
  ResearchSource
} from '../types/aiGeneration';

// Mock data for demonstration purposes
export function generateMockAIContent() {
  // Create a sample AI-generated course
  const mockResearchedContent: ResearchedContent[] = [
    {
      source: ResearchSource.DOCS_MAIN,
      url: 'https://docs.sentry.io/product/profiling/',
      title: 'Sentry Profiling Documentation',
      content: 'Profiling in Sentry allows you to collect and analyze performance data from your applications. This helps identify bottlenecks and optimize performance.',
      relevanceScore: 0.95,
      extractedAt: new Date(),
      keyTopics: ['profiling', 'performance', 'optimization', 'bottlenecks'],
      codeExamples: [
        'import * as Sentry from "@sentry/react";\n\nSentry.init({\n  dsn: "YOUR_DSN",\n  integrations: [\n    new Sentry.BrowserProfilingIntegration(),\n  ],\n  profilesSampleRate: 1.0,\n});'
      ],
      useCases: [
        'Identifying slow functions in production',
        'Optimizing CPU-intensive operations',
        'Monitoring memory usage patterns'
      ]
    },
    {
      source: ResearchSource.BLOG,
      url: 'https://blog.sentry.io/profiling-best-practices/',
      title: 'Profiling Best Practices',
      content: 'Learn how to effectively use profiling data to improve application performance. Best practices include setting appropriate sample rates and focusing on hot paths.',
      relevanceScore: 0.88,
      extractedAt: new Date(),
      keyTopics: ['best practices', 'sample rates', 'hot paths', 'optimization'],
      codeExamples: [
        '// Set up profiling with custom sampling\nSentry.init({\n  profilesSampleRate: 0.1, // Profile 10% of transactions\n});'
      ],
      useCases: [
        'Production performance monitoring',
        'Development optimization workflows'
      ]
    }
  ];

  const mockAICourse: AIGeneratedCourse = {
    id: 'ai-profiling-course-demo',
    title: 'Advanced Profiling with Sentry',
    description: 'Master application profiling techniques using Sentry to identify performance bottlenecks and optimize your code. Learn to set up profiling, analyze data, and implement performance improvements.',
    duration: '2.5 hrs',
    level: 'Advanced',
    rating: 4.7,
    students: 0,
    category: 'Performance',
    isPopular: false,
    isAiGenerated: true,
    generationRequest: {
      id: 'req-profiling-demo-001',
      keywords: ['profiling', 'performance', 'optimization'],
      selectedSources: [
        {
          source: ResearchSource.DOCS_MAIN,
          enabled: true,
          priority: 1,
          description: 'Official Sentry documentation'
        },
        {
          source: ResearchSource.BLOG,
          enabled: true,
          priority: 2,
          description: 'Sentry engineering blog'
        }
      ],
      targetRoles: ['frontend', 'backend', 'fullstack'],

      includeCodeExamples: true,
      includeScenarios: true,
      generateLearningPath: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdBy: 'admin'
    },
    researchSources: mockResearchedContent,
    synthesizedContent: {
      mainConcepts: [
        'Profiling fundamentals and metrics',
        'Performance bottleneck identification',
        'Code optimization strategies',
        'Production profiling best practices'
      ],
      keyTakeaways: [
        'Set up continuous profiling in production environments',
        'Identify and prioritize performance bottlenecks',
        'Use flame graphs to analyze execution patterns',
        'Implement sampling strategies for minimal overhead',
        'Correlate profiling data with user experience metrics',
        'Optimize hot paths based on profiling insights'
      ],
      codeExamples: [
        'import * as Sentry from "@sentry/react";\n\nSentry.init({\n  dsn: "YOUR_DSN",\n  integrations: [\n    new Sentry.BrowserProfilingIntegration(),\n  ],\n  profilesSampleRate: 1.0,\n});',
        '// Custom profiling spans\nconst span = Sentry.startSpan({ name: "expensive-operation" }, () => {\n  // Your performance-critical code here\n  return performExpensiveCalculation();\n});'
      ],
      useCases: [
        'Identifying slow database queries in web applications',
        'Optimizing React component rendering performance',
        'Monitoring API response times and bottlenecks',
        'Analyzing memory allocation patterns',
        'Debugging performance regressions after deployments'
      ],
      bestPractices: [
        'Use appropriate sampling rates to balance data quality and overhead',
        'Focus on optimizing the most frequently executed code paths',
        'Correlate profiling data with business metrics and user experience',
        'Set up alerts for performance degradation',
        'Regularly review and act on profiling insights'
      ],
      commonPitfalls: [
        'Setting profiling sample rates too high in production',
        'Ignoring the performance impact of profiling itself',
        'Focusing on micro-optimizations instead of major bottlenecks',
        'Not correlating profiling data with real user experience'
      ],
      relatedFeatures: ['performance-monitoring', 'error-tracking', 'dashboards-alerts']
    },
    generatedModules: [
      {
        id: 'profiling-setup-module',
        title: 'Setting Up Profiling',
        description: 'Learn how to configure and enable profiling in your Sentry-monitored applications.',
        duration: '20 min',
        isCompleted: false,
        keyTakeaways: [
          'Configure profiling integrations for different platforms',
          'Set appropriate sampling rates for production use',
          'Verify profiling data collection'
        ],
        scenario: 'Your team needs to identify why the checkout process in your e-commerce application has become 40% slower over the past month.',
        codeExample: 'import * as Sentry from "@sentry/react";\n\n// Enable profiling in your Sentry configuration\nSentry.init({\n  dsn: "YOUR_DSN_HERE",\n  integrations: [\n    new Sentry.BrowserProfilingIntegration(),\n  ],\n  // Profile 10% of transactions in production\n  profilesSampleRate: 0.1,\n  // Enable performance monitoring\n  tracesSampleRate: 1.0,\n});',
        contentConfig: {
          hasHandsOn: true,
          hasScenario: true,
          hasCodeExample: true,
          estimatedReadingTime: 8
        },
        sourceReferences: ['https://docs.sentry.io/product/profiling/'],
        confidence: 0.92
      },
      {
        id: 'analyzing-profiles-module',
        title: 'Analyzing Profile Data',
        description: 'Master the art of reading flame graphs and identifying performance bottlenecks from profiling data.',
        duration: '35 min',
        isCompleted: false,
        keyTakeaways: [
          'Read and interpret flame graphs effectively',
          'Identify hot paths and performance bottlenecks',
          'Correlate profiling data with user experience metrics'
        ],
        scenario: 'You have collected profiling data showing that 60% of CPU time is spent in an unknown function. Learn to trace this back to actionable optimization opportunities.',
        codeExample: '// Create custom profiling spans for detailed analysis\nconst transaction = Sentry.startTransaction({ name: "user-checkout" });\n\nconst span = transaction.startChild({\n  op: "function",\n  description: "process-payment"\n});\n\ntry {\n  const result = await processPayment(paymentData);\n  span.setStatus("ok");\n  return result;\n} catch (error) {\n  span.setStatus("internal_error");\n  throw error;\n} finally {\n  span.finish();\n  transaction.finish();\n}',
        contentConfig: {
          hasHandsOn: true,
          hasScenario: true,
          hasCodeExample: true,
          estimatedReadingTime: 12
        },
        sourceReferences: ['https://docs.sentry.io/product/profiling/', 'https://blog.sentry.io/profiling-analysis/'],
        confidence: 0.89
      },
      {
        id: 'optimization-strategies-module',
        title: 'Performance Optimization Strategies',
        description: 'Apply profiling insights to implement effective performance optimizations in your codebase.',
        duration: '30 min',
        isCompleted: false,
        keyTakeaways: [
          'Prioritize optimization efforts based on impact',
          'Implement code-level optimizations guided by profiling data',
          'Measure and validate performance improvements'
        ],
        scenario: 'Using profiling data, you\'ve identified that JSON serialization is consuming 25% of your API response time. Learn systematic approaches to optimize this bottleneck.',
        codeExample: '// Before optimization - identified via profiling\nfunction serializeResponse(data) {\n  return JSON.stringify(data); // Hot path identified\n}\n\n// After optimization\nconst responseCache = new Map();\n\nfunction serializeResponse(data) {\n  const key = generateCacheKey(data);\n  if (responseCache.has(key)) {\n    return responseCache.get(key);\n  }\n  \n  const serialized = JSON.stringify(data);\n  responseCache.set(key, serialized);\n  return serialized;\n}',
        contentConfig: {
          hasHandsOn: true,
          hasScenario: true,
          hasCodeExample: true,
          estimatedReadingTime: 10
        },
        sourceReferences: ['https://docs.sentry.io/product/profiling/', 'https://blog.sentry.io/optimization-strategies/'],
        confidence: 0.87
      },
      {
        id: 'production-profiling-module',
        title: 'Production Profiling Best Practices',
        description: 'Implement sustainable profiling strategies for production environments without impacting performance.',
        duration: '25 min',
        isCompleted: false,
        keyTakeaways: [
          'Balance data collection with performance overhead',
          'Set up intelligent sampling strategies',
          'Create alerts for performance regressions'
        ],
        scenario: 'Your application serves 10,000 requests per second. Design a profiling strategy that provides actionable insights while maintaining sub-1ms overhead.',
        codeExample: '// Adaptive sampling based on request characteristics\nfunction getProfileSampleRate(request) {\n  // Higher sampling for error conditions\n  if (request.hasErrors) {\n    return 1.0; // Profile 100% of error cases\n  }\n  \n  // Higher sampling for slow requests\n  if (request.responseTime > 1000) {\n    return 0.5; // Profile 50% of slow requests\n  }\n  \n  // Normal sampling for regular traffic\n  return 0.01; // Profile 1% of normal requests\n}\n\n// Apply dynamic sampling\nSentry.configureScope(scope => {\n  scope.setContext("profiling", {\n    sampleRate: getProfileSampleRate(currentRequest)\n  });\n});',
        contentConfig: {
          hasHandsOn: true,
          hasScenario: true,
          hasCodeExample: true,
          estimatedReadingTime: 9
        },
        sourceReferences: ['https://docs.sentry.io/product/profiling/', 'https://blog.sentry.io/production-profiling/'],
        confidence: 0.90
      }
    ],
    rolePersonalizations: [
      {
        roleId: 'frontend',
        explanation: 'Frontend profiling focuses on JavaScript execution, rendering performance, and user interaction bottlenecks. You\'ll learn to identify slow React components, optimize bundle sizes, and improve Core Web Vitals.',
        whyRelevant: 'Frontend performance directly impacts user experience, conversion rates, and SEO rankings. Profiling helps you identify which JavaScript code is causing the biggest user experience issues.',
        nextStepNudge: 'Ready to optimize your React components and improve page load times? Continue to see how profiling integrates with your frontend monitoring workflow.',
        difficulty: 'advanced',
        roleSpecificExamples: [
          'Profiling React component re-renders',
          'Identifying expensive JavaScript computations',
          'Optimizing bundle loading and code splitting'
        ],
        roleSpecificUseCases: [
          'Debugging slow page loads in single-page applications',
          'Optimizing user interaction response times',
          'Improving Core Web Vitals scores'
        ]
      },
      {
        roleId: 'backend',
        explanation: 'Backend profiling helps you identify database bottlenecks, slow API endpoints, and inefficient algorithms. Learn to optimize server response times and reduce infrastructure costs.',
        whyRelevant: 'Backend performance affects every user request and directly impacts server costs, scalability, and user satisfaction. Profiling helps prioritize optimization efforts for maximum impact.',
        nextStepNudge: 'Ready to optimize your API performance and reduce server costs? Learn how to integrate profiling into your backend monitoring strategy.',
        difficulty: 'advanced',
        roleSpecificExamples: [
          'Profiling database query performance',
          'Identifying CPU-intensive API operations',
          'Optimizing microservice communication'
        ],
        roleSpecificUseCases: [
          'Reducing API response times',
          'Optimizing database query performance',
          'Minimizing resource consumption and costs'
        ]
      },
      {
        roleId: 'fullstack',
        explanation: 'Full-stack profiling provides end-to-end performance insights from browser to database. You\'ll learn to correlate frontend and backend performance data for comprehensive optimization.',
        whyRelevant: 'As a full-stack engineer, you need visibility into performance bottlenecks across the entire application stack to optimize user experience and system efficiency.',
        nextStepNudge: 'Ready to optimize performance across your entire application stack? Learn how to correlate frontend and backend profiling data.',
        difficulty: 'advanced',
        roleSpecificExamples: [
          'Tracing performance across frontend and backend',
          'Optimizing full user journey performance',
          'Balancing client and server-side processing'
        ],
        roleSpecificUseCases: [
          'End-to-end performance optimization',
          'Correlating frontend and backend bottlenecks',
          'Optimizing complete user workflows'
        ]
      }
    ],
    qualityScore: 0.89,
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lastModified: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    version: 1,
    approvedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    approvedBy: 'admin'
  };

  // Advanced Profiling course removed - was showing in main UI
  // Keeping the course definition for reference but not adding to store
  // addAIGeneratedCourse(mockAICourse);
  // addGenerationRequest(mockAICourse.generation_request);
  // updateGenerationProgress(mockAICourse.generation_request.id, { ... });

  // Note: Additional mock courses can be added here if needed for testing

  console.log('Mock AI content generated and added to store');
  return mockAICourse;
}

// Auto-generate mock content when this module is imported
// Comment this out if you don't want automatic generation
generateMockAIContent();