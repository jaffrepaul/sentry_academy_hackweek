import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

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

// Dynamic import for AdminDashboard to reduce initial bundle size
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard').then(mod => ({ default: mod.AdminDashboard })), {
  loading: () => <AdminLoadingFallback />,
  ssr: false // Admin dashboard doesn't need SSR
})

// Static metadata
export const metadata = {
  title: 'Admin Dashboard | Sentry Academy',
  description: 'Administrative dashboard for managing Sentry Academy content and users.',
  robots: 'noindex,nofollow', // Don't index admin pages
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