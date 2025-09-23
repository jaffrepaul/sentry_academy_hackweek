'use client'

import React, { memo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

const Logo: React.FC = memo(() => {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (pathname !== '/') {
        router.push('/')
      } else {
        // If we're already on homepage, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [pathname, router]
  )

  return (
    <button
      onClick={handleLogoClick}
      className="flex items-center space-x-3 transition-opacity hover:opacity-80"
      aria-label="Go to homepage"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-900 dark:text-white">
        <Image
          src="/logos/sentry-logo.svg"
          alt="Sentry Logo"
          width={48}
          height={48}
          className="h-12 w-12 dark:brightness-200 dark:invert"
          priority
        />
      </div>
      <div className="text-left">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sentry Academy</h1>
        <p className="text-xs text-purple-600 dark:text-purple-400">
          Master Application Observability
        </p>
      </div>
    </button>
  )
})

Logo.displayName = 'Logo'
export default Logo
