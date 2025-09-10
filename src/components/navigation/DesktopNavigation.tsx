'use client'

import React, { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import NavigationLinks from './NavigationLinks'
import ThemeToggle from '../ui/ThemeToggle'

const DesktopNavigation: React.FC = memo(() => {
  const { isDark } = useTheme()
  const router = useRouter()

  const handleAdminClick = useCallback(() => {
    router.push('/admin')
  }, [router])

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <NavigationLinks />
      
      <button
        onClick={handleAdminClick}
        className={`p-2 rounded-lg transition-smooth transform hover:scale-110 ${
          isDark
            ? 'bg-slate-800/50 hover:bg-slate-700/50 text-purple-400'
            : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
        }`}
        aria-label="Access admin dashboard"
        title="Admin Dashboard"
      >
        <Settings className="w-5 h-5" />
      </button>
      
      <ThemeToggle />
      
      <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-violet-700 transition-smooth transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
        Get Started
      </button>
    </nav>
  )
})

DesktopNavigation.displayName = 'DesktopNavigation'
export default DesktopNavigation