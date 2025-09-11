'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getAuthSession } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { EngineerRole, SentryFeature } from '@/types/roles'
import { revalidatePath } from 'next/cache'

export async function getUserProgress() {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user.length) {
      throw new Error('User not found')
    }

    const userData = user[0]
    return {
      role: userData.engineerRole as EngineerRole | null,
      currentStep: userData.currentStep || 0,
      completedSteps: (userData.completedSteps as string[]) || [],
      completedModules: (userData.completedModules as string[]) || [],
      completedFeatures: (userData.completedFeatures as SentryFeature[]) || [],
      onboardingCompleted: userData.onboardingCompleted || false,
      preferredContentType: userData.preferredContentType as 'hands-on' | 'conceptual' | 'mixed' || 'mixed',
      hasSeenOnboarding: userData.hasSeenOnboarding || false,
      lastActiveDate: userData.updatedAt || new Date(),
    }
  } catch (error) {
    console.error('Error fetching user progress:', error)
    throw error
  }
}

export async function updateUserRole(role: EngineerRole, selectedFeatures: string[] = []) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    await db
      .update(users)
      .set({
        engineerRole: role,
        completedFeatures: selectedFeatures as SentryFeature[],
        onboardingCompleted: selectedFeatures.length > 0,
        hasSeenOnboarding: true,
        currentStep: 0,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

export async function updateUserProgress(updates: {
  currentStep?: number
  completedSteps?: string[]
  completedModules?: string[]
  completedFeatures?: SentryFeature[]
  onboardingCompleted?: boolean
  preferredContentType?: 'hands-on' | 'conceptual' | 'mixed'
}) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error updating user progress:', error)
    throw error
  }
}

export async function completeModule(moduleId: string) {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    // First get current progress
    const currentProgress = await getUserProgress()
    const updatedCompletedModules = [...currentProgress.completedModules]
    
    if (!updatedCompletedModules.includes(moduleId)) {
      updatedCompletedModules.push(moduleId)
    }

    await db
      .update(users)
      .set({
        completedModules: updatedCompletedModules,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error completing module:', error)
    throw error
  }
}

export async function resetProgress() {
  const session = await getAuthSession()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    await db
      .update(users)
      .set({
        engineerRole: null,
        currentStep: 0,
        completedSteps: [],
        completedModules: [],
        completedFeatures: [],
        onboardingCompleted: false,
        preferredContentType: 'mixed',
        hasSeenOnboarding: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error resetting progress:', error)
    throw error
  }
}