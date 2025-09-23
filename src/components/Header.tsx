'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { Menu, X } from 'lucide-react'
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
 * - Theme management (now handled by Tailwind dark: classes)
 */
const Header: React.FC = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  // Header styles using Tailwind dark mode
  const headerClasses = useMemo(
    () =>
      'w-full border-b backdrop-blur-xl border-gray-200/20 bg-white/90 dark:border-gray-700/20 dark:bg-slate-950/90',
    []
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
        zIndex: 9999,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Logo />

          <DesktopNavigation />

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  )
})

Header.displayName = 'Header'
export default Header
