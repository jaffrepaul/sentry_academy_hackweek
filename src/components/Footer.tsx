'use client'

import React, { memo, useMemo } from 'react'
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react'
import { getTextClasses } from '@/utils/styles'
import Image from 'next/image'

const Footer: React.FC = memo(() => {
  const titleClasses = useMemo(() => getTextClasses('primary'), [])
  const subtitleClasses = useMemo(() => getTextClasses('secondary'), [])
  const linkClasses = useMemo(
    () =>
      'transition-colors duration-200 text-gray-700 hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-400',
    []
  )

  const footerLinks = {
    product: [
      { name: 'Learning Paths', href: '#paths' },
      { name: 'All Courses', href: '#courses' },
      { name: 'Assessments', href: '#' },
      { name: 'Certificates', href: '#' },
    ],
    resources: [
      { name: 'Sentry Docs', href: 'https://docs.sentry.io', external: true },
      { name: 'Product Docs', href: 'https://docs.sentry.io/product/', external: true },
      { name: 'Sentry Blog', href: 'https://sentry-blog.sentry.dev/', external: true },
      { name: 'Sentry vs Logging', href: 'https://sentry.io/vs/logging/', external: true },
      {
        name: 'YouTube Channel',
        href: 'https://www.youtube.com/@Sentry-monitoring/videos',
        external: true,
      },
      { name: 'Customer Stories', href: 'https://sentry.io/customers/', external: true },
    ],
    company: [
      { name: 'About Academy', href: '#' },
      { name: 'Instructors', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Careers', href: '#' },
    ],
  }

  return (
    <footer className="border-t border-purple-400/40 bg-white/80 backdrop-blur-xl dark:border-purple-500/30 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg text-gray-900 dark:text-white">
                <Image
                  src="/logos/sentry-logo.svg"
                  alt="Sentry Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 dark:brightness-200 dark:invert"
                />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${titleClasses}`}>Sentry Academy</h3>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  Master Application Observability
                </p>
              </div>
            </div>
            <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
              The comprehensive learning platform for mastering Sentry.io
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-lg border border-purple-300/20 bg-gray-100/60 transition-colors hover:border-purple-400/40 hover:bg-purple-500/30 dark:border-purple-500/20 dark:bg-slate-900/60"
              >
                <Github className="h-5 w-5 text-gray-600 group-hover:text-purple-400 dark:text-gray-400" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-lg border border-purple-300/20 bg-gray-100/60 transition-colors hover:border-purple-400/40 hover:bg-purple-500/30 dark:border-purple-500/20 dark:bg-slate-900/60"
              >
                <Twitter className="h-5 w-5 text-gray-600 group-hover:text-purple-400 dark:text-gray-400" />
              </a>
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center rounded-lg border border-purple-300/20 bg-gray-100/60 transition-colors hover:border-purple-400/40 hover:bg-purple-500/30 dark:border-purple-500/20 dark:bg-slate-900/60"
              >
                <Linkedin className="h-5 w-5 text-gray-600 group-hover:text-purple-400 dark:text-gray-400" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className={`mb-6 font-semibold ${titleClasses}`}>Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={linkClasses}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className={`mb-6 font-semibold ${titleClasses}`}>Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`${linkClasses} flex items-center space-x-1`}
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span>{link.name}</span>
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`mb-6 font-semibold ${titleClasses}`}>Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={linkClasses}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-purple-300/20 pt-8 dark:border-purple-500/20 md:flex-row">
          <div className={`mb-4 text-sm md:mb-0 ${subtitleClasses}`}>
            © 2025 Sentry Academy. All rights reserved.
          </div>
          <div className={`flex space-x-6 text-sm ${subtitleClasses}`}>
            <a href="#" className={linkClasses}>
              Privacy Policy
            </a>
            <a href="#" className={linkClasses}>
              Terms of Service
            </a>
            <a href="#" className={linkClasses}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'
export default Footer
