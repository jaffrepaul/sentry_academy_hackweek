'use client'

import React, { createContext, useContext, useCallback, ReactNode } from 'react'
import { EngineerRole, UserProgress, LearningPath, LearningPathStep, NextContentRecommendation } from '../types/roles'
import { useUserProgress } from '../hooks/useUserProgress'
import { useLearningPath } from '../hooks/useLearningPath'
import { mapFeaturesToProgress } from '../utils/roleProgressMapper'

interface RoleContextType {
  userProgress: UserProgress
  currentLearningPath: LearningPath | null
  currentStep: LearningPathStep | null
  setUserRole: (role: EngineerRole, selectedFeatures?: string[]) => Promise<void>
  completeModule: (moduleId: string) => void
  resetProgress: () => void
  getNextRecommendation: () => NextContentRecommendation | null
  isLoading?: boolean
  isPending?: boolean
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

interface RoleProviderProps {
  children: ReactNode
}

/**
 * Optimized Role Provider with separated concerns:
 * - User progress management (useUserProgress hook)
 * - Learning path logic (useLearningPath hook)  
 * - Role/feature mapping (roleProgressMapper utility)
 */
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { userProgress, updateProgress, completeModule, resetProgress, isLoading, isPending } = useUserProgress()
  const { currentLearningPath, currentStep, getNextRecommendation } = useLearningPath(
    userProgress.role,
    userProgress.completedSteps,
    userProgress.completedFeatures
  )

  const setUserRole = useCallback(async (role: EngineerRole, selectedFeatures: string[] = []) => {
    // Use the separated mapper utility for cleaner code
    const { completedModules, completedFeatures, completedStepIds } = mapFeaturesToProgress(
      role, 
      selectedFeatures
    )

    // For authenticated users, use the server action
    try {
      const { updateUserRole } = await import('@/lib/actions/user-progress-actions')
      const result = await updateUserRole(role, selectedFeatures)
      
      if (!result.success) {
        // Fallback to local update for unauthenticated users or errors
        console.log('Server update failed, using local fallback:', result.error)
        updateProgress({
          role,
          currentStep: 0,
          completedSteps: completedStepIds,
          completedModules: completedModules,
          completedFeatures: completedFeatures,
          onboardingCompleted: selectedFeatures.length > 0,
          hasSeenOnboarding: true
        })
      }
      // The useUserProgress hook will automatically refetch the data on success
    } catch (error) {
      console.error('Failed to update user role on server:', error)
      // Fallback to local update for any unexpected errors
      updateProgress({
        role,
        currentStep: 0,
        completedSteps: completedStepIds,
        completedModules: completedModules,
        completedFeatures: completedFeatures,
        onboardingCompleted: selectedFeatures.length > 0,
        hasSeenOnboarding: true
      })
    }
  }, [updateProgress])

  const contextValue: RoleContextType = {
    userProgress,
    currentLearningPath,
    currentStep,
    setUserRole,
    completeModule,
    resetProgress,
    getNextRecommendation,
    isLoading,
    isPending
  }

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}