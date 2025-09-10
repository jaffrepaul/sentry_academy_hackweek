'use client'

import React, { memo, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { getNavLinkClasses, scrollToSection } from '@/utils/styles'

interface NavigationLinksProps {
  isMobile?: boolean
  onLinkClick?: () => void
}

const NavigationLinks: React.FC<NavigationLinksProps> = memo(({ 
  isMobile = false, 
  onLinkClick 
}) => {
  const { isDark } = useTheme()
  const router = useRouter()

  const navLinkClasses = useMemo(() => 
    `${getNavLinkClasses(isDark)} ${isMobile ? 'text-left' : ''}`, 
    [isDark, isMobile]
  )

  const handleScrollToSection = useCallback((sectionId: string) => {
    onLinkClick?.()
    
    // If we're not on the homepage, navigate there first
    if (window.location.pathname !== '/') {
      router.push(`/#${sectionId}`)
    } else {
      // We're already on the homepage, just scroll
      scrollToSection(sectionId)
    }
  }, [router, onLinkClick])

  const handleConceptsClick = useCallback(() => {
    onLinkClick?.()
    router.push('/concepts')
  }, [router, onLinkClick])

  const links = [
    {
      label: 'Courses',
      onClick: () => handleScrollToSection('courses'),
      'aria-label': 'Go to courses section'
    },
    {
      label: 'Learning Paths',
      onClick: () => handleScrollToSection('paths'),
      'aria-label': 'Go to learning paths section'
    },
    {
      label: 'Concepts 101',
      onClick: handleConceptsClick,
      'aria-label': 'Go to Concepts 101 page'
    }
  ]

  return (
    <>
      {links.map((link) => (
        <button 
          key={link.label}
          onClick={link.onClick} 
          className={navLinkClasses}
          aria-label={link['aria-label']}
        >
          {link.label}
        </button>
      ))}
      <a 
        href="https://sentry-build.sentry.dev/" 
        target="_blank" 
        rel="noopener noreferrer"
        className={navLinkClasses}
        onClick={onLinkClick}
      >
        Workshops
      </a>
    </>
  )
})

NavigationLinks.displayName = 'NavigationLinks'
export default NavigationLinks