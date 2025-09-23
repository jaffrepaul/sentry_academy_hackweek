'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { getAuthSession } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { EngineerRole, SentryFeature } from '@/types/roles'
import { revalidatePath } from 'next/cache'

// Extended session type for server actions
interface ExtendedSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export async function getUserProgress() {
  const session = (await getAuthSession()) as ExtendedSession | null
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)

    if (!user.length) {
      throw new Error('User not found')
    }

    const userData = user[0]
    if (!userData) {
      return {
        role: null,
        currentStep: 0,
        completedSteps: [],
        completedModules: [],
        completedFeatures: [],
        onboardingCompleted: false,
        lastActiveDate: new Date(),
        preferredContentType: 'mixed' as const,
        hasSeenOnboarding: false,
      }
    }

    return {
      role: userData.engineer_role as EngineerRole | null,
      currentStep: userData.current_step || 0,
      completedSteps: (userData.completed_steps as string[]) || [],
      completedModules: (userData.completed_modules as string[]) || [],
      completedFeatures: (userData.completed_features as SentryFeature[]) || [],
      onboardingCompleted: userData.onboarding_completed || false,
      preferredContentType:
        (userData.preferred_content_type as 'hands-on' | 'conceptual' | 'mixed') || 'mixed',
      hasSeenOnboarding: userData.has_seen_onboarding || false,
      lastActiveDate: userData.updated_at || new Date(),
    }
  } catch (error) {
    console.error('Error fetching user progress:', error)
    throw error
  }
}

export async function updateUserRole(
  role: EngineerRole,
  selectedFeatures: string[] = []
): Promise<{ success: boolean; error?: string }> {
  const session = (await getAuthSession()) as ExtendedSession | null
  if (!session?.user?.id) {
    return { success: false, error: 'User not authenticated' }
  }

  try {
    await db
      .update(users)
      .set({
        engineer_role: role,
        completed_features: selectedFeatures as SentryFeature[],
        onboarding_completed: selectedFeatures.length > 0,
        has_seen_onboarding: true,
        current_step: 0,
        updated_at: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
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
  const session = (await getAuthSession()) as ExtendedSession | null
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    await db
      .update(users)
      .set({
        ...updates,
        updated_at: new Date(),
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
  const session = (await getAuthSession()) as ExtendedSession | null
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
        completed_modules: updatedCompletedModules,
        updated_at: new Date(),
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
  const session = (await getAuthSession()) as ExtendedSession | null
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    await db
      .update(users)
      .set({
        engineer_role: null,
        current_step: 0,
        completed_steps: [],
        completed_modules: [],
        completed_features: [],
        onboarding_completed: false,
        preferred_content_type: 'mixed',
        has_seen_onboarding: false,
        updated_at: new Date(),
      })
      .where(eq(users.id, session.user.id))

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error resetting progress:', error)
    throw error
  }
}
