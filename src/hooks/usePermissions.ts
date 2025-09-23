'use client'

import { useSession } from 'next-auth/react'
import { hasPermission, hasAnyPermission, hasAllPermissions, Permission } from '@/lib/permissions'

/**
 * Client-side hook for checking user permissions
 */
export function usePermissions() {
  const { data: session } = useSession()
  const userRole = session?.user?.role

  return {
    hasPermission: (permission: Permission) => hasPermission(userRole || undefined, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(userRole || undefined, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(userRole || undefined, permissions),
    userRole,
    isAuthenticated: !!session,
  }
}
