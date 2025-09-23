'use client'

import { useState, useEffect, useOptimistic, useTransition } from 'react'
import { UserProgress, SentryFeature } from '@/types/roles'
import { useSession } from 'next-auth/react'
import {
  getUserProgress,
  updateUserProgress as updateUserProgressAction,
  completeModule as completeModuleAction,
  resetProgress as resetProgressAction,
} from '@/lib/actions/user-progress-actions'

const defaultUserProgress: UserProgress = {
  role: null,
  currentStep: 0,
  completedSteps: [],
  completedModules: [],
  completedFeatures: [],
  onboardingCompleted: false,
  lastActiveDate: new Date(),
  preferredContentType: 'mixed',
  hasSeenOnboarding: false,
}

/**
 * Hook for managing user progress with database persistence and optimistic updates
 */
export function useUserProgress() {
  const { data: session, status } = useSession()
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultUserProgress)
  const [optimisticProgress, updateOptimisticProgress] = useOptimistic(
    userProgress,
    (state: UserProgress, updates: Partial<UserProgress>) => ({
      ...state,
      ...updates,
      lastActiveDate: new Date(),
    })
  )
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  // Load progress from database when user is authenticated
  useEffect(() => {
    if (status === 'loading') return

    if (session?.user?.id) {
      getUserProgress()
        .then(progress => {
          setUserProgress(progress)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Failed to load user progress:', error)
          setUserProgress(defaultUserProgress)
          setIsLoading(false)
        })
    } else {
      // Not authenticated, use default progress
      setUserProgress(defaultUserProgress)
      setIsLoading(false)
    }
  }, [session?.user?.id, status])

  const updateProgress = (updates: Partial<UserProgress>) => {
    if (!session?.user?.id) {
      // For unauthenticated users, just update local state
      setUserProgress(prev => ({
        ...prev,
        ...updates,
        lastActiveDate: new Date(),
      }))
      return
    }

    // Optimistic update
    updateOptimisticProgress(updates)

    // Server update
    startTransition(async () => {
      try {
        await updateUserProgressAction({
          currentStep: updates.currentStep || 0,
          completedSteps: updates.completedSteps || [],
          completedModules: updates.completedModules || [],
          completedFeatures: (updates.completedFeatures as SentryFeature[]) || [],
          onboardingCompleted: updates.onboardingCompleted || false,
          preferredContentType: updates.preferredContentType || 'mixed',
        })
        // Refetch to ensure consistency
        const freshProgress = await getUserProgress()
        setUserProgress(freshProgress)
      } catch (error) {
        console.error('Failed to update user progress:', error)
        // Revert optimistic update on error
        const freshProgress = await getUserProgress()
        setUserProgress(freshProgress)
      }
    })
  }

  const completeModule = (moduleId: string) => {
    if (!session?.user?.id) {
      // For unauthenticated users, just update local state
      setUserProgress(prev => {
        const newCompletedModules = [...prev.completedModules]
        if (!newCompletedModules.includes(moduleId)) {
          newCompletedModules.push(moduleId)
        }
        return {
          ...prev,
          completedModules: newCompletedModules,
          lastActiveDate: new Date(),
        }
      })
      return
    }

    // Optimistic update
    const newCompletedModules = [...optimisticProgress.completedModules]
    if (!newCompletedModules.includes(moduleId)) {
      newCompletedModules.push(moduleId)
    }
    updateOptimisticProgress({ completedModules: newCompletedModules })

    // Server update
    startTransition(async () => {
      try {
        await completeModuleAction(moduleId)
        // Refetch to ensure consistency
        const freshProgress = await getUserProgress()
        setUserProgress(freshProgress)
      } catch (error) {
        console.error('Failed to complete module:', error)
        // Revert optimistic update on error
        const freshProgress = await getUserProgress()
        setUserProgress(freshProgress)
      }
    })
  }

  const resetProgress = () => {
    if (!session?.user?.id) {
      // For unauthenticated users, just reset local state
      setUserProgress(defaultUserProgress)
      return
    }

    // Optimistic update
    updateOptimisticProgress(defaultUserProgress)

    // Server update
    startTransition(async () => {
      try {
        await resetProgressAction()
        setUserProgress(defaultUserProgress)
      } catch (error) {
        console.error('Failed to reset progress:', error)
        // Revert optimistic update on error
        const freshProgress = await getUserProgress()
        setUserProgress(freshProgress)
      }
    })
  }

  return {
    userProgress: optimisticProgress,
    updateProgress,
    completeModule,
    resetProgress,
    isLoading,
    isPending,
  }
}
