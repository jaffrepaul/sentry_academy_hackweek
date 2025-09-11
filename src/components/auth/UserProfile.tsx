'use client'

import { useSession } from 'next-auth/react'
import { User, Star, BookOpen, Award } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'

export default function UserProfile() {
  const { data: session } = useSession()
  const { isDark } = useTheme()

  if (!session) {
    return null
  }

  return (
    <div className={`rounded-2xl p-6 backdrop-blur-sm border ${
      isDark
        ? 'bg-slate-900/40 border-purple-500/30'
        : 'bg-white/75 border-purple-400/40'
    }`}>
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
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-violet-600`}>
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
          <h3 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {session.user?.name || 'User'}
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {session.user?.email}
          </p>
          <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full mt-1 ${
            session.user?.role === 'admin'
              ? isDark
                ? 'bg-red-900/30 text-red-300'
                : 'bg-red-100 text-red-700'
              : isDark
                ? 'bg-emerald-900/30 text-emerald-300'
                : 'bg-emerald-100 text-emerald-700'
          }`}>
            <Star className="w-3 h-3" />
            <span className="capitalize">{session.user?.role || 'Student'}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`text-center p-3 rounded-lg ${
          isDark
            ? 'bg-slate-800/50'
            : 'bg-purple-50/50'
        }`}>
          <BookOpen className={`w-5 h-5 mx-auto mb-1 ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`} />
          <div className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            0
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Courses
          </div>
        </div>

        <div className={`text-center p-3 rounded-lg ${
          isDark
            ? 'bg-slate-800/50'
            : 'bg-purple-50/50'
        }`}>
          <Award className={`w-5 h-5 mx-auto mb-1 ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`} />
          <div className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            0
          </div>
          <div className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Certificates
          </div>
        </div>
      </div>
    </div>
  )
}