import React from 'react';
import { Check } from 'lucide-react';
import { RoleInfo, EngineerRole } from '../types/roles';

interface RoleSelectorProps {
  role: RoleInfo;
  isSelected: boolean;
  onSelect: (roleId: EngineerRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ role, isSelected, onSelect }) => {
  return (
    <div
      className={`
        relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200
        ${isSelected 
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
        }
      `}
      onClick={() => onSelect(role.id)}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Role Icon */}
      <div className="text-4xl mb-4">
        {role.icon}
      </div>

      {/* Role Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {role.title}
      </h3>

      {/* Role Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
        {role.description}
      </p>

      {/* Common Tasks */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Common Tasks:
        </h4>
        <ul className="space-y-1">
          {role.commonTasks.slice(0, 3).map((task, index) => (
            <li 
              key={index} 
              className="text-xs text-gray-600 dark:text-gray-400 flex items-start"
            >
              <span className="text-purple-500 mr-2 mt-1">•</span>
              <span>{task}</span>
            </li>
          ))}
          {role.commonTasks.length > 3 && (
            <li className="text-xs text-gray-500 dark:text-gray-500 italic">
              + {role.commonTasks.length - 3} more...
            </li>
          )}
        </ul>
      </div>

      {/* Hover Effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200
        ${!isSelected ? 'hover:opacity-100' : ''}
        bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20
      `} />
    </div>
  );
};

export default RoleSelector;