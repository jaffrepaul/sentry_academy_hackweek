import React, { memo, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getNavLinkClasses, scrollToSection } from '../utils/styles';

const Header: React.FC = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Memoize style classes to prevent recalculation
  const headerClasses = useMemo(() => 
    `w-full border-b backdrop-blur-xl ${
      isDark 
        ? 'border-purple-500/30 bg-slate-950/90' 
        : 'border-purple-300/30 bg-white/90'
    }`, [isDark]
  );

  const navLinkClasses = useMemo(() => getNavLinkClasses(isDark), [isDark]);

  const themeButtonClasses = useMemo(() => 
    `p-2 rounded-lg transition-all duration-200 ${
      isDark
        ? 'bg-slate-800/50 hover:bg-slate-700/50 text-yellow-400'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'  // Improved from gray-700 to gray-800 for better contrast
    }`, [isDark]
  );

  const handleScrollToSection = useCallback((sectionId: string) => {
    setIsMenuOpen(false); // Close mobile menu after clicking
    
    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      // Use setTimeout to ensure the page has navigated before scrolling
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      // We're already on the homepage, just scroll
      scrollToSection(sectionId);
    }
  }, [location.pathname, navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      // If we're already on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  const handleAdminClick = useCallback(() => {
    setIsMenuOpen(false);
    navigate('/admin');
  }, [navigate]);

  return (
    <header 
      className={headerClasses} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <button onClick={handleLogoClick} className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              <img 
                src="/logos/sentry-logo.svg" 
                alt="Sentry Logo" 
                className="w-12 h-12"
                style={{ filter: isDark ? 'invert(1) brightness(1)' : 'brightness(0.1)' }}
              />
            </div>
            <div className="text-left">
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sentry Academy
              </h1>
              <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Master Application Observability
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleScrollToSection('courses')} 
              className={navLinkClasses}
              aria-label="Go to courses section"
            >
              Courses
            </button>
            <button 
              onClick={() => handleScrollToSection('paths')} 
              className={navLinkClasses}
              aria-label="Go to learning paths section"
            >
              Learning Paths
            </button>
            <a href="#concepts" className={navLinkClasses}>
              Concepts 101
            </a>
            <a href="#workshops" className={navLinkClasses}>
              Workshops
            </a>
            <button
              onClick={handleAdminClick}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark
                  ? 'bg-slate-800/50 hover:bg-slate-700/50 text-purple-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
              }`}
              aria-label="Access admin dashboard"
              title="Admin Dashboard"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className={themeButtonClasses}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25">
              Get Started
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden ${isDark ? 'text-white' : 'text-gray-900'}`}
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t backdrop-blur-xl ${
            isDark 
              ? 'border-purple-500/30 bg-slate-950/95' 
              : 'border-purple-300/30 bg-white/95'
          }`}>
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => handleScrollToSection('courses')} 
                className={`${navLinkClasses} text-left`}
              >
                Courses
              </button>
              <button 
                onClick={() => handleScrollToSection('paths')} 
                className={`${navLinkClasses} text-left`}
              >
                Learning Paths
              </button>
              <a href="#concepts" className={navLinkClasses}>
                Concepts 101
              </a>
              <a href="#workshops" className={navLinkClasses}>
                Workshops
              </a>
              <button
                onClick={handleAdminClick}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-700/50 text-purple-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Admin</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-700/50 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-lg font-medium mt-2 shadow-lg shadow-purple-500/25">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;