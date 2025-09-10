'use client'

import React, { memo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

const Logo: React.FC = memo(() => {
  const { isDark } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname !== '/') {
      router.push('/')
    } else {
      // If we're already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname, router])

  return (
    <button 
      onClick={handleLogoClick} 
      className="flex items-center space-x-3 transition-opacity hover:opacity-80"
      aria-label="Go to homepage"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        <img 
          src="/logos/sentry-logo.svg" 
          alt="Sentry Logo" 
          className={`w-12 h-12 ${isDark ? 'filter invert brightness-0' : ''}`}
          style={{ filter: isDark ? 'invert(1) brightness(2)' : 'none' }}
        />
      </div>
      <div className="text-left">
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Sentry Academy
        </h1>
        <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
          Master Application Observability
        </p>
      </div>
    </button>
  )
})

Logo.displayName = 'Logo'
export default Logo