'use client'

import React, { memo, useMemo } from 'react'
import { ArrowRight, User, Code, Server, Settings, BarChart, Layers, Bot } from 'lucide-react'
// Theme handled automatically by Tailwind dark: classes
import { usePersonalizedLearning } from '@/contexts/PersonalizedLearningContext'
import { getTextClasses } from '@/utils/styles'
import PersonaPathDisplay from './PersonaPathDisplay'
import { EngineerRole } from '@/types/roles'

const UserInputForm: React.FC = () => {
  // Theme handled automatically by Tailwind dark: classes
  const [selectedRole, setSelectedRole] = React.useState('')
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([])
  const [isHovered, setIsHovered] = React.useState(false)

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    )
  }

  const { setEngineerRole } = usePersonalizedLearning()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole) {
      setEngineerRole(selectedRole as EngineerRole, selectedFeatures)
      console.log('Selected role:', selectedRole)
      console.log('Selected features:', selectedFeatures)
    }
  }

  const roleOptions = [
    {
      value: 'frontend',
      label: 'Front-end Web Developer',
      icon: <Code className="h-5 w-5" />,
      description: 'Monitor client-side issues and user experience',
    },
    {
      value: 'backend',
      label: 'Backend Engineer',
      icon: <Server className="h-5 w-5" />,
      description: 'Deep visibility into backend performance',
    },
    {
      value: 'fullstack',
      label: 'Full-stack Engineer',
      icon: <Layers className="h-5 w-5" />,
      description: 'End-to-end observability pipeline and tooling',
    },
    {
      value: 'sre',
      label: 'SRE/DevOps',
      icon: <Settings className="h-5 w-5" />,
      description: 'High reliability and proactive alerting',
    },
    {
      value: 'ai-ml',
      label: 'AI/ML-Aware Developer',
      icon: <Bot className="h-5 w-5" />,
      description: 'Debug AI pipelines with observability',
    },
    {
      value: 'pm-manager',
      label: 'Product/Engineering Manager',
      icon: <BarChart className="h-5 w-5" />,
      description: 'Turn data into actionable insights',
    },
  ]

  const sentryFeatures = [
    { value: 'error-tracking', label: 'Error Tracking' },
    { value: 'performance-monitoring', label: 'Performance Monitoring' },
    { value: 'logging', label: 'Logging' },
    { value: 'session-replay', label: 'Session Replay' },
    { value: 'distributed-tracing', label: 'Distributed Tracing' },
    { value: 'release-health', label: 'Release Health' },
    { value: 'dashboards-alerts', label: 'Dashboards & Alerts' },
    { value: 'integrations', label: 'Integrations' },
    { value: 'user-feedback', label: 'User Feedback' },
    { value: 'seer-mcp', label: 'Seer / MCP' },
    { value: 'custom-metrics', label: 'Custom Metrics' },
    { value: 'metrics-insights', label: 'AI Agent Monitoring' },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center space-x-3">
          <User className="h-8 w-8 text-purple-700 dark:text-purple-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
            I am a...
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {roleOptions.map(option => (
            <div
              key={option.value}
              className="group relative cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02]"
            >
              <input
                type="radio"
                id={option.value}
                name="role"
                value={option.value}
                checked={selectedRole === option.value}
                onChange={e => setSelectedRole(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor={option.value}
                className={`block transform cursor-pointer rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  selectedRole === option.value
                    ? 'border-purple-500/80 bg-white/85 shadow-lg shadow-purple-400/25 dark:border-purple-400/80 dark:bg-slate-900/80 dark:shadow-purple-500/25'
                    : 'border-purple-400/40 bg-white/75 hover:border-purple-500/60 hover:bg-white/85 hover:shadow-purple-400/20 dark:border-purple-500/30 dark:bg-slate-900/40 dark:hover:border-purple-400/60 dark:hover:bg-slate-900/60 dark:hover:shadow-purple-500/20'
                }`}
              >
                <div className="text-center">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                      selectedRole === option.value
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30'
                        : 'bg-gradient-to-r from-purple-400/20 to-violet-500/20 group-hover:from-purple-400/30 group-hover:to-violet-500/30'
                    }`}
                  >
                    <div
                      className={`transition-colors duration-300 ${
                        selectedRole === option.value
                          ? 'text-white'
                          : 'text-purple-400 group-hover:text-purple-300'
                      }`}
                    >
                      {option.icon}
                    </div>
                  </div>
                  <h3
                    className={`mb-2 text-lg font-bold transition-all duration-300 ${
                      selectedRole === option.value
                        ? 'text-purple-700 dark:text-purple-300'
                        : 'text-gray-900 group-hover:text-purple-800 dark:text-white dark:group-hover:text-purple-200'
                    }`}
                  >
                    {option.label}
                  </h3>
                  <p
                    className={`text-sm transition-all duration-300 ${
                      selectedRole === option.value
                        ? 'text-gray-600 dark:text-gray-300'
                        : 'text-gray-700 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                    }`}
                  >
                    {option.description}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h3 className="mb-6 text-center text-xl font-bold text-gray-900 dark:text-white">
            I currently use these Sentry features...
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sentryFeatures.map(feature => (
              <div key={feature.value} className="group">
                <label className="flex cursor-pointer items-center space-x-3 rounded-xl border border-purple-400/40 bg-white/75 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/60 hover:bg-white/85 dark:border-purple-500/30 dark:bg-slate-900/40 dark:hover:border-purple-400/60 dark:hover:bg-slate-900/60">
                  <input
                    type="checkbox"
                    value={feature.value}
                    checked={selectedFeatures.includes(feature.value)}
                    onChange={() => handleFeatureChange(feature.value)}
                    className="h-4 w-4 rounded border-2 border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-offset-0 dark:border-purple-500"
                  />
                  <span className="text-gray-800 transition-all duration-300 group-hover:text-purple-700 dark:text-gray-300 dark:group-hover:text-purple-300">
                    {feature.label}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={!selectedRole}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group inline-flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:from-purple-600 hover:to-violet-700 hover:shadow-purple-500/30 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-purple-500 disabled:hover:to-violet-600"
          >
            <span>Get My Personalized Path</span>
            <ArrowRight
              className={`h-5 w-5 transition-all duration-300 ease-out ${isHovered && selectedRole ? 'translate-x-2' : ''}`}
            />
          </button>
        </div>
      </form>
    </div>
  )
}

const LearningPaths: React.FC = memo(() => {
  // Theme handled automatically by Tailwind dark: classes
  const { engineerRole } = usePersonalizedLearning()

  const titleClasses = useMemo(() => getTextClasses('primary'), [])
  const subtitleClasses = useMemo(() => getTextClasses('secondary'), [])

  // Jump directly to learning path when persona is selected (no animation)
  React.useEffect(() => {
    if (engineerRole) {
      // Use setTimeout with 0 to ensure DOM is updated first, then jump immediately
      setTimeout(() => {
        const pathsSection = document.getElementById('paths')
        if (pathsSection) {
          pathsSection.scrollIntoView({
            behavior: 'auto', // Instant, no animation
            block: 'start',
          })
        }
      }, 0)
    }
  }, [engineerRole])

  return (
    <section id="paths" className="relative py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-200/20 to-transparent dark:via-purple-900/10"></div>
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full blur-3xl bg-purple-300/20 dark:bg-purple-500/10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl bg-pink-300/20 dark:bg-violet-500/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${titleClasses}`}>
            {engineerRole ? 'Your' : 'Choose Your'}{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${subtitleClasses}`}>
            {engineerRole 
              ? `Great! You're set up as a ${engineerRole} engineer. Here's what we recommend next.`
              : 'Every expert started somewhere. Pick the path that matches your current experience and let us guide you to Sentry mastery.'
            }
          </p>
        </div>

        {engineerRole ? <PersonaPathDisplay /> : <UserInputForm />}
      </div>
    </section>
  )
})

LearningPaths.displayName = 'LearningPaths'
export default LearningPaths
