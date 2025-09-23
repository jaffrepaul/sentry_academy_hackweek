'use client'

import {
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
  UpdateProgressRequest,
  AIContentRequest,
  ConvertToCourseRequest,
  ApproveContentRequest,
  CourseResponse,
  ProgressResponse,
  APIResponse,
} from '@/types/api'

// API client configuration
const API_BASE = '/api'

// Generic fetch wrapper with error handling
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

// Courses API
export const coursesApi = {
  // Get all courses with filters
  async getCourses(filters: CourseFilters = {}): Promise<CourseResponse> {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const queryString = params.toString()
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`

    return apiRequest<CourseResponse>(endpoint, { method: 'GET' })
  },

  // Get single course by ID
  async getCourse(courseId: number): Promise<CourseResponse> {
    return apiRequest<CourseResponse>(`/courses/${courseId}`, { method: 'GET' })
  },

  // Create new course
  async createCourse(courseData: CreateCourseRequest): Promise<CourseResponse> {
    return apiRequest<CourseResponse>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    })
  },

  // Update existing course
  async updateCourse(courseId: number, updates: UpdateCourseRequest): Promise<CourseResponse> {
    return apiRequest<CourseResponse>(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  // Delete course
  async deleteCourse(courseId: number): Promise<APIResponse> {
    return apiRequest<APIResponse>(`/courses/${courseId}`, {
      method: 'DELETE',
    })
  },
}

// User Progress API
export const progressApi = {
  // Get user progress (for current user or specific user if admin)
  async getProgress(
    params: { courseId?: number; userId?: number } = {}
  ): Promise<ProgressResponse> {
    const searchParams = new URLSearchParams()

    if (params.courseId) {
      searchParams.append('courseId', params.courseId.toString())
    }
    if (params.userId) {
      searchParams.append('userId', params.userId.toString())
    }

    const queryString = searchParams.toString()
    const endpoint = `/user-progress${queryString ? `?${queryString}` : ''}`

    return apiRequest<ProgressResponse>(endpoint, { method: 'GET' })
  },

  // Get specific user's progress (admin only or own progress)
  async getUserProgress(userId: number): Promise<ProgressResponse> {
    return apiRequest<ProgressResponse>(`/user-progress/${userId}`, { method: 'GET' })
  },

  // Update progress for current user
  async updateProgress(progressData: UpdateProgressRequest): Promise<ProgressResponse> {
    return apiRequest<ProgressResponse>('/user-progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    })
  },

  // Reset user progress (admin only)
  async resetProgress(userId: number, courseId?: number): Promise<APIResponse> {
    const params = courseId ? `?courseId=${courseId}` : ''
    return apiRequest<APIResponse>(`/user-progress/${userId}${params}`, {
      method: 'DELETE',
    })
  },
}

// AI Content API
export const aiContentApi = {
  // Generate new AI content
  async generateContent(request: AIContentRequest) {
    return apiRequest('/ai-content', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Get generated AI content with pagination
  async getGeneratedContent(params: { limit?: number; offset?: number } = {}) {
    const searchParams = new URLSearchParams()

    if (params.limit) {
      searchParams.append('limit', params.limit.toString())
    }
    if (params.offset) {
      searchParams.append('offset', params.offset.toString())
    }

    const queryString = searchParams.toString()
    const endpoint = `/ai-content${queryString ? `?${queryString}` : ''}`

    return apiRequest(endpoint, { method: 'GET' })
  },

  // Approve AI content
  async approveContent(contentId: number) {
    return apiRequest(`/ai-content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'approve' } as ApproveContentRequest),
    })
  },

  // Convert AI content to course
  async convertToCourse(contentId: number, courseData: ConvertToCourseRequest['courseData']) {
    return apiRequest(`/ai-content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        action: 'convert_to_course',
        courseData,
      } as ConvertToCourseRequest),
    })
  },

  // Delete AI generated content
  async deleteContent(contentId: number) {
    return apiRequest(`/ai-content/${contentId}`, {
      method: 'DELETE',
    })
  },
}

// Utility functions for optimistic updates
export const optimisticApi = {
  // Progress update with optimistic UI
  async updateProgressOptimistically(
    courseId: number,
    progress: number,
    completed: boolean,
    optimisticUpdate: (action: any) => void
  ) {
    // Apply optimistic update immediately
    optimisticUpdate({
      type: 'UPDATE_PROGRESS',
      courseId,
      progress,
      completed,
    })

    try {
      // Make API call
      await progressApi.updateProgress({ courseId, progress, completed })
    } catch (error) {
      // Revert optimistic update on error
      throw error
    }
  },

  // Course creation with optimistic UI
  async createCourseOptimistically(
    courseData: CreateCourseRequest,
    optimisticUpdate: (action: any) => void
  ) {
    const tempCourse = {
      ...courseData,
      id: Date.now(), // Temporary ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Apply optimistic update immediately
    optimisticUpdate({
      type: 'ADD_COURSE',
      course: tempCourse,
    })

    try {
      // Make API call
      const result = await coursesApi.createCourse(courseData)
      return result
    } catch (error) {
      // Revert optimistic update on error
      throw error
    }
  },

  // Course update with optimistic UI
  async updateCourseOptimistically(
    courseId: number,
    updates: UpdateCourseRequest,
    optimisticUpdate: (action: any) => void
  ) {
    // Apply optimistic update immediately
    optimisticUpdate({
      type: 'UPDATE_COURSE',
      courseId,
      updates,
    })

    try {
      // Make API call
      await coursesApi.updateCourse(courseId, updates)
    } catch (error) {
      // Revert optimistic update on error
      throw error
    }
  },
}

// Error handling utilities
export function isApiError(error: any): error is { message: string; status?: number } {
  return error && typeof error.message === 'string'
}

export function getApiErrorMessage(error: any): string {
  if (isApiError(error)) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

// Network status utilities
export function isNetworkError(error: any): boolean {
  return error instanceof TypeError && error.message.includes('fetch')
}

export function shouldRetry(error: any, retryCount: number): boolean {
  if (retryCount >= 3) return false

  // Retry on network errors or 5xx status codes
  if (isNetworkError(error)) return true

  if (isApiError(error) && error.status) {
    return error.status >= 500 && error.status < 600
  }

  return false
}
