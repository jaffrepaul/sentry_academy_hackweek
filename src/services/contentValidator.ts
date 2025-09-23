import {
  AIGeneratedCourse,
  AIGeneratedModule,
  AIGeneratedPersonalization,
  ValidationResult,
  ValidationIssue,
} from '../types/aiGeneration'
import { EngineerRole, SentryFeature } from '../types/roles'

/**
 * Content Quality Validation Service
 * Validates AI-generated content for technical accuracy, structure compliance, and educational quality
 */

interface QualityMetrics {
  technicalAccuracy: number
  structuralCompliance: number
  educationalValue: number
  roleRelevance: number
  overallScore: number
}

interface ValidationContext {
  expectedLevel: 'beginner' | 'intermediate' | 'advanced'
  targetRoles: EngineerRole[]
  requiredFeatures: SentryFeature[]
  minQualityThreshold: number
}

/**
 * Main validation function for AI-generated courses
 */
export function validateCourseStructure(
  course: AIGeneratedCourse,
  context?: Partial<ValidationContext>
): ValidationResult {
  const issues: ValidationIssue[] = []
  const suggestions: string[] = []

  const validationContext: ValidationContext = {
    expectedLevel: 'intermediate',
    targetRoles: [],
    requiredFeatures: [],
    minQualityThreshold: 0.7,
    ...context,
  }

  // Validate course metadata
  const metadataIssues = validateCourseMetadata(course)
  issues.push(...metadataIssues)

  // Validate modules
  const moduleIssues = validateModules(course.generatedModules)
  issues.push(...moduleIssues)

  // Validate role personalizations
  const roleIssues = validateRolePersonalizations(
    course.rolePersonalizations,
    course.generationRequest.targetRoles
  )
  issues.push(...roleIssues)

  // Validate content quality
  const qualityIssues = validateContentQuality(course)
  issues.push(...qualityIssues)

  // Validate technical accuracy
  const technicalIssues = validateTechnicalContent(course)
  issues.push(...technicalIssues)

  // Generate quality metrics
  const metrics = calculateQualityMetrics(course, issues)

  // Generate suggestions
  const improvementSuggestions = generateImprovementSuggestions(course, issues, metrics)
  suggestions.push(...improvementSuggestions)

  const isValid =
    metrics.overallScore >= validationContext.minQualityThreshold &&
    !issues.some(issue => issue.severity === 'critical')

  return {
    is_valid: isValid,
    score: metrics.overallScore,
    issues,
    suggestions,
  }
}

/**
 * Validates content quality including readability and educational value
 */
export function checkContentQuality(content: string): {
  readabilityScore: number
  educationalValue: number
  technicalDepth: number
  issues: string[]
} {
  const issues: string[] = []

  // Check readability
  const readabilityScore = calculateReadabilityScore(content)
  if (readabilityScore < 0.6) {
    issues.push('Content may be too complex or difficult to read')
  }

  // Check educational value
  const educationalValue = assessEducationalValue(content)
  if (educationalValue < 0.7) {
    issues.push('Content lacks sufficient educational structure or clear learning objectives')
  }

  // Check technical depth
  const technicalDepth = assessTechnicalDepth(content)
  if (technicalDepth < 0.5) {
    issues.push('Content needs more technical detail and practical examples')
  }

  return {
    readabilityScore,
    educationalValue,
    technicalDepth,
    issues,
  }
}

/**
 * Ensures content is relevant for target engineer roles
 */
export function ensureRoleRelevance(
  course: AIGeneratedCourse,
  targetRole: EngineerRole
): {
  relevanceScore: number
  issues: string[]
  suggestions: string[]
} {
  const issues: string[] = []
  const suggestions: string[] = []

  // Check if role has personalization
  const rolePersonalization = course.rolePersonalizations.find(rp => rp.roleId === targetRole)
  if (!rolePersonalization) {
    issues.push(`No personalization found for ${targetRole} role`)
    suggestions.push(`Add role-specific content for ${targetRole} engineers`)
  }

  // Check role-specific keywords and concepts
  const roleRelevanceScore = calculateRoleRelevance(course, targetRole)

  if (roleRelevanceScore < 0.6) {
    issues.push(`Content may not be sufficiently relevant for ${targetRole} engineers`)
    suggestions.push(`Add more ${targetRole}-specific examples and use cases`)
  }

  // Check difficulty appropriateness
  if (rolePersonalization) {
    const difficultyIssues = validateDifficultyForRole(rolePersonalization, targetRole)
    issues.push(...difficultyIssues)
  }

  return {
    relevanceScore: roleRelevanceScore,
    issues,
    suggestions,
  }
}

// Helper validation functions

function validateCourseMetadata(course: AIGeneratedCourse): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Title validation
  if (!course.title || course.title.length < 10) {
    issues.push({
      type: 'structure',
      severity: 'high',
      message: 'Course title is too short or missing',
      field: 'title',
      suggested_fix: 'Provide a descriptive title of at least 10 characters',
    })
  }

  if (course.title && course.title.length > 100) {
    issues.push({
      type: 'structure',
      severity: 'medium',
      message: 'Course title is too long',
      field: 'title',
      suggested_fix: 'Keep title under 100 characters for better readability',
    })
  }

  // Description validation
  if (!course.description || course.description.length < 50) {
    issues.push({
      type: 'structure',
      severity: 'high',
      message: 'Course description is too short or missing',
      field: 'description',
      suggested_fix: 'Provide a comprehensive description of at least 50 characters',
    })
  }

  // Duration validation
  if (!course.duration || !course.duration.match(/\d+\s*(min|hr|hour)/i)) {
    issues.push({
      type: 'structure',
      severity: 'medium',
      message: 'Invalid or missing duration format',
      field: 'duration',
      suggested_fix: 'Use format like "2 hrs" or "90 min"',
    })
  }

  // Level validation
  const validLevels = ['Beginner', 'Intermediate', 'Advanced']
  if (!validLevels.includes(course.level)) {
    issues.push({
      type: 'structure',
      severity: 'medium',
      message: 'Invalid course level',
      field: 'level',
      suggested_fix: 'Use one of: Beginner, Intermediate, Advanced',
    })
  }

  return issues
}

function validateModules(modules: AIGeneratedModule[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (modules.length < 3) {
    issues.push({
      type: 'content',
      severity: 'high',
      message: 'Insufficient number of modules',
      suggested_fix: 'Add more modules for comprehensive coverage (minimum 3)',
    })
  }

  if (modules.length > 8) {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'Too many modules may overwhelm learners',
      suggested_fix: 'Consider combining related topics or splitting into multiple courses',
    })
  }

  modules.forEach((module, index) => {
    // Module title validation
    if (!module.title || module.title.length < 5) {
      issues.push({
        type: 'structure',
        severity: 'medium',
        message: `Module ${index + 1} title is too short`,
        field: `modules[${index}].title`,
        suggested_fix: 'Provide descriptive module titles',
      })
    }

    // Key takeaways validation
    if (!module.keyTakeaways || module.keyTakeaways.length < 2) {
      issues.push({
        type: 'content',
        severity: 'medium',
        message: `Module ${index + 1} has insufficient key takeaways`,
        field: `modules[${index}].keyTakeaways`,
        suggested_fix: 'Include at least 2-3 key takeaways per module',
      })
    }

    // Code example validation
    if (
      module.contentConfig.hasCodeExample &&
      (!module.codeExample || module.codeExample.length < 20)
    ) {
      issues.push({
        type: 'technical',
        severity: 'medium',
        message: `Module ${index + 1} lacks adequate code examples`,
        field: `modules[${index}].codeExample`,
        suggested_fix: 'Provide comprehensive, working code examples',
      })
    }

    // Scenario validation
    if (module.contentConfig.hasScenario && (!module.scenario || module.scenario.length < 30)) {
      issues.push({
        type: 'content',
        severity: 'low',
        message: `Module ${index + 1} scenario is too brief`,
        field: `modules[${index}].scenario`,
        suggested_fix: 'Provide detailed, realistic scenarios',
      })
    }

    // Confidence threshold
    if (module.confidence < 0.6) {
      issues.push({
        type: 'technical',
        severity: 'high',
        message: `Module ${index + 1} has low confidence score`,
        field: `modules[${index}].confidence`,
        suggested_fix: 'Review and improve content accuracy and completeness',
      })
    }
  })

  return issues
}

function validateRolePersonalizations(
  personalizations: AIGeneratedPersonalization[],
  targetRoles: EngineerRole[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Check coverage
  const coveredRoles = personalizations.map(p => p.roleId)
  const missingRoles = targetRoles.filter(role => !coveredRoles.includes(role))

  if (missingRoles.length > 0) {
    issues.push({
      type: 'relevance',
      severity: 'high',
      message: `Missing personalizations for roles: ${missingRoles.join(', ')}`,
      suggested_fix: 'Generate personalizations for all target roles',
    })
  }

  // Validate individual personalizations
  personalizations.forEach((personalization, index) => {
    if (!personalization.explanation || personalization.explanation.length < 50) {
      issues.push({
        type: 'content',
        severity: 'medium',
        message: `Personalization for ${personalization.roleId} lacks detailed explanation`,
        field: `rolePersonalizations[${index}].explanation`,
        suggested_fix: 'Provide comprehensive role-specific explanations',
      })
    }

    if (!personalization.whyRelevant || personalization.whyRelevant.length < 30) {
      issues.push({
        type: 'relevance',
        severity: 'medium',
        message: `Personalization for ${personalization.roleId} lacks clear relevance explanation`,
        field: `rolePersonalizations[${index}].whyRelevant`,
        suggested_fix: 'Explain specifically why this content matters for this role',
      })
    }

    if (personalization.roleSpecificExamples.length === 0) {
      issues.push({
        type: 'content',
        severity: 'low',
        message: `No role-specific examples for ${personalization.roleId}`,
        field: `rolePersonalizations[${index}].roleSpecificExamples`,
        suggested_fix: 'Add practical examples relevant to this role',
      })
    }
  })

  return issues
}

function validateContentQuality(course: AIGeneratedCourse): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Check synthesized content quality
  const { mainConcepts, keyTakeaways, useCases, bestPractices } = course.synthesizedContent

  if (mainConcepts.length < 3) {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'Insufficient main concepts covered',
      suggested_fix: 'Include more core concepts for comprehensive coverage',
    })
  }

  if (keyTakeaways.length < 5) {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'Too few key takeaways',
      suggested_fix: 'Include more actionable takeaways for learners',
    })
  }

  if (useCases.length < 2) {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'Insufficient use cases provided',
      suggested_fix: 'Add more real-world use cases and examples',
    })
  }

  if (bestPractices.length < 3) {
    issues.push({
      type: 'content',
      severity: 'low',
      message: 'Limited best practices coverage',
      suggested_fix: 'Include more industry best practices',
    })
  }

  return issues
}

function validateTechnicalContent(course: AIGeneratedCourse): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Check for Sentry-specific content
  const allContent = [
    course.title,
    course.description,
    ...course.generatedModules.map(m => m.title + ' ' + m.description),
    ...course.synthesizedContent.mainConcepts,
  ]
    .join(' ')
    .toLowerCase()

  const sentryTerms = ['sentry', 'error tracking', 'performance monitoring', 'observability']
  const hasSentryContent = sentryTerms.some(term => allContent.includes(term))

  if (!hasSentryContent) {
    issues.push({
      type: 'technical',
      severity: 'critical',
      message: 'Content does not appear to be Sentry-specific',
      suggested_fix: 'Ensure content focuses on Sentry tools and concepts',
    })
  }

  // Check code examples for basic syntax
  course.generatedModules.forEach((module, index) => {
    if (module.codeExample && module.codeExample.includes('TODO')) {
      issues.push({
        type: 'technical',
        severity: 'medium',
        message: `Module ${index + 1} contains placeholder code`,
        field: `modules[${index}].codeExample`,
        suggested_fix: 'Replace placeholder code with working examples',
      })
    }

    if (module.codeExample && !module.codeExample.includes('Sentry')) {
      issues.push({
        type: 'technical',
        severity: 'medium',
        message: `Module ${index + 1} code example lacks Sentry integration`,
        field: `modules[${index}].codeExample`,
        suggested_fix: 'Include Sentry-specific code in examples',
      })
    }
  })

  return issues
}

function calculateQualityMetrics(
  _course: AIGeneratedCourse,
  issues: ValidationIssue[]
): QualityMetrics {
  const criticalIssues = issues.filter(i => i.severity === 'critical').length
  const highIssues = issues.filter(i => i.severity === 'high').length
  const mediumIssues = issues.filter(i => i.severity === 'medium').length

  // Calculate individual metrics
  const structuralCompliance = Math.max(
    0,
    1 - (criticalIssues * 0.3 + highIssues * 0.2 + mediumIssues * 0.1)
  )
  const technicalAccuracy = Math.max(
    0,
    1 - issues.filter(i => i.type === 'technical').length * 0.15
  )
  const educationalValue = Math.max(0, 1 - issues.filter(i => i.type === 'content').length * 0.1)
  const roleRelevance = Math.max(0, 1 - issues.filter(i => i.type === 'relevance').length * 0.15)

  // Calculate overall score
  const overallScore =
    structuralCompliance * 0.3 +
    technicalAccuracy * 0.25 +
    educationalValue * 0.25 +
    roleRelevance * 0.2

  return {
    technicalAccuracy,
    structuralCompliance,
    educationalValue,
    roleRelevance,
    overallScore,
  }
}

function generateImprovementSuggestions(
  course: AIGeneratedCourse,
  _issues: ValidationIssue[],
  metrics: QualityMetrics
): string[] {
  const suggestions: string[] = []

  // General improvement suggestions based on metrics
  if (metrics.technicalAccuracy < 0.8) {
    suggestions.push('Review technical content for accuracy and add more Sentry-specific examples')
  }

  if (metrics.educationalValue < 0.8) {
    suggestions.push('Enhance educational structure with clearer learning objectives and outcomes')
  }

  if (metrics.roleRelevance < 0.8) {
    suggestions.push(
      'Improve role-specific content and add more targeted examples for each engineering role'
    )
  }

  if (metrics.structuralCompliance < 0.8) {
    suggestions.push('Address structural issues in course organization and module formatting')
  }

  // Specific suggestions based on course content
  if (course.generatedModules.length < 4) {
    suggestions.push('Consider adding more modules to provide comprehensive coverage of the topic')
  }

  if (course.rolePersonalizations.length < course.generationRequest.targetRoles.length) {
    suggestions.push('Generate personalizations for all target engineering roles')
  }

  const avgModuleConfidence =
    course.generatedModules.reduce((sum, m) => sum + m.confidence, 0) /
    course.generatedModules.length
  if (avgModuleConfidence < 0.8) {
    suggestions.push(
      'Improve module content quality and research depth for higher confidence scores'
    )
  }

  // Quality-specific suggestions
  if (course.synthesizedContent.codeExamples.length < 3) {
    suggestions.push('Add more practical code examples throughout the course')
  }

  if (course.synthesizedContent.useCases.length < 3) {
    suggestions.push('Include more real-world use cases and scenarios')
  }

  return suggestions
}

// Utility functions for content analysis

function calculateReadabilityScore(content: string): number {
  // Simple readability calculation based on sentence length and word complexity
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(w => w.length > 0)

  if (sentences.length === 0 || words.length === 0) return 0

  const avgSentenceLength = words.length / sentences.length
  const complexWords = words.filter(word => word.length > 6).length
  const complexWordRatio = complexWords / words.length

  // Higher score for moderate sentence length and lower complex word ratio
  let score = 1.0
  if (avgSentenceLength > 20) score -= 0.2
  if (avgSentenceLength > 30) score -= 0.3
  if (complexWordRatio > 0.3) score -= 0.2
  if (complexWordRatio > 0.5) score -= 0.3

  return Math.max(0, score)
}

function assessEducationalValue(content: string): number {
  const educationalIndicators = [
    'learn',
    'understand',
    'implement',
    'practice',
    'example',
    'step',
    'guide',
    'tutorial',
    'exercise',
    'objective',
  ]

  const lowerContent = content.toLowerCase()
  const foundIndicators = educationalIndicators.filter(indicator =>
    lowerContent.includes(indicator)
  ).length

  return Math.min(1.0, (foundIndicators / educationalIndicators.length) * 2)
}

function assessTechnicalDepth(content: string): number {
  const technicalTerms = [
    'api',
    'configuration',
    'integration',
    'sdk',
    'implementation',
    'monitoring',
    'tracking',
    'debugging',
    'performance',
    'optimization',
  ]

  const lowerContent = content.toLowerCase()
  const foundTerms = technicalTerms.filter(term => lowerContent.includes(term)).length

  return Math.min(1.0, (foundTerms / technicalTerms.length) * 1.5)
}

function calculateRoleRelevance(course: AIGeneratedCourse, role: EngineerRole): number {
  const roleKeywords = {
    frontend: ['react', 'javascript', 'browser', 'ui', 'user experience', 'client'],
    backend: ['api', 'server', 'database', 'service', 'backend', 'infrastructure'],
    fullstack: ['end-to-end', 'full-stack', 'complete', 'integration', 'system'],
    sre: ['reliability', 'infrastructure', 'deployment', 'operations', 'monitoring'],
    'ai-ml': ['model', 'machine learning', 'data', 'pipeline', 'inference', 'training'],
    'pm-manager': ['metrics', 'dashboard', 'business', 'stakeholder', 'reporting', 'insights'],
  }

  const keywords = roleKeywords[role] || []
  const allContent = [
    course.title,
    course.description,
    ...course.generatedModules.map(m => m.title + ' ' + m.description),
    ...course.synthesizedContent.mainConcepts,
  ]
    .join(' ')
    .toLowerCase()

  const foundKeywords = keywords.filter(keyword => allContent.includes(keyword)).length

  return foundKeywords / keywords.length
}

function validateDifficultyForRole(
  personalization: AIGeneratedPersonalization,
  role: EngineerRole
): string[] {
  const issues: string[] = []

  // Role-specific difficulty expectations
  const expectedDifficulty = {
    frontend: ['beginner', 'intermediate'],
    backend: ['intermediate', 'advanced'],
    fullstack: ['intermediate', 'advanced'],
    sre: ['intermediate', 'advanced'],
    'ai-ml': ['advanced'],
    'pm-manager': ['beginner', 'intermediate'],
  }

  const expected = expectedDifficulty[role] || ['intermediate']
  if (!expected.includes(personalization.difficulty)) {
    issues.push(
      `Difficulty level "${personalization.difficulty}" may not be appropriate for ${role} role`
    )
  }

  return issues
}

// Export types only
export type { QualityMetrics, ValidationContext }
