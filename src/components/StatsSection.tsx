'use client'

import React, { memo, useMemo } from 'react'
// Theme handled automatically by Tailwind dark: classes
import { getCardClasses, getTextClasses, getButtonClasses } from '@/utils/styles'
import { stats } from '@/data/stats'

interface StatCardProps {
  icon: any
  value: string
  label: string
  color: string
}

const StatCard: React.FC<StatCardProps> = memo(({ icon: Icon, value, label, color }) => {
  // Theme handled automatically by Tailwind dark: classes

  const cardClasses = useMemo(() => getCardClasses(), [])
  const titleClasses = useMemo(() => getTextClasses('primary'), [])
  const labelClasses = useMemo(() => getTextClasses('secondary'), [])

  return (
    <div className="group cursor-pointer">
      <div className={`${cardClasses} p-6 text-center`}>
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:rotate-6 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className={`text-3xl md:text-4xl font-bold mb-2 transition-colors ${titleClasses} group-hover:text-purple-300`}>
          {value}
        </div>
        <div className={`font-medium ${labelClasses}`}>
          {label}
        </div>
      </div>
    </div>
  )
})

StatCard.displayName = 'StatCard'

const StatsSection: React.FC = memo(() => {
  // Theme handled automatically by Tailwind dark: classes

  const titleClasses = useMemo(() => getTextClasses('primary'), [])
  const subtitleClasses = useMemo(() => getTextClasses('secondary'), [])
  const primaryButtonClasses = useMemo(() => getButtonClasses('primary'), [])
  const secondaryButtonClasses = useMemo(() => getButtonClasses('secondary'), [])

  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 dark:from-purple-500/10 dark:to-violet-500/10"></div>
      <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse bg-purple-300/20 dark:bg-purple-500/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${titleClasses}`}>
            Join the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${subtitleClasses}`}>
            Thousands of developers have already leveled up their monitoring skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="backdrop-blur-sm border rounded-3xl p-8 md:p-12 text-center bg-gradient-to-r from-purple-200/30 to-pink-200/30 border-purple-300/30 dark:from-purple-500/20 dark:to-violet-500/20 dark:border-purple-500/30">
          <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${titleClasses}`}>
            Ready to Level Up Your Monitoring Game?
          </h3>
          <p className={`mb-8 max-w-2xl mx-auto leading-relaxed ${subtitleClasses}`}>
            Start your journey today and join thousands of developers who've mastered 
            error monitoring with Sentry Academy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`${primaryButtonClasses} px-8 py-3 rounded-xl font-medium`}>
              Start Learning Free
            </button>
            <button className={`${secondaryButtonClasses} px-8 py-3 rounded-xl font-medium`}>
              View Curriculum
            </button>
          </div>
        </div>
      </div>
    </section>
  )
})

StatsSection.displayName = 'StatsSection'
export default StatsSection
