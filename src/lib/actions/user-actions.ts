'use server'

import { db } from '@/lib/db'
import { users, userProgress } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getUserById(id: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    
    return user[0] || null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function getUserProgress(userId: string) {
  try {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return []
  }
}

export async function updateUserProgress(
  userId: string,
  courseId: number,
  progress: number,
  completed: boolean = false
) {
  try {
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.courseId, courseId)
        )
      )
      .limit(1)
    
    if (existing.length > 0) {
      await db
        .update(userProgress)
        .set({
          progress,
          completed,
          lastAccessedAt: new Date(),
        })
        .where(eq(userProgress.id, existing[0].id))
    } else {
      await db.insert(userProgress).values({
        userId,
        courseId,
        progress,
        completed,
        lastAccessedAt: new Date(),
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating user progress:', error)
    return { success: false, error: 'Failed to update progress' }
  }
}
