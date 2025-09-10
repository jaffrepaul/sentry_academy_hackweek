'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { Menu, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Logo from './ui/Logo'
import DesktopNavigation from './navigation/DesktopNavigation'
import MobileMenu from './navigation/MobileMenu'

/**
 * Main Header Component
 * 
 * Optimized header with separated concerns:
 * - Logo handling
 * - Desktop navigation
 * - Mobile menu
 * - Theme management
 */
const Header: React.FC = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { isDark } = useTheme()

  // Memoize header styles to prevent recalculation
  const headerClasses = useMemo(() => 
    `w-full border-b backdrop-blur-xl ${
      isDark 
        ? 'border-purple-500/30 bg-slate-950/90' 
        : 'border-purple-300/30 bg-white/90'
    }`, [isDark]
  )

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <header 
      className={headerClasses} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Logo />
          
          <DesktopNavigation />

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden transition-colors ${
              isDark ? 'text-white hover:text-purple-300' : 'text-gray-900 hover:text-purple-600'
            }`}
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
      </div>
    </header>
  )
})

Header.displayName = 'Header'
export default Header
