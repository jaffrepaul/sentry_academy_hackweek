/**
 * Basic data validation utilities for database operations
 */

import { db } from './index'
import * as schema from './schema'
import { sql, count } from 'drizzle-orm'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  tableCounts: Record<string, number>
}

/**
 * Simple validation functions
 */

/**
 * Quick validation to check if database has basic data
 */
export async function quickValidation(): Promise<ValidationResult> {
  const errors: string[] = []
  const tableCounts: Record<string, number> = {}

  try {
    // Count records in main tables
    const [usersResult] = await db.select({ count: count() }).from(schema.users)
    const [coursesResult] = await db.select({ count: count() }).from(schema.courses)
    const [learningPathsResult] = await db.select({ count: count() }).from(schema.learning_paths)

    tableCounts.users = usersResult?.count || 0
    tableCounts.courses = coursesResult?.count || 0
    tableCounts.learning_paths = learningPathsResult?.count || 0

    // Basic validation checks
    if (tableCounts.courses === 0) {
      errors.push('No courses found in database')
    }

    if (tableCounts.learning_paths === 0) {
      errors.push('No learning paths found in database')
    }

    return {
      isValid: errors.length === 0,
      errors,
      tableCounts,
    }
  } catch (error) {
    return {
      isValid: false,
      errors: [
        `Database validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      tableCounts,
    }
  }
}

/**
 * Check database connectivity and basic structure
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean
  hasData: boolean
  error?: string
}> {
  try {
    // Simple connectivity test
    await db.execute(sql`SELECT 1`)

    // Check if we have basic data
    const validation = await quickValidation()

    const result: { connected: boolean; hasData: boolean; error?: string } = {
      connected: true,
      hasData: validation.isValid && (validation.tableCounts.courses ?? 0) > 0,
    }

    if (validation.errors.length > 0) {
      result.error = validation.errors[0] ?? 'Unknown validation error'
    }

    return result
  } catch (error) {
    return {
      connected: false,
      hasData: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
    }
  }
}
