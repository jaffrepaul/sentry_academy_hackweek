'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { LogIn, LogOut, User } from 'lucide-react'
import Image from 'next/image'

export default function SignInButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-slate-700" />
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
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-slate-700">
              <User className="h-4 w-4" />
            </div>
          )}
          <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:inline">
            {session.user?.name || session.user?.email}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut()}
          className="inline-flex items-center space-x-2 rounded-lg border border-gray-300/50 bg-gray-100/80 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-200/90 dark:border-slate-600/50 dark:bg-slate-700/60 dark:text-gray-300 dark:hover:bg-slate-600/80"
        >
          <LogOut className="h-4 w-4" />
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
        className="inline-flex transform items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 px-4 py-2 font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-violet-700 hover:shadow-purple-500/40"
      >
        <LogIn className="h-4 w-4" />
        <span>Sign In</span>
      </button>
    </div>
  )
}
