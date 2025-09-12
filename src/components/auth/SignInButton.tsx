'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { LogIn, LogOut, User } from 'lucide-react'
import Image from 'next/image'

export default function SignInButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="animate-pulse h-9 w-24 rounded-lg bg-gray-200 dark:bg-slate-700" />
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Profile */}
        <div className="flex items-center space-x-2">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-slate-700">
              <User className="w-4 h-4" />
            </div>
          )}
          <span className="text-sm font-medium hidden sm:inline text-gray-700 dark:text-gray-300">
            {session.user?.name || session.user?.email}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 bg-gray-100/80 text-gray-700 hover:bg-gray-200/90 border border-gray-300/50 dark:bg-slate-700/60 dark:text-gray-300 dark:hover:bg-slate-600/80 dark:border-slate-600/50"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Sign In Button */}
      <button
        onClick={() => signIn()}
        className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 inline-flex items-center space-x-2"
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In</span>
      </button>
    </div>
  )
}