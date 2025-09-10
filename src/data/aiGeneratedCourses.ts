import { 
  AIGeneratedCourse, 
  ContentGenerationRequest, 
  GenerationProgress, 
  GenerationStatus,
  ResearchSource,
  ResearchSourceConfig,
  ApprovalWorkflow,
  BulkOperation,
  AIGenerationSettings
} from '../types/aiGeneration';
import { Course } from './courses';
import { EngineerRole } from '../types/roles';

// Default research source configurations
export const defaultResearchSources: ResearchSourceConfig[] = [
  {
    source: ResearchSource.DOCS_MAIN,
    enabled: true,
    priority: 1,
    description: 'Official Sentry documentation - highest technical accuracy'
  },
  {
    source: ResearchSource.SENTRY_MAIN,
    enabled: true,
    priority: 2,
    description: 'Main Sentry platform and product information'
  },
  {
    source: ResearchSource.DOCS_PRODUCT,
    enabled: true,
    priority: 3,
    description: 'Product-specific documentation with feature details'
  },
  {
    source: ResearchSource.BLOG,
    enabled: true,
    priority: 4,
    description: 'Engineering blog posts with real-world examples'
  },
  {
    source: ResearchSource.VS_LOGGING,
    enabled: true,
    priority: 5,
    description: 'Comparison content for positioning context'
  },
  {
    source: ResearchSource.ANSWERS,
    enabled: true,
    priority: 6,
    description: 'Community Q&A and troubleshooting resources'
  },
  {
    source: ResearchSource.SUPPORT,
    enabled: true,
    priority: 7,
    description: 'Support documentation and help center'
  },
  {
    source: ResearchSource.YOUTUBE,
    enabled: true,
    priority: 8,
    description: 'Video content and tutorials'
  },
  {
    source: ResearchSource.CUSTOMERS,
    enabled: true,
    priority: 9,
    description: 'Customer case studies and success stories'
  }
];

// Default AI generation settings
export const defaultAISettings: AIGenerationSettings = {
  defaultSources: defaultResearchSources,
  maxConcurrentGenerations: 3,
  defaultQualityThreshold: 0.7,
  autoApprovalThreshold: 0.85,
  maxContentLength: 10000,
  enableExperimentalFeatures: false,
  rateLimits: {
    requestsPerHour: 10,
    requestsPerDay: 50
  }
};

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
class AIGeneratedCoursesStore {
  private courses: Map<string, AIGeneratedCourse> = new Map();
  private generationRequests: Map<string, ContentGenerationRequest> = new Map();
  private generationProgress: Map<string, GenerationProgress> = new Map();
  private approvalWorkflows: Map<string, ApprovalWorkflow> = new Map();
  private bulkOperations: Map<string, BulkOperation> = new Map();
  private settings: AIGenerationSettings = defaultAISettings;

  // Course management
  addCourse(course: AIGeneratedCourse): void {
    this.courses.set(course.id, course);
  }

  getCourse(id: string): AIGeneratedCourse | undefined {
    return this.courses.get(id);
  }

  getAllCourses(): AIGeneratedCourse[] {
    return Array.from(this.courses.values());
  }

  getApprovedCourses(): AIGeneratedCourse[] {
    return this.getAllCourses().filter(course => 
      course.approvedAt && course.approvedBy
    );
  }

  getCoursesByStatus(status: GenerationStatus): AIGeneratedCourse[] {
    return this.getAllCourses().filter(course => {
      const progress = this.getGenerationProgress(course.generationRequest.id);
      return progress?.status === status;
    });
  }

  getCoursesByRole(role: EngineerRole): AIGeneratedCourse[] {
    return this.getAllCourses().filter(course =>
      course.generationRequest.targetRoles.includes(role)
    );
  }

  updateCourse(id: string, updates: Partial<AIGeneratedCourse>): boolean {
    const course = this.courses.get(id);
    if (!course) return false;

    const updatedCourse = {
      ...course,
      ...updates,
      lastModified: new Date(),
      version: course.version + 1
    };

    this.courses.set(id, updatedCourse);
    return true;
  }

  deleteCourse(id: string): boolean {
    return this.courses.delete(id);
  }

  // Generation request management
  addGenerationRequest(request: ContentGenerationRequest): void {
    this.generationRequests.set(request.id, request);
    
    // Initialize progress tracking
    this.generationProgress.set(request.id, {
      status: 'pending',
      currentStep: 'Queued for processing',
      progress: 0,
      logs: [`Request created at ${request.createdAt.toISOString()}`]
    });
  }

  getGenerationRequest(id: string): ContentGenerationRequest | undefined {
    return this.generationRequests.get(id);
  }

  getAllGenerationRequests(): ContentGenerationRequest[] {
    return Array.from(this.generationRequests.values());
  }

  updateGenerationProgress(requestId: string, progress: Partial<GenerationProgress>): void {
    const current = this.generationProgress.get(requestId);
    if (!current) return;

    const updated = {
      ...current,
      ...progress,
      logs: [...current.logs, ...(progress.logs || [])]
    };

    this.generationProgress.set(requestId, updated);
  }

  getGenerationProgress(requestId: string): GenerationProgress | undefined {
    return this.generationProgress.get(requestId);
  }

  // Approval workflow management
  addApprovalWorkflow(workflow: ApprovalWorkflow): void {
    this.approvalWorkflows.set(workflow.id, workflow);
  }

  getApprovalWorkflow(id: string): ApprovalWorkflow | undefined {
    return this.approvalWorkflows.get(id);
  }

  getApprovalWorkflowByCourse(courseId: string): ApprovalWorkflow | undefined {
    return Array.from(this.approvalWorkflows.values())
      .find(workflow => workflow.courseId === courseId);
  }

  getPendingApprovals(): ApprovalWorkflow[] {
    return Array.from(this.approvalWorkflows.values())
      .filter(workflow => workflow.status === 'pending' || workflow.status === 'in-review');
  }

  updateApprovalWorkflow(id: string, updates: Partial<ApprovalWorkflow>): boolean {
    const workflow = this.approvalWorkflows.get(id);
    if (!workflow) return false;

    this.approvalWorkflows.set(id, { ...workflow, ...updates });
    return true;
  }

  // Bulk operations management
  addBulkOperation(operation: BulkOperation): void {
    this.bulkOperations.set(operation.id, operation);
  }

  getBulkOperation(id: string): BulkOperation | undefined {
    return this.bulkOperations.get(id);
  }

  getAllBulkOperations(): BulkOperation[] {
    return Array.from(this.bulkOperations.values());
  }

  updateBulkOperation(id: string, updates: Partial<BulkOperation>): boolean {
    const operation = this.bulkOperations.get(id);
    if (!operation) return false;

    this.bulkOperations.set(id, { ...operation, ...updates });
    return true;
  }

  // Settings management
  getSettings(): AIGenerationSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<AIGenerationSettings>): void {
    this.settings = { ...this.settings, ...updates };
  }

  // Statistics and analytics
  getGenerationStats() {
    const totalRequests = this.generationRequests.size;
    const totalCourses = this.courses.size;
    const approvedCourses = this.getApprovedCourses().length;
    const pendingApprovals = this.getPendingApprovals().length;
    
    const statusCounts = this.getAllCourses().reduce((acc, course) => {
      const progress = this.getGenerationProgress(course.generationRequest.id);
      const status = progress?.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roleDistribution = this.getAllCourses().reduce((acc, course) => {
      course.generationRequest.targetRoles.forEach(role => {
        acc[role] = (acc[role] || 0) + 1;
      });
      return acc;
    }, {} as Record<EngineerRole, number>);

    return {
      totalRequests,
      totalCourses,
      approvedCourses,
      pendingApprovals,
      statusCounts,
      roleDistribution,
      averageQualityScore: totalCourses > 0 
        ? this.getAllCourses().reduce((sum, course) => sum + course.qualityScore, 0) / totalCourses 
        : 0
    };
  }

  // Integration with existing course system
  mergeWithExistingCourses(existingCourses: Course[]): Course[] {
    const aiCourses = this.getApprovedCourses();
    const mergedCourses = [...existingCourses];

    // Add approved AI-generated courses
    aiCourses.forEach(aiCourse => {
      // Convert AIGeneratedCourse to Course for compatibility
      const course: Course = {
        id: aiCourse.id,
        title: aiCourse.title,
        description: aiCourse.description,
        duration: aiCourse.duration,
        level: aiCourse.level,
        rating: aiCourse.rating,
        students: aiCourse.students,
        category: aiCourse.category,
        isPopular: aiCourse.isPopular
      };
      mergedCourses.push(course);
    });

    return mergedCourses;
  }

  // Utility methods
  searchCourses(query: string): AIGeneratedCourse[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllCourses().filter(course =>
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.generationRequest.keywords.some(keyword => 
        keyword.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  getCoursesCreatedAfter(date: Date): AIGeneratedCourse[] {
    return this.getAllCourses().filter(course =>
      course.generatedAt > date
    );
  }

  getCoursesByQualityThreshold(threshold: number): AIGeneratedCourse[] {
    return this.getAllCourses().filter(course =>
      course.qualityScore >= threshold
    );
  }

  // Data export/import for backup
  exportData() {
    return {
      courses: Array.from(this.courses.entries()),
      generationRequests: Array.from(this.generationRequests.entries()),
      generationProgress: Array.from(this.generationProgress.entries()),
      approvalWorkflows: Array.from(this.approvalWorkflows.entries()),
      bulkOperations: Array.from(this.bulkOperations.entries()),
      settings: this.settings,
      exportedAt: new Date().toISOString()
    };
  }

  importData(data: Record<string, unknown>) {
    if (data.courses) {
      this.courses = new Map(data.courses);
    }
    if (data.generationRequests) {
      this.generationRequests = new Map(data.generationRequests);
    }
    if (data.generationProgress) {
      this.generationProgress = new Map(data.generationProgress);
    }
    if (data.approvalWorkflows) {
      this.approvalWorkflows = new Map(data.approvalWorkflows);
    }
    if (data.bulkOperations) {
      this.bulkOperations = new Map(data.bulkOperations);
    }
    if (data.settings) {
      this.settings = data.settings;
    }
  }

  // Clear all data (for testing/reset)
  clear() {
    this.courses.clear();
    this.generationRequests.clear();
    this.generationProgress.clear();
    this.approvalWorkflows.clear();
    this.bulkOperations.clear();
    this.settings = defaultAISettings;
  }
}

// Global store instance
export const aiGeneratedCoursesStore = new AIGeneratedCoursesStore();



// Convenience functions for external use
export const addAIGeneratedCourse = (course: AIGeneratedCourse) => 
  aiGeneratedCoursesStore.addCourse(course);

export const getAIGeneratedCourse = (id: string) => 
  aiGeneratedCoursesStore.getCourse(id);

export const getAllAIGeneratedCourses = () => 
  aiGeneratedCoursesStore.getAllCourses();

export const getApprovedAIGeneratedCourses = () => 
  aiGeneratedCoursesStore.getApprovedCourses();

export const mergeCourseData = (existingCourses: Course[]) => 
  aiGeneratedCoursesStore.mergeWithExistingCourses(existingCourses);

export const getGenerationStats = () => 
  aiGeneratedCoursesStore.getGenerationStats();

export const addGenerationRequest = (request: ContentGenerationRequest) => 
  aiGeneratedCoursesStore.addGenerationRequest(request);

export const getGenerationProgress = (requestId: string) => 
  aiGeneratedCoursesStore.getGenerationProgress(requestId);

export const updateGenerationProgress = (requestId: string, progress: Partial<GenerationProgress>) => 
  aiGeneratedCoursesStore.updateGenerationProgress(requestId, progress);

export const getAIGenerationSettings = () => 
  aiGeneratedCoursesStore.getSettings();

export const updateAIGenerationSettings = (updates: Partial<AIGenerationSettings>) => 
  aiGeneratedCoursesStore.updateSettings(updates);

// Export the store instance for advanced usage
export { AIGeneratedCoursesStore };