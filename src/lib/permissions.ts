import { getAuthSession } from './auth'

// Define user roles
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor', 
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

// Define permissions
export enum Permission {
  // Course permissions
  VIEW_COURSES = 'view_courses',
  CREATE_COURSE = 'create_course',
  EDIT_COURSE = 'edit_course',
  DELETE_COURSE = 'delete_course',
  PUBLISH_COURSE = 'publish_course',
  
  // User permissions
  VIEW_USERS = 'view_users',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  
  // Admin permissions
  ACCESS_ADMIN = 'access_admin',
  MANAGE_SETTINGS = 'manage_settings',
  
  // AI content permissions
  GENERATE_CONTENT = 'generate_content',
  REVIEW_CONTENT = 'review_content',
  
  // Analytics permissions
  VIEW_ANALYTICS = 'view_analytics',
}

// Role-permission mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    Permission.VIEW_COURSES,
  ],
  
  [UserRole.INSTRUCTOR]: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.GENERATE_CONTENT,
    Permission.VIEW_ANALYTICS,
  ],
  
  [UserRole.ADMIN]: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSE,
    Permission.EDIT_COURSE,
    Permission.DELETE_COURSE,
    Permission.PUBLISH_COURSE,
    Permission.VIEW_USERS,
    Permission.EDIT_USER,
    Permission.ACCESS_ADMIN,
    Permission.GENERATE_CONTENT,
    Permission.REVIEW_CONTENT,
    Permission.VIEW_ANALYTICS,
  ],
  
  [UserRole.SUPER_ADMIN]: [
    ...Object.values(Permission), // All permissions
  ],
}

// Helper functions
export function hasPermission(userRole: string | undefined, permission: Permission): boolean {
  if (!userRole || !(userRole in rolePermissions)) {
    return false
  }
  
  const role = userRole as UserRole
  return rolePermissions[role].includes(permission)
}

export function hasAnyPermission(userRole: string | undefined, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: string | undefined, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

// Server-side permission checking
export async function checkPermission(permission: Permission): Promise<boolean> {
  const session = await getAuthSession()
  return hasPermission(session?.user?.role, permission)
}

export async function requirePermission(permission: Permission): Promise<void> {
  const hasAccess = await checkPermission(permission)
  if (!hasAccess) {
    throw new Error(`Access denied. Required permission: ${permission}`)
  }
}

// Client-side permission hooks (for use in components)
export function usePermissions() {
  // This would be used in a custom hook with useSession
  // For now, returning basic structure
  return {
    hasPermission: (permission: Permission) => false, // Placeholder
    hasAnyPermission: (permissions: Permission[]) => false, // Placeholder
    hasAllPermissions: (permissions: Permission[]) => false, // Placeholder
  }
}

// Permission checking for React components
interface PermissionGuardProps {
  permission: Permission
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  // This would use useSession to check permissions
  // For now, return children (placeholder implementation)
  return <>{children}</>
}

// Admin route guard
interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  return (
    <PermissionGuard permission={Permission.ACCESS_ADMIN} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export default {
  UserRole,
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  checkPermission,
  requirePermission,
  PermissionGuard,
  AdminGuard,
}