'use client'

import { useOptimistic } from 'react'
import { Course, UserProgress } from '@/lib/db/schema'

// Types for optimistic updates
export type OptimisticAction = 
  | { type: 'UPDATE_PROGRESS'; courseId: number; progress: number; completed: boolean }
  | { type: 'ADD_COURSE'; course: Course }
  | { type: 'UPDATE_COURSE'; courseId: number; updates: Partial<Course> }
  | { type: 'DELETE_COURSE'; courseId: number }

// Hook for optimistic course updates
export function useOptimisticCourses(initialCourses: Course[]) {
  return useOptimistic(
    initialCourses,
    (state, action: OptimisticAction) => {
      switch (action.type) {
        case 'ADD_COURSE':
          return [action.course, ...state]
        
        case 'UPDATE_COURSE':
          return state.map(course => 
            course.id === action.courseId 
              ? { ...course, ...action.updates }
              : course
          )
        
        case 'DELETE_COURSE':
          return state.filter(course => course.id !== action.courseId)
        
        default:
          return state
      }
    }
  )
}

// Hook for optimistic progress updates
export function useOptimisticProgress(initialProgress: UserProgress[]) {
  return useOptimistic(
    initialProgress,
    (state, action: OptimisticAction) => {
      if (action.type === 'UPDATE_PROGRESS') {
        const existing = state.find(p => p.courseId === action.courseId)
        
        if (existing) {
          return state.map(p => 
            p.courseId === action.courseId
              ? { ...p, progress: action.progress, completed: action.completed }
              : p
          )
        } else {
          // Create new progress entry
          const newProgress: UserProgress = {
            id: Date.now(), // Temporary ID
            userId: 0, // Will be set by server
            courseId: action.courseId,
            progress: action.progress,
            completed: action.completed,
            lastAccessedAt: new Date(),
            createdAt: new Date()
          }
          return [...state, newProgress]
        }
      }
      
      return state
    }
  )
}

// Utility functions for progress calculations
export function calculateOverallProgress(progressList: UserProgress[]): {
  totalCourses: number
  completedCourses: number
  averageProgress: number
} {
  if (progressList.length === 0) {
    return { totalCourses: 0, completedCourses: 0, averageProgress: 0 }
  }

  const completedCourses = progressList.filter(p => p.completed).length
  const averageProgress = Math.round(
    progressList.reduce((sum, p) => sum + p.progress, 0) / progressList.length
  )

  return {
    totalCourses: progressList.length,
    completedCourses,
    averageProgress
  }
}

// Utility for debounced progress updates
export function createProgressDebouncer(
  updateFn: (courseId: number, progress: number) => Promise<void>,
  delay: number = 1000
) {
  const timeouts = new Map<number, NodeJS.Timeout>()

  return (courseId: number, progress: number) => {
    // Clear existing timeout for this course
    const existingTimeout = timeouts.get(courseId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      updateFn(courseId, progress)
      timeouts.delete(courseId)
    }, delay)

    timeouts.set(courseId, timeout)
  }
}

// Toast notifications for optimistic updates
export const optimisticToasts = {
  progressUpdated: (courseName: string, progress: number) => ({
    title: 'Progress Updated',
    description: `${courseName}: ${progress}% complete`,
    duration: 2000
  }),
  
  courseCompleted: (courseName: string) => ({
    title: '🎉 Course Completed!',
    description: `Congratulations on completing ${courseName}`,
    duration: 5000
  }),

  courseCreated: (courseName: string) => ({
    title: 'Course Created',
    description: `${courseName} has been created successfully`,
    duration: 3000
  }),

  courseUpdated: (courseName: string) => ({
    title: 'Course Updated',
    description: `${courseName} has been updated`,
    duration: 2000
  }),

  error: (message: string) => ({
    title: 'Error',
    description: message,
    variant: 'destructive' as const,
    duration: 5000
  })
}

// Error boundaries for optimistic updates
export function handleOptimisticError(
  error: Error,
  action: OptimisticAction,
  revert: () => void
) {
  console.error('Optimistic update failed:', error, action)
  
  // Revert the optimistic update
  revert()
  
  // Show error message
  return optimisticToasts.error(
    `Failed to ${action.type.toLowerCase().replace('_', ' ')}`
  )
}

// Local storage utilities for offline support
export const offlineStorage = {
  saveProgress: (userId: number, courseId: number, progress: number) => {
    const key = `progress_${userId}_${courseId}`
    const data = { progress, timestamp: Date.now() }
    localStorage.setItem(key, JSON.stringify(data))
  },

  getOfflineProgress: (userId: number): Array<{ courseId: number; progress: number; timestamp: number }> => {
    const prefix = `progress_${userId}_`
    const offlineProgress: Array<{ courseId: number; progress: number; timestamp: number }> = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(prefix)) {
        const courseId = parseInt(key.replace(prefix, ''))
        const data = JSON.parse(localStorage.getItem(key) || '{}')
        if (data.progress !== undefined) {
          offlineProgress.push({
            courseId,
            progress: data.progress,
            timestamp: data.timestamp
          })
        }
      }
    }

    return offlineProgress
  },

  clearProgress: (userId: number, courseId?: number) => {
    if (courseId) {
      localStorage.removeItem(`progress_${userId}_${courseId}`)
    } else {
      const prefix = `progress_${userId}_`
      const keysToRemove: string[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(prefix)) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
  }
}