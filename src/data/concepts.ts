export interface Concept {
  id: string;
  title: string;
  description: string[];  // Array of paragraphs
  arcadeUrl?: string;     // Optional for concepts using images
  imageUrl?: string;      // For tracing concepts using documentation images
  imageAlt?: string;      // Alt text for images
  order: number;
  useImage?: boolean;     // Flag to determine if using image instead of arcade
}

export const concepts: Concept[] = [
  {
    id: "event",
    title: "Event",
    description: [
      "An event is an individual occurrence captured by Sentry, representing something that happened in your application. Events can be errors, exceptions, messages, or transactions that provide insight into your application's behavior and health.",
      "When your application encounters an error or exception, Sentry automatically captures it as an event with detailed context including stack traces, environment information, and user data. You can also manually capture custom events for specific scenarios.",
      "Each event contains structured data that helps developers understand what went wrong, when it happened, and the circumstances surrounding the occurrence, making debugging and issue resolution more efficient."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 1
  },
  {
    id: "issue",
    title: "Issue",
    description: [
      "An issue is a group of similar events created by Sentry's grouping algorithm. When multiple events share common characteristics, Sentry automatically groups them together to reduce noise and help you focus on unique problems.",
      "The grouping algorithm analyzes various factors including stack traces, error messages, and other event properties to determine which events belong together. This intelligent grouping prevents you from being overwhelmed by thousands of duplicate error reports.",
      "Issues provide a consolidated view of recurring problems in your application, allowing you to track the frequency, impact, and resolution status of each unique problem across your entire codebase."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 2
  },
  {
    id: "alert",
    title: "Alert",
    description: [
      "An alert is a notification triggered when certain conditions are met in your Sentry data. Alerts help ensure your team is immediately notified about critical issues, performance degradations, or unusual patterns in your application.",
      "You can configure alert rules based on various criteria such as error frequency, new issues appearing, performance thresholds being exceeded, or custom conditions specific to your application's needs.",
      "Alerts integrate with popular communication tools like Slack, email, PagerDuty, and webhooks, ensuring notifications reach your team through their preferred channels and enabling rapid response to critical issues."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 3
  },
  {
    id: "release",
    title: "Release",
    description: [
      "A release is a version of your code deployed to an environment. Releases in Sentry enable you to track which version of your application is running and correlate errors and performance issues with specific code deployments.",
      "By associating events with releases, you can quickly identify when new issues were introduced, track the health of each deployment, and understand the impact of code changes on your application's stability and performance.",
      "Release tracking enables powerful regression detection, deploy health monitoring, and the ability to quickly rollback problematic deployments when issues are detected in production environments."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 4
  },
  {
    id: "environment",
    title: "Environment",
    description: [
      "An environment is a deployment stage such as production, staging, or development. Environments provide crucial context for your events and enable you to separate data from different deployment stages.",
      "Environment separation ensures that test errors don't pollute your production data and allows teams to focus on issues relevant to each specific deployment stage. This separation is essential for maintaining clean, actionable monitoring data.",
      "You can filter your Sentry data by environment to quickly switch context between different deployment stages, making it easy to verify fixes in staging before they reach production or debug development-specific issues."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 5
  },
  {
    id: "project",
    title: "Project",
    description: [
      "A project is a container for your application's events, settings, and team access within Sentry. Each project represents an individual application or service and maintains its own configuration, error data, and access controls.",
      "Projects enable you to organize your monitoring data by application or service, ensuring that teams only see errors and performance data relevant to their work while maintaining security and proper access control.",
      "Within a project, you can configure integrations, alert rules, release tracking, and team permissions, providing a complete monitoring solution tailored to each application's specific needs and team structure."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 6
  },
  {
    id: "organization",
    title: "Organization",
    description: [
      "An organization is the top-level container in Sentry that houses multiple projects and manages team access and billing. Organizations provide the highest level of structure for managing your monitoring infrastructure.",
      "Within an organization, you can create multiple projects, manage team members and their permissions, configure billing and usage limits, and maintain consistent settings across all your applications and services.",
      "Organizations enable enterprise-level management of your Sentry deployment, providing centralized control over access, billing, and configuration while allowing individual projects to maintain their specific settings and team structures."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 7
  },
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    description: [
      "Breadcrumbs are a trail of events leading up to an issue, providing crucial context for understanding what happened before an error occurred. They capture user actions, system events, and application state changes.",
      "When an error occurs, Sentry automatically includes breadcrumbs that show the sequence of events that led to the problem. This timeline helps developers reproduce issues and understand the user experience that triggered the error.",
      "Breadcrumbs can include navigation events, user interactions, API calls, console messages, and custom events, creating a comprehensive audit trail that makes debugging significantly more effective and efficient."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 8
  },
  {
    id: "tags",
    title: "Tags",
    description: [
      "Tags are key-value pairs that provide searchable metadata for your events. They enable you to categorize, filter, and search your Sentry data based on custom criteria relevant to your application and business logic.",
      "Sentry automatically adds many useful tags such as browser type, operating system, release version, and environment. You can also add custom tags to track specific user segments, feature flags, or any other relevant metadata.",
      "Tags make it easy to slice and dice your error data, enabling you to quickly find issues affecting specific user groups, browser versions, geographic regions, or any other dimension important to your application."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 9
  },
  {
    id: "context",
    title: "Context",
    description: [
      "Context is additional data attached to events that provides deeper insight into the circumstances surrounding an error or performance issue. Context data helps developers understand the full picture of what was happening when an event occurred.",
      "Context can include user information, device details, application state, custom business data, and any other relevant information that helps with debugging and understanding the impact of issues on your users.",
      "Rich context data transforms raw error reports into actionable insights, enabling faster debugging, better user impact assessment, and more informed decisions about issue prioritization and resolution strategies."
    ],
    arcadeUrl: "https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true",
    order: 10
  },
  {
    id: "distributed-tracing",
    title: "Distributed Tracing",
    description: [
      "Distributed tracing allows you to follow a request as it travels through multiple services and systems in your application architecture. It provides end-to-end visibility into how requests flow through your distributed systems.",
      "When a user makes a request to your application, distributed tracing captures the entire journey - from the initial web request through various microservices, databases, and external APIs. This creates a complete picture of request flow and timing.",
      "Distributed tracing is essential for understanding performance bottlenecks in modern microservice architectures, identifying which services are causing slowdowns, and optimizing the overall user experience across complex distributed systems."
    ],
    useImage: true,
    imageUrl: "/anatomy-of-a-trace.webp",
    imageAlt: "The anatomy of a trace showing trace spanning entire operation, browser connect, http.client spans, and nested resource operations with timing details",
    order: 11
  },
  {
    id: "transactions-spans",
    title: "Transactions and Spans",
    description: [
      "A transaction represents a single operation or request in your application, such as a web request, background job, or user interaction. Transactions provide the top-level context for performance monitoring and contain detailed timing information.",
      "Spans are the individual operations that make up a transaction, such as database queries, API calls, or function executions. Spans have a parent-child relationship that creates a hierarchical view of all operations within a transaction.",
      "Together, transactions and spans create a detailed performance profile of your application, showing exactly where time is spent and which operations are causing performance bottlenecks. This granular timing data enables precise performance optimization."
    ],
    useImage: true,
    imageUrl: "/anatomy-of-a-trace.webp",
    imageAlt: "Trace anatomy diagram showing transaction structure with nested spans including browser connect, http.client operations, and resource spans with timing information",
    order: 12
  }
];