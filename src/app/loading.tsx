/**
 * Loading component for the home page
 * 
 * This shows while the server component is rendering,
 * providing better user experience during navigation.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center">
        <div className="relative">
          {/* Spinning logo */}
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading Sentry Academy
          </h2>
          <p className="text-gray-400">
            Preparing your learning experience...
          </p>
          
          {/* Loading dots animation */}
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}