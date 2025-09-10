'use client'

import { useState, useEffect } from 'react'
import { UserProgress, EngineerRole } from '@/types/roles'

const STORAGE_KEY = 'sentry-academy-user-progress'

const defaultUserProgress: UserProgress = {
  role: null,
  currentStep: 0,
  completedSteps: [],
  completedModules: [],
  completedFeatures: [],
  onboardingCompleted: false,
  lastActiveDate: new Date(),
  preferredContentType: 'mixed',
  hasSeenOnboarding: false
}

/**
 * Hook for managing user progress with localStorage persistence
 */
export function useUserProgress() {
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultUserProgress)

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        // Ensure dates are properly parsed
        const progressWithDates = {
          ...parsed,
          lastActiveDate: new Date(parsed.lastActiveDate || Date.now())
        }
        setUserProgress(progressWithDates)
      } catch (error) {
        console.error('Failed to parse saved progress:', error)
        setUserProgress(defaultUserProgress)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (userProgress !== defaultUserProgress) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress))
    }
  }, [userProgress])

  const updateProgress = (updates: Partial<UserProgress>) => {
    setUserProgress(prev => ({
      ...prev,
      ...updates,
      lastActiveDate: new Date()
    }))
  }

  const completeModule = (moduleId: string) => {
    setUserProgress(prev => {
      const newCompletedModules = [...prev.completedModules]
      if (!newCompletedModules.includes(moduleId)) {
        newCompletedModules.push(moduleId)
      }
      return {
        ...prev,
        completedModules: newCompletedModules,
        lastActiveDate: new Date()
      }
    })
  }

  const resetProgress = () => {
    setUserProgress(defaultUserProgress)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    userProgress,
    updateProgress,
    completeModule,
    resetProgress
  }
}