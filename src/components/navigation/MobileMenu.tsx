'use client'

import React, { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import NavigationLinks from './NavigationLinks'
import ThemeToggle from '../ui/ThemeToggle'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = memo(({ isOpen, onClose }) => {
  const router = useRouter()

  const handleAdminClick = useCallback(() => {
    onClose()
    router.push('/admin')
  }, [router, onClose])

  if (!isOpen) return null

  return (
    <div className="md:hidden py-4 border-t backdrop-blur-xl border-purple-300/30 bg-white/95 dark:border-purple-500/30 dark:bg-slate-950/95">
      <div className="flex flex-col space-y-3">
        <NavigationLinks isMobile onLinkClick={onClose} />
        
        <div className="flex items-center space-x-3 pt-3 border-t border-purple-500/20">
          <button
            onClick={handleAdminClick}
            className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-purple-600 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 dark:text-purple-400"
            aria-label="Access admin dashboard"
          >
            <Settings className="w-5 h-5" />
            <span>Admin</span>
          </button>
          
          <div className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 bg-gray-100/50 dark:bg-slate-800/30">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
})

MobileMenu.displayName = 'MobileMenu'
export default MobileMenu