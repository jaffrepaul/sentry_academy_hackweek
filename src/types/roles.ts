export type EngineerRole = 'backend' | 'frontend' | 'sre' | 'fullstack';

export interface RoleInfo {
  id: EngineerRole;
  title: string;
  description: string;
  icon: string;
  commonTasks: string[];
}

export interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  modules: string[]; // Course IDs
  outcomes: string[];
  estimatedTime: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface LearningPath {
  id: string;
  roleId: EngineerRole;
  title: string;
  description: string;
  steps: LearningPathStep[];
  totalEstimatedTime: string;
}

export interface UserProgress {
  role: EngineerRole | null;
  currentStep: number;
  completedSteps: string[];
  completedModules: string[];
  onboardingCompleted: boolean;
  lastActiveDate: Date;
  preferredContentType: 'hands-on' | 'conceptual' | 'mixed';
  hasSeenOnboarding: boolean;
}

export interface NextContentRecommendation {
  moduleId: string;
  stepId: string;
  priority: number;
  reasoning: string;
  timeEstimate: string;
}

export interface PersonalizedContent {
  roleSpecificExplanation: string;
  whyRelevantToRole: string;
  nextStepNudge: string;
  difficultyForRole: 'beginner' | 'intermediate' | 'advanced';
}

export interface RolePersonalization {
  roleId: EngineerRole;
  contentAdaptations: {
    [moduleId: string]: {
      explanation: string;
      whyRelevant: string;
      nextStepNudge: string;
    };
  };
}