import React from 'react';
import { Check, Clock, Lock } from 'lucide-react';
import { LearningPathStep } from '../types/roles';

interface PathProgressProps {
  steps: (LearningPathStep & {
    isCompleted: boolean;
    completedModules: string[];
    progress: number;
  })[];
  currentStepIndex?: number;
  className?: string;
}

const PathProgress: React.FC<PathProgressProps> = ({ 
  steps, 
  currentStepIndex = 0,
  className = '' 
}) => {
  const getStepStatus = (step: any, index: number) => {
    if (step.isCompleted) return 'completed';
    if (index === currentStepIndex) return 'current';
    if (index < currentStepIndex || step.isUnlocked) return 'unlocked';
    return 'locked';
  };

  const getStepIcon = (status: string, progress: number) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-white" />;
      case 'current':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'locked':
        return <Lock className="w-3 h-3 text-gray-400" />;
      default:
        return (
          <div className="w-2 h-2 bg-purple-600 rounded-full" />
        );
    }
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-white border-purple-500 shadow-lg ring-4 ring-purple-100';
      case 'unlocked':
        return 'bg-white border-purple-300 hover:border-purple-500';
      case 'locked':
        return 'bg-gray-100 border-gray-300';
      default:
        return 'bg-white border-gray-300';
    }
  };

  const getConnectorStyles = (fromStatus: string, toStatus: string) => {
    if (fromStatus === 'completed') {
      return 'bg-green-500';
    }
    if (fromStatus === 'current' && toStatus !== 'locked') {
      return 'bg-purple-300';
    }
    return 'bg-gray-300';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(step, index);
        const nextStatus = index < steps.length - 1 ? getStepStatus(steps[index + 1], index + 1) : null;

        return (
          <div key={step.id} className="relative">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute left-6 top-12 w-0.5 h-6 ${getConnectorStyles(status, nextStatus!)}`}
              />
            )}

            {/* Step Content */}
            <div className="flex items-start gap-4">
              {/* Step Icon */}
              <div className={`
                relative w-12 h-12 rounded-full border-2 flex items-center justify-center
                transition-all duration-200 ${getStepStyles(status)}
              `}>
                {getStepIcon(status, step.progress)}
                
                {/* Progress Ring for Current Step */}
                {status === 'current' && step.progress > 0 && (
                  <div className="absolute inset-0">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-purple-200"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${step.progress * 62.83} 62.83`}
                        className="text-purple-500"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Step Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${
                    status === 'locked' 
                      ? 'text-gray-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {step.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    {/* Time Estimate */}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      status === 'locked'
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                      {step.estimatedTime}
                    </span>
                    
                    {/* Status Badge */}
                    {status === 'completed' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        Complete
                      </span>
                    )}
                    {status === 'current' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                        In Progress
                      </span>
                    )}
                    {status === 'locked' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                <p className={`text-sm mb-3 ${
                  status === 'locked' 
                    ? 'text-gray-400' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {step.description}
                </p>

                {/* Module Progress */}
                {status !== 'locked' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Modules: {step.completedModules.length}/{step.modules.length}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(step.progress * 100)}% complete
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${step.progress * 100}%` }}
                      />
                    </div>

                    {/* Outcomes Preview */}
                    {step.outcomes.length > 0 && (
                      <div className="mt-3">
                        <details className="group">
                          <summary className="text-xs text-purple-600 dark:text-purple-400 cursor-pointer hover:text-purple-700 dark:hover:text-purple-300">
                            Learning outcomes ({step.outcomes.length})
                          </summary>
                          <ul className="mt-2 space-y-1 ml-4">
                            {step.outcomes.map((outcome, outcomeIndex) => (
                              <li key={outcomeIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                                <span className="text-purple-500 mr-2 mt-0.5">•</span>
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PathProgress;