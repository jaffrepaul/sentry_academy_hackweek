export type EngineerRole = 'backend' | 'frontend' | 'sre' | 'fullstack' | 'ai-ml' | 'pm-manager'

export interface RoleInfo {
  id: EngineerRole
  title: string
  description: string
  icon: string
  commonTasks: string[]
}

export interface LearningPathStep {
  id: string
  title: string
  description: string
  feature: SentryFeature
  modules: string[] // Course IDs
  outcomes: string[]
  estimatedTime: string
  isCompleted: boolean
  isUnlocked: boolean
  priority: number // Lower number = higher priority
}

export type SentryFeature =
  | 'error-tracking'
  | 'performance-monitoring'
  | 'logging'
  | 'session-replay'
  | 'distributed-tracing'
  | 'release-health'
  | 'dashboards-alerts'
  | 'integrations'
  | 'user-feedback'
  | 'seer-mcp'
  | 'custom-metrics'
  | 'metrics-insights'
  | 'stakeholder-reporting'

export interface LearningPath {
  id: string
  roleId: EngineerRole
  title: string
  description: string
  steps: LearningPathStep[]
  totalEstimatedTime: string
}

export interface UserProgress {
  role: EngineerRole | null
  currentStep: number
  completedSteps: string[]
  completedModules: string[]
  completedFeatures: SentryFeature[]
  onboardingCompleted: boolean
  lastActiveDate: Date
  preferredContentType: 'hands-on' | 'conceptual' | 'mixed'
  hasSeenOnboarding: boolean
}

export interface NextContentRecommendation {
  moduleId: string
  stepId: string
  priority: number
  reasoning: string
  timeEstimate: string
}

export interface PersonalizedContent {
  roleSpecificExplanation: string
  whyRelevantToRole: string
  nextStepNudge: string
  difficultyForRole: 'beginner' | 'intermediate' | 'advanced'
}

export interface RolePersonalization {
  roleId: EngineerRole
  contentAdaptations: {
    [moduleId: string]: {
      explanation: string
      whyRelevant: string
      nextStepNudge: string
    }
  }
}
