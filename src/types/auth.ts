import { User } from '@/lib/db/schema'

export interface AuthUser extends User {
  permissions?: string[]
}

export interface Session {
  user: AuthUser
  expires: string
}

export type UserRole = 'student' | 'instructor' | 'admin' | 'content_creator'

export interface RolePermissions {
  [key: string]: string[]
}

export const rolePermissions: RolePermissions = {
  student: ['read:courses', 'update:own_progress'],
  instructor: ['read:courses', 'create:courses', 'update:own_courses', 'read:student_progress'],
  admin: ['*'], // All permissions
  content_creator: ['read:courses', 'create:courses', 'generate:ai_content']
}
