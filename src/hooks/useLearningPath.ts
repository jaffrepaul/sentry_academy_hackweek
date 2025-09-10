'use client'

import { useState, useEffect, useMemo } from 'react'
import { EngineerRole, LearningPath, LearningPathStep, NextContentRecommendation, SentryFeature } from '@/types/roles'
import { getLearningPathForRole } from '@/data/roles'

/**
 * Hook for managing learning path state and recommendations
 */
export function useLearningPath(
  role: EngineerRole | null, 
  completedSteps: string[], 
  completedFeatures: SentryFeature[]
) {
  const [currentLearningPath, setCurrentLearningPath] = useState<LearningPath | null>(null)

  // Update learning path when role changes
  useEffect(() => {
    if (role) {
      const path = getLearningPathForRole(role)
      if (path) {
        // Update path with completion status and unlocking logic
        const updatedPath = {
          ...path,
          steps: path.steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id)
            const isFirstIncompleteStep = !isCompleted && 
              path.steps
                .filter(s => s.priority < step.priority)
                .every(s => completedSteps.includes(s.id))
            
            return {
              ...step,
              isCompleted,
              isUnlocked: isCompleted || isFirstIncompleteStep || step.priority === 1
            }
          })
        }
        setCurrentLearningPath(updatedPath)
      } else {
        setCurrentLearningPath(null)
      }
    } else {
      setCurrentLearningPath(null)
    }
  }, [role, completedSteps])

  // Get current step
  const currentStep = useMemo(() => {
    if (!currentLearningPath) return null
    return currentLearningPath.steps.find(step => 
      !step.isCompleted && step.isUnlocked
    ) || null
  }, [currentLearningPath])

  // Get next recommendation
  const getNextRecommendation = (): NextContentRecommendation | null => {
    if (!role || !currentLearningPath) return null

    // Find the next uncompleted step in priority order that is also unlocked
    const nextStep = currentLearningPath.steps
      .filter(step => !step.isCompleted && step.isUnlocked)
      .sort((a, b) => a.priority - b.priority)[0]

    if (!nextStep) return null // All steps completed or no unlocked steps

    // Get the primary module for this step
    const primaryModule = nextStep.modules[0]
    
    return {
      moduleId: primaryModule,
      stepId: nextStep.id,
      priority: nextStep.priority,
      reasoning: nextStep.description,
      timeEstimate: nextStep.estimatedTime
    }
  }

  return {
    currentLearningPath,
    currentStep,
    getNextRecommendation
  }
}