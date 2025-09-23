'use client'

import React, { memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import NavigationLinks from './NavigationLinks'
import ThemeToggle from '@/components/ui/ThemeToggle'

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
    <div className="border-t border-purple-300/30 bg-white/95 py-4 backdrop-blur-xl dark:border-purple-500/30 dark:bg-slate-950/95 md:hidden">
      <div className="flex flex-col space-y-3">
        <NavigationLinks isMobile onLinkClick={onClose} />

        <div className="flex items-center space-x-3 border-t border-purple-500/20 pt-3">
          <button
            onClick={handleAdminClick}
            className="flex items-center space-x-2 rounded-lg bg-gray-100 p-2 text-purple-600 transition-all duration-200 hover:bg-gray-200 dark:bg-slate-800/50 dark:text-purple-400 dark:hover:bg-slate-700/50"
            aria-label="Access admin dashboard"
          >
            <Settings className="h-5 w-5" />
            <span>Admin</span>
          </button>

          <div className="flex items-center space-x-2 rounded-lg bg-gray-100/50 p-2 transition-all duration-200 dark:bg-slate-800/30">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
})

MobileMenu.displayName = 'MobileMenu'
export default MobileMenu
