'use client'

import { useSession } from 'next-auth/react'
import { hasPermission, hasAnyPermission, hasAllPermissions, Permission } from '@/lib/permissions'

interface ExtendedSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

/**
 * Client-side hook for checking user permissions
 */
export function usePermissions() {
  const { data: session } = useSession()
  const extendedSession = session as unknown as ExtendedSession
  const userRole = extendedSession?.user?.role

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
