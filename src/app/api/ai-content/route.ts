import { NextRequest, NextResponse } from 'next/server'
import { 
  generateAIContent, 
  getAIGeneratedContent,
  type AIContentRequest
} from '@/lib/actions/ai-actions'
import { checkUserPermission } from '@/lib/actions/auth-actions'

// POST /api/ai-content - Generate new AI content
export async function POST(request: NextRequest) {
  try {
    // Check permissions - only instructors and admins can generate content
    const canCreate = await checkUserPermission('create_course')
    if (!canCreate) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { type, prompt, targetAudience, difficulty, duration } = body

    // Validate required fields
    if (!type || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Type and prompt are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['course', 'module', 'quiz', 'exercise']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid content type' },
        { status: 400 }
      )
    }

    const contentRequest: AIContentRequest = {
      type,
      prompt,
      targetAudience,
      difficulty,
      duration
    }

    const result = await generateAIContent(contentRequest)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      id: result.id
    }, { status: 201 })
  } catch (error) {
    console.error('Error generating AI content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI content' },
      { status: 500 }
    )
  }
}

// GET /api/ai-content - Get AI generated content with pagination
export async function GET(request: NextRequest) {
  try {
    // Check permissions - only instructors and admins can view generated content
    const canView = await checkUserPermission('create_course')
    if (!canView) {
      return NextResponse.json(
        { success: false, error: 'Permission denied' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const content = await getAIGeneratedContent(limit, offset)

    return NextResponse.json({
      success: true,
      content,
      count: content.length
    })
  } catch (error) {
    console.error('Error fetching AI content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI content' },
      { status: 500 }
    )
  }
}