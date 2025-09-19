import { NextRequest, NextResponse } from 'next/server'

// Dynamic import to prevent build-time issues
async function importActions() {
  try {
    const { 
      approveAIContent, 
      convertAIContentToCourse,
      deleteAIContent
    } = await import('@/lib/actions/ai-actions')
    const { checkUserPermission } = await import('@/lib/actions/auth-actions')
    
    return { approveAIContent, convertAIContentToCourse, deleteAIContent, checkUserPermission }
  } catch (error) {
    console.error('Failed to import actions:', error)
    return null
  }
}

// PUT /api/ai-content/[id] - Approve AI content or convert to course
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const actions = await importActions()
    if (!actions) {
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const { approveAIContent, convertAIContentToCourse, checkUserPermission } = actions

    const params = await context.params
    const contentId = parseInt(params.id)
    
    if (isNaN(contentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid content ID' },
        { status: 400 }
      )
    }

    // Check permissions
    const canEdit = await checkUserPermission('create_course')
    if (!canEdit) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, courseData } = body

    if (action === 'approve') {
      const result = await approveAIContent(contentId)
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Content approved successfully'
      })
    }

    if (action === 'convert_to_course') {
      if (!courseData || !courseData.slug || !courseData.title) {
        return NextResponse.json(
          { success: false, error: 'Course slug and title are required' },
          { status: 400 }
        )
      }

      const result = await convertAIContentToCourse(contentId, courseData)
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        courseId: result.courseId,
        message: 'Content converted to course successfully'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "approve" or "convert_to_course"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating AI content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update AI content' },
      { status: 500 }
    )
  }
}

// DELETE /api/ai-content/[id] - Delete AI generated content
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const actions = await importActions()
    if (!actions) {
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const { deleteAIContent, checkUserPermission } = actions

    const params = await context.params
    const contentId = parseInt(params.id)
    
    if (isNaN(contentId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid content ID' },
        { status: 400 }
      )
    }

    // Check permissions - only admins can delete AI content
    const canDelete = await checkUserPermission('delete_course')
    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: 'Permission denied - admin required' },
        { status: 403 }
      )
    }

    const result = await deleteAIContent(contentId)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'AI content deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting AI content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete AI content' },
      { status: 500 }
    )
  }
}