import { 
  ResearchedContent, 
  ResearchSource, 
  ResearchSourceConfig
} from '../types/aiGeneration';
import { updateGenerationProgress } from '../data/aiGeneratedCourses';

// Note: Additional interfaces like ScrapedContent, YouTubeVideoData, SearchResult
// would be implemented when adding real web scraping capabilities

class ContentResearchEngine {
  private cache: Map<string, ResearchedContent> = new Map();
  private rateLimitTracker: Map<string, number[]> = new Map();

  // Rate limiting for external API calls
  private checkRateLimit(domain: string, maxPerMinute: number = 10): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    const requests = this.rateLimitTracker.get(domain) || [];
    const recentRequests = requests.filter(time => time > oneMinuteAgo);
    
    if (recentRequests.length >= maxPerMinute) {
      return false;
    }
    
    recentRequests.push(now);
    this.rateLimitTracker.set(domain, recentRequests);
    return true;
  }

  // Main research function
  async researchSentryContent(
    keywords: string[], 
    sources: ResearchSourceConfig[],
    requestId: string
  ): Promise<ResearchedContent[]> {
    updateGenerationProgress(requestId, {
      status: 'researching',
      currentStep: 'Starting content research',
      progress: 10,
      logs: [`Starting research for keywords: ${keywords.join(', ')}`]
    });

    const results: ResearchedContent[] = [];
    const enabledSources = sources.filter(s => s.enabled);
    
    for (let i = 0; i < enabledSources.length; i++) {
      const sourceConfig = enabledSources[i];
      const progressStep = 10 + (20 * (i + 1)) / enabledSources.length;
      
      updateGenerationProgress(requestId, {
        currentStep: `Researching ${this.getSourceDisplayName(sourceConfig.source)}`,
        progress: progressStep,
        logs: [`Researching source: ${this.getSourceDisplayName(sourceConfig.source)}`]
      });

      try {
        const sourceResults = await this.researchSource(
          sourceConfig.source, 
          keywords, 
          sourceConfig.priority
        );
        results.push(...sourceResults);
      } catch (error) {
        console.error(`Error researching ${sourceConfig.source}:`, error);
        updateGenerationProgress(requestId, {
          logs: [`Warning: Failed to research ${this.getSourceDisplayName(sourceConfig.source)}: ${error}`]
        });
      }
    }

    updateGenerationProgress(requestId, {
      currentStep: 'Research completed, filtering and ranking results',
      progress: 35,
      logs: [`Research completed. Found ${results.length} relevant content pieces.`]
    });

    // Filter and rank results
    const filteredResults = this.filterAndRankResults(results, keywords);
    
    return filteredResults;
  }

  // Research individual source
  private async researchSource(
    source: ResearchSource, 
    keywords: string[], 
    priority: number
  ): Promise<ResearchedContent[]> {
    const cacheKey = `${source}-${keywords.join('-')}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.extractedAt)) {
      return [cached];
    }

    switch (source) {
      case ResearchSource.DOCS_MAIN:
        return await this.researchSentryDocs(keywords, priority);
      case ResearchSource.DOCS_PRODUCT:
        return await this.researchSentryProductDocs(keywords, priority);
      case ResearchSource.BLOG:
        return await this.researchSentryBlog(keywords, priority);
      case ResearchSource.CUSTOMERS:
        return await this.researchCustomerStories(keywords, priority);
      case ResearchSource.VS_LOGGING:
        return await this.researchComparisonContent(keywords, priority);
      case ResearchSource.YOUTUBE:
        return await this.researchYouTubeContent(keywords, priority);
      default:
        return [];
    }
  }

  // Research Sentry main documentation
  private async researchSentryDocs(keywords: string[], _priority: number): Promise<ResearchedContent[]> {
    const results: ResearchedContent[] = [];
    
    // Simulate research - in production, this would make actual HTTP requests
    const mockDocPages = [
      {
        url: 'https://docs.sentry.io/platforms/javascript/',
        title: 'JavaScript Platform Guide',
        content: this.generateMockDocContent('JavaScript SDK setup and configuration', keywords),
        section: 'Platform Guides'
      },
      {
        url: 'https://docs.sentry.io/product/performance/',
        title: 'Performance Monitoring',
        content: this.generateMockDocContent('Performance monitoring and tracing', keywords),
        section: 'Product'
      },
      {
        url: 'https://docs.sentry.io/product/sentry-basics/',
        title: 'Sentry Basics',
        content: this.generateMockDocContent('Fundamental Sentry concepts', keywords),
        section: 'Basics'
      }
    ];

    for (const page of mockDocPages) {
      if (this.checkRateLimit('docs.sentry.io', 5)) {
        const relevanceScore = this.calculateRelevanceScore(page.content, keywords);
        
        if (relevanceScore > 0.3) { // Only include relevant content
          results.push({
            source: ResearchSource.DOCS_MAIN,
            url: page.url,
            title: page.title,
            content: page.content,
            relevanceScore,
            extractedAt: new Date(),
            keyTopics: this.extractKeyTopics(page.content, keywords),
            codeExamples: this.extractCodeExamples(page.content),
            useCases: this.extractUseCases(page.content)
          });
        }
      }
    }

    return results;
  }

  // Research Sentry product documentation
  private async researchSentryProductDocs(keywords: string[], _priority: number): Promise<ResearchedContent[]> {
    const results: ResearchedContent[] = [];
    
    const mockProductPages = [
      {
        url: 'https://docs.sentry.io/product/alerts/',
        title: 'Alerts & Notifications',
        content: this.generateMockDocContent('Setting up alerts and notification rules', keywords)
      },
      {
        url: 'https://docs.sentry.io/product/dashboards/',
        title: 'Dashboards',
        content: this.generateMockDocContent('Creating custom dashboards and widgets', keywords)
      },
      {
        url: 'https://docs.sentry.io/product/releases/',
        title: 'Release Management',
        content: this.generateMockDocContent('Managing releases and tracking deployment health', keywords)
      }
    ];

    for (const page of mockProductPages) {
      if (this.checkRateLimit('docs.sentry.io', 5)) {
        const relevanceScore = this.calculateRelevanceScore(page.content, keywords);
        
        if (relevanceScore > 0.3) {
          results.push({
            source: ResearchSource.DOCS_PRODUCT,
            url: page.url,
            title: page.title,
            content: page.content,
            relevanceScore,
            extractedAt: new Date(),
            keyTopics: this.extractKeyTopics(page.content, keywords),
            codeExamples: this.extractCodeExamples(page.content),
            useCases: this.extractUseCases(page.content)
          });
        }
      }
    }

    return results;
  }

  // Research Sentry blog
  private async researchSentryBlog(keywords: string[], _priority: number): Promise<ResearchedContent[]> {
    const results: ResearchedContent[] = [];
    
    const mockBlogPosts = [
      {
        url: 'https://blog.sentry.io/performance-monitoring-best-practices/',
        title: 'Performance Monitoring Best Practices',
        content: this.generateMockBlogContent('Best practices for implementing performance monitoring', keywords)
      },
      {
        url: 'https://blog.sentry.io/debugging-production-javascript/',
        title: 'Debugging JavaScript in Production',
        content: this.generateMockBlogContent('Advanced techniques for debugging production JavaScript applications', keywords)
      },
      {
        url: 'https://blog.sentry.io/release-health-monitoring/',
        title: 'Release Health Monitoring',
        content: this.generateMockBlogContent('How to monitor the health of your releases', keywords)
      }
    ];

    for (const post of mockBlogPosts) {
      if (this.checkRateLimit('blog.sentry.io', 3)) {
        const relevanceScore = this.calculateRelevanceScore(post.content, keywords);
        
        if (relevanceScore > 0.2) {
          results.push({
            source: ResearchSource.BLOG,
            url: post.url,
            title: post.title,
            content: post.content,
            relevanceScore,
            extractedAt: new Date(),
            keyTopics: this.extractKeyTopics(post.content, keywords),
            codeExamples: this.extractCodeExamples(post.content),
            useCases: this.extractUseCases(post.content)
          });
        }
      }
    }

    return results;
  }

  // Research customer stories
  private async researchCustomerStories(keywords: string[], _priority: number): Promise<ResearchedContent[]> {
    const results: ResearchedContent[] = [];
    
    const mockCustomerStories = [
      {
        url: 'https://sentry.io/customers/dropbox/',
        title: 'How Dropbox Uses Sentry',
        content: this.generateMockCustomerContent('Dropbox case study on error monitoring and performance optimization', keywords)
      },
      {
        url: 'https://sentry.io/customers/microsoft/',
        title: 'Microsoft\'s Monitoring Strategy',
        content: this.generateMockCustomerContent('Microsoft\'s approach to application monitoring at scale', keywords)
      }
    ];

    for (const story of mockCustomerStories) {
      if (this.checkRateLimit('sentry.io', 2)) {
        const relevanceScore = this.calculateRelevanceScore(story.content, keywords);
        
        if (relevanceScore > 0.2) {
          results.push({
            source: ResearchSource.CUSTOMERS,
            url: story.url,
            title: story.title,
            content: story.content,
            relevanceScore,
            extractedAt: new Date(),
            keyTopics: this.extractKeyTopics(story.content, keywords),
            useCases: this.extractUseCases(story.content)
          });
        }
      }
    }

    return results;
  }

  // Research comparison content
  private async researchComparisonContent(keywords: string[], _priority: number): Promise<ResearchedContent[]> {
    const results: ResearchedContent[] = [];
    
    const mockComparisonContent = {
      url: 'https://sentry.io/vs/logging/',
      title: 'Sentry vs Traditional Logging',
      content: this.generateMockComparisonContent('Comparison between Sentry and traditional logging approaches', keywords)
    };

    if (this.checkRateLimit('sentry.io', 1)) {
      const relevanceScore = this.calculateRelevanceScore(mockComparisonContent.content, keywords);
      
      if (relevanceScore > 0.2) {
        results.push({
          source: ResearchSource.VS_LOGGING,
          url: mockComparisonContent.url,
          title: mockComparisonContent.title,
          content: mockComparisonContent.content,
          relevanceScore,
          extractedAt: new Date(),
          keyTopics: this.extractKeyTopics(mockComparisonContent.content, keywords),
          useCases: this.extractUseCases(mockComparisonContent.content)
        });
      }
    }

    return results;
  }

  // Research YouTube content
  private async researchYouTubeContent(keywords: string[], _priority: number): Promise<ResearchedContent[]> {
    // Note: This would require YouTube API integration in production
    const results: ResearchedContent[] = [];
    
    const mockVideoContent = {
      url: 'https://www.youtube.com/watch?v=mock-video-id',
      title: 'Sentry Performance Monitoring Tutorial',
      content: this.generateMockVideoContent('Video tutorial on implementing performance monitoring', keywords)
    };

    if (this.checkRateLimit('youtube.com', 1)) {
      const relevanceScore = this.calculateRelevanceScore(mockVideoContent.content, keywords);
      
      if (relevanceScore > 0.3) {
        results.push({
          source: ResearchSource.YOUTUBE,
          url: mockVideoContent.url,
          title: mockVideoContent.title,
          content: mockVideoContent.content,
          relevanceScore,
          extractedAt: new Date(),
          keyTopics: this.extractKeyTopics(mockVideoContent.content, keywords),
          codeExamples: this.extractCodeExamples(mockVideoContent.content),
          useCases: this.extractUseCases(mockVideoContent.content)
        });
      }
    }

    return results;
  }

  // Synthesize web content from URLs
  async synthesizeWebContent(urls: string[]): Promise<ResearchedContent[]> {
    const results: ResearchedContent[] = [];
    
    for (const url of urls) {
      try {
        if (this.checkRateLimit(new URL(url).hostname, 5)) {
          // In production, this would make actual HTTP requests and parse content
          const mockContent = this.generateMockContentFromUrl(url);
          results.push(mockContent);
        }
      } catch (error) {
        console.error(`Error processing URL ${url}:`, error);
      }
    }

    return results;
  }

  // Helper methods
  private isCacheValid(extractedAt: Date): boolean {
    const cacheMaxAge = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - extractedAt.getTime() < cacheMaxAge;
  }

  private calculateRelevanceScore(content: string, keywords: string[]): number {
    const lowerContent = content.toLowerCase();
    let score = 0;
    
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      const keywordCount = (lowerContent.match(new RegExp(lowerKeyword, 'g')) || []).length;
      score += keywordCount * 0.1;
    });

    // Normalize score to 0-1 range
    return Math.min(score, 1);
  }

  private extractKeyTopics(content: string, keywords: string[]): string[] {
    const topics = new Set<string>();
    
    // Add original keywords
    keywords.forEach(keyword => topics.add(keyword));
    
    // Extract additional topics (mock implementation)
    const commonTopics = [
      'error tracking', 'performance monitoring', 'logging', 'debugging',
      'alerts', 'dashboards', 'releases', 'integrations', 'API',
      'frontend', 'backend', 'JavaScript', 'React', 'Node.js'
    ];
    
    commonTopics.forEach(topic => {
      if (content.toLowerCase().includes(topic.toLowerCase())) {
        topics.add(topic);
      }
    });

    return Array.from(topics).slice(0, 10); // Limit to 10 topics
  }

  private extractCodeExamples(content: string): string[] {
    // Mock implementation - in production, this would parse actual code blocks
    const examples: string[] = [];
    
    if (content.includes('```') || content.includes('code')) {
      examples.push('// Example Sentry configuration');
      examples.push('import * as Sentry from "@sentry/react";');
      examples.push('Sentry.init({ dsn: "your-dsn-here" });');
    }

    return examples;
  }

  private extractUseCases(content: string): string[] {
    // Mock implementation - in production, this would analyze content for use cases
    const useCases: string[] = [];
    
    if (content.includes('monitoring') || content.includes('tracking')) {
      useCases.push('Production application monitoring');
    }
    if (content.includes('debug') || content.includes('error')) {
      useCases.push('Error debugging and resolution');
    }
    if (content.includes('performance') || content.includes('optimization')) {
      useCases.push('Performance optimization');
    }

    return useCases;
  }

  private filterAndRankResults(results: ResearchedContent[], _keywords: string[]): ResearchedContent[] {
    return results
      .filter(result => result.relevanceScore > 0.2) // Filter low-relevance results
      .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
      .slice(0, 20); // Limit to top 20 results
  }

  private getSourceDisplayName(source: ResearchSource): string {
    const displayNames = {
      [ResearchSource.DOCS_MAIN]: 'Sentry Documentation',
      [ResearchSource.DOCS_PRODUCT]: 'Product Documentation',
      [ResearchSource.BLOG]: 'Sentry Blog',
      [ResearchSource.CUSTOMERS]: 'Customer Stories',
      [ResearchSource.VS_LOGGING]: 'Comparison Content',
      [ResearchSource.YOUTUBE]: 'YouTube Videos'
    };
    return displayNames[source] || source;
  }

  // Mock content generators (in production, these would be replaced with actual content fetching)
  private generateMockDocContent(topic: string, keywords: string[]): string {
    return `# ${topic}

This comprehensive guide covers ${keywords.join(', ')} in detail. Learn how to implement best practices for monitoring and observability.

## Getting Started

To begin with ${keywords[0]}, you'll need to configure your Sentry SDK properly. This involves setting up the appropriate initialization parameters and ensuring your application is properly instrumented.

## Key Concepts

Understanding the fundamental concepts of ${keywords.join(' and ')} is crucial for effective implementation. These concepts include:

- Error tracking and categorization
- Performance monitoring and metrics
- Alert configuration and management
- Dashboard creation and customization

## Implementation Examples

Here are practical examples of implementing ${keywords[0]} in your application:

\`\`\`javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
\`\`\`

## Best Practices

Follow these best practices when implementing ${keywords.join(', ')}:

1. Configure appropriate sampling rates
2. Set up meaningful alert thresholds
3. Create role-specific dashboards
4. Implement proper error boundaries
5. Use structured logging practices

## Troubleshooting

Common issues and their solutions when working with ${keywords.join(', ')}.`;
  }

  private generateMockBlogContent(topic: string, keywords: string[]): string {
    return `# ${topic}

In this post, we'll explore advanced techniques for ${keywords.join(', ')} using Sentry. Learn from real-world examples and best practices.

## Introduction

${topic} is essential for modern application development. With Sentry, you can implement comprehensive monitoring that goes beyond basic error tracking.

## Real-World Scenarios

We've seen companies improve their ${keywords[0]} strategies by implementing the following approaches:

- Proactive monitoring with intelligent alerts
- Custom dashboards for different stakeholder groups
- Integration with existing development workflows
- Performance optimization based on real user data

## Case Study

A leading tech company reduced their mean time to resolution by 60% after implementing these ${keywords.join(' and ')} strategies.

## Conclusion

Implementing effective ${keywords.join(', ')} requires a strategic approach that considers your team's specific needs and workflows.`;
  }

  private generateMockCustomerContent(topic: string, keywords: string[]): string {
    return `# ${topic}

Learn how this leading company successfully implemented ${keywords.join(', ')} to improve their application reliability and user experience.

## Challenge

The company faced significant challenges with ${keywords[0]}, including:
- High error rates affecting user experience
- Lack of visibility into performance issues
- Difficulty prioritizing engineering work
- Limited insights into user impact

## Solution

By implementing Sentry's ${keywords.join(' and ')} capabilities, they achieved:
- 90% reduction in unhandled errors
- 50% improvement in page load times
- Real-time visibility into application health
- Data-driven engineering prioritization

## Results

The implementation of ${keywords.join(', ')} led to measurable business impact:
- Increased user satisfaction scores
- Reduced customer support tickets
- Improved developer productivity
- Better product reliability

## Key Takeaways

The success factors for implementing ${keywords.join(' and ')} include:
1. Starting with clear objectives
2. Involving all stakeholders in the process
3. Establishing monitoring best practices
4. Continuous improvement based on data`;
  }

  private generateMockComparisonContent(topic: string, keywords: string[]): string {
    return `# ${topic}

Compare traditional approaches with Sentry's modern approach to ${keywords.join(', ')}.

## Traditional Approach

Traditional ${keywords[0]} solutions often involve:
- Manual log analysis
- Reactive debugging
- Limited context and visibility
- Fragmented tooling

## Sentry Approach

Sentry's approach to ${keywords.join(' and ')} provides:
- Automatic error grouping and analysis
- Proactive issue detection
- Rich context and user impact data
- Unified monitoring platform

## Key Differences

| Feature | Traditional | Sentry |
|---------|-------------|---------|
| Error Detection | Manual | Automatic |
| Context | Limited | Rich |
| User Impact | Unknown | Measured |
| Resolution Time | Hours/Days | Minutes |

## Migration Strategy

Moving from traditional ${keywords[0]} to Sentry involves:
1. Assessment of current setup
2. Gradual implementation
3. Team training and adoption
4. Optimization and refinement`;
  }

  private generateMockVideoContent(topic: string, keywords: string[]): string {
    return `Video Transcript: ${topic}

Welcome to this tutorial on ${keywords.join(', ')} with Sentry. 

In this video, we'll cover:
- Setting up ${keywords[0]} in your application
- Configuring alerts and notifications
- Creating effective dashboards
- Best practices for ${keywords.join(' and ')}

[Video demonstrates step-by-step implementation]

Key points covered:
- Installation and configuration
- Real-world examples
- Common pitfalls to avoid
- Performance optimization tips

For more information, visit the Sentry documentation.`;
  }

  private generateMockContentFromUrl(url: string): ResearchedContent {
    const domain = new URL(url).hostname;
    const keywords = ['monitoring', 'observability'];
    
    return {
      source: this.getSourceFromUrl(url),
      url,
      title: `Content from ${domain}`,
      content: this.generateMockDocContent(`Information from ${domain}`, keywords),
      relevanceScore: 0.7,
      extractedAt: new Date(),
      keyTopics: keywords,
      codeExamples: ['// Example code from external source'],
      useCases: ['External monitoring example']
    };
  }

  private getSourceFromUrl(url: string): ResearchSource {
    if (url.includes('docs.sentry.io')) {
      return ResearchSource.DOCS_MAIN;
    } else if (url.includes('blog.sentry.io')) {
      return ResearchSource.BLOG;
    } else if (url.includes('youtube.com')) {
      return ResearchSource.YOUTUBE;
    }
    return ResearchSource.DOCS_MAIN; // Default
  }
}

// Export singleton instance
export const contentResearchEngine = new ContentResearchEngine();

// Export class for testing
export { ContentResearchEngine };