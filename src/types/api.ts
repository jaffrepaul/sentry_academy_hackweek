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
}

export interface AIContentRequest {
  type: 'course' | 'module' | 'quiz' | 'exercise'
  prompt: string
  context?: Record<string, any>
}

export interface AIContentResponse {
  id: number
  content: any
  status: 'pending' | 'generated' | 'approved'
}
