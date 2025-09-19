import { Course, CourseModule } from '../data/courses';
import { EngineerRole, SentryFeature, LearningPathStep } from './roles';

// Enum for research sources
export enum ResearchSource {
  DOCS_MAIN = 'https://docs.sentry.io',
  SENTRY_MAIN = 'https://sentry.io',
  DOCS_PRODUCT = 'https://docs.sentry.io/product/',
  BLOG = 'https://sentry-blog.sentry.dev/',
  VS_LOGGING = 'https://sentry.io/vs/logging/',
  ANSWERS = 'https://sentry.io/answers/',
  SUPPORT = 'https://sentry.zendesk.com/hc/en-us/',
  YOUTUBE = 'https://www.youtube.com/@Sentry-monitoring/videos',
  CUSTOMERS = 'https://sentry.io/customers/'
}

// Research source configuration
export interface ResearchSourceConfig {
  source: ResearchSource;
  enabled: boolean;
  priority: number; // 1-5, where 1 is highest priority
  description: string;
}

// Content generation request
export interface ContentGenerationRequest {
  id: string;
  keywords: string[];
  selectedSources: ResearchSourceConfig[];
  targetRoles: EngineerRole[];
  includeCodeExamples: boolean;
  includeScenarios: boolean;
  generateLearningPath: boolean;
  createdAt: Date;
  createdBy: string; // Admin user identifier
}

// Generation status tracking
export type GenerationStatus = 
  | 'pending' 
  | 'researching' 
  | 'generating' 
  | 'review-needed' 
  | 'approved' 
  | 'rejected' 
  | 'published'
  | 'error';

export interface GenerationProgress {
  status: GenerationStatus;
  currentStep: string;
  progress: number; // 0-100
  logs: string[];
  error?: string;
  estimatedTimeRemaining?: number; // in seconds
}

// Research data structures
export interface ResearchedContent {
  source: ResearchSource;
  url: string;
  title: string;
  content: string;
  relevanceScore: number; // 0-1
  extractedAt: Date;
  keyTopics: string[];
  codeExamples?: string[];
  useCases?: string[];
}

export interface SynthesizedContent {
  mainConcepts: string[];
  keyTakeaways: string[];
  codeExamples: string[];
  useCases: string[];
  bestPractices: string[];
  commonPitfalls: string[];
  relatedFeatures: SentryFeature[];
}

// AI-generated course content
export interface AIGeneratedCourse extends Course {
  isAiGenerated: true;
  generationRequest: ContentGenerationRequest;
  researchSources: ResearchedContent[];
  synthesizedContent: SynthesizedContent;
  generatedModules: AIGeneratedModule[];
  rolePersonalizations: AIGeneratedPersonalization[];
  qualityScore: number; // 0-1
  reviewNotes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  generatedAt: Date;
  lastModified: Date;
  version: number;
}

export interface AIGeneratedModule extends CourseModule {
  id: string;
  keyTakeaways: string[];
  scenario: string;
  codeExample: string;
  contentConfig: {
    hasHandsOn: boolean;
    hasScenario: boolean;
    hasCodeExample: boolean;
    estimatedReadingTime: number;
  };
  sourceReferences: string[]; // URLs used to generate this module
  confidence: number; // 0-1, AI confidence in content accuracy
}

export interface AIGeneratedPersonalization {
  roleId: EngineerRole;
  explanation: string;
  whyRelevant: string;
  nextStepNudge: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  roleSpecificExamples: string[];
  roleSpecificUseCases: string[];
}

// Learning path integration
export interface AIGeneratedLearningPathStep extends LearningPathStep {
  isAiGenerated: true;
  originalCourseId: string;
  confidence: number;
  suggestedPlacement: number; // Suggested position in learning path
  prerequisites: string[]; // IDs of steps that should come before this
}

// Template structure for content generation
export interface ContentTemplate {
  course_structure: {
    title_pattern: string;
    description_length: number;
    module_count: number;
    estimated_duration: string;
  };
  module_structure: {
    title_pattern: string;
    description_length: number;
    include_key_takeaways: boolean;
    include_scenario: boolean;
    include_code_example: boolean;
  };
  role_personalization: {
    explanation_length: number;
    include_use_cases: boolean;
    include_next_steps: boolean;
  };
}

// Content validation results
export interface ValidationResult {
  is_valid: boolean;
  score: number; // 0-1
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  type: 'structure' | 'content' | 'technical' | 'relevance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  field?: string;
  suggested_fix?: string;
}

// Content approval workflow
export interface ApprovalWorkflow {
  id: string;
  course_id: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  assigned_reviewer?: string;
  review_comments: ReviewComment[];
  approval_criteria: ApprovalCriterion[];
  created_at: Date;
  reviewed_at?: Date;
}

export interface ReviewComment {
  id: string;
  reviewer: string;
  content: string;
  type: 'general' | 'technical' | 'editorial' | 'suggestion';
  module_id?: string; // If comment is specific to a module
  resolved: boolean;
  created_at: Date;
}

export interface ApprovalCriterion {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  notes?: string;
}

// Bulk operations
export interface BulkOperation {
  id: string;
  type: 'approve' | 'reject' | 'publish' | 'archive' | 'delete';
  course_ids: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  results: BulkOperationResult[];
  created_at: Date;
  completed_at?: Date;
}

export interface BulkOperationResult {
  course_id: string;
  success: boolean;
  error?: string;
}

// API response types
export interface GenerationResponse {
  success: boolean;
  request_id: string;
  estimated_duration: number; // in seconds
  error?: string;
}

export interface ContentPreviewData {
  course: AIGeneratedCourse;
  comparison_course?: Course; // Similar existing course for comparison
  validation_result: ValidationResult;
  suggested_learning_path_placement: {
    role_id: EngineerRole;
    suggested_position: number;
    reasoning: string;
  }[];
}

// Settings and configuration
export interface AIGenerationSettings {
  default_sources: ResearchSourceConfig[];
  max_concurrent_generations: number;
  default_quality_threshold: number; // 0-1
  auto_approval_threshold: number; // 0-1
  max_content_length: number;
  enable_experimental_features: boolean;
  openai_api_key?: string;
  rate_limits: {
    requests_per_hour: number;
    requests_per_day: number;
  };
}

// Export utility type for backwards compatibility
export type AIGeneratedCourseData = Omit<AIGeneratedCourse, 'is_ai_generated'>;