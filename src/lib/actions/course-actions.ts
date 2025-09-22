'use server'

import { cache } from 'react'
import { db } from '@/lib/db'
import { courses, learning_paths, course_modules } from '@/lib/db/schema'
import { eq, like, and, desc } from 'drizzle-orm'
import { CourseFilters } from '@/types/api'
import { getMockCourses, getMockCourseBySlug, getMockCourseModules, getMockLearningPaths } from '@/lib/fallback/mock-courses'
import { healthCheck } from '@/lib/db'

// Cached version of course fetching for better performance
export const getCourses = cache(async (filters: CourseFilters & { limit?: number } = {}) => {
  try {
    const query = db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.is_published, true),
          filters.category ? eq(courses.category, filters.category) : undefined,
          filters.difficulty ? eq(courses.difficulty, filters.difficulty) : undefined,
          filters.search ? like(courses.title, `%${filters.search}%`) : undefined
        )
      )
      .orderBy(desc(courses.created_at))
    
    if (filters.limit) {
      query.limit(filters.limit)
    }
    
    const dbCourses = await query.execute()
    
    // If database is empty, fall back to mock data for development
    if (dbCourses.length === 0) {
      console.warn('⚠️  No courses found in database, falling back to mock data')
      return await getMockCourses(filters)
    }
    
    return dbCourses
  } catch (error) {
    console.error('❌ Error fetching courses from database:', error)
    console.warn('⚠️  Falling back to mock data due to database error')
    return await getMockCourses(filters)
  }
})

// Cached version of single course fetching
export const getCourseBySlug = cache(async (slug: string) => {
  try {
    const course = await db
      .select()
      .from(courses)
      .where(and(eq(courses.slug, slug), eq(courses.is_published, true)))
      .limit(1)
    
    const dbCourse = course[0] || null
    
    // If course not found in database, fall back to mock data
    if (!dbCourse) {
      console.warn(`⚠️  Course '${slug}' not found in database, checking mock data`)
      return await getMockCourseBySlug(slug)
    }
    
    return dbCourse
  } catch (error) {
    console.error(`❌ Error fetching course '${slug}' from database:`, error)
    console.warn(`⚠️  Falling back to mock data for course: ${slug}`)
    return await getMockCourseBySlug(slug)
  }
})

// Cached course modules fetching
export const getCourseModules = cache(async (courseId: number) => {
  try {
    const modules = await db
      .select()
      .from(course_modules)
      .where(eq(course_modules.course_id, courseId))
      .orderBy(course_modules.order)
    
    // If no modules found in database, fall back to mock data
    if (modules.length === 0) {
      console.warn(`⚠️  No modules found for course ${courseId}, falling back to mock data`)
      return await getMockCourseModules(courseId)
    }
    
    return modules
  } catch (error) {
    console.error(`❌ Error fetching course modules for course ${courseId}:`, error)
    console.warn(`⚠️  Falling back to mock data for course modules: ${courseId}`)
    return await getMockCourseModules(courseId)
  }
})

// Cached learning paths fetching
export const getLearningPaths = cache(async () => {
  try {
    const paths = await db
      .select()
      .from(learning_paths)
      .orderBy(learning_paths.title)
    
    // If no learning paths found in database, fall back to mock data
    if (paths.length === 0) {
      console.warn('⚠️  No learning paths found in database, falling back to mock data')
      return await getMockLearningPaths()
    }
    
    return paths
  } catch (error) {
    console.error('❌ Error fetching learning paths:', error)
    console.warn('⚠️  Falling back to mock data for learning paths')
    return await getMockLearningPaths()
  }
})

/**
 * Get database and data status for monitoring/debugging
 */
export const getDataStatus = cache(async () => {
  try {
    const dbHealth = await healthCheck()
    const coursesCount = await db.select().from(courses).then(rows => rows.length)
    const learningPathsCount = await db.select().from(learning_paths).then(rows => rows.length)
    const modulesCount = await db.select().from(course_modules).then(rows => rows.length)
    
    return {
      database: dbHealth,
      counts: {
        courses: coursesCount,
        learningPaths: learningPathsCount,
        courseModules: modulesCount
      },
      usingFallback: false,
      lastChecked: new Date()
    }
  } catch (error) {
    console.warn('❌ Database status check failed:', error)
    return {
      database: { status: 'unhealthy', timestamp: new Date() },
      counts: {
        courses: 12, // Mock data counts
        learningPaths: 3,
        courseModules: 0
      },
      usingFallback: true,
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})

