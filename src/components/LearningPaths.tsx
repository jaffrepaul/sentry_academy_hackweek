'use client'

import React, { memo, useMemo } from 'react'
import { ArrowRight, User, Code, Server, Settings, BarChart, Layers, Bot } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useRole } from '@/contexts/RoleContext'
import { getTextClasses } from '@/utils/styles'
import PersonaPathDisplay from './PersonaPathDisplay'
import { EngineerRole } from '@/types/roles'

const UserInputForm: React.FC = () => {
  const { isDark } = useTheme()
  const [selectedRole, setSelectedRole] = React.useState('')
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([])
  const [isHovered, setIsHovered] = React.useState(false)

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const { setUserRole } = useRole()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRole) {
      setUserRole(selectedRole as EngineerRole, selectedFeatures)
      console.log('Selected role:', selectedRole)
      console.log('Selected features:', selectedFeatures)
    }
  }

  const roleOptions = [
    {
      value: 'frontend',
      label: 'Front-end Web Developer',
      icon: <Code className="w-5 h-5" />,
      description: 'Monitor client-side issues and user experience'
    },
    {
      value: 'backend',
      label: 'Backend Engineer',
      icon: <Server className="w-5 h-5" />,
      description: 'Deep visibility into backend performance'
    },
    {
      value: 'fullstack',
      label: 'Full-stack Engineer',
      icon: <Layers className="w-5 h-5" />,
      description: 'End-to-end observability pipeline and tooling'
    },
    {
      value: 'sre',
      label: 'SRE/DevOps',
      icon: <Settings className="w-5 h-5" />,
      description: 'High reliability and proactive alerting'
    },
    {
      value: 'ai-ml',
      label: 'AI/ML-Aware Developer',
      icon: <Bot className="w-5 h-5" />,
      description: 'Debug AI pipelines with observability'
    },
    {
      value: 'pm-manager',
      label: 'Product/Engineering Manager',
      icon: <BarChart className="w-5 h-5" />,
      description: 'Turn data into actionable insights'
    }
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
    { value: 'metrics-insights', label: 'AI Agent Monitoring' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3">
          <User className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-700'}`} />
          <span className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>I am a...</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {roleOptions.map((option) => (
            <div key={option.value} className="group cursor-pointer relative transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1">
              <input
                type="radio"
                id={option.value}
                name="role"
                value={option.value}
                checked={selectedRole === option.value}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor={option.value}
                className={`block backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                  selectedRole === option.value
                    ? isDark 
                      ? 'border-purple-400/80 bg-slate-900/80 shadow-lg shadow-purple-500/25'
                      : 'border-purple-500/80 bg-white/85 shadow-lg shadow-purple-400/25'
                    : isDark
                      ? 'border-purple-500/30 bg-slate-900/40 hover:border-purple-400/60 hover:bg-slate-900/60 hover:shadow-purple-500/20'
                      : 'border-purple-400/40 bg-white/75 hover:border-purple-500/60 hover:bg-white/85 hover:shadow-purple-400/20'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${
                    selectedRole === option.value
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30'
                      : 'bg-gradient-to-r from-purple-400/20 to-violet-500/20 group-hover:from-purple-400/30 group-hover:to-violet-500/30'
                  }`}>
                    <div className={`transition-colors duration-300 ${
                      selectedRole === option.value ? 'text-white' : 'text-purple-400 group-hover:text-purple-300'
                    }`}>
                      {option.icon}
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold mb-2 transition-all duration-300 ${
                    selectedRole === option.value 
                      ? isDark ? 'text-purple-300' : 'text-purple-700'
                      : isDark 
                        ? 'text-white group-hover:text-purple-200' 
                        : 'text-gray-900 group-hover:text-purple-800'
                  }`}>
                    {option.label}
                  </h3>
                  <p className={`text-sm transition-all duration-300 ${
                    selectedRole === option.value 
                      ? isDark ? 'text-gray-300' : 'text-gray-600'
                      : isDark 
                        ? 'text-gray-400 group-hover:text-gray-300' 
                        : 'text-gray-700 group-hover:text-gray-600'
                  }`}>
                    {option.description}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h3 className={`text-xl font-bold mb-6 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            I currently use these Sentry features...
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sentryFeatures.map((feature) => (
              <div key={feature.value} className="group">
                <label className={`flex items-center space-x-3 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
                  isDark 
                    ? 'bg-slate-900/40 border-purple-500/30 hover:border-purple-400/60 hover:bg-slate-900/60'
                    : 'bg-white/75 border-purple-400/40 hover:border-purple-500/60 hover:bg-white/85'
                }`}>
                  <input
                    type="checkbox"
                    value={feature.value}
                    checked={selectedFeatures.includes(feature.value)}
                    onChange={() => handleFeatureChange(feature.value)}
                    className={`w-4 h-4 text-purple-500 rounded focus:ring-purple-400 focus:ring-2 focus:ring-offset-0 accent-purple-500 ${
                      isDark 
                        ? 'bg-slate-900/60 border-purple-500/50' 
                        : 'bg-white border-purple-400/60'
                    }`}
                  />
                  <span className={`transition-all duration-300 ${
                    isDark 
                      ? 'text-gray-300 group-hover:text-purple-300' 
                      : 'text-gray-800 group-hover:text-purple-700'
                  }`}>
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
            className="group bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-300 ease-out transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-purple-500 disabled:hover:to-violet-600 inline-flex items-center space-x-2"
          >
            <span>Get My Personalized Path</span>
            <ArrowRight className={`w-5 h-5 transition-all duration-300 ease-out ${isHovered && selectedRole ? 'translate-x-2' : ''}`} />
          </button>
        </div>
      </form>
    </div>
  )
}


const LearningPaths: React.FC = memo(() => {
  const { isDark } = useTheme()
  const { userProgress } = useRole()

  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark])
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark])

  // Jump directly to learning path when persona is selected (no animation)
  React.useEffect(() => {
    if (userProgress.role) {
      // Use setTimeout with 0 to ensure DOM is updated first, then jump immediately
      setTimeout(() => {
        const pathsSection = document.getElementById('paths')
        if (pathsSection) {
          pathsSection.scrollIntoView({ 
            behavior: 'auto', // Instant, no animation
            block: 'start' 
          })
        }
      }, 0)
    }
  }, [userProgress.role])

  return (
    <section id="paths" className="py-20 lg:py-32 relative">
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-transparent via-purple-900/10 to-transparent' 
          : 'bg-gradient-to-b from-transparent via-purple-200/20 to-transparent'
      }`}></div>
      <div className={`absolute top-1/2 left-0 w-72 h-72 rounded-full blur-3xl ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'
      }`}></div>
      <div className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl ${
        isDark ? 'bg-violet-500/10' : 'bg-pink-300/20'
      }`}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${titleClasses}`}>
            {userProgress.role ? 'Your' : 'Choose Your'}{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${subtitleClasses}`}>
            {userProgress.role 
              ? `Great! You're set up as a ${userProgress.role} engineer. Here's what we recommend next.`
              : 'Every expert started somewhere. Pick the path that matches your current experience and let us guide you to Sentry mastery.'
            }
          </p>
        </div>

        {userProgress.role ? <PersonaPathDisplay /> : <UserInputForm />}
      </div>
    </section>
  )
})

LearningPaths.displayName = 'LearningPaths'
export default LearningPaths
