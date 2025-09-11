import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/actions/auth-actions'
import { db } from '@/lib/db'
import { userProgress, users, courses } from '@/lib/db/schema'
import { eq, and, desc, count } from 'drizzle-orm'

// GET /api/user-progress/[userId] - Get specific user's progress (admin only or own progress)
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const targetUserId = params.userId

    // Check permissions - users can only see their own progress unless admin
    if (currentUser.id !== targetUserId && currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Get user info
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      })
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get detailed progress with course information
    const progressList = await db
      .select({
        id: userProgress.id,
        courseId: userProgress.courseId,
        completed: userProgress.completed,
        progress: userProgress.progress,
        lastAccessedAt: userProgress.lastAccessedAt,
        createdAt: userProgress.createdAt,
        courseTitle: courses.title,
        courseSlug: courses.slug,
        courseDuration: courses.duration,
        courseCategory: courses.category,
        courseDifficulty: courses.difficulty,
        courseImageUrl: courses.imageUrl
      })
      .from(userProgress)
      .innerJoin(courses, eq(userProgress.courseId, courses.id))
      .where(eq(userProgress.userId, targetUserId))
      .orderBy(desc(userProgress.lastAccessedAt))

    // Get progress statistics
    const [stats] = await db
      .select({
        totalCourses: count(),
        completedCourses: count(userProgress.completed),
      })
      .from(userProgress)
      .where(eq(userProgress.userId, targetUserId))

    // Calculate average progress
    const avgProgress = progressList.length > 0 
      ? Math.round(progressList.reduce((sum, p) => sum + p.progress, 0) / progressList.length)
      : 0

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: currentUser.role === 'admin' ? user.email : undefined,
        role: user.role
      },
      progress: progressList,
      stats: {
        totalCoursesStarted: stats?.totalCourses || 0,
        completedCourses: progressList.filter(p => p.completed).length,
        averageProgress: avgProgress,
        recentActivity: progressList.slice(0, 5) // Last 5 activities
      }
    })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user progress' },
      { status: 500 }
    )
  }
}

// DELETE /api/user-progress/[userId] - Reset user's progress (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Permission denied - admin required' },
        { status: 403 }
      )
    }

    const targetUserId = params.userId

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    if (courseId) {
      // Reset progress for specific course
      const courseIdNum = parseInt(courseId)
      if (isNaN(courseIdNum)) {
        return NextResponse.json(
          { success: false, error: 'Invalid course ID' },
          { status: 400 }
        )
      }

      await db
        .delete(userProgress)
        .where(
          and(
            eq(userProgress.userId, targetUserId),
            eq(userProgress.courseId, courseIdNum)
          )
        )

      return NextResponse.json({
        success: true,
        message: 'Course progress reset successfully'
      })
    } else {
      // Reset all progress for user
      await db
        .delete(userProgress)
        .where(eq(userProgress.userId, targetUserId))

      return NextResponse.json({
        success: true,
        message: 'All user progress reset successfully'
      })
    }
  } catch (error) {
    console.error('Error resetting user progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset user progress' },
      { status: 500 }
    )
  }
}