'use client'

import { ReactNode } from 'react'
import { Permission } from '@/lib/permissions'
import { usePermissions } from '@/hooks/usePermissions'

interface PermissionGuardProps {
  permission: Permission
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { hasPermission } = usePermissions()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminGuard({ children, fallback }: AdminGuardProps) {
  return (
    <PermissionGuard permission={Permission.ACCESS_ADMIN} fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

interface RoleGuardProps {
  allowedRoles: string[]
  fallback?: ReactNode
  children: ReactNode
}

export function RoleGuard({ allowedRoles, fallback = null, children }: RoleGuardProps) {
  const { userRole, isAuthenticated } = usePermissions()

  if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
