'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Admin loading fallback
function AdminLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
      </div>
    </div>
  )
}

// Dynamic import for AdminDashboard to reduce initial bundle size
const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard').then(mod => ({ default: mod.AdminDashboard })),
  {
    loading: () => <AdminLoadingFallback />,
    ssr: false, // Admin dashboard doesn't need SSR
  }
)

// Note: Metadata is handled by the parent layout since this is a Client Component

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminDashboard />
    </Suspense>
  )
}

// No caching for admin pages - handled by parent layout
