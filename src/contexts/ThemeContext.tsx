'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  isInitialized: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

/**
 * Optimized Theme Provider with better performance:
 * - Memoized callbacks and values
 * - System preference detection
 * - Reduced re-renders
 * - Better initialization handling
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true) // Default to dark
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      
      if (savedTheme) {
        setIsDark(savedTheme === 'dark')
      } else {
        // Check system preference if no saved theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDark(prefersDark)
      }
      
      setIsInitialized(true)
    }

    initializeTheme()
  }, [])

  // Apply theme to document with better performance
  useEffect(() => {
    if (!isInitialized) return
    
    const body = document.body
    const html = document.documentElement
    
    // Batch DOM updates to avoid layout thrashing
    requestAnimationFrame(() => {
      if (isDark) {
        body.classList.add('dark')
        body.classList.remove('light')
        html.classList.add('dark')
        html.classList.remove('light')
      } else {
        body.classList.add('light')
        body.classList.remove('dark')
        html.classList.add('light')
        html.classList.remove('dark')
      }
    })
  }, [isDark, isInitialized])

  // Memoized toggle function to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }, [])

  // Memoized context value to prevent unnecessary provider re-renders
  const contextValue = useMemo(() => ({
    isDark,
    toggleTheme,
    isInitialized
  }), [isDark, toggleTheme, isInitialized])

  // Show minimal loading state while initializing to prevent flicker
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
