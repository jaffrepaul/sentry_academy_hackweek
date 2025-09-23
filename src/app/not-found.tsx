import Link from 'next/link'
import { Search, Home, BookOpen } from 'lucide-react'

/**
 * 404 Not Found page
 *
 * This page is shown when a user navigates to a route that doesn't exist.
 * It provides helpful navigation options to get back to the main content.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="max-w-lg text-center">
        {/* 404 illustration */}
        <div className="mb-8">
          <div className="mb-4 text-8xl font-bold text-purple-500">404</div>
          <div className="mx-auto mb-6 h-20 w-20 text-gray-400">
            <Search className="h-full w-full" />
          </div>
        </div>

        {/* Error message */}
        <h1 className="mb-4 text-3xl font-bold text-white">Page Not Found</h1>

        <p className="mb-8 text-lg text-gray-400">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you
          entered the wrong URL.
        </p>

        {/* Navigation options */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Link>

          <Link
            href="/#courses"
            className="inline-flex items-center rounded-lg bg-slate-700 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-600"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Courses
          </Link>
        </div>

        {/* Additional help */}
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-sm text-gray-500">
            Need help? Try searching for what you're looking for or{' '}
            <Link href="/" className="text-purple-400 underline hover:text-purple-300">
              start from the homepage
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
