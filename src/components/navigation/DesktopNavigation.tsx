'use client'

import React, { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import NavigationLinks from './NavigationLinks'
import ThemeToggle from '@/components/ui/ThemeToggle'

const DesktopNavigation: React.FC = memo(() => {
  const router = useRouter()

  const handleAdminClick = useCallback(() => {
    router.push('/admin')
  }, [router])

  return (
    <nav className="hidden items-center space-x-8 md:flex">
      <NavigationLinks />

      <button
        onClick={handleAdminClick}
        className="transition-smooth transform rounded-lg bg-gray-100 p-2 text-purple-600 hover:scale-110 hover:bg-gray-200 dark:bg-slate-800/50 dark:text-purple-400 dark:hover:bg-slate-700/50"
        aria-label="Access admin dashboard"
        title="Admin Dashboard"
      >
        <Settings className="h-5 w-5" />
      </button>

      <ThemeToggle />

      <button
        onClick={() => {
          // Scroll to learning paths section to get started
          if (window.location.pathname !== '/') {
            router.push('/')
            setTimeout(() => {
              const element = document.getElementById('paths')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }, 200)
          } else {
            const element = document.getElementById('paths')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }
        }}
        className="transform rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 px-4 py-2 font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-violet-700 hover:shadow-purple-500/40"
      >
        Get Started
      </button>
    </nav>
  )
})

DesktopNavigation.displayName = 'DesktopNavigation'
export default DesktopNavigation
