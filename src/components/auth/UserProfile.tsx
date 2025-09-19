'use client'

import { useSession } from 'next-auth/react'
import { User, Star, BookOpen, Award } from 'lucide-react'
import Image from 'next/image'

export default function UserProfile() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <div className="rounded-2xl p-6 backdrop-blur-sm border bg-white/75 border-purple-400/40 dark:bg-slate-900/40 dark:border-purple-500/30">
      <div className="flex items-center space-x-4 mb-6">
        {/* Profile Image */}
        <div className="relative">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-violet-600">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            session.user?.role === 'admin' 
              ? 'bg-gradient-to-r from-red-500 to-pink-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}>
            {session.user?.role === 'admin' ? 'A' : 'U'}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {session.user?.name || 'User'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {session.user?.email}
          </p>
          <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full mt-1 ${
            session.user?.role === 'admin'
              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            <span>{session.user?.role === 'admin' ? 'Admin' : 'Student'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Courses</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Achievements</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Star className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">Course Progress</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">75%</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-300"
            style={{ width: '75%' }}
          />
        </div>
      </div>
    </div>
  )
}