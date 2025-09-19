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
        className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
      >
        Get Started
      </button>
    </nav>
  )
})

DesktopNavigation.displayName = 'DesktopNavigation'
export default DesktopNavigation