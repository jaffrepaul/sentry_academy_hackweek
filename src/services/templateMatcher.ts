import { 
  SynthesizedContent, 
  ContentTemplate,
  AIGeneratedModule,
  AIGeneratedPersonalization
} from '../types/aiGeneration';
import { EngineerRole } from '../types/roles';

/**
 * Template Matching Engine
 * Maps raw AI-generated content to existing course structure patterns
 */

// Default templates based on existing course patterns
export const defaultTemplates = {
  course: {
    titlePattern: "{concept} with Sentry",
    descriptionLength: 150,
    moduleCount: 5,
    estimatedDuration: "2 hrs"
  },
  module: {
    titlePattern: "{action} {concept}",
    descriptionLength: 100,
    includeKeyTakeaways: true,
    includeScenario: true,
    includeCodeExample: true
  },
  rolePersonalization: {
    explanationLength: 200,
    includeUseCases: true,
    includeNextSteps: true
  }
};

// Content pattern analysis
interface ContentPattern {
  concepts: string[];
  actions: string[];
  technologies: string[];
  businessImpacts: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Analyzes content and extracts patterns for template matching
 */
export function analyzeContentPatterns(synthesizedContent: SynthesizedContent): ContentPattern {
  const { mainConcepts, keyTakeaways, useCases, bestPractices } = synthesizedContent;
  
  // Extract action words from takeaways and practices
  const actionWords = [
    ...extractActionWords(keyTakeaways),
    ...extractActionWords(bestPractices)
  ];

  // Extract technical concepts
  const techConcepts = extractTechnicalConcepts([
    ...mainConcepts,
    ...keyTakeaways
  ]);

  // Extract business impact terms
  const businessTerms = extractBusinessImpacts(useCases);

  // Determine complexity based on content depth
  const complexity = determineComplexity(synthesizedContent);

  return {
    concepts: [...new Set(mainConcepts)],
    actions: [...new Set(actionWords)],
    technologies: [...new Set(techConcepts)],
    businessImpacts: [...new Set(businessTerms)],
    complexity
  };
}

/**
 * Maps raw content to existing course structure
 */
export function mapToExistingStructure(
  synthesizedContent: SynthesizedContent,
  targetRole?: EngineerRole,
  template?: ContentTemplate
): {
  courseTitle: string;
  courseDescription: string;
  modules: Partial<AIGeneratedModule>[];
  estimatedDuration: string;
} {
  const patterns = analyzeContentPatterns(synthesizedContent);
  const usedTemplate = template || createDynamicTemplate(patterns);

  // Generate course title
  const primaryConcept = patterns.concepts[0] || 'Sentry Monitoring';
  const courseTitle = generateCourseTitle(primaryConcept, patterns, targetRole);

  // Generate course description
  const courseDescription = generateCourseDescription(
    synthesizedContent,
    patterns,
    usedTemplate.course_structure.description_length
  );

  // Generate modules
  const modules = generateModuleStructure(
    synthesizedContent,
    patterns,
    usedTemplate.course_structure.module_count
  );

  // Calculate duration
  const estimatedDuration = calculateCourseDuration(modules.length, patterns.complexity);

  return {
    courseTitle,
    courseDescription,
    modules,
    estimatedDuration
  };
}

/**
 * Generates module structure based on content and patterns
 */
export function generateModuleStructure(
  synthesizedContent: SynthesizedContent,
  patterns: ContentPattern,
  targetModuleCount: number = 5
): Partial<AIGeneratedModule>[] {
  const { mainConcepts, useCases, codeExamples } = synthesizedContent;
  
  // Create modules based on main concepts
  const conceptModules = mainConcepts.slice(0, targetModuleCount - 1).map((concept, index) => 
    createConceptModule(concept, synthesizedContent, patterns, index)
  );

  // Add a practical/hands-on module if we have space
  if (conceptModules.length < targetModuleCount && (codeExamples.length > 0 || useCases.length > 0)) {
    conceptModules.push(createPracticalModule(synthesizedContent, patterns, conceptModules.length));
  }

  return conceptModules;
}

/**
 * Creates role-specific content personalization
 */
export function createRoleSpecificContent(
  synthesizedContent: SynthesizedContent,
  patterns: ContentPattern,
  role: EngineerRole
): Partial<AIGeneratedPersonalization> {
  const roleContexts = {
    'frontend': {
      focusAreas: ['user experience', 'performance', 'debugging', 'client-side'],
      examples: ['React components', 'browser errors', 'page load times'],
      pain_points: ['JavaScript errors', 'performance bottlenecks', 'user impact']
    },
    'backend': {
      focusAreas: ['API performance', 'server errors', 'database queries', 'infrastructure'],
      examples: ['API endpoints', 'server exceptions', 'database performance'],
      pain_points: ['service downtime', 'API latency', 'data integrity']
    },
    'fullstack': {
      focusAreas: ['end-to-end monitoring', 'system integration', 'performance optimization'],
      examples: ['full-stack applications', 'microservices', 'user journeys'],
      pain_points: ['complex debugging', 'performance across layers', 'data flow issues']
    },
    'sre': {
      focusAreas: ['system reliability', 'infrastructure monitoring', 'incident response'],
      examples: ['infrastructure metrics', 'service health', 'alerting systems'],
      pain_points: ['system outages', 'capacity planning', 'incident escalation']
    },
    'ai-ml': {
      focusAreas: ['model monitoring', 'data pipelines', 'inference performance'],
      examples: ['ML model serving', 'data quality', 'prediction accuracy'],
      pain_points: ['model drift', 'data issues', 'inference latency']
    },
    'pm-manager': {
      focusAreas: ['metrics analysis', 'team coordination', 'business impact'],
      examples: ['KPI dashboards', 'team reports', 'stakeholder updates'],
      pain_points: ['data interpretation', 'priority setting', 'resource allocation']
    }
  };

  const roleContext = roleContexts[role];
  
  return {
    roleId: role,
    explanation: generateRoleExplanation(synthesizedContent, roleContext, patterns),
    whyRelevant: generateRelevanceExplanation(roleContext, patterns),
    nextStepNudge: generateNextStepNudge(role, patterns),
    difficulty: patterns.complexity,
    roleSpecificExamples: generateRoleExamples(roleContext, synthesizedContent),
    roleSpecificUseCases: generateRoleUseCases(roleContext, synthesizedContent.useCases)
  };
}

/**
 * Validates that generated content matches expected structure
 */
export function validateStructureCompliance(
  generatedContent: Record<string, unknown>,
  targetStructure: 'course' | 'module' | 'learning_path'
): {
  isCompliant: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  switch (targetStructure) {
    case 'course':
      if (!generatedContent.title || (typeof generatedContent.title === 'string' && generatedContent.title.length < 10)) {
        issues.push('Course title too short');
        suggestions.push('Title should be at least 10 characters and descriptive');
      }
      
      if (!generatedContent.description || (typeof generatedContent.description === 'string' && generatedContent.description.length < 50)) {
        issues.push('Course description too short');
        suggestions.push('Description should be at least 50 characters');
      }

      if (!generatedContent.generatedModules || (Array.isArray(generatedContent.generatedModules) && generatedContent.generatedModules.length < 3)) {
        issues.push('Insufficient number of modules');
        suggestions.push('Course should have at least 3 modules for comprehensive coverage');
      }
      break;

    case 'module':
      if (!generatedContent.keyTakeaways || (Array.isArray(generatedContent.keyTakeaways) && generatedContent.keyTakeaways.length < 2)) {
        issues.push('Insufficient key takeaways');
        suggestions.push('Each module should have at least 2-3 key takeaways');
      }

      if (!generatedContent.scenario) {
        issues.push('Missing scenario');
        suggestions.push('Include a real-world scenario to provide context');
      }
      break;

    case 'learning_path':
      if (!generatedContent.outcomes || (Array.isArray(generatedContent.outcomes) && generatedContent.outcomes.length < 2)) {
        issues.push('Insufficient learning outcomes');
        suggestions.push('Learning path step should have clear outcomes');
      }
      break;
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    suggestions
  };
}

// Helper functions

function extractActionWords(content: string[]): string[] {
  const actionPatterns = [
    /\b(implement|configure|set up|monitor|track|debug|optimize|analyze|integrate|deploy)\b/gi,
    /\b(create|build|develop|establish|enable|disable|update|manage)\b/gi
  ];

  const actions: string[] = [];
  content.forEach(text => {
    actionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        actions.push(...matches.map(match => match.toLowerCase()));
      }
    });
  });

  return actions;
}

function extractTechnicalConcepts(content: string[]): string[] {
  const techTerms = [
    'react', 'javascript', 'node.js', 'python', 'django', 'api', 'database',
    'microservices', 'kubernetes', 'docker', 'aws', 'gcp', 'azure',
    'performance', 'latency', 'throughput', 'errors', 'exceptions',
    'alerts', 'dashboards', 'metrics', 'logs', 'traces'
  ];

  const found: string[] = [];
  content.forEach(text => {
    const lowerText = text.toLowerCase();
    techTerms.forEach(term => {
      if (lowerText.includes(term)) {
        found.push(term);
      }
    });
  });

  return found;
}

function extractBusinessImpacts(useCases: string[]): string[] {
  const businessTerms = [
    'user experience', 'performance', 'reliability', 'scalability',
    'cost reduction', 'efficiency', 'productivity', 'quality',
    'customer satisfaction', 'revenue', 'conversion', 'retention'
  ];

  const found: string[] = [];
  useCases.forEach(useCase => {
    const lowerCase = useCase.toLowerCase();
    businessTerms.forEach(term => {
      if (lowerCase.includes(term)) {
        found.push(term);
      }
    });
  });

  return found;
}

function determineComplexity(content: SynthesizedContent): 'beginner' | 'intermediate' | 'advanced' {
  const complexityIndicators = {
    beginner: ['basic', 'introduction', 'getting started', 'setup', 'installation'],
    intermediate: ['configuration', 'integration', 'best practices', 'optimization'],
    advanced: ['architecture', 'scaling', 'custom', 'enterprise', 'distributed']
  };

  const allText = [
    ...content.mainConcepts,
    ...content.keyTakeaways,
    ...content.bestPractices
  ].join(' ').toLowerCase();

  let beginnerScore = 0;
  let intermediateScore = 0;
  let advancedScore = 0;

  complexityIndicators.beginner.forEach(term => {
    if (allText.includes(term)) beginnerScore++;
  });
  complexityIndicators.intermediate.forEach(term => {
    if (allText.includes(term)) intermediateScore++;
  });
  complexityIndicators.advanced.forEach(term => {
    if (allText.includes(term)) advancedScore++;
  });

  if (advancedScore >= intermediateScore && advancedScore >= beginnerScore) {
    return 'advanced';
  } else if (intermediateScore >= beginnerScore) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
}

function createDynamicTemplate(patterns: ContentPattern): ContentTemplate {
  const moduleCount = Math.min(Math.max(patterns.concepts.length, 3), 6);
  
  return {
    course_structure: {
      title_pattern: "{concept} Mastery with Sentry",
      description_length: patterns.complexity === 'advanced' ? 200 : 150,
      module_count: moduleCount,
      estimated_duration: patterns.complexity === 'advanced' ? "3 hrs" : "2 hrs"
    },
    module_structure: {
      title_pattern: "{action} {concept}",
      description_length: 100,
      include_key_takeaways: true,
      include_scenario: patterns.complexity !== 'beginner',
      include_code_example: patterns.technologies.length > 0
    },
    role_personalization: {
      explanation_length: patterns.complexity === 'advanced' ? 250 : 200,
      include_use_cases: true,
      include_next_steps: true
    }
  };
}

function generateCourseTitle(
  primaryConcept: string,
  patterns: ContentPattern,
  role?: EngineerRole
): string {
  const conceptCapitalized = primaryConcept.charAt(0).toUpperCase() + primaryConcept.slice(1);
  
  if (role) {
    const roleMap = {
      'frontend': 'Frontend',
      'backend': 'Backend',
      'fullstack': 'Full-Stack',
      'sre': 'SRE',
      'ai-ml': 'AI/ML',
      'pm-manager': 'Product Management'
    };
    return `${conceptCapitalized} for ${roleMap[role]} Engineers`;
  }

  if (patterns.complexity === 'advanced') {
    return `Advanced ${conceptCapitalized} with Sentry`;
  } else if (patterns.complexity === 'beginner') {
    return `Getting Started with ${conceptCapitalized}`;
  } else {
    return `Mastering ${conceptCapitalized} with Sentry`;
  }
}

function generateCourseDescription(
  content: SynthesizedContent,
  patterns: ContentPattern,
  maxLength: number
): string {
  const primaryConcept = patterns.concepts[0] || 'Sentry monitoring';
  const keyBenefit = content.useCases[0] || 'improve application reliability';
  
  let description = `Learn how to effectively implement ${primaryConcept} to ${keyBenefit}. `;
  
  if (content.keyTakeaways.length > 0) {
    description += `Master ${content.keyTakeaways.slice(0, 2).join(' and ')}.`;
  }

  // Truncate if too long
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }

  return description;
}

function createConceptModule(
  concept: string,
  content: SynthesizedContent,
  patterns: ContentPattern,
  index: number
): Partial<AIGeneratedModule> {
  const action = patterns.actions[index] || 'Understanding';
  const title = `${action.charAt(0).toUpperCase()}${action.slice(1)} ${concept}`;
  
  return {
    title,
    description: `Learn the fundamentals of ${concept} and how to apply it effectively in your Sentry monitoring strategy.`,
    duration: "15 min",
    keyTakeaways: content.keyTakeaways.slice(index * 2, (index + 1) * 2),
    scenario: content.useCases[index] || `You need to implement ${concept} monitoring for your application.`,
    codeExample: content.codeExamples[index] || `// ${concept} implementation example\n// Will be populated with specific code`,
    contentConfig: {
      hasHandsOn: patterns.technologies.length > 0,
      hasScenario: true,
      hasCodeExample: content.codeExamples.length > index,
      estimatedReadingTime: 5
    },
    confidence: 0.8
  };
}

function createPracticalModule(
  content: SynthesizedContent,
  _patterns: ContentPattern,
  _index: number
): Partial<AIGeneratedModule> {
  return {
    title: "Hands-On Implementation",
    description: "Apply what you've learned with practical examples and real-world scenarios.",
    duration: "25 min",
    keyTakeaways: content.bestPractices.slice(0, 3),
    scenario: "Implement a complete monitoring solution using the concepts you've learned.",
    codeExample: content.codeExamples.join('\n\n') || "// Complete implementation example",
    contentConfig: {
      hasHandsOn: true,
      hasScenario: true,
      hasCodeExample: true,
      estimatedReadingTime: 8
    },
    confidence: 0.85
  };
}

function calculateCourseDuration(moduleCount: number, complexity: string): string {
  const baseMinutes = moduleCount * 15; // 15 minutes per module
  const complexityMultiplier = {
    'beginner': 1.0,
    'intermediate': 1.2,
    'advanced': 1.5
  };

  const totalMinutes = Math.round(baseMinutes * (complexityMultiplier[complexity as keyof typeof complexityMultiplier] || 1.0));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours}.${Math.round(minutes / 6)} hrs`;
  }
}

function generateRoleExplanation(
  content: SynthesizedContent,
  roleContext: {focusAreas: string[]},
  _patterns: ContentPattern
): string {
  const primaryConcept = content.mainConcepts[0] || 'monitoring';
  const focusArea = roleContext.focusAreas[0] || 'application monitoring';
  
  return `As a ${roleContext.focusAreas[0]} focused engineer, ${primaryConcept} is crucial for ${focusArea}. This content will help you understand how to apply ${primaryConcept} concepts specifically to your daily workflow and responsibilities.`;
}

function generateRelevanceExplanation(roleContext: {pain_points: string[]}, _patterns: ContentPattern): string {
  const painPoint = roleContext.pain_points[0] || 'technical issues';
  return `This directly addresses ${painPoint} that you encounter in your role, providing practical solutions and best practices.`;
}

function generateNextStepNudge(role: EngineerRole, _patterns: ContentPattern): string {
  const nextSteps = {
    'frontend': 'implement user experience monitoring',
    'backend': 'set up API performance tracking',
    'fullstack': 'create end-to-end monitoring',
    'sre': 'establish infrastructure alerting',
    'ai-ml': 'monitor model performance',
    'pm-manager': 'build stakeholder dashboards'
  };

  return `Ready to ${nextSteps[role]}? Continue to the next module to build on these concepts.`;
}

function generateRoleExamples(roleContext: {examples: string[]}, content: SynthesizedContent): string[] {
  const examples = roleContext.examples || [];
  const codeExamples = content.codeExamples.slice(0, 2);
  
  return [...examples, ...codeExamples].slice(0, 3);
}

function generateRoleUseCases(roleContext: {focusAreas: string[]}, useCases: string[]): string[] {
  return useCases
    .filter(useCase => 
      roleContext.focusAreas.some((area: string) => 
        useCase.toLowerCase().includes(area.toLowerCase())
      )
    )
    .slice(0, 3);
}

export type {
  ContentPattern
};

export {
  createDynamicTemplate,
  generateCourseTitle,
  generateCourseDescription,
  createConceptModule,
  createPracticalModule
};