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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="text-center max-w-lg">
        {/* 404 illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-purple-500 mb-4">404</div>
          <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
            <Search className="w-full h-full" />
          </div>
        </div>
        
        {/* Error message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-400 mb-8 text-lg">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Link>
          
          <Link
            href="/courses"
            className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Link>
        </div>
        
        {/* Additional help */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-sm text-gray-500">
            Need help? Try searching for what you're looking for or{' '}
            <Link href="/" className="text-purple-400 hover:text-purple-300 underline">
              start from the homepage
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}