'use client'

import React, { memo, useMemo } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const ThemeToggle: React.FC = memo(() => {
  const { isDark, toggleTheme } = useTheme()

  const buttonClasses = useMemo(() => 
    `p-2 rounded-lg transition-smooth transform hover:scale-110 ${
      isDark
        ? 'bg-slate-800/50 hover:bg-slate-700/50 text-yellow-400'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
    }`, [isDark]
  )

  return (
    <button
      onClick={toggleTheme}
      className={buttonClasses}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'
export default ThemeToggle