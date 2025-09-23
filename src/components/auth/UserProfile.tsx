'use client'

import { useSession } from 'next-auth/react'
import { User, Star, BookOpen, Award } from 'lucide-react'
import Image from 'next/image'

interface ExtendedSession {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export default function UserProfile() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  // Type cast to include the role property
  const extendedSession = session as unknown as ExtendedSession

  return (
    <div className="rounded-2xl border border-purple-400/40 bg-white/75 p-6 backdrop-blur-sm dark:border-purple-500/30 dark:bg-slate-900/40">
      <div className="mb-6 flex items-center space-x-4">
        {/* Profile Image */}
        <div className="relative">
          {extendedSession.user?.image ? (
            <Image
              src={extendedSession.user.image}
              alt={extendedSession.user.name || 'User'}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-600">
              <User className="h-8 w-8 text-white" />
            </div>
          )}
          <div
            className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
              extendedSession.user?.role === 'admin'
                ? 'bg-gradient-to-r from-red-500 to-pink-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
          >
            {extendedSession.user?.role === 'admin' ? 'A' : 'U'}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {extendedSession.user?.name || 'User'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{extendedSession.user?.email}</p>
          <div
            className={`mt-1 inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs ${
              extendedSession.user?.role === 'admin'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            }`}
          >
            <span>{extendedSession.user?.role === 'admin' ? 'Admin' : 'Student'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Courses</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <Award className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Achievements</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
            <Star className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Course Progress</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">75%</p>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-300"
            style={{ width: '75%' }}
          />
        </div>
      </div>
    </div>
  )
}
