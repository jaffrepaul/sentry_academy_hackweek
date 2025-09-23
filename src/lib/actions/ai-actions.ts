'use server'

import { db } from '@/lib/db'
import { ai_generated_content, courses, course_modules } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export interface AIContentRequest {
  type: 'course' | 'module' | 'quiz' | 'exercise'
  prompt: string
  targetAudience?: string
  difficulty?: string
  duration?: string
}

export interface AIContentResponse {
  success: boolean
  content?: any
  error?: string
  id?: number
}

// Generate AI content server action
export async function generateAIContent(request: AIContentRequest): Promise<AIContentResponse> {
  try {
    // Insert the request into the database
    const [newContent] = await db
      .insert(ai_generated_content)
      .values({
        type: request.type,
        prompt: request.prompt,
        status: 'pending',
        content: null,
      })
      .returning()

    if (!newContent) {
      return {
        success: false,
        error: 'Failed to create content record',
      }
    }

    // Mock AI content generation (replace with actual AI service integration)
    const mockContent = await generateMockContent(request)

    // Update the content with generated data
    await db
      .update(ai_generated_content)
      .set({
        content: mockContent,
        status: 'generated',
        updated_at: new Date(),
      })
      .where(eq(ai_generated_content.id, newContent.id))

    revalidatePath('/admin')

    return {
      success: true,
      content: mockContent,
      id: newContent.id,
    }
  } catch (error) {
    console.error('Error generating AI content:', error)
    return {
      success: false,
      error: 'Failed to generate AI content',
    }
  }
}

// Approve generated content
export async function approveAIContent(
  contentId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(ai_generated_content)
      .set({
        status: 'approved',
        updated_at: new Date(),
      })
      .where(eq(ai_generated_content.id, contentId))

    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error approving AI content:', error)
    return {
      success: false,
      error: 'Failed to approve content',
    }
  }
}

// Get AI generated content with pagination
export async function getAIGeneratedContent(limit: number = 10, offset: number = 0) {
  try {
    return await db
      .select()
      .from(ai_generated_content)
      .orderBy(desc(ai_generated_content.created_at))
      .limit(limit)
      .offset(offset)
  } catch (error) {
    console.error('Error fetching AI content:', error)
    return []
  }
}

// Convert approved AI content to actual course
export async function convertAIContentToCourse(
  contentId: number,
  additionalData: {
    slug: string
    title: string
    description?: string
    category?: string
    difficulty?: string
    duration?: string
    imageUrl?: string
  }
): Promise<{ success: boolean; courseId?: number; error?: string }> {
  try {
    // Get the AI content
    const [aiContent] = await db
      .select()
      .from(ai_generated_content)
      .where(eq(ai_generated_content.id, contentId))
      .limit(1)

    if (!aiContent || aiContent.status !== 'approved') {
      return { success: false, error: 'Content not found or not approved' }
    }

    // Create the course
    const [newCourse] = await db
      .insert(courses)
      .values({
        slug: additionalData.slug,
        title: additionalData.title,
        description: additionalData.description || '',
        content: JSON.stringify(aiContent.content),
        category: additionalData.category || null,
        difficulty: additionalData.difficulty || null,
        duration: additionalData.duration || null,
        image_url: additionalData.imageUrl || null,
        is_published: false, // Needs manual review before publishing
      })
      .returning()

    // If content includes modules, create them
    if (
      newCourse &&
      aiContent.content &&
      typeof aiContent.content === 'object' &&
      'modules' in aiContent.content &&
      Array.isArray(aiContent.content.modules)
    ) {
      for (const [index, module] of aiContent.content.modules.entries()) {
        await db.insert(course_modules).values({
          course_id: newCourse.id,
          title: module.title || `Module ${index + 1}`,
          content: module.content || '',
          order: index,
          duration: module.duration || '30 min',
        })
      }
    }

    revalidatePath('/admin')
    if (!newCourse) {
      return {
        success: false,
        error: 'Failed to create course',
      }
    }

    revalidatePath('/courses')

    return {
      success: true,
      courseId: newCourse.id,
    }
  } catch (error) {
    console.error('Error converting AI content to course:', error)
    return {
      success: false,
      error: 'Failed to create course from AI content',
    }
  }
}

// Mock content generation function (replace with actual AI service)
async function generateMockContent(request: AIContentRequest) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  switch (request.type) {
    case 'course':
      return {
        title: generateCourseTitle(request.prompt),
        description: `AI-generated course about ${request.prompt}`,
        modules: [
          {
            title: `Introduction to ${request.prompt}`,
            content: `<h2>Welcome to ${request.prompt}</h2><p>In this module, you'll learn the fundamentals...</p>`,
            duration: '30 min',
          },
          {
            title: `Advanced ${request.prompt} Techniques`,
            content: `<h2>Advanced Concepts</h2><p>Now that you understand the basics, let's dive deeper...</p>`,
            duration: '45 min',
          },
          {
            title: `${request.prompt} Best Practices`,
            content: `<h2>Best Practices</h2><p>Learn industry-standard practices for ${request.prompt}...</p>`,
            duration: '35 min',
          },
        ],
        totalDuration: request.duration || '1.5 hours',
        difficulty: request.difficulty || 'Intermediate',
        targetAudience: request.targetAudience || 'Developers',
      }

    case 'module':
      return {
        title: `Module: ${request.prompt}`,
        content: `<h2>${request.prompt}</h2><p>This module covers...</p><ul><li>Key concepts</li><li>Practical examples</li><li>Hands-on exercises</li></ul>`,
        duration: request.duration || '30 min',
        exercises: [
          {
            type: 'quiz',
            question: `What is the main purpose of ${request.prompt}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
          },
        ],
      }

    case 'quiz':
      return {
        title: `Quiz: ${request.prompt}`,
        questions: [
          {
            question: `What is ${request.prompt}?`,
            type: 'multiple-choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: `${request.prompt} is...`,
          },
          {
            question: `How would you implement ${request.prompt}?`,
            type: 'multiple-choice',
            options: ['Method A', 'Method B', 'Method C', 'Method D'],
            correctAnswer: 1,
            explanation: 'The correct approach is...',
          },
        ],
        passingScore: 70,
        timeLimit: 10, // minutes
      }

    case 'exercise':
      return {
        title: `Exercise: ${request.prompt}`,
        description: `Hands-on exercise for ${request.prompt}`,
        instructions: [
          'Step 1: Set up your environment',
          'Step 2: Implement the basic functionality',
          'Step 3: Test your implementation',
          'Step 4: Optimize and refine',
        ],
        code_template: `// TODO: Implement ${request.prompt}\nfunction implement${request.prompt.replace(/\s+/g, '')}() {\n  // Your code here\n}`,
        expected_output: 'Expected results...',
        difficulty: request.difficulty || 'Intermediate',
      }

    default:
      return {
        content: `Generated content for: ${request.prompt}`,
        type: request.type,
      }
  }
}

// Helper function to generate course titles
function generateCourseTitle(prompt: string): string {
  const titleTemplates = [
    `Mastering ${prompt}`,
    `Complete Guide to ${prompt}`,
    `${prompt} Fundamentals`,
    `Advanced ${prompt} Techniques`,
    `${prompt} Best Practices`,
    `Professional ${prompt} Development`,
  ]

  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)] || 'Generated Course'
}

// Delete AI generated content
export async function deleteAIContent(
  contentId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(ai_generated_content).where(eq(ai_generated_content.id, contentId))

    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error deleting AI content:', error)
    return {
      success: false,
      error: 'Failed to delete AI content',
    }
  }
}
