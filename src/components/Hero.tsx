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
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-500/15 dark:to-violet-500/15"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse bg-purple-300/40 dark:bg-purple-500/30"></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl animate-pulse delay-500 bg-pink-300/30 dark:bg-violet-500/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${titleClasses}`}>
            Master{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Application Observability
            </span>
            <br />
            with Sentry
          </h1>
          
          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${subtitleClasses}`}>
            Interactive learning platform designed to help developers master Sentry's powerful observability tools through hands-on experience and personalized learning paths.
          </p>

          {/* Path Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <div className="group cursor-pointer relative transition-smooth hover:scale-[1.02]" onClick={() => scrollToSection('courses')}>
              <div className={`${getCardClasses()} p-8 h-full group-hover:shadow-2xl group-hover:shadow-purple-400/25 dark:group-hover:shadow-purple-500/25`}>
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 mx-auto transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-6">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${titleClasses}`}>
                  New to Sentry
                </h3>
                <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
                  Start from the basics. Learn what Sentry is, how to set it up, and why error monitoring matters for your applications.
                </p>
                <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                  Start Learning <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-all duration-300 ease-out" />
                </div>
              </div>
            </div>

            <div className="group cursor-pointer relative transition-smooth hover:scale-[1.02]" onClick={() => scrollToSection('paths')}>
              <div className={`${getCardClasses()} p-8 h-full group-hover:shadow-2xl group-hover:shadow-purple-400/25 dark:group-hover:shadow-purple-500/25`}>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mb-6 mx-auto transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-6">
                  <UserCog className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${titleClasses}`}>
                  Sentry Pro
                </h3>
                <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
                  Already using Sentry? Level up with advanced features, performance monitoring, and enterprise-grade workflows.
                </p>
                <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                  Advanced Courses <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-all duration-300 ease-out" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className={`flex flex-wrap justify-center items-center gap-8 ${subtitleClasses}`}>
            <div className="flex items-center space-x-2">
              <Code className={`w-5 h-5 ${accentClasses}`} />
              <span>Hands-on Labs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className={`w-5 h-5 ${accentClasses}`} />
              <span>Real-world Scenarios</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className={`w-5 h-5 ${accentClasses}`} />
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
