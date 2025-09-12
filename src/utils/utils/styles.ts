// Style utility functions for consistent theming using Tailwind dark: classes
import { backgroundOption4 } from './backgroundOptions'; // or 3, 4, 5
export const getBackgroundStyle = backgroundOption4;

/**
 * Card classes using Tailwind dark: modifier
 * Now automatically handles light/dark themes without JavaScript conditionals
 */
export const getCardClasses = (isHover = true) => 
  `backdrop-blur-sm border rounded-2xl transition-all duration-300 ease-out ${
    isHover ? 'transform hover:scale-105 hover:shadow-xl' : ''          
  } bg-white/75 dark:bg-slate-900/40 border-purple-400/40 dark:border-purple-500/30 hover:border-purple-500/60 dark:hover:border-purple-400/60 hover:bg-white/85 dark:hover:bg-slate-900/60 hover:shadow-purple-400/20 dark:hover:shadow-purple-500/20`;

/**
 * Text classes using Tailwind dark: modifier
 * Automatically handles light/dark theme variants
 */
export const getTextClasses = (variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
  const variants = {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-700 dark:text-gray-300',
    accent: 'text-purple-700 dark:text-purple-400'
  };
  return variants[variant];
};

/**
 * Button classes using Tailwind dark: modifier
 * Primary buttons maintain gradient, secondary buttons adapt to theme
 */
export const getButtonClasses = (variant: 'primary' | 'secondary' = 'primary') => {
  if (variant === 'primary') {
    return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700 transition-smooth transform hover:scale-105 shadow-lg hover:shadow-purple-500/30';
  }
  
  return 'backdrop-blur-sm border transition-all duration-300 ease-out shadow-lg bg-white/70 dark:bg-slate-900/50 border-purple-400/50 dark:border-purple-500/40 text-gray-900 dark:text-white hover:border-purple-500/70 dark:hover:border-purple-400/60 hover:bg-white/80 dark:hover:bg-slate-900/70 hover:shadow-purple-400/20 dark:hover:shadow-purple-500/20';
};

/**
 * Navigation link classes using Tailwind dark: modifier
 * Clean, consistent styling across light and dark themes
 */
export const getNavLinkClasses = () => 
  'transition-colors duration-300 ease-out text-gray-800 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300';

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};