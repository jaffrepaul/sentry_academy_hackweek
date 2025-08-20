// Style utility functions for consistent theming
import { backgroundOption4 } from './backgroundOptions'; // or 3, 4, 5
export const getBackgroundStyle = backgroundOption4;

export const getCardClasses = (isDark: boolean, isHover = true) => 
  `backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
    isHover ? 'transform hover:scale-105 hover:shadow-xl' : ''          
  } ${
    isDark 
      ? 'bg-slate-900/40 border-purple-500/30 hover:border-purple-400/60 hover:bg-slate-900/60 hover:shadow-purple-500/20'
      : 'bg-white/75 border-purple-400/40 hover:border-purple-500/60 hover:bg-white/85 hover:shadow-purple-400/20'  // Improved opacity and border contrast
  }`;

export const getTextClasses = (isDark: boolean, variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
  const variants = {
    primary: isDark ? 'text-white' : 'text-gray-900',
    secondary: isDark ? 'text-gray-300' : 'text-gray-700', // Improved from gray-600 to gray-700 for better contrast
    accent: isDark ? 'text-purple-400' : 'text-purple-700'  // Improved from purple-600 to purple-700 for better contrast
  };
  return variants[variant];
};

export const getButtonClasses = (isDark: boolean, variant: 'primary' | 'secondary' = 'primary') => {
  if (variant === 'primary') {
    return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white hover:from-purple-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30';
  }
  
  return `backdrop-blur-sm border transition-all duration-200 shadow-lg ${
    isDark 
      ? 'bg-slate-900/50 border-purple-500/40 text-white hover:border-purple-400/60 hover:bg-slate-900/70 hover:shadow-purple-500/20'
      : 'bg-white/70 border-purple-400/50 text-gray-900 hover:border-purple-500/70 hover:bg-white/80 hover:shadow-purple-400/20'  // Improved opacity and border contrast
  }`;
};

export const getNavLinkClasses = (isDark: boolean) => 
  `transition-colors duration-200 ${
    isDark 
      ? 'text-gray-300 hover:text-purple-300' 
      : 'text-gray-800 hover:text-purple-700'  // Improved from gray-700 to gray-800 and purple-600 to purple-700
  }`;

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // Account for fixed header height (approximately 80px)
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - 80;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
