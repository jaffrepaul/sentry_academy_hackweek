import { Suspense } from 'react'
import { AdminDashboard } from '@/components/AdminDashboard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Static metadata
export const metadata = {
  title: 'Admin Dashboard | Sentry Academy',
  description: 'Administrative dashboard for managing Sentry Academy content and users.',
  robots: 'noindex,nofollow', // Don't index admin pages
}

// Admin loading fallback
function AdminLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Loading admin dashboard...
        </p>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminDashboard />
    </Suspense>
  )
}

// No caching for admin pages
export const revalidate = 0