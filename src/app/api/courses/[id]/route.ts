import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses, course_modules } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { checkUserPermission } from '@/lib/actions/auth-actions'
import { revalidatePath } from 'next/cache'

// GET /api/courses/[id] - Get course details
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const courseId = parseInt(params.id)
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID' },
        { status: 400 }
      )
    }

    // Get course
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

    // Get course modules
    const modules = await db
      .select()
      .from(course_modules)
      .where(eq(course_modules.course_id, courseId))
      .orderBy(course_modules.order)

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        modules
      }
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

// PUT /api/courses/[id] - Update course (instructor/admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const courseId = parseInt(params.id)
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID' },
        { status: 400 }
      )
    }

    // Check permissions
    const canEdit = await checkUserPermission('edit_course')
    if (!canEdit) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      content,
      difficulty,
      duration,
      category,
      imageUrl,
      isPublished
    } = body

    // Check if course exists
    const [existingCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    // Update course
    const [updatedCourse] = await db
      .update(courses)
      .set({
        title: title ?? existingCourse.title,
        description: description ?? existingCourse.description,
        content: content ?? existingCourse.content,
        difficulty: difficulty ?? existingCourse.difficulty,
        duration: duration ?? existingCourse.duration,
        category: category ?? existingCourse.category,
        image_url: imageUrl ?? existingCourse.image_url,
        is_published: isPublished ?? existingCourse.is_published,
        updated_at: new Date()
      })
      .where(eq(courses.id, courseId))
      .returning()

    revalidatePath(`/courses/${existingCourse.slug}`)
    revalidatePath('/courses')
    revalidatePath('/admin')

    return NextResponse.json({
      success: true,
      course: updatedCourse
    })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

// DELETE /api/courses/[id] - Delete course (admin only)
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const courseId = parseInt(params.id)
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID' },
        { status: 400 }
      )
    }

    // Check permissions
    const canDelete = await checkUserPermission('delete_course')
    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: 'Permission denied - admin required' },
        { status: 403 }
      )
    }

    // Check if course exists
    const [existingCourse] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1)

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    // Delete course modules first
    await db
      .delete(course_modules)
      .where(eq(course_modules.course_id, courseId))

    // Delete course
    await db
      .delete(courses)
      .where(eq(courses.id, courseId))

    revalidatePath('/courses')
    revalidatePath('/admin')

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}