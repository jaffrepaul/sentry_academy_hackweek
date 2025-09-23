import { EngineerRole, SentryFeature } from '@/types/roles'

/**
 * Maps selected features to completed features and modules based on user role
 * This handles the complex logic of determining what steps should be marked
 * as completed based on the user's existing Sentry knowledge
 */
export function mapFeaturesToProgress(
  role: EngineerRole,
  selectedFeatures: string[]
): {
  completedModules: string[]
  completedFeatures: SentryFeature[]
  completedStepIds: string[]
} {
  const completedModules: string[] = []
  const completedFeatures: SentryFeature[] = []
  const completedStepIds: string[] = []

  // If user selected ANY feature other than error-tracking, or explicitly selected error-tracking,
  // we assume they have basic Sentry setup and thus error tracking is complete
  const hasOtherFeatures =
    selectedFeatures.length > 0 &&
    (selectedFeatures.includes('error-tracking') ||
      selectedFeatures.some(f => f !== 'error-tracking'))

  if (hasOtherFeatures) {
    completedFeatures.push('error-tracking')
    // For different roles, error tracking means different starting modules
    switch (role) {
      case 'frontend':
        completedModules.push('sentry-fundamentals')
        completedStepIds.push('frontend-error-tracking')
        break
      case 'backend':
        completedModules.push('nodejs-integration')
        completedStepIds.push('backend-error-tracking')
        break
      case 'sre':
        completedModules.push('nodejs-integration')
        completedStepIds.push('sre-error-tracking')
        break
      case 'ai-ml':
        completedModules.push('nodejs-integration')
        completedStepIds.push('ai-ml-error-tracking')
        break
      case 'fullstack':
        completedModules.push('sentry-fundamentals')
        completedStepIds.push('fullstack-error-tracking')
        break
      case 'pm-manager':
        // PM/Manager doesn't have an error tracking step since they focus on metrics insights
        // but we still mark the feature as understood
        break
    }
  }

  // Map other features to their respective modules and steps
  const featureMapping: Record<
    string,
    {
      feature: SentryFeature
      modules: string[]
      getStepIds: (role: EngineerRole) => string[]
    }
  > = {
    'performance-monitoring': {
      feature: 'performance-monitoring',
      modules: ['performance-monitoring'],
      getStepIds: role => {
        switch (role) {
          case 'frontend':
            return ['frontend-performance']
          case 'backend':
            return ['backend-performance']
          case 'fullstack':
            return ['fullstack-performance']
          case 'sre':
            return ['sre-performance-tracing']
          case 'ai-ml':
            return ['ai-ml-performance']
          default:
            return []
        }
      },
    },
    'session-replay': {
      feature: 'session-replay',
      modules: ['react-error-boundaries'],
      getStepIds: role => {
        switch (role) {
          case 'frontend':
            return ['frontend-session-replay']
          case 'fullstack':
            return ['fullstack-session-replay']
          default:
            return []
        }
      },
    },
    logging: {
      feature: 'logging',
      modules: ['react-error-boundaries'], // Using this as logging course placeholder
      getStepIds: role => {
        switch (role) {
          case 'frontend':
            return ['frontend-logging']
          case 'backend':
            return ['backend-logging']
          case 'fullstack':
            return ['fullstack-logging']
          case 'sre':
            return ['sre-logging']
          case 'ai-ml':
            return ['ai-ml-logging']
          default:
            return []
        }
      },
    },
    'distributed-tracing': {
      feature: 'distributed-tracing',
      modules: ['distributed-tracing'],
      getStepIds: role => {
        switch (role) {
          case 'backend':
            return ['backend-distributed-tracing']
          case 'fullstack':
            return ['fullstack-distributed-tracing']
          case 'sre':
            return ['sre-performance-tracing']
          case 'ai-ml':
            return ['ai-ml-distributed-tracing']
          default:
            return []
        }
      },
    },
    'release-health': {
      feature: 'release-health',
      modules: ['release-health'],
      getStepIds: role => {
        switch (role) {
          case 'backend':
            return ['backend-release-health']
          case 'sre':
            return ['sre-release-health']
          default:
            return []
        }
      },
    },
    'dashboards-alerts': {
      feature: 'dashboards-alerts',
      modules: ['custom-dashboards'],
      getStepIds: role => {
        switch (role) {
          case 'frontend':
            return ['frontend-dashboards-alerts']
          case 'backend':
            return ['backend-dashboards-alerts']
          case 'fullstack':
            return ['fullstack-dashboards-alerts']
          case 'sre':
            return ['sre-dashboards']
          case 'ai-ml':
            return ['ai-ml-dashboards-alerts']
          default:
            return []
        }
      },
    },
    integrations: {
      feature: 'integrations',
      modules: ['team-workflows'],
      getStepIds: role => {
        switch (role) {
          case 'frontend':
            return ['frontend-integrations']
          case 'sre':
            return ['sre-integrations']
          default:
            return []
        }
      },
    },
    'user-feedback': {
      feature: 'user-feedback',
      modules: ['user-feedback'],
      getStepIds: role => {
        switch (role) {
          case 'frontend':
            return ['frontend-user-feedback']
          default:
            return []
        }
      },
    },
    'seer-mcp': {
      feature: 'seer-mcp',
      modules: ['seer-mcp'],
      getStepIds: role => {
        switch (role) {
          case 'ai-ml':
            return ['ai-ml-seer-mcp']
          default:
            return []
        }
      },
    },
    'custom-metrics': {
      feature: 'custom-metrics',
      modules: ['custom-metrics'],
      getStepIds: role => {
        switch (role) {
          case 'ai-ml':
            return ['ai-ml-custom-metrics']
          default:
            return []
        }
      },
    },
    'metrics-insights': {
      feature: 'metrics-insights',
      modules: ['metrics-insights'],
      getStepIds: role => {
        switch (role) {
          case 'pm-manager':
            return ['pm-understanding-metrics']
          default:
            return []
        }
      },
    },
    'stakeholder-reporting': {
      feature: 'stakeholder-reporting',
      modules: ['stakeholder-dashboards'],
      getStepIds: role => {
        switch (role) {
          case 'pm-manager':
            return ['pm-stakeholder-reporting']
          default:
            return []
        }
      },
    },
  }

  // Process each selected feature
  selectedFeatures.forEach(featureKey => {
    const mapping = featureMapping[featureKey]
    if (mapping) {
      completedFeatures.push(mapping.feature)
      completedModules.push(...mapping.modules)
      completedStepIds.push(...mapping.getStepIds(role))
    }
  })

  return {
    completedModules,
    completedFeatures,
    completedStepIds,
  }
}
