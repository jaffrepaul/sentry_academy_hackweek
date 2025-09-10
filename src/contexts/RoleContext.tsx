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
  setUserRole: (role: EngineerRole, selectedFeatures?: string[]) => void
  completeModule: (moduleId: string) => void
  resetProgress: () => void
  getNextRecommendation: () => NextContentRecommendation | null
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
  const { userProgress, updateProgress, completeModule, resetProgress } = useUserProgress()
  const { currentLearningPath, currentStep, getNextRecommendation } = useLearningPath(
    userProgress.role,
    userProgress.completedSteps,
    userProgress.completedFeatures
  )

  const setUserRole = useCallback((role: EngineerRole, selectedFeatures: string[] = []) => {
    // Use the separated mapper utility for cleaner code
    const { completedModules, completedFeatures, completedStepIds } = mapFeaturesToProgress(
      role, 
      selectedFeatures
    )

    // Update user progress with new role and computed progress
    updateProgress({
      role,
      currentStep: 0,
      completedSteps: completedStepIds,
      completedModules,
      completedFeatures,
      onboardingCompleted: selectedFeatures.length > 0,
      hasSeenOnboarding: true
    })
  }, [updateProgress])

  const contextValue: RoleContextType = {
    userProgress,
    currentLearningPath,
    currentStep,
    setUserRole,
    completeModule,
    resetProgress,
    getNextRecommendation
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