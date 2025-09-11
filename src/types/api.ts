// API request/response types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CourseFilters {
  category?: string
  difficulty?: string
  role?: string
  search?: string
  limit?: number
}

export interface AIContentRequest {
  type: 'course' | 'module' | 'quiz' | 'exercise'
  prompt: string
  targetAudience?: string
  difficulty?: string
  duration?: string
  context?: Record<string, any>
}

export interface AIContentResponse {
  id: number
  content: any
  status: 'pending' | 'generated' | 'approved'
}

// Course API types
export interface CreateCourseRequest {
  slug: string
  title: string
  description?: string
  content?: string
  difficulty?: string
  duration?: string
  category?: string
  imageUrl?: string
  isPublished?: boolean
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface CourseResponse {
  success: boolean
  course?: any
  courses?: any[]
  count?: number
  error?: string
}

// User Progress API types
export interface UpdateProgressRequest {
  courseId: number
  progress: number
  completed?: boolean
}

export interface ProgressResponse {
  success: boolean
  progress?: any
  error?: string
  message?: string
}

// AI Content API types
export interface ConvertToCourseRequest {
  action: 'convert_to_course'
  courseData: {
    slug: string
    title: string
    description?: string
    category?: string
    difficulty?: string
    duration?: string
    imageUrl?: string
  }
}

export interface ApproveContentRequest {
  action: 'approve'
}

export interface AIContentActionRequest extends ConvertToCourseRequest {}
export interface AIContentActionRequest extends ApproveContentRequest {}
