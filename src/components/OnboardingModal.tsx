import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import RoleOnboarding from './RoleOnboarding';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { markOnboardingComplete } = useRole();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleComplete = () => {
    markOnboardingComplete();
    onComplete();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className={`
          relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
          w-full max-w-4xl max-h-[90vh] overflow-hidden
          transform transition-all duration-300
          ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 
                     hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[90vh]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Sentry Academy! 🎓
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                To give you the most relevant learning experience, we'd love to know about your role. 
                This helps us personalize your content and recommend the best learning path for you.
              </p>
            </div>

            <RoleOnboarding onComplete={handleComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;