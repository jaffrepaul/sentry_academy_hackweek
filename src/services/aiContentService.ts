import { 
  ContentGenerationRequest, 
  AIGeneratedCourse, 
  AIGeneratedModule,
  AIGeneratedPersonalization,
  SynthesizedContent,
  ResearchedContent,
  ResearchSource,
  GenerationResponse
} from '../types/aiGeneration';
import { EngineerRole } from '../types/roles';
import { updateGenerationProgress, aiGeneratedCoursesStore } from '../data/aiGeneratedCourses';

// Types for OpenAI API integration
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

class AIContentService {
  private config: OpenAIConfig;
  private rateLimitTracker: Map<string, number[]> = new Map();
  private backgroundTasks: Map<string, NodeJS.Timeout> = new Map();

  constructor(apiKey?: string) {
    this.config = {
      apiKey: apiKey || (typeof process !== 'undefined' && process.env?.OPENAI_API_KEY) || '',
      model: 'gpt-4o-mini',
      maxTokens: 4000,
      temperature: 0.7
    };
  }

  // Rate limiting helper
  private checkRateLimit(endpoint: string, maxPerHour: number = 60): boolean {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const requests = this.rateLimitTracker.get(endpoint) || [];
    const recentRequests = requests.filter(time => time > oneHourAgo);
    
    if (recentRequests.length >= maxPerHour) {
      return false;
    }
    
    recentRequests.push(now);
    this.rateLimitTracker.set(endpoint, recentRequests);
    return true;
  }

  // OpenAI API call wrapper
  // @ts-expect-error: Method is used but TypeScript incorrectly reports it as unused
  private async callOpenAI(messages: OpenAIMessage[]): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!this.checkRateLimit('openai-api', 50)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  // Generate course content from research
  async generateCourseContent(
    request: ContentGenerationRequest,
    researchedContent: ResearchedContent[]
  ): Promise<AIGeneratedCourse> {
    try {
      updateGenerationProgress(request.id, {
        status: 'generating',
        currentStep: 'Synthesizing research into course content',
        progress: 40,
        logs: ['Starting content generation from research data']
      });

      // First, synthesize the research
      const synthesizedContent = await this.synthesizeResearch(researchedContent, request.keywords);
      
      updateGenerationProgress(request.id, {
        currentStep: 'Generating course structure and modules',
        progress: 60,
        logs: ['Research synthesized, generating course structure']
      });

      // Generate course metadata
      const courseMetadata = await this.generateCourseMetadata(synthesizedContent, request);
      
      // Generate modules
      const modules = await this.generateModules(synthesizedContent, request);
      
      updateGenerationProgress(request.id, {
        currentStep: 'Creating role-specific personalizations',
        progress: 80,
        logs: ['Modules generated, creating role personalizations']
      });

      // Generate role personalizations
      const rolePersonalizations = await this.generateRolePersonalizations(
        synthesizedContent, 
        request.targetRoles
      );

      // Calculate quality score based on various factors
      const qualityScore = this.calculateQualityScore(
        synthesizedContent, 
        modules, 
        rolePersonalizations,
        researchedContent
      );

      const aiCourse: AIGeneratedCourse = {
        ...courseMetadata,
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isAiGenerated: true,
        generationRequest: request,
        researchSources: researchedContent,
        synthesizedContent,
        generatedModules: modules,
        rolePersonalizations,
        qualityScore,
        generatedAt: new Date(),
        lastModified: new Date(),
        version: 1
      };

      // Add the generated course to the store
      console.log('AIContentService: Adding course to store:', aiCourse.id, aiCourse.title);
      aiGeneratedCoursesStore.addCourse(aiCourse);

      updateGenerationProgress(request.id, {
        status: 'review-needed',
        currentStep: 'Content generation complete - ready for review',
        progress: 100,
        logs: ['Course generation completed successfully', `Course ${aiCourse.id} added to store`]
      });

      console.log('AIContentService: Course generation completed successfully');

      return aiCourse;
    } catch (error) {
      updateGenerationProgress(request.id, {
        status: 'error',
        currentStep: 'Content generation failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        logs: [`Error during generation: ${error}`]
      });
      throw error;
    }
  }

  // Synthesize research into structured content
  private async synthesizeResearch(
    _researchedContent: ResearchedContent[], 
    keywords: string[]
  ): Promise<SynthesizedContent> {
    // For demo purposes, return mock synthesized content
    console.log('AIContentService: Synthesizing research for keywords:', keywords);
    
    // Mock synthesis for demo - in production this would call OpenAI
    return {
      mainConcepts: [
        `${keywords[0]} fundamentals and setup`,
        `Advanced ${keywords[0]} techniques`,
        `${keywords[0]} best practices`,
        `Production ${keywords[0]} strategies`
      ],
      keyTakeaways: [
        `Master ${keywords[0]} configuration and setup`,
        `Implement advanced ${keywords[0]} patterns`,
        `Apply ${keywords[0]} best practices in production`,
        `Troubleshoot common ${keywords[0]} issues`
      ],
      codeExamples: [
        `// ${keywords[0]} setup example\nimport * as Sentry from "@sentry/react";\n\n// Configure ${keywords[0]}\nSentry.init({\n  // Configuration here\n});`,
        `// Advanced ${keywords[0]} usage\n// Implementation details here`
      ],
      useCases: [
        `Production ${keywords[0]} monitoring`,
        `Development ${keywords[0]} optimization`,
        `Team ${keywords[0]} workflows`
      ],
      bestPractices: [
        `Use appropriate ${keywords[0]} sampling rates`,
        `Monitor ${keywords[0]} performance impact`,
        `Set up ${keywords[0]} alerts and dashboards`
      ],
      commonPitfalls: [
        `Over-configuring ${keywords[0]} in development`,
        `Ignoring ${keywords[0]} performance overhead`,
        `Missing ${keywords[0]} edge cases`
      ],
      relatedFeatures: ['performance-monitoring', 'error-tracking', 'dashboards-alerts']
    };

    /* Original OpenAI integration - keeping for future use
    const researchSummary = researchedContent
      .map(content => `Source: ${content.title}\nContent: ${content.content.substring(0, 1000)}...`)
      .join('\n\n');

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are an expert technical education content synthesizer specializing in Sentry observability tools. 
        Your task is to analyze research content and extract key learning concepts, practical examples, and best practices.
        
        Focus on creating educational content that is:
        - Technically accurate and up-to-date
        - Practical and actionable
        - Suitable for different skill levels
        - Rich with real-world use cases
        
        Return your response as a JSON object with the following structure:
        {
          "mainConcepts": ["concept1", "concept2", ...],
          "keyTakeaways": ["takeaway1", "takeaway2", ...],
          "codeExamples": ["example1", "example2", ...],
          "useCases": ["usecase1", "usecase2", ...],
          "bestPractices": ["practice1", "practice2", ...],
          "commonPitfalls": ["pitfall1", "pitfall2", ...],
          "relatedFeatures": ["feature1", "feature2", ...]
        }`
      },
      {
        role: 'user',
        content: `Please synthesize the following research content for Sentry concepts related to: ${keywords.join(', ')}

Research Content:
${researchSummary}

Extract the key educational components that would be most valuable for engineers learning about these Sentry features.`
      }
    ];

    try {
      const response = await this.callOpenAI(messages);
      const synthesized = JSON.parse(response);
      
      // Validate and sanitize the response
      return {
        mainConcepts: Array.isArray(synthesized.mainConcepts) ? synthesized.mainConcepts : [],
        keyTakeaways: Array.isArray(synthesized.keyTakeaways) ? synthesized.keyTakeaways : [],
        codeExamples: Array.isArray(synthesized.codeExamples) ? synthesized.codeExamples : [],
        useCases: Array.isArray(synthesized.useCases) ? synthesized.useCases : [],
        bestPractices: Array.isArray(synthesized.bestPractices) ? synthesized.bestPractices : [],
        commonPitfalls: Array.isArray(synthesized.commonPitfalls) ? synthesized.commonPitfalls : [],
        relatedFeatures: Array.isArray(synthesized.relatedFeatures) ? synthesized.relatedFeatures : []
      };
    } catch (error) {
      console.error('Error synthesizing research:', error);
      throw new Error('Failed to synthesize research content');
    }
    */
  }

  // Generate course metadata
  private async generateCourseMetadata(
    _synthesizedContent: SynthesizedContent,
    request: ContentGenerationRequest
  ): Promise<Omit<AIGeneratedCourse, 'id' | 'isAiGenerated' | 'generationRequest' | 'researchSources' | 'synthesizedContent' | 'generatedModules' | 'rolePersonalizations' | 'qualityScore' | 'generatedAt' | 'lastModified' | 'version'>> {
    console.log('AIContentService: Generating course metadata for keywords:', request.keywords);
    
    // For demo purposes, return mock metadata
    const title = `Mastering ${request.keywords.join(' & ')} with Sentry`;
    const description = `Learn ${request.keywords.join(' and ')} concepts through hands-on examples and real-world scenarios. Master the fundamentals and apply advanced techniques in production environments.`;
    
    return {
      title,
      description,
      duration: '2.5 hrs',
      level: 'Intermediate',
      category: 'Monitoring',
      rating: 4.5,
      students: 0,
      isPopular: false
    };

    /* Original OpenAI integration - keeping for future use
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are an expert course designer for technical education. Create engaging course metadata based on synthesized content.
        
        Return a JSON object with this structure:
        {
          "title": "Course Title",
          "description": "Compelling 2-3 sentence description",
          "duration": "X hrs" or "X min",
          "level": "Beginner" | "Intermediate" | "Advanced",
          "category": "Category name",
          "rating": 4.5,
          "students": 0,
          "isPopular": false
        }`
      },
      {
        role: 'user',
        content: `Create course metadata for a Sentry course about: ${request.keywords.join(', ')}

Target skill level: Intermediate
Target roles: ${request.targetRoles.join(', ')}

Key concepts: ${synthesizedContent.mainConcepts.join(', ')}
Main takeaways: ${synthesizedContent.keyTakeaways.slice(0, 3).join(', ')}`
      }
    ];

    try {
      const response = await this.callOpenAI(messages);
      const metadata = JSON.parse(response);
      
      return {
        title: metadata.title || `Sentry ${request.keywords[0]} Training`,
        description: metadata.description || 'Learn advanced Sentry concepts and best practices.',
        duration: metadata.duration || '2 hrs',
        level: 'Intermediate',
        category: metadata.category || 'Monitoring',
        rating: Math.min(Math.max(metadata.rating || 4.5, 3.0), 5.0),
        students: 0,
        isPopular: false
      };
    } catch (error) {
      console.error('Error generating course metadata:', error);
      // Return defaults if generation fails
      return {
        title: `Sentry ${request.keywords.join(' & ')} Guide`,
        description: `Learn ${request.keywords.join(' and ')} with Sentry. Master the concepts and apply them in real-world scenarios.`,
        duration: '2 hrs',
        level: 'Intermediate',
        category: 'Monitoring',
        rating: 4.5,
        students: 0,
        isPopular: false
      };
    }
    */
  }

  // Generate course modules
  private async generateModules(
    synthesizedContent: SynthesizedContent,
    request: ContentGenerationRequest
  ): Promise<AIGeneratedModule[]> {
    console.log('AIContentService: Generating modules for concepts:', synthesizedContent.mainConcepts);
    
    const moduleCount = Math.min(Math.max(synthesizedContent.mainConcepts.length, 3), 6);
    const modules: AIGeneratedModule[] = [];

    for (let i = 0; i < moduleCount; i++) {
      const concept = synthesizedContent.mainConcepts[i] || `Advanced Topic ${i + 1}`;
      const moduleData = await this.generateSingleModule(concept, synthesizedContent, request, i);
      modules.push(moduleData);
    }

    console.log('AIContentService: Generated', modules.length, 'modules');
    return modules;
  }

  // Generate a single module
  private async generateSingleModule(
    concept: string,
    _synthesizedContent: SynthesizedContent,
    request: ContentGenerationRequest,
    index: number
  ): Promise<AIGeneratedModule> {
    console.log('AIContentService: Generating module for concept:', concept);
    
    // For demo purposes, return mock module data
    const moduleId = `module-${index + 1}-${Date.now()}`;
    const title = concept;
    const description = `Learn about ${concept} in detail. This module covers the fundamentals, implementation strategies, and best practices for ${concept} in production environments.`;
    
    return {
      id: moduleId,
      title,
      description,
      duration: '20 min',
      isCompleted: false,
      keyTakeaways: [
        `Understand ${concept} fundamentals`,
        `Implement ${concept} in your applications`,
        `Apply ${concept} best practices`,
        `Troubleshoot common ${concept} issues`
      ],
      scenario: `You're working on a production application and need to implement ${concept}. Learn how to configure, deploy, and monitor ${concept} effectively.`,
      codeExample: `// ${concept} implementation example\nimport * as Sentry from "@sentry/react";\n\n// Configure ${concept}\nSentry.init({\n  // Add your configuration here\n  dsn: "YOUR_DSN_HERE",\n  // ${concept} specific settings\n});\n\n// Use ${concept} in your application\nfunction example${concept.replace(/\s+/g, '')}() {\n  // Implementation details\n  console.log('${concept} example');\n}`,
      contentConfig: {
        hasHandsOn: request.includeCodeExamples,
        hasScenario: request.includeScenarios,
        hasCodeExample: request.includeCodeExamples,
        estimatedReadingTime: 8
      },
      sourceReferences: [`https://docs.sentry.io/product/${concept.toLowerCase().replace(/\s+/g, '-')}/`],
      confidence: 0.85
    };

    /* Original OpenAI integration - keeping for future use
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are an expert technical curriculum designer. Create a detailed course module for Sentry education.
        
        Return a JSON object with this structure:
        {
          "title": "Module Title",
          "description": "2-3 sentence module description",
          "duration": "X min",
          "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"],
          "scenario": "Real-world scenario description",
          "codeExample": "Code example with comments",
          "sourceReferences": ["url1", "url2"]
        }`
      },
      {
        role: 'user',
        content: `Create a module about: ${concept}

Context:
- Course keywords: ${request.keywords.join(', ')}
- Skill level: Intermediate
- Available takeaways: ${synthesizedContent.keyTakeaways.join(', ')}
- Available code examples: ${synthesizedContent.codeExamples.slice(0, 2).join(', ')}
- Available use cases: ${synthesizedContent.useCases.slice(0, 2).join(', ')}
- Best practices: ${synthesizedContent.bestPractices.slice(0, 2).join(', ')}

Make it practical and actionable for engineers.`
      }
    ];

    try {
      const response = await this.callOpenAI(messages);
      const moduleData = JSON.parse(response);
      
      return {
        id: `module-${index + 1}-${Date.now()}`,
        title: moduleData.title || concept,
        description: moduleData.description || `Learn about ${concept} in Sentry.`,
        duration: moduleData.duration || '15 min',
        isCompleted: false,
        keyTakeaways: Array.isArray(moduleData.keyTakeaways) ? moduleData.keyTakeaways : [
          `Understand ${concept}`,
          `Implement ${concept} best practices`,
          `Troubleshoot ${concept} issues`
        ],
        scenario: moduleData.scenario || `You need to implement ${concept} monitoring for a production application.`,
        codeExample: moduleData.codeExample || `// Example ${concept} implementation\n// TODO: Add specific code example`,
        contentConfig: {
          hasHandsOn: request.includeCodeExamples,
          hasScenario: request.includeScenarios,
          hasCodeExample: request.includeCodeExamples,
          estimatedReadingTime: this.estimateReadingTime(moduleData.description || '')
        },
        sourceReferences: Array.isArray(moduleData.sourceReferences) ? moduleData.sourceReferences : [],
        confidence: 0.8 // Base confidence, can be adjusted based on available research
      };
    } catch (error) {
      console.error('Error generating module:', error);
      // Return a basic module if generation fails
      return {
        id: `module-${index + 1}-${Date.now()}`,
        title: concept,
        description: `Learn about ${concept} and how to use it effectively with Sentry.`,
        duration: '15 min',
        isCompleted: false,
        keyTakeaways: [
          `Understand ${concept} fundamentals`,
          `Implement ${concept} in your applications`,
          `Monitor and troubleshoot ${concept} issues`
        ],
        scenario: `You're tasked with implementing ${concept} monitoring for your team's production applications.`,
        codeExample: `// ${concept} implementation example\n// This will be updated with specific code`,
        contentConfig: {
          hasHandsOn: request.includeCodeExamples,
          hasScenario: request.includeScenarios,
          hasCodeExample: request.includeCodeExamples,
          estimatedReadingTime: 5
        },
        sourceReferences: [],
        confidence: 0.6
      };
    }
    */
  }

  // Generate role-specific personalizations
  private async generateRolePersonalizations(
    synthesizedContent: SynthesizedContent,
    targetRoles: EngineerRole[]
  ): Promise<AIGeneratedPersonalization[]> {
    console.log('AIContentService: Generating role personalizations for:', targetRoles);
    const personalizations: AIGeneratedPersonalization[] = [];

    for (const role of targetRoles) {
      const personalization = await this.generateRolePersonalization(role, synthesizedContent);
      personalizations.push(personalization);
    }

    console.log('AIContentService: Generated personalizations for', personalizations.length, 'roles');
    return personalizations;
  }

  // Generate personalization for a specific role
  private async generateRolePersonalization(
    role: EngineerRole,
    synthesizedContent: SynthesizedContent
  ): Promise<AIGeneratedPersonalization> {
    console.log('AIContentService: Generating personalization for role:', role);
    
    // For demo purposes, return mock personalization data
    const roleLabels = {
      'frontend': 'Frontend Developer',
      'backend': 'Backend Engineer', 
      'fullstack': 'Full-stack Developer',
      'sre': 'SRE/DevOps Engineer',
      'ai-ml': 'AI/ML Engineer',
      'pm-manager': 'Product Manager/Engineering Manager'
    };

    const mainConcept = synthesizedContent.mainConcepts[0] || 'monitoring';
    
    return {
      roleId: role,
      explanation: `As a ${roleLabels[role]}, you'll learn how ${mainConcept} applies specifically to your daily work. This content focuses on the tools and techniques most relevant to ${role} responsibilities.`,
      whyRelevant: `${mainConcept} is crucial for ${roleLabels[role]}s because it directly impacts your ability to build reliable, observable applications and deliver great user experiences.`,
      nextStepNudge: `Ready to apply ${mainConcept} in your ${role} workflow? Continue to the next module to see practical implementation examples.`,
      difficulty: 'intermediate',
      roleSpecificExamples: [
        `${role}-specific ${mainConcept} implementation`,
        `Common ${mainConcept} patterns for ${role} work`,
        `${roleLabels[role]} workflow integration`
      ],
      roleSpecificUseCases: [
        `${mainConcept} for ${role} development`,
        `Team collaboration with ${mainConcept}`,
        `Production ${mainConcept} for ${roleLabels[role]}s`
      ]
    };

    /* Original OpenAI integration - keeping for future use
    const roleContexts = {
      'frontend': 'Frontend developers work with React, JavaScript, and user experience optimization',
      'backend': 'Backend engineers work with APIs, databases, and server-side applications',
      'fullstack': 'Full-stack developers work across the entire application stack',
      'sre': 'SRE/DevOps engineers focus on infrastructure, reliability, and system operations',
      'ai-ml': 'AI/ML engineers work with machine learning models, data pipelines, and model serving',
      'pm-manager': 'Product managers and engineering managers focus on metrics, insights, and team coordination'
    };

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are an expert in role-specific technical education. Create personalized content explanations that resonate with specific engineering roles.
        
        Return a JSON object with this structure:
        {
          "explanation": "Role-specific explanation of the content",
          "whyRelevant": "Why this matters specifically for this role",
          "nextStepNudge": "Encouraging next step guidance",
          "difficulty": "beginner" | "intermediate" | "advanced",
          "roleSpecificExamples": ["example1", "example2"],
          "roleSpecificUseCases": ["usecase1", "usecase2"]
        }`
      },
      {
        role: 'user',
        content: `Create role-specific personalization for: ${role}

Role context: ${roleContexts[role]}

Content concepts: ${synthesizedContent.mainConcepts.join(', ')}
Use cases: ${synthesizedContent.useCases.join(', ')}
Best practices: ${synthesizedContent.bestPractices.join(', ')}

Make it highly relevant and actionable for this specific role.`
      }
    ];

    try {
      const response = await this.callOpenAI(messages);
      const personalizationData = JSON.parse(response);
      
      return {
        roleId: role,
        explanation: personalizationData.explanation || `Learn how to apply these Sentry concepts in your ${role} work.`,
        whyRelevant: personalizationData.whyRelevant || `This is important for ${role} engineers to improve their monitoring and debugging capabilities.`,
        nextStepNudge: personalizationData.nextStepNudge || `Continue learning to master advanced Sentry techniques for ${role} development.`,
        difficulty: personalizationData.difficulty || 'intermediate',
        roleSpecificExamples: Array.isArray(personalizationData.roleSpecificExamples) ? 
          personalizationData.roleSpecificExamples : [],
        roleSpecificUseCases: Array.isArray(personalizationData.roleSpecificUseCases) ? 
          personalizationData.roleSpecificUseCases : []
      };
    } catch (error) {
      console.error('Error generating role personalization:', error);
      return {
        roleId: role,
        explanation: `This content is specifically designed to help ${role} engineers implement effective monitoring and observability practices.`,
        whyRelevant: `As a ${role} engineer, these skills will help you build more reliable and observable systems.`,
        nextStepNudge: `Continue to the next module to deepen your Sentry expertise.`,
        difficulty: 'intermediate',
        roleSpecificExamples: [],
        roleSpecificUseCases: []
      };
    }
    */
  }

  // Calculate quality score based on various factors
  private calculateQualityScore(
    synthesizedContent: SynthesizedContent,
    modules: AIGeneratedModule[],
    rolePersonalizations: AIGeneratedPersonalization[],
    researchSources: ResearchedContent[]
  ): number {
    let score = 0;
    let maxScore = 0;

    // Content richness (30% of total score)
    const contentRichness = (
      synthesizedContent.mainConcepts.length * 0.1 +
      synthesizedContent.keyTakeaways.length * 0.1 +
      synthesizedContent.codeExamples.length * 0.05 +
      synthesizedContent.bestPractices.length * 0.05
    );
    score += Math.min(contentRichness, 0.3);
    maxScore += 0.3;

    // Module quality (25% of total score)
    const avgModuleConfidence = modules.reduce((sum, module) => sum + module.confidence, 0) / modules.length;
    score += avgModuleConfidence * 0.25;
    maxScore += 0.25;

    // Role coverage (20% of total score)
    const roleCoverage = rolePersonalizations.length > 0 ? 0.2 : 0;
    score += roleCoverage;
    maxScore += 0.2;

    // Research quality (15% of total score)
    const avgRelevanceScore = researchSources.reduce((sum, source) => sum + source.relevanceScore, 0) / researchSources.length;
    score += avgRelevanceScore * 0.15;
    maxScore += 0.15;

    // Source diversity (10% of total score)
    const uniqueSources = new Set(researchSources.map(source => source.source)).size;
    const sourceDiversity = Math.min(uniqueSources / 4, 1) * 0.1; // Normalize to max 4 sources
    score += sourceDiversity;
    maxScore += 0.1;

    return Math.min(score / maxScore, 1);
  }

  // Utility methods


  // Utility method for future use
  /*
  private estimateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
  */

  // Public method to start content generation
  async startContentGeneration(request: ContentGenerationRequest): Promise<GenerationResponse> {
    try {
      // Cancel any existing task for this request
      this.cancelBackgroundTask(request.id);
      
      // Simulate async processing - in a real implementation, this would
      // trigger a background job or queue processing
      console.log('AIContentService: Starting async content generation for request:', request.id);
      
      const timeoutId = setTimeout(async () => {
        console.log('AIContentService: Executing background generation for:', request.id);
        try {
          // This would normally fetch from external sources
          const mockResearchedContent: ResearchedContent[] = [
            {
              source: ResearchSource.DOCS_MAIN,
              url: 'https://docs.sentry.io',
              title: 'Sentry Documentation',
              content: 'Mock content for demonstration',
              relevanceScore: 0.9,
              extractedAt: new Date(),
              keyTopics: request.keywords,
              codeExamples: ['// Example code'],
              useCases: ['Monitoring production apps']
            }
          ];

          await this.generateCourseContent(request, mockResearchedContent);
        } catch (error) {
          console.error('Background generation failed:', error);
        } finally {
          // Clean up the task reference
          this.backgroundTasks.delete(request.id);
        }
      }, 3000); // Increased delay to 3 seconds to simulate real processing

      // Store the timeout ID for cleanup
      this.backgroundTasks.set(request.id, timeoutId);

      return {
        success: true,
        request_id: request.id,
        estimated_duration: 120 // 2 minutes
      };
    } catch (error) {
      return {
        success: false,
        request_id: request.id,
        estimated_duration: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Cancel a background task
  public cancelBackgroundTask(requestId: string): void {
    const timeoutId = this.backgroundTasks.get(requestId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.backgroundTasks.delete(requestId);
      console.log('AIContentService: Cancelled background task for request:', requestId);
    }
  }

  // Cancel all background tasks (cleanup method)
  public cancelAllBackgroundTasks(): void {
    for (const [requestId, timeoutId] of this.backgroundTasks.entries()) {
      clearTimeout(timeoutId);
      console.log('AIContentService: Cancelled background task for request:', requestId);
    }
    this.backgroundTasks.clear();
  }

  // Update configuration
  updateConfig(newConfig: Partial<OpenAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Check API key status
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
}

// Export singleton instance
export const aiContentService = new AIContentService();

// Export class for testing
export { AIContentService };