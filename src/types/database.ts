// Re-export database types for easy importing
import type {
  User,
  Course,
  LearningPath,
  UserProgress,
  AIGeneratedContent,
  CourseModule
} from '@/lib/db/schema'

export type {
  User,
  Course,
  LearningPath,
  UserProgress,
  AIGeneratedContent,
  CourseModule
}

// Additional types for API responses
export interface CourseWithModules extends Course {
  modules: CourseModule[]
}

export interface LearningPathWithCourses extends LearningPath {
  courseDetails: Course[]
}

export interface UserWithProgress extends User {
  progress: UserProgress[]
}
