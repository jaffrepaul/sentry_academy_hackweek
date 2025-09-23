'use client'

import React, { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import NavigationLinks from './NavigationLinks'
import ThemeToggle from '@/components/ui/ThemeToggle'
import SignInButton from '@/components/auth/SignInButton'

const DesktopNavigation: React.FC = memo(() => {
  const router = useRouter()

  const handleAdminClick = useCallback(() => {
    router.push('/admin')
  }, [router])

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <NavigationLinks />
      
      <button
        onClick={handleAdminClick}
        className="p-2 rounded-lg transition-smooth transform hover:scale-110 bg-gray-100 hover:bg-gray-200 text-purple-600 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 dark:text-purple-400"
        aria-label="Access admin dashboard"
        title="Admin Dashboard"
      >
        <Settings className="w-5 h-5" />
      </button>
      
      <ThemeToggle />
      
      <SignInButton />
    </nav>
  )
})

DesktopNavigation.displayName = 'DesktopNavigation'
export default DesktopNavigation