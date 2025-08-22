import { Course, CourseModule } from '../data/courses';
import { EngineerRole, SentryFeature, LearningPathStep } from './roles';

// Enum for research sources
export enum ResearchSource {
  DOCS_MAIN = 'https://docs.sentry.io',
  DOCS_PRODUCT = 'https://docs.sentry.io/product/',
  BLOG = 'https://sentry-blog.sentry.dev/',
  VS_LOGGING = 'https://sentry.io/vs/logging/',
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
  isAIGenerated: true;
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
  isAIGenerated: true;
  originalCourseId: string;
  confidence: number;
  suggestedPlacement: number; // Suggested position in learning path
  prerequisites: string[]; // IDs of steps that should come before this
}

// Template structure for content generation
export interface ContentTemplate {
  courseStructure: {
    titlePattern: string;
    descriptionLength: number;
    moduleCount: number;
    estimatedDuration: string;
  };
  moduleStructure: {
    titlePattern: string;
    descriptionLength: number;
    includeKeyTakeaways: boolean;
    includeScenario: boolean;
    includeCodeExample: boolean;
  };
  rolePersonalization: {
    explanationLength: number;
    includeUseCases: boolean;
    includeNextSteps: boolean;
  };
}

// Content validation results
export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-1
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  type: 'structure' | 'content' | 'technical' | 'relevance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  field?: string;
  suggestedFix?: string;
}

// Content approval workflow
export interface ApprovalWorkflow {
  id: string;
  courseId: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  assignedReviewer?: string;
  reviewComments: ReviewComment[];
  approvalCriteria: ApprovalCriterion[];
  createdAt: Date;
  reviewedAt?: Date;
}

export interface ReviewComment {
  id: string;
  reviewer: string;
  content: string;
  type: 'general' | 'technical' | 'editorial' | 'suggestion';
  moduleId?: string; // If comment is specific to a module
  resolved: boolean;
  createdAt: Date;
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
  courseIds: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  results: BulkOperationResult[];
  createdAt: Date;
  completedAt?: Date;
}

export interface BulkOperationResult {
  courseId: string;
  success: boolean;
  error?: string;
}

// API response types
export interface GenerationResponse {
  success: boolean;
  requestId: string;
  estimatedDuration: number; // in seconds
  error?: string;
}

export interface ContentPreviewData {
  course: AIGeneratedCourse;
  comparisonCourse?: Course; // Similar existing course for comparison
  validationResult: ValidationResult;
  suggestedLearningPathPlacement: {
    roleId: EngineerRole;
    suggestedPosition: number;
    reasoning: string;
  }[];
}

// Settings and configuration
export interface AIGenerationSettings {
  defaultSources: ResearchSourceConfig[];
  maxConcurrentGenerations: number;
  defaultQualityThreshold: number; // 0-1
  autoApprovalThreshold: number; // 0-1
  maxContentLength: number;
  enableExperimentalFeatures: boolean;
  openaiApiKey?: string;
  rateLimits: {
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

// Export utility type for backwards compatibility
export type AIGeneratedCourseData = Omit<AIGeneratedCourse, 'isAIGenerated'>;