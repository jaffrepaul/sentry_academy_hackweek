'use client'

import React, { memo, useMemo } from 'react'
import { ArrowRight, User, UserCog, Code, Globe, Rocket } from 'lucide-react'
// Theme handled automatically by Tailwind dark: classes
import { getTextClasses, getCardClasses, scrollToSection } from '@/utils/styles'

const Hero: React.FC = memo(() => {
  // Theme handled automatically by Tailwind dark: classes

  const titleClasses = useMemo(() => getTextClasses('primary'), [])
  const subtitleClasses = useMemo(() => getTextClasses('secondary'), [])
  const accentClasses = useMemo(() => getTextClasses('accent'), [])

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-500/15 dark:to-violet-500/15"></div>
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-purple-300/40 blur-3xl dark:bg-purple-500/30"></div>
      <div className="absolute right-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-pink-300/30 blur-2xl delay-500 dark:bg-violet-500/20"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1
            className={`mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl ${titleClasses}`}
          >
            Master{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Application Observability
            </span>
            <br />
            with Sentry
          </h1>

          <p
            className={`mx-auto mb-12 max-w-3xl text-xl leading-relaxed md:text-2xl ${subtitleClasses}`}
          >
            Interactive learning platform designed to help developers master Sentry's powerful
            observability tools through hands-on experience and personalized learning paths.
          </p>

          {/* Path Selection Cards */}
          <div className="mx-auto mb-12 grid max-w-4xl gap-6 md:grid-cols-2">
            <div
              className="transition-smooth group relative cursor-pointer hover:scale-[1.02]"
              onClick={() => scrollToSection('courses')}
            >
              <div
                className={`${getCardClasses()} h-full p-8 group-hover:shadow-2xl group-hover:shadow-purple-400/25 dark:group-hover:shadow-purple-500/25`}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500 ease-out group-hover:rotate-6 group-hover:scale-105">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className={`mb-4 text-2xl font-bold ${titleClasses}`}>New to Sentry</h3>
                <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
                  Start from the basics. Learn what Sentry is, how to set it up, and why error
                  monitoring matters for your applications.
                </p>
                <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                  Start Learning{' '}
                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 ease-out group-hover:translate-x-2" />
                </div>
              </div>
            </div>

            <div
              className="transition-smooth group relative cursor-pointer hover:scale-[1.02]"
              onClick={() => scrollToSection('paths')}
            >
              <div
                className={`${getCardClasses()} h-full p-8 group-hover:shadow-2xl group-hover:shadow-purple-400/25 dark:group-hover:shadow-purple-500/25`}
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-400 to-violet-500 transition-all duration-500 ease-out group-hover:rotate-6 group-hover:scale-105">
                  <UserCog className="h-8 w-8 text-white" />
                </div>
                <h3 className={`mb-4 text-2xl font-bold ${titleClasses}`}>Sentry Pro</h3>
                <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
                  Already using Sentry? Level up with advanced features, performance monitoring, and
                  enterprise-grade workflows.
                </p>
                <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                  Advanced Courses{' '}
                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 ease-out group-hover:translate-x-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className={`flex flex-wrap items-center justify-center gap-8 ${subtitleClasses}`}>
            <div className="flex items-center space-x-2">
              <Code className={`h-5 w-5 ${accentClasses}`} />
              <span>Hands-on Labs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className={`h-5 w-5 ${accentClasses}`} />
              <span>Real-world Scenarios</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className={`h-5 w-5 ${accentClasses}`} />
              <span>Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'
export default Hero
