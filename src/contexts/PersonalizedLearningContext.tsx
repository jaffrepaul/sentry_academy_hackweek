'use client'

import React, { createContext, useContext, useCallback, ReactNode } from 'react'
import { EngineerRole, UserProgress, LearningPath, LearningPathStep, NextContentRecommendation } from '@/types/roles'
import { useUserProgress } from '@/hooks/useUserProgress'
import { useLearningPath } from '@/hooks/useLearningPath'
import { mapFeaturesToProgress } from '@/utils/roleProgressMapper'

interface PersonalizedLearningContextType {
  // User's complete learning state
  userProgress: UserProgress
  engineerRole: EngineerRole | null
  
  // Learning path data derived from progress
  currentLearningPath: LearningPath | null
  currentStep: LearningPathStep | null
  getNextRecommendation: () => NextContentRecommendation | null
  
  // Actions for managing learning journey
  setEngineerRole: (role: EngineerRole, selectedFeatures?: string[]) => Promise<void>
  completeModule: (moduleId: string) => void
  resetProgress: () => void
  
  // Loading states
  isLoading?: boolean
  isPending?: boolean
}

const PersonalizedLearningContext = createContext<PersonalizedLearningContextType | undefined>(undefined)

interface PersonalizedLearningProviderProps {
  children: ReactNode
}

/**
 * Personalized Learning Provider
 * 
 * Manages the complete personalized learning journey for Sentry Academy users.
 * This combines engineer role selection with progress tracking because they are
 * inherently coupled in the user experience.
 * 
 * Responsibilities:
 * - Engineer role selection (backend, frontend, sre, fullstack, ai-ml, pm-manager)
 * - Learning path generation based on role and completed features
 * - Progress tracking (completed modules, steps, features)
 * - Personalized content recommendations
 * - Database persistence with optimistic updates
 * 
 * Note: This is separate from user access roles (admin/student/instructor) 
 * which are handled by NextAuth authentication.
 */
export const PersonalizedLearningProvider: React.FC<PersonalizedLearningProviderProps> = ({ children }) => {
  const { userProgress, updateProgress, completeModule, resetProgress, isLoading, isPending } = useUserProgress()
  const { currentLearningPath, currentStep, getNextRecommendation } = useLearningPath(
    userProgress.role,
    userProgress.completedSteps,
    userProgress.completedFeatures
  )

  const setEngineerRole = useCallback(async (role: EngineerRole, selectedFeatures: string[] = []) => {
    // Calculate progress mapping for the selected role and features
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

  const contextValue: PersonalizedLearningContextType = {
    userProgress,
    engineerRole: userProgress.role,
    currentLearningPath,
    currentStep,
    setEngineerRole,
    completeModule,
    resetProgress,
    getNextRecommendation,
    isLoading,
    isPending
  }

  return (
    <PersonalizedLearningContext.Provider value={contextValue}>
      {children}
    </PersonalizedLearningContext.Provider>
  )
}

export const usePersonalizedLearning = (): PersonalizedLearningContextType => {
  const context = useContext(PersonalizedLearningContext)
  if (context === undefined) {
    throw new Error('usePersonalizedLearning must be used within a PersonalizedLearningProvider')
  }
  return context
}
