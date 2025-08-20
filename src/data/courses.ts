export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  rating: number;
  students: number;
  category: string;
  isPopular?: boolean;
}

export const courses: Course[] = [
  {
    id: "sentry-fundamentals",
    title: "Sentry Fundamentals",
    description: "See Sentry in action through a comprehensive 10-minute demo. Learn how to efficiently identify and resolve errors and performance issues using Sentry's platform.",
    duration: "10 min",
    level: "Beginner",
    rating: 4.9,
    students: 12500,
    category: "Foundation",
    isPopular: true
  },
  {
    id: "react-error-boundaries",
    title: "Sentry Logging ",
    description: "Master structured logging with Sentry. Learn to send, view, and query logs from your applications for better debugging and monitoring.",
    duration: "1.2 hrs",
    level: "Intermediate",
    rating: 4.8,
    students: 8900,
    category: "Monitoring"
  },
  {
    id: "performance-monitoring",
    title: "Performance Monitoring",
    description: "Deep dive into performance tracking, Core Web Vitals, and optimizing your application's speed and user experience.",
    duration: "2.1 hrs",
    level: "Advanced",
    rating: 4.7,
    students: 6400,
    category: "Performance"
  },
  {
    id: "nodejs-integration",
    title: "Node.js Integration",
    description: "Complete backend monitoring setup, express middleware integration, and tracking server-side errors effectively.",
    duration: "1.8 hrs",
    level: "Intermediate",
    rating: 4.8,
    students: 7200,
    category: "Backend"
  },
  {
    id: "custom-dashboards",
    title: "Custom Dashboards",
    description: "Create powerful custom dashboards, set up alerts, and build monitoring workflows that fit your team's needs.",
    duration: "2.5 hrs",
    level: "Advanced",
    rating: 4.6,
    students: 4100,
    category: "Advanced"
  },
  {
    id: "team-workflows",
    title: "Team Workflows",
    description: "Establish team protocols, manage releases, and implement CI/CD integration for seamless development workflows.",
    duration: "3.2 hrs",
    level: "Expert",
    rating: 4.9,
    students: 3800,
    category: "Enterprise",
    isPopular: true
  }
];

export interface CourseModule {
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
}

// Sentry Fundamentals modules
export const sentryFundamentalsModules: CourseModule[] = [
  {
    title: "Install Sentry SDK",
    description: "Set up Sentry in your Next.js application using the installation wizard and configure error monitoring, tracing, and session replay.",
    duration: "8 min",
    isCompleted: true
  },
  {
    title: "Verify Your Setup",
    description: "Test your Sentry configuration by triggering sample errors and verifying data appears in your Sentry project dashboard.",
    duration: "12 min",
    isCompleted: true
  },
  {
    title: "Sending Logs",
    description: "Learn to capture exceptions, send custom messages, and add context to your error reports for better debugging.",
    duration: "15 min",
    isCompleted: false
  },
  {
    title: "Customizing Session Replay",
    description: "Configure session replay settings, privacy controls, and sampling rates to capture meaningful user interactions.",
    duration: "12 min",
    isCompleted: false
  },
  {
    title: "Distributed Tracing",
    description: "Implement performance monitoring with custom spans, trace API calls, and monitor user interactions across your application.",
    duration: "18 min",
    isCompleted: false
  }
];

// Sentry Logging modules  
export const sentryLoggingModules: CourseModule[] = [
  {
    title: "Introduction to Sentry Logs",
    description: "Understanding structured logging and why logs are essential for debugging applications beyond errors.",
    duration: "8 min",
    isCompleted: true
  },
  {
    title: "Setting Up Sentry Logging",
    description: "Learn how to enable logging in your Sentry SDK configuration and start capturing logs from your applications.",
    duration: "12 min",
    isCompleted: true
  },
  {
    title: "Structured Logging with Sentry.logger",
    description: "Master the Sentry.logger API including trace, debug, info, warn, error, and fatal log levels with practical examples.",
    duration: "18 min",
    isCompleted: false
  },
  {
    title: "Advanced Logging Features",
    description: "Explore console logging integration, Winston integration, and the beforeSendLog callback for filtering logs.",
    duration: "15 min",
    isCompleted: false
  },
  {
    title: "Viewing and Searching Logs in Sentry",
    description: "Learn to navigate the Sentry Logs UI, search by text and properties, create alerts, and build dashboard widgets.",
    duration: "19 min",
    isCompleted: false
  }
];

// Default modules for backward compatibility
export const courseModules: CourseModule[] = sentryFundamentalsModules;
