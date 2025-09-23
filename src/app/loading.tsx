/**
 * Loading component for the home page
 *
 * This shows while the server component is rendering,
 * providing better user experience during navigation.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="relative">
          {/* Spinning logo */}
          <div className="mx-auto mb-6 h-16 w-16">
            <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-violet-600"></div>
          </div>

          {/* Loading text */}
          <h2 className="mb-2 text-xl font-semibold text-white">Loading Sentry Academy</h2>
          <p className="text-gray-400">Preparing your learning experience...</p>

          {/* Loading dots animation */}
          <div className="mt-4 flex justify-center space-x-1">
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
