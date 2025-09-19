-- Seed data for courses table
INSERT INTO courses (slug, title, description, content, difficulty, duration, category, image_url, is_published) VALUES
-- Core Sentry courses
('sentry-fundamentals', 'Sentry Fundamentals', 'See Sentry in action through a comprehensive 10-minute demo. Learn how to efficiently identify and resolve errors and performance issues using Sentry''s platform.', 'Complete course content for Sentry Fundamentals covering SDK installation, error tracking, and basic monitoring setup.', 'Beginner', '10 min', 'Foundation', '/course-thumbnails/sentry-fundamentals.jpg', true),

('react-error-boundaries', 'Sentry Logging', 'Master structured logging with Sentry. Learn to send, view, and query logs from your applications for better debugging and monitoring.', 'In-depth coverage of Sentry logging features, structured logging patterns, and log analysis.', 'Intermediate', '1.2 hrs', 'Monitoring', '/course-thumbnails/sentry-logging.jpg', true),

('performance-monitoring', 'Performance Monitoring', 'Deep dive into performance tracking, Core Web Vitals, and optimizing your application''s speed and user experience.', 'Comprehensive guide to performance monitoring, Web Vitals tracking, and performance optimization strategies.', 'Advanced', '2.1 hrs', 'Performance', '/course-thumbnails/performance-monitoring.jpg', true),

('nodejs-integration', 'Node.js Integration', 'Complete backend monitoring setup, express middleware integration, and tracking server-side errors effectively.', 'Complete Node.js integration guide covering Express middleware, error tracking, and backend monitoring.', 'Intermediate', '1.8 hrs', 'Backend', '/course-thumbnails/nodejs-integration.jpg', true),

('custom-dashboards', 'Custom Dashboards', 'Create powerful custom dashboards, set up alerts, and build monitoring workflows that fit your team''s needs.', 'Learn to build custom dashboards, configure alerts, and create monitoring workflows.', 'Advanced', '2.5 hrs', 'Advanced', '/course-thumbnails/custom-dashboards.jpg', true),

('team-workflows', 'Team Workflows', 'Establish team protocols, manage releases, and implement CI/CD integration for seamless development workflows.', 'Team collaboration features, release management, and CI/CD integration patterns.', 'Expert', '3.2 hrs', 'Enterprise', '/course-thumbnails/team-workflows.jpg', true),

('distributed-tracing', 'Distributed Tracing', 'Master distributed tracing across microservices, trace request flows, and identify performance bottlenecks in complex systems.', 'Advanced distributed tracing concepts, microservice monitoring, and trace analysis.', 'Advanced', '2.8 hrs', 'Performance', '/course-thumbnails/distributed-tracing.jpg', true),

('release-health', 'Release Health & Deployment Monitoring', 'Track release stability, monitor deployment health, and set up automated rollback triggers for safer deployments.', 'Release health monitoring, deployment tracking, and automated rollback strategies.', 'Intermediate', '2.0 hrs', 'DevOps', '/course-thumbnails/release-health.jpg', true),

('user-feedback', 'User Feedback Integration', 'Implement user feedback systems, link feedback to errors, and create feedback-driven debugging workflows.', 'User feedback integration, error correlation, and feedback-driven development workflows.', 'Intermediate', '1.5 hrs', 'UX', '/course-thumbnails/user-feedback.jpg', true),

('seer-mcp', 'Seer & MCP for AI/ML', 'Leverage Sentry''s AI-powered debugging with Seer and implement Model Context Protocol (MCP) for ML observability.', 'Advanced AI-powered debugging with Seer, MCP implementation, and ML observability patterns.', 'Advanced', '3.5 hrs', 'AI/ML', '/course-thumbnails/seer-mcp.jpg', true),

-- Management-focused courses
('stakeholder-dashboards', 'Building Effective Dashboards for Stakeholders', 'Learn to create compelling dashboards that translate technical metrics into business insights for PMs, executives, and cross-functional teams.', 'Dashboard design for non-technical stakeholders, metrics communication, and business impact visualization.', 'Beginner', '2.0 hrs', 'Management', '/course-thumbnails/stakeholder-dashboards.jpg', true),

('metrics-insights', 'Metrics-Driven Product Insights', 'Master the art of interpreting Sentry data to make informed product decisions, prioritize engineering work, and communicate impact to stakeholders.', 'Product management with Sentry data, metrics interpretation, and data-driven decision making.', 'Beginner', '1.5 hrs', 'Management', '/course-thumbnails/metrics-insights.jpg', true);