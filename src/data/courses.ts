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
    description: "Learn the core concepts of error monitoring, how to set up your first Sentry project, and capture your first errors.",
    duration: "45 min",
    level: "Beginner",
    rating: 4.9,
    students: 12500,
    category: "Foundation",
    isPopular: true
  },
  {
    id: "react-error-boundaries",
    title: "React Error Boundaries",
    description: "Master React-specific error handling, implement error boundaries, and integrate Sentry for comprehensive frontend monitoring.",
    duration: "1.2 hrs",
    level: "Intermediate",
    rating: 4.8,
    students: 8900,
    category: "Frontend"
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

export const courseModules: CourseModule[] = [
  {
    title: "Logs",
    description: "Understanding the fundamentals of logging and why logs are essential for debugging applications.",
    duration: "8 min",
    isCompleted: true
  },
  {
    title: "Code Intros",
    description: "Learn how to instrument your code with Sentry SDK and capture meaningful error context.",
    duration: "12 min",
    isCompleted: true
  },
  {
    title: "Why it matters?",
    description: "Discover the business impact of proper error monitoring and how it improves user experience.",
    duration: "6 min",
    isCompleted: false
  },
  {
    title: "Key Message: Do XYZ with ABC!",
    description: "Master the core concepts and best practices for effective error tracking implementation.",
    duration: "15 min",
    isCompleted: false
  },
  {
    title: "Real World Example",
    description: "Walk through a practical scenario: handling database timeouts and preventing error cascading.",
    duration: "20 min",
    isCompleted: false
  }
];
