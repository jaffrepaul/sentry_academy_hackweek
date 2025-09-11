import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq, like, and, desc } from 'drizzle-orm'
import { checkUserPermission } from '@/lib/actions/auth-actions'
import { revalidatePath } from 'next/cache'

// GET /api/courses - List courses with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    const published = searchParams.get('published') !== 'false' // Default to true

    const queryBuilder = db
      .select()
      .from(courses)
      .where(
        and(
          published ? eq(courses.isPublished, true) : undefined,
          category ? eq(courses.category, category) : undefined,
          difficulty ? eq(courses.difficulty, difficulty) : undefined,
          search ? like(courses.title, `%${search}%`) : undefined
        )
      )
      .orderBy(desc(courses.createdAt))
      .$dynamic()

    // Apply limit and offset if provided
    let query = queryBuilder
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    if (offset) {
      query = query.offset(parseInt(offset))
    }

    const coursesList = await query

    return NextResponse.json({
      success: true,
      courses: coursesList,
      count: coursesList.length
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create new course (instructor/admin only)
export async function POST(request: NextRequest) {
  try {
    // Check permissions
    const canCreate = await checkUserPermission('create_course')
    if (!canCreate) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      slug,
      title,
      description,
      content,
      difficulty,
      duration,
      category,
      imageUrl,
      isPublished = false
    } = body

    // Validate required fields
    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: 'Slug and title are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existing = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, slug))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Course with this slug already exists' },
        { status: 409 }
      )
    }

    // Create course
    const [newCourse] = await db.insert(courses).values({
      slug,
      title,
      description: description || null,
      content: content || null,
      difficulty: difficulty || null,
      duration: duration || null,
      category: category || null,
      imageUrl: imageUrl || null,
      isPublished,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    revalidatePath('/courses')
    revalidatePath('/admin')

    return NextResponse.json({
      success: true,
      course: newCourse
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  }
}