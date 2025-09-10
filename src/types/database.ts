// Re-export database types for easy importing
export type {
  User,
  Course,
  LearningPath,
  UserProgress,
  AIGeneratedContent,
  CourseModule
} from '@/lib/db/schema'

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
