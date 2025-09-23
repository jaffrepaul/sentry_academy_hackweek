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
        <div
          className={`h-16 w-16 ${color} mx-auto mb-4 flex items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-6`}
        >
          <Icon className="h-8 w-8 text-white drop-shadow-sm" />
        </div>
        <div
          className={`mb-2 text-3xl font-bold transition-colors md:text-4xl ${titleClasses} group-hover:text-purple-300`}
        >
          {value}
        </div>
        <div className={`font-medium ${labelClasses}`}>{label}</div>
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
    <section className="relative py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 dark:from-purple-500/10 dark:to-violet-500/10"></div>
      <div className="absolute right-1/3 top-0 h-96 w-96 animate-pulse rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={`mb-6 text-3xl font-bold md:text-5xl ${titleClasses}`}>
            Join the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className={`mx-auto max-w-2xl text-xl ${subtitleClasses}`}>
            Thousands of developers have already leveled up their monitoring skills
          </p>
        </div>

        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="rounded-3xl border border-purple-300/30 bg-gradient-to-r from-purple-200/30 to-pink-200/30 p-8 text-center backdrop-blur-sm dark:border-purple-500/30 dark:from-purple-500/20 dark:to-violet-500/20 md:p-12">
          <h3 className={`mb-4 text-2xl font-bold md:text-3xl ${titleClasses}`}>
            Ready to Level Up Your Monitoring Game?
          </h3>
          <p className={`mx-auto mb-8 max-w-2xl leading-relaxed ${subtitleClasses}`}>
            Start your journey today and join thousands of developers who've mastered error
            monitoring with Sentry Academy.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className={`${primaryButtonClasses} rounded-xl px-8 py-3 font-medium`}>
              Start Learning Free
            </button>
            <button className={`${secondaryButtonClasses} rounded-xl px-8 py-3 font-medium`}>
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
