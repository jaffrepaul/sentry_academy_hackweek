-- Seed data for learning paths table
INSERT INTO learning_paths (slug, title, description, role, courses) VALUES
-- Frontend Developer Learning Path
('frontend-path', 'Frontend Web Developer Learning Path', 'Monitor client-side issues, analyze user experience, and incorporate user feedback for rapid debugging', 'frontend', '[1,3,2,10,9,5,6]'),

-- Backend Engineer Learning Path  
('backend-path', 'Backend Engineer Learning Path', 'Gain deep visibility into backend errors, logging, and performance bottlenecks', 'backend', '[4,3,2,7,6,5]'),

-- Full-stack Developer Learning Path
('fullstack-path', 'Full-stack Developer Learning Path', 'Build a seamless, end-to-end observability pipeline across frontend and backend systems', 'fullstack', '[1,4,3,2,10,7,5]'),

-- SRE/DevOps Learning Path
('sre-path', 'SRE/DevOps/Infrastructure Learning Path', 'Maintain high reliability and proactive alerting across distributed systems', 'sre', '[4,3,2,5,6,8,6]'),

-- AI/ML-Aware Developer Learning Path
('ai-ml-path', 'AI/ML-Aware Developer Learning Path', 'Debug AI pipelines and model performance with observability-first principles', 'ai-ml', '[4,3,2,10,7,5]'),

-- Product Manager / Engineering Manager Learning Path
('pm-manager-path', 'Metrics-Driven Insights with Sentry', 'Turn raw observability data into actionable insights for improving product quality, performance, and user experience', 'pm-manager', '[5,3,6,11,12]')
ON CONFLICT (slug) DO NOTHING;