'use client'

import React, { memo, useMemo } from 'react'
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react'
import { getTextClasses } from '@/utils/styles'
import Image from 'next/image'

const Footer: React.FC = memo(() => {
  const titleClasses = useMemo(() => getTextClasses('primary'), [])
  const subtitleClasses = useMemo(() => getTextClasses('secondary'), [])
  const linkClasses = useMemo(() => 
    'transition-colors duration-200 text-gray-700 hover:text-purple-700 dark:text-gray-300 dark:hover:text-purple-400', []
  )

  const footerLinks = {
    product: [
      { name: 'Learning Paths', href: '#paths' },
      { name: 'All Courses', href: '#courses' },
      { name: 'Assessments', href: '#' },
      { name: 'Certificates', href: '#' }
    ],
    resources: [
      { name: 'Sentry Docs', href: 'https://docs.sentry.io', external: true },
      { name: 'Product Docs', href: 'https://docs.sentry.io/product/', external: true },
      { name: 'Sentry Blog', href: 'https://sentry-blog.sentry.dev/', external: true },
      { name: 'Sentry vs Logging', href: 'https://sentry.io/vs/logging/', external: true },
      { name: 'YouTube Channel', href: 'https://www.youtube.com/@Sentry-monitoring/videos', external: true },
      { name: 'Customer Stories', href: 'https://sentry.io/customers/', external: true }
    ],
    company: [
      { name: 'About Academy', href: '#' },
      { name: 'Instructors', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Careers', href: '#' }
    ]
  }

  return (
    <footer className="backdrop-blur-xl border-t bg-white/80 border-purple-400/40 dark:bg-slate-950/80 dark:border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-900 dark:text-white">
                <Image 
                  src="/logos/sentry-logo.svg" 
                  alt="Sentry Logo" 
                  width={48}
                  height={48}
                  className="w-12 h-12 dark:invert dark:brightness-200"
                />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${titleClasses}`}>
                  Sentry Academy
                </h3>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  Master Application Observability
                </p>
              </div>
            </div>
            <p className={`leading-relaxed mb-6 ${subtitleClasses}`}>
              The comprehensive learning platform for mastering Sentry.io
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors group border hover:border-purple-400/40 bg-gray-100/60 border-purple-300/20 dark:bg-slate-900/60 dark:border-purple-500/20">
                <Github className="w-5 h-5 group-hover:text-purple-400 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors group border hover:border-purple-400/40 bg-gray-100/60 border-purple-300/20 dark:bg-slate-900/60 dark:border-purple-500/20">
                <Twitter className="w-5 h-5 group-hover:text-purple-400 text-gray-600 dark:text-gray-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-500/30 transition-colors group border hover:border-purple-400/40 bg-gray-100/60 border-purple-300/20 dark:bg-slate-900/60 dark:border-purple-500/20">
                <Linkedin className="w-5 h-5 group-hover:text-purple-400 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className={`font-semibold mb-6 ${titleClasses}`}>
              Product
            </h4>
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
            <h4 className={`font-semibold mb-6 ${titleClasses}`}>
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className={`${linkClasses} flex items-center space-x-1`}
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <span>{link.name}</span>
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`font-semibold mb-6 ${titleClasses}`}>
              Company
            </h4>
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

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center border-purple-300/20 dark:border-purple-500/20">
          <div className={`text-sm mb-4 md:mb-0 ${subtitleClasses}`}>
            © 2025 Sentry Academy. All rights reserved.
          </div>
          <div className={`flex space-x-6 text-sm ${subtitleClasses}`}>
            <a href="#" className={linkClasses}>Privacy Policy</a>
            <a href="#" className={linkClasses}>Terms of Service</a>
            <a href="#" className={linkClasses}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'
export default Footer
