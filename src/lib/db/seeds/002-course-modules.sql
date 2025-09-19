-- Seed data for course modules table
-- First, we need to get the course IDs from the courses table
WITH course_ids AS (
  SELECT id, slug FROM courses
)
INSERT INTO course_modules (course_id, title, content, "order", duration) VALUES
-- Sentry Fundamentals modules (course slug: sentry-fundamentals)
((SELECT id FROM course_ids WHERE slug = 'sentry-fundamentals'), 'Install Sentry SDK', 'Set up Sentry in your Next.js application using the installation wizard and configure error monitoring, tracing, and session replay.', 1, '8 min'),
((SELECT id FROM course_ids WHERE slug = 'sentry-fundamentals'), 'Verify Your Setup', 'Test your Sentry configuration by triggering sample errors and verifying data appears in your Sentry project dashboard.', 2, '12 min'),
((SELECT id FROM course_ids WHERE slug = 'sentry-fundamentals'), 'Sending Logs', 'Learn to capture exceptions, send custom messages, and add context to your error reports for better debugging.', 3, '15 min'),
((SELECT id FROM course_ids WHERE slug = 'sentry-fundamentals'), 'Customizing Session Replay', 'Configure session replay settings, privacy controls, and sampling rates to capture meaningful user interactions.', 4, '12 min'),
((SELECT id FROM course_ids WHERE slug = 'sentry-fundamentals'), 'Distributed Tracing', 'Implement performance monitoring with custom spans, trace API calls, and monitor user interactions across your application.', 5, '18 min'),

-- Sentry Logging modules (course slug: react-error-boundaries) 
((SELECT id FROM course_ids WHERE slug = 'react-error-boundaries'), 'Introduction to Sentry Logs', 'Understanding structured logging and why logs are essential for debugging applications beyond errors.', 1, '8 min'),
((SELECT id FROM course_ids WHERE slug = 'react-error-boundaries'), 'Setting Up Sentry Logging', 'Learn how to enable logging in your Sentry SDK configuration and start capturing logs from your applications.', 2, '12 min'),
((SELECT id FROM course_ids WHERE slug = 'react-error-boundaries'), 'Structured Logging with Sentry.logger', 'Master the Sentry.logger API including trace, debug, info, warn, error, and fatal log levels with practical examples.', 3, '18 min'),
((SELECT id FROM course_ids WHERE slug = 'react-error-boundaries'), 'Advanced Logging Features', 'Explore console logging integration, Winston integration, and the beforeSendLog callback for filtering logs.', 4, '15 min'),
((SELECT id FROM course_ids WHERE slug = 'react-error-boundaries'), 'Viewing and Searching Logs in Sentry', 'Learn to navigate the Sentry Logs UI, search by text and properties, create alerts, and build dashboard widgets.', 5, '19 min'),

-- Performance Monitoring modules (course slug: performance-monitoring)
((SELECT id FROM course_ids WHERE slug = 'performance-monitoring'), 'Core Web Vitals Overview', 'Understanding LCP, FID, and CLS metrics and their impact on user experience and SEO.', 1, '25 min'),
((SELECT id FROM course_ids WHERE slug = 'performance-monitoring'), 'Setting Up Performance Monitoring', 'Configure Sentry performance monitoring in your application with proper sampling rates and custom instrumentation.', 2, '30 min'),
((SELECT id FROM course_ids WHERE slug = 'performance-monitoring'), 'Custom Performance Metrics', 'Create custom transactions and spans to track specific application performance patterns.', 3, '35 min'),
((SELECT id FROM course_ids WHERE slug = 'performance-monitoring'), 'Performance Optimization Strategies', 'Identify bottlenecks and apply optimization techniques based on Sentry performance data.', 4, '40 min'),

-- Node.js Integration modules (course slug: nodejs-integration)
((SELECT id FROM course_ids WHERE slug = 'nodejs-integration'), 'Node.js SDK Installation', 'Install and configure the Sentry Node.js SDK for Express.js and other Node.js frameworks.', 1, '20 min'),
((SELECT id FROM course_ids WHERE slug = 'nodejs-integration'), 'Express Middleware Integration', 'Set up Sentry middleware for Express.js applications to automatically capture errors and performance data.', 2, '25 min'),
((SELECT id FROM course_ids WHERE slug = 'nodejs-integration'), 'Database Query Monitoring', 'Monitor database queries and transactions with Sentry''s database integration features.', 3, '30 min'),
((SELECT id FROM course_ids WHERE slug = 'nodejs-integration'), 'API Error Handling', 'Implement comprehensive error handling and monitoring for REST APIs and GraphQL endpoints.', 4, '33 min'),

-- Custom Dashboards modules (course slug: custom-dashboards)
((SELECT id FROM course_ids WHERE slug = 'custom-dashboards'), 'Dashboard Fundamentals', 'Understanding different dashboard types and when to use them for various monitoring scenarios.', 1, '30 min'),
((SELECT id FROM course_ids WHERE slug = 'custom-dashboards'), 'Building Widget Collections', 'Create and organize dashboard widgets for error rates, performance metrics, and custom business KPIs.', 2, '45 min'),
((SELECT id FROM course_ids WHERE slug = 'custom-dashboards'), 'Advanced Querying and Filtering', 'Master Sentry''s query language to create sophisticated dashboard filters and aggregations.', 3, '40 min'),
((SELECT id FROM course_ids WHERE slug = 'custom-dashboards'), 'Alert Configuration', 'Set up intelligent alerts based on dashboard metrics with proper thresholds and notification channels.', 4, '35 min'),

-- Team Workflows modules (course slug: team-workflows)
((SELECT id FROM course_ids WHERE slug = 'team-workflows'), 'Team Setup and Permissions', 'Configure team access, roles, and permissions for collaborative Sentry usage.', 1, '25 min'),
((SELECT id FROM course_ids WHERE slug = 'team-workflows'), 'Issue Assignment and Triage', 'Implement effective issue assignment workflows and triage processes for teams.', 2, '30 min'),
((SELECT id FROM course_ids WHERE slug = 'team-workflows'), 'Release Management', 'Set up release tracking, deploy notifications, and release health monitoring.', 3, '45 min'),
((SELECT id FROM course_ids WHERE slug = 'team-workflows'), 'CI/CD Integration', 'Integrate Sentry with GitHub Actions, Jenkins, and other CI/CD platforms.', 4, '50 min'),
((SELECT id FROM course_ids WHERE slug = 'team-workflows'), 'Integration Ecosystem', 'Connect Sentry with Slack, Jira, PagerDuty, and other team tools.', 5, '42 min');