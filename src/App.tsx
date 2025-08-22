// Import mock data for demonstration (remove in production) - MUST BE FIRST
import './data/mockAIContent';
import { useMemo, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { getBackgroundStyle } from './utils/styles';
import Header from './components/Header';
import Hero from './components/Hero';
import LearningPaths from './components/LearningPaths';
import CourseGrid from './components/CourseGrid';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';
import CourseDetail from './components/CourseDetail';
import SiteBackgroundDemo from './components/SiteBackgroundDemo';
import { AdminDashboard } from './components/AdminDashboard';

// Home page wrapper component that handles page transitions
const HomePage = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if we're returning from a course detail page
    const scrollToSection = location.state?.scrollToSection;
    if (scrollToSection) {
      // Start with page hidden for smooth transition
      setIsVisible(false);
      
      // Small delay then fade in for smooth transition
      setTimeout(() => {
        setIsVisible(true);
        
        // If we need to scroll to courses section, do it after the page is visible
        if (scrollToSection === 'courses') {
          setTimeout(() => {
            const coursesSection = document.getElementById('courses');
            if (coursesSection) {
              coursesSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }
          }, 100); // Additional delay to ensure page is fully rendered
        }
      }, 50);
    } else {
      // Normal page load - show immediately
      setIsVisible(true);
    }
  }, [location.state]);

  return (
    <div 
      className={`transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Hero />
      <CourseGrid />
      <LearningPaths />
      <StatsSection />
      <Footer />
    </div>
  );
};

function App() {
  const { isDark } = useTheme();



  // Memoize background styles to prevent recalculation on every render
  const backgroundStyle = useMemo(() => getBackgroundStyle(isDark), [isDark]);

  // Memoize gradient classes for better performance
  const gradientClasses = useMemo(() => ({
    primary: isDark 
      ? 'bg-gradient-to-r from-purple-500/10 via-transparent to-violet-500/10' 
      : 'bg-gradient-to-r from-purple-200/20 via-transparent to-pink-200/20',
    accent1: isDark ? 'bg-purple-500/10' : 'bg-purple-300/20',
    accent2: isDark ? 'bg-violet-500/10' : 'bg-pink-300/20'
  }), [isDark]);



  return (
    <>
      {/* Header positioned outside main layout flow */}
      <Header />
      
      {/* Main content with background */}
      <div 
        className="min-h-screen relative"
        style={{
          ...backgroundStyle,
          contain: 'layout style paint'
        }}
      >
        {/* Animated background elements */}
        <div className={`absolute inset-0 ${gradientClasses.primary}`} style={{ pointerEvents: 'none' }} />
        <div 
          className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${gradientClasses.accent1}`}
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'auto',
            pointerEvents: 'none'
          }}
        />
        <div 
          className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl ${gradientClasses.accent2}`}
          style={{
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s',
            willChange: 'auto',
            pointerEvents: 'none'
          }}
        />
        
        {/* Content with top padding for header */}
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/demo/backgrounds" element={<SiteBackgroundDemo />} />
          </Routes>
        </div>
      </div>


    </>
  );
}

export default App;