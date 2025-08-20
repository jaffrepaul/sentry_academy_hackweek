import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { roles } from '../data/roles';
import { EngineerRole } from '../types/roles';
import RoleSelector from './RoleSelector';

interface RoleOnboardingProps {
  onComplete: () => void;
}

const RoleOnboarding: React.FC<RoleOnboardingProps> = ({ onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<EngineerRole | null>(null);
  const [preferredContentType, setPreferredContentType] = useState<'hands-on' | 'conceptual' | 'mixed'>('mixed');
  const { setUserRole } = useRole();

  const handleRoleSelect = (roleId: EngineerRole) => {
    setSelectedRole(roleId);
  };

  const handleGetStarted = () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Role Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          What's your primary engineering role?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <RoleSelector
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onSelect={handleRoleSelect}
            />
          ))}
        </div>
      </div>

      {/* Content Preference */}
      <div className="mb-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4 text-center">
          How do you prefer to learn?
        </h3>
        
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { value: 'hands-on', label: 'Hands-on Tutorials', emoji: '🛠️' },
            { value: 'conceptual', label: 'Conceptual Guides', emoji: '📚' },
            { value: 'mixed', label: 'Mix of Both', emoji: '🎯' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setPreferredContentType(option.value as any)}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                ${preferredContentType === option.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-purple-300'
                }
              `}
            >
              <span>{option.emoji}</span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Benefits Preview */}
      {selectedRole && (
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              Your Personalized Experience
            </h4>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">🎯</span>
              <div>
                <div className="font-medium text-purple-900 dark:text-purple-100">Tailored Content</div>
                <div className="text-purple-700 dark:text-purple-300">Role-specific explanations and examples</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">🗺️</span>
              <div>
                <div className="font-medium text-purple-900 dark:text-purple-100">Learning Path</div>
                <div className="text-purple-700 dark:text-purple-300">Curated sequence optimized for your role</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">📈</span>
              <div>
                <div className="font-medium text-purple-900 dark:text-purple-100">Progress Tracking</div>
                <div className="text-purple-700 dark:text-purple-300">Smart recommendations for what's next</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Get Started Button */}
      <div className="text-center">
        <button
          onClick={handleGetStarted}
          disabled={!selectedRole}
          className={`
            inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200
            ${selectedRole
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <span>Start My Learning Journey</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        
        {!selectedRole && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please select a role to continue
          </p>
        )}
      </div>

      {/* Skip Option */}
      <div className="text-center mt-6">
        <button
          onClick={onComplete}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
        >
          Skip for now (you can set this later)
        </button>
      </div>
    </div>
  );
};

export default RoleOnboarding;