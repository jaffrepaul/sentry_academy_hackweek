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
        className="transition-smooth transform rounded-lg bg-gray-100 p-2 text-gray-800 hover:scale-110 hover:bg-gray-200 dark:bg-slate-800/50 dark:text-yellow-400 dark:hover:bg-slate-700/50"
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-5 w-5 animate-pulse rounded bg-gray-400" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="transition-smooth transform rounded-lg bg-gray-100 p-2 text-gray-800 hover:scale-110 hover:bg-gray-200 dark:bg-slate-800/50 dark:text-yellow-400 dark:hover:bg-slate-700/50"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'
export default ThemeToggle
