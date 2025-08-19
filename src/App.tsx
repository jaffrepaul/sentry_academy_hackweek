import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import { getBackgroundStyle } from './utils/styles';
import Header from './components/Header';
import Hero from './components/Hero';
import LearningPaths from './components/LearningPaths';
import CourseGrid from './components/CourseGrid';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';
import CourseDetail from './components/CourseDetail';

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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Animated background elements */}
      <div className={`absolute inset-0 ${gradientClasses.primary}`} />
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${gradientClasses.accent1}`} />
      <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${gradientClasses.accent2}`} />
      <Header />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <CourseGrid />
              <LearningPaths />
              <StatsSection />
              <Footer />
            </>
          } />
          <Route path="/course/:courseId" element={<CourseDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;