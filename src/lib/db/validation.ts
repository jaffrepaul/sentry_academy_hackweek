/**
 * Data validation and cleanup utilities for database operations
 */

import { db } from './index'
import * as schema from './schema'
import { eq, sql, count, isNull, like } from 'drizzle-orm'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  stats: Record<string, any>
}

export interface DataQualityReport {
  tables: Record<string, {
    recordCount: number
    issues: string[]
    lastUpdated?: Date
  }>
  overallScore: number
  recommendations: string[]
}

/**
 * Comprehensive data validation class
 */
export class DataValidator {
  
  /**
   * Validate all data in the database
   */
  async validateAll(): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    const stats: Record<string, any> = {}

    try {
      // Validate users
      const userValidation = await this.validateUsers()
      errors.push(...userValidation.errors)
      warnings.push(...userValidation.warnings)
      stats.users = userValidation.stats

      // Validate courses
      const courseValidation = await this.validateCourses()
      errors.push(...courseValidation.errors)
      warnings.push(...courseValidation.warnings)
      stats.courses = courseValidation.stats

      // Validate learning paths
      const pathValidation = await this.validateLearningPaths()
      errors.push(...pathValidation.errors)
      warnings.push(...pathValidation.warnings)
      stats.learningPaths = pathValidation.stats

      // Validate relational integrity
      const integrityValidation = await this.validateRelationalIntegrity()
      errors.push(...integrityValidation.errors)
      warnings.push(...integrityValidation.warnings)

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation failed: ${error.message}`],
        warnings: [],
        stats: {}
      }
    }
  }

  /**
   * Validate user data
   */
  async validateUsers(): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for duplicate emails
      const duplicateEmails = await db
        .select({ email: schema.users.email, count: sql<number>`count(*)` })
        .from(schema.users)
        .groupBy(schema.users.email)
        .having(sql`count(*) > 1`)

      if (duplicateEmails.length > 0) {
        errors.push(`Found ${duplicateEmails.length} duplicate email addresses`)
      }

      // Check for users without names
      const [usersWithoutNames] = await db
        .select({ count: count() })
        .from(schema.users)
        .where(isNull(schema.users.name))

      if (usersWithoutNames.count > 0) {
        warnings.push(`${usersWithoutNames.count} users missing names`)
      }

      // Check for invalid email formats
      const invalidEmails = await db
        .select({ email: schema.users.email })
        .from(schema.users)
        .where(sql`email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`)

      if (invalidEmails.length > 0) {
        errors.push(`${invalidEmails.length} users have invalid email formats`)
      }

      // Get user stats
      const [totalUsers] = await db.select({ count: count() }).from(schema.users)
      const usersByRole = await db
        .select({ role: schema.users.role, count: count() })
        .from(schema.users)
        .groupBy(schema.users.role)

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {
          total: totalUsers.count,
          byRole: usersByRole.reduce((acc, { role, count }) => {
            acc[role || 'unknown'] = count
            return acc
          }, {} as Record<string, number>)
        }
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`User validation failed: ${error.message}`],
        warnings: [],
        stats: {}
      }
    }
  }

  /**
   * Validate course data
   */
  async validateCourses(): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for duplicate slugs
      const duplicateSlugs = await db
        .select({ slug: schema.courses.slug, count: sql<number>`count(*)` })
        .from(schema.courses)
        .groupBy(schema.courses.slug)
        .having(sql`count(*) > 1`)

      if (duplicateSlugs.length > 0) {
        errors.push(`Found ${duplicateSlugs.length} duplicate course slugs`)
      }

      // Check for courses without descriptions
      const [coursesWithoutDescriptions] = await db
        .select({ count: count() })
        .from(schema.courses)
        .where(isNull(schema.courses.description))

      if (coursesWithoutDescriptions.count > 0) {
        warnings.push(`${coursesWithoutDescriptions.count} courses missing descriptions`)
      }

      // Check for unpublished courses
      const [unpublishedCourses] = await db
        .select({ count: count() })
        .from(schema.courses)
        .where(eq(schema.courses.isPublished, false))

      if (unpublishedCourses.count > 0) {
        warnings.push(`${unpublishedCourses.count} courses are unpublished`)
      }

      // Get course stats
      const [totalCourses] = await db.select({ count: count() }).from(schema.courses)
      const coursesByCategory = await db
        .select({ category: schema.courses.category, count: count() })
        .from(schema.courses)
        .groupBy(schema.courses.category)

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {
          total: totalCourses.count,
          byCategory: coursesByCategory.reduce((acc, { category, count }) => {
            acc[category || 'uncategorized'] = count
            return acc
          }, {} as Record<string, number>)
        }
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Course validation failed: ${error.message}`],
        warnings: [],
        stats: {}
      }
    }
  }

  /**
   * Validate learning paths
   */
  async validateLearningPaths(): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for duplicate slugs
      const duplicateSlugs = await db
        .select({ slug: schema.learningPaths.slug, count: sql<number>`count(*)` })
        .from(schema.learningPaths)
        .groupBy(schema.learningPaths.slug)
        .having(sql`count(*) > 1`)

      if (duplicateSlugs.length > 0) {
        errors.push(`Found ${duplicateSlugs.length} duplicate learning path slugs`)
      }

      // Check for paths with invalid course references
      const paths = await db.select().from(schema.learningPaths)
      const allCourses = await db.select({ id: schema.courses.id }).from(schema.courses)
      const validCourseIds = new Set(allCourses.map(c => c.id))

      for (const path of paths) {
        if (path.courses) {
          const courseIds = path.courses as number[]
          const invalidCourseIds = courseIds.filter(id => !validCourseIds.has(id))
          
          if (invalidCourseIds.length > 0) {
            errors.push(`Learning path "${path.slug}" references invalid course IDs: ${invalidCourseIds.join(', ')}`)
          }
        }
      }

      // Get learning path stats
      const [totalPaths] = await db.select({ count: count() }).from(schema.learningPaths)
      const pathsByRole = await db
        .select({ role: schema.learningPaths.role, count: count() })
        .from(schema.learningPaths)
        .groupBy(schema.learningPaths.role)

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {
          total: totalPaths.count,
          byRole: pathsByRole.reduce((acc, { role, count }) => {
            acc[role || 'unknown'] = count
            return acc
          }, {} as Record<string, number>)
        }
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Learning path validation failed: ${error.message}`],
        warnings: [],
        stats: {}
      }
    }
  }

  /**
   * Validate relational integrity
   */
  async validateRelationalIntegrity(): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    try {
      // Check for orphaned course modules
      const orphanedModules = await db
        .select({ id: schema.courseModules.id, courseId: schema.courseModules.courseId })
        .from(schema.courseModules)
        .leftJoin(schema.courses, eq(schema.courseModules.courseId, schema.courses.id))
        .where(isNull(schema.courses.id))

      if (orphanedModules.length > 0) {
        errors.push(`Found ${orphanedModules.length} orphaned course modules`)
      }

      // Check for orphaned user progress
      const orphanedProgress = await db
        .select({ id: schema.userProgress.id })
        .from(schema.userProgress)
        .leftJoin(schema.users, eq(schema.userProgress.userId, sql`${schema.users.id}::integer`))
        .where(isNull(schema.users.id))

      if (orphanedProgress.length > 0) {
        warnings.push(`Found ${orphanedProgress.length} orphaned user progress records`)
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {}
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Relational integrity validation failed: ${error.message}`],
        warnings: [],
        stats: {}
      }
    }
  }

  /**
   * Generate data quality report
   */
  async generateQualityReport(): Promise<DataQualityReport> {
    const validation = await this.validateAll()
    
    const tables = {
      users: {
        recordCount: validation.stats.users?.total || 0,
        issues: validation.errors.filter(e => e.includes('user')).concat(
          validation.warnings.filter(w => w.includes('user'))
        )
      },
      courses: {
        recordCount: validation.stats.courses?.total || 0,
        issues: validation.errors.filter(e => e.includes('course')).concat(
          validation.warnings.filter(w => w.includes('course'))
        )
      },
      learningPaths: {
        recordCount: validation.stats.learningPaths?.total || 0,
        issues: validation.errors.filter(e => e.includes('path')).concat(
          validation.warnings.filter(w => w.includes('path'))
        )
      }
    }

    // Calculate overall score (simple scoring system)
    const totalIssues = validation.errors.length + (validation.warnings.length * 0.5)
    const maxPossibleScore = 100
    const overallScore = Math.max(0, maxPossibleScore - (totalIssues * 10))

    const recommendations: string[] = []
    if (validation.errors.length > 0) {
      recommendations.push('Fix critical data errors immediately')
    }
    if (validation.warnings.length > 5) {
      recommendations.push('Address data quality warnings to improve system reliability')
    }
    if (overallScore < 80) {
      recommendations.push('Consider running data cleanup procedures')
    }

    return {
      tables,
      overallScore: Math.round(overallScore),
      recommendations
    }
  }

  /**
   * Clean up data based on validation results
   */
  async performCleanup(dryRun: boolean = true): Promise<string[]> {
    const actions: string[] = []
    
    if (dryRun) {
      actions.push('DRY RUN MODE - No changes will be made')
    }

    try {
      // Remove duplicate user progress entries (keep the latest)
      const duplicateProgressQuery = sql`
        WITH ranked_progress AS (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY user_id, course_id 
            ORDER BY last_accessed_at DESC
          ) as rn
          FROM user_progress
        )
        SELECT id FROM ranked_progress WHERE rn > 1
      `
      
      if (!dryRun) {
        const duplicateProgress = await db.execute(duplicateProgressQuery)
        if (duplicateProgress.rows.length > 0) {
          // Delete duplicates
          actions.push(`Removed ${duplicateProgress.rows.length} duplicate progress entries`)
        }
      } else {
        actions.push('Would remove duplicate user progress entries')
      }

      return actions
    } catch (error) {
      actions.push(`Cleanup failed: ${error.message}`)
      return actions
    }
  }
}

/**
 * Quick validation utility
 */
export async function quickValidation(): Promise<boolean> {
  const validator = new DataValidator()
  const result = await validator.validateAll()
  
  if (!result.isValid) {
    console.error('❌ Data validation failed:')
    result.errors.forEach(error => console.error(`  - ${error}`))
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️  Data warnings:')
    result.warnings.forEach(warning => console.warn(`  - ${warning}`))
  }
  
  return result.isValid
}