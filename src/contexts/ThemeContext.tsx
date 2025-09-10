'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getBackgroundStyle } from '@/utils/styles'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
    setIsInitialized(true)
  }, [])

  // Apply theme to body and wrapper
  useEffect(() => {
    if (!isInitialized) return
    
    const body = document.body
    const wrapper = document.getElementById('theme-wrapper')
    
    // Apply theme classes
    if (isDark) {
      body.classList.add('dark')
      body.classList.remove('light')
    } else {
      body.classList.add('light')
      body.classList.remove('dark')
    }
    
    // Apply background style
    if (wrapper) {
      const backgroundStyle = getBackgroundStyle(isDark)
      Object.assign(wrapper.style, backgroundStyle)
      wrapper.className = `min-h-screen transition-smooth-slow ${
        isDark ? 'text-white' : 'text-gray-900'
      }`
    }
  }, [isDark, isInitialized])

  const toggleTheme = React.useCallback(() => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }, [isDark])

  const contextValue = React.useMemo(() => ({
    isDark,
    toggleTheme
  }), [isDark, toggleTheme])

  // Prevent rendering until theme is initialized to avoid flicker
  if (!isInitialized) {
    return <div className="min-h-screen bg-slate-900" />
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
