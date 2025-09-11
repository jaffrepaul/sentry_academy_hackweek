import { NextRequest, NextResponse } from 'next/server'
import { 
  updateUserProgress 
} from '@/lib/actions/user-actions'
import { getCurrentUser } from '@/lib/actions/auth-actions'
import { db } from '@/lib/db'
import { userProgress, courses } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET /api/user-progress - Get user progress
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const userId = searchParams.get('userId')

    // If userId is provided and current user is admin, get that user's progress
    let targetUserId = currentUser.id
    if (userId && (currentUser.role === 'admin' || currentUser.role === 'super_admin')) {
      targetUserId = userId // userId is now string, no need to parseInt
    } else if (userId && currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      // Non-admin users can only access their own progress
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    if (courseId) {
      // Get progress for specific course
      const courseIdNum = parseInt(courseId)
      if (isNaN(courseIdNum)) {
        return NextResponse.json(
          { success: false, error: 'Invalid course ID' },
          { status: 400 }
        )
      }

      const [progress] = await db
        .select({
          id: userProgress.id,
          userId: userProgress.userId,
          courseId: userProgress.courseId,
          completed: userProgress.completed,
          progress: userProgress.progress,
          lastAccessedAt: userProgress.lastAccessedAt,
          createdAt: userProgress.createdAt,
          courseTitle: courses.title,
          courseSlug: courses.slug
        })
        .from(userProgress)
        .innerJoin(courses, eq(userProgress.courseId, courses.id))
        .where(
          and(
            eq(userProgress.userId, targetUserId),
            eq(userProgress.courseId, courseIdNum)
          )
        )
        .limit(1)

      return NextResponse.json({
        success: true,
        progress: progress || null
      })
    } else {
      // Get all progress for user
      const progressList = await db
        .select({
          id: userProgress.id,
          userId: userProgress.userId,
          courseId: userProgress.courseId,
          completed: userProgress.completed,
          progress: userProgress.progress,
          lastAccessedAt: userProgress.lastAccessedAt,
          createdAt: userProgress.createdAt,
          courseTitle: courses.title,
          courseSlug: courses.slug,
          courseDuration: courses.duration,
          courseCategory: courses.category
        })
        .from(userProgress)
        .innerJoin(courses, eq(userProgress.courseId, courses.id))
        .where(eq(userProgress.userId, targetUserId))
        .orderBy(desc(userProgress.lastAccessedAt))

      return NextResponse.json({
        success: true,
        progress: progressList
      })
    }
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user progress' },
      { status: 500 }
    )
  }
}

// POST /api/user-progress - Update user progress
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId, progress, completed = false } = body

    // Validate required fields
    if (!courseId || progress === undefined) {
      return NextResponse.json(
        { success: false, error: 'Course ID and progress are required' },
        { status: 400 }
      )
    }

    // Validate progress value
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return NextResponse.json(
        { success: false, error: 'Progress must be a number between 0 and 100' },
        { status: 400 }
      )
    }

    // Validate course exists
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    const result = await updateUserProgress(
      currentUser.id,
      courseId,
      progress,
      completed || progress >= 100
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully'
    })
  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}