'use client'

import React, { memo, useMemo } from 'react'
import { TrendingUp, Users, Award, Clock } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { getCardClasses, getTextClasses, getButtonClasses } from '@/utils/styles'

interface StatCardProps {
  icon: any
  value: string
  label: string
  color: string
}

const StatCard: React.FC<StatCardProps> = memo(({ icon: Icon, value, label, color }) => {
  const { isDark } = useTheme()

  const cardClasses = useMemo(() => getCardClasses(isDark), [isDark])
  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark])
  const labelClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark])

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
  const { isDark } = useTheme()

  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark])
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark])
  const primaryButtonClasses = useMemo(() => getButtonClasses(isDark, 'primary'), [isDark])
  const secondaryButtonClasses = useMemo(() => getButtonClasses(isDark, 'secondary'), [isDark])

  const stats = [
    { 
      icon: Users,
      value: '10K+', 
      label: 'Active Learners',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    { 
      icon: Award,
      value: '50+', 
      label: 'Expert-Led Courses',
      color: 'bg-gradient-to-r from-purple-500 to-violet-500'
    },
    { 
      icon: TrendingUp,
      value: '95%', 
      label: 'Success Rate',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    { 
      icon: Clock,
      value: '24/7', 
      label: 'Learning Support',
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    }
  ]

  return (
    <section className="py-20 lg:py-32 relative">
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-500/10 to-violet-500/10' 
          : 'bg-gradient-to-r from-purple-200/20 to-pink-200/20'
      }`}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'
      }`}></div>
      
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

        <div className={`backdrop-blur-sm border rounded-3xl p-8 md:p-12 text-center ${
          isDark 
            ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/30'
            : 'bg-gradient-to-r from-purple-200/30 to-pink-200/30 border-purple-300/30'
        }`}>
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
