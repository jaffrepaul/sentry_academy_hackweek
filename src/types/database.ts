// Re-export database types for easier imports
export type {
  User,
  NewUser,
  Account,
  Session,
  VerificationToken,
  Course,
  LearningPath,
  UserProgress,
  AIGeneratedContent,
  CourseModule,
} from '@/lib/db/schema'

// Import the types for use in this file
import type {
  User,
  Course,
  LearningPath,
  UserProgress,
  AIGeneratedContent,
  CourseModule,
} from '@/lib/db/schema'

// Additional derived types
export interface CourseWithProgress extends Course {
  progress?: UserProgress
  userProgress?: number // 0-100 percentage
}

export interface CourseWithModules extends Course {
  modules: CourseModule[]
}

export interface DetailedCourse extends CourseWithProgress {
  modules: CourseModule[]
  moduleCount: number
  estimatedDuration: string
}

export interface UserWithProgress extends User {
  progress: UserProgress[]
  completedCourses: number
  inProgressCourses: number
}

// Learning path with populated course data
export interface LearningPathWithCourses extends LearningPath {
  courseData: Course[]
}

// AI content with typed content field based on type
export interface AIGeneratedCourse extends Omit<AIGeneratedContent, 'content'> {
  type: 'course'
  content: {
    title: string
    description: string
    difficulty: string
    duration: string
    category: string
    modules: Array<{
      title: string
      content: string
      duration: string
      order: number
    }>
  }
}

export interface AIGeneratedModule extends Omit<AIGeneratedContent, 'content'> {
  type: 'module'
  content: {
    title: string
    content: string
    duration: string
    order: number
    courseId?: number
  }
}

// Union type for all AI content types
export type TypedAIContent = AIGeneratedCourse | AIGeneratedModule

// Database query result types
export interface CourseQueryResult {
  courses: Course[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ProgressStats {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalProgress: number // Average progress across all courses
  streak: number
  minutesSpent: number
}
