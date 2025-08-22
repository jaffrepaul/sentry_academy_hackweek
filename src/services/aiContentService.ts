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
import { updateGenerationProgress } from '../data/aiGeneratedCourses';

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
        isAIGenerated: true,
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

      updateGenerationProgress(request.id, {
        status: 'review-needed',
        currentStep: 'Content generation complete - ready for review',
        progress: 100,
        logs: ['Course generation completed successfully']
      });

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
    researchedContent: ResearchedContent[], 
    keywords: string[]
  ): Promise<SynthesizedContent> {
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
  }

  // Generate course metadata
  private async generateCourseMetadata(
    synthesizedContent: SynthesizedContent,
    request: ContentGenerationRequest
  ): Promise<Omit<AIGeneratedCourse, 'id' | 'isAIGenerated' | 'generationRequest' | 'researchSources' | 'synthesizedContent' | 'generatedModules' | 'rolePersonalizations' | 'qualityScore' | 'generatedAt' | 'lastModified' | 'version'>> {
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

Target skill level: ${request.contentType}
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
        level: this.mapContentTypeToLevel(request.contentType),
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
        level: this.mapContentTypeToLevel(request.contentType),
        category: 'Monitoring',
        rating: 4.5,
        students: 0,
        isPopular: false
      };
    }
  }

  // Generate course modules
  private async generateModules(
    synthesizedContent: SynthesizedContent,
    request: ContentGenerationRequest
  ): Promise<AIGeneratedModule[]> {
    const moduleCount = Math.min(Math.max(synthesizedContent.mainConcepts.length, 3), 6);
    const modules: AIGeneratedModule[] = [];

    for (let i = 0; i < moduleCount; i++) {
      const concept = synthesizedContent.mainConcepts[i] || `Advanced Topic ${i + 1}`;
      const module = await this.generateSingleModule(concept, synthesizedContent, request, i);
      modules.push(module);
    }

    return modules;
  }

  // Generate a single module
  private async generateSingleModule(
    concept: string,
    synthesizedContent: SynthesizedContent,
    request: ContentGenerationRequest,
    index: number
  ): Promise<AIGeneratedModule> {
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
- Skill level: ${request.contentType}
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
  }

  // Generate role-specific personalizations
  private async generateRolePersonalizations(
    synthesizedContent: SynthesizedContent,
    targetRoles: EngineerRole[]
  ): Promise<AIGeneratedPersonalization[]> {
    const personalizations: AIGeneratedPersonalization[] = [];

    for (const role of targetRoles) {
      const personalization = await this.generateRolePersonalization(role, synthesizedContent);
      personalizations.push(personalization);
    }

    return personalizations;
  }

  // Generate personalization for a specific role
  private async generateRolePersonalization(
    role: EngineerRole,
    synthesizedContent: SynthesizedContent
  ): Promise<AIGeneratedPersonalization> {
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
  private mapContentTypeToLevel(contentType: string): string {
    const mapping = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced'
    };
    return mapping[contentType as keyof typeof mapping] || 'Intermediate';
  }

  private estimateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Public method to start content generation
  async startContentGeneration(request: ContentGenerationRequest): Promise<GenerationResponse> {
    try {
      // Simulate async processing - in a real implementation, this would
      // trigger a background job or queue processing
      setTimeout(async () => {
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
        }
      }, 1000);

      return {
        success: true,
        requestId: request.id,
        estimatedDuration: 120 // 2 minutes
      };
    } catch (error) {
      return {
        success: false,
        requestId: request.id,
        estimatedDuration: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
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