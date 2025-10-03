'use server'

import * as Sentry from '@sentry/nextjs'
import { db } from '@/lib/db'
import { users, user_progress } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function getUserById(id: string) {
  return await Sentry.withServerActionInstrumentation(
    'getUserById',
    {
      recordResponse: false,
    },
    async () => {
      try {
        const user = await db.select().from(users).where(eq(users.id, id)).limit(1)

        return user[0] || null
      } catch (error) {
        Sentry.captureException(error, {
          tags: { action: 'getUserById', userId: id },
          extra: { id },
        })
        console.error('Error fetching user:', error)
        return null
      }
    }
  )
}

export async function getUserProgress(userId: string) {
  return await Sentry.withServerActionInstrumentation(
    'getUserProgress',
    {
      recordResponse: false,
    },
    async () => {
      try {
        return await db.select().from(user_progress).where(eq(user_progress.user_id, userId))
      } catch (error) {
        Sentry.captureException(error, {
          tags: { action: 'getUserProgress', userId },
          extra: { userId },
        })
        console.error('Error fetching user progress:', error)
        return []
      }
    }
  )
}

export async function updateUserProgress(
  userId: string,
  courseId: number,
  progress: number,
  completed: boolean = false
) {
  return await Sentry.withServerActionInstrumentation(
    'updateUserProgress',
    {
      recordResponse: true,
    },
    async () => {
      try {
        const existing = await db
          .select()
          .from(user_progress)
          .where(and(eq(user_progress.user_id, userId), eq(user_progress.course_id, courseId)))
          .limit(1)

        if (existing.length > 0 && existing[0]) {
          await db
            .update(user_progress)
            .set({
              progress,
              completed,
              last_accessed_at: new Date(),
            })
            .where(eq(user_progress.id, existing[0].id))
        } else {
          await db.insert(user_progress).values({
            user_id: userId,
            course_id: courseId,
            progress,
            completed,
            last_accessed_at: new Date(),
          })
        }

        return { success: true }
      } catch (error) {
        Sentry.captureException(error, {
          tags: { action: 'updateUserProgress', userId, courseId: courseId.toString() },
          extra: { userId, courseId, progress, completed },
        })
        console.error('Error updating user progress:', error)
        return { success: false, error: 'Failed to update progress' }
      }
    }
  )
}
