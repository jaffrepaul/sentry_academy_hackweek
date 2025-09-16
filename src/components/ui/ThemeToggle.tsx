'use client'

import React, { memo, useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

const ThemeToggle: React.FC = memo(() => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  // Show a neutral placeholder during SSR and before mounting
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg transition-smooth transform hover:scale-110 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 dark:text-yellow-400"
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-5 h-5 animate-pulse bg-gray-400 rounded" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-smooth transform hover:scale-110 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 dark:text-yellow-400"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'
export default ThemeToggle