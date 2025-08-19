import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Trophy, Star, CheckCircle, Circle, Code, FileText, Lightbulb, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCardClasses, getTextClasses } from '../utils/styles';
import { courseModules } from '../data/courses';

interface ContentModuleProps {
  title: string;
  description: string;
  duration: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

const ContentModule: React.FC<ContentModuleProps> = memo(({ 
  title, 
  description, 
  duration, 
  isCompleted = false, 
  isActive = false,
  onClick 
}) => {
  const { isDark } = useTheme();

  const cardClasses = useMemo(() => {
    if (isActive) {
      return isDark 
        ? 'border-purple-400/80 bg-slate-900/80 shadow-lg shadow-purple-500/25'
        : 'border-purple-400/80 bg-white/80 shadow-lg shadow-purple-300/25';
    }
    return isDark
      ? 'border-purple-500/30 bg-slate-900/40 hover:border-purple-400/60 hover:bg-slate-900/60'
      : 'border-purple-300/30 bg-white/60 hover:border-purple-400/60 hover:bg-white/80';
  }, [isDark, isActive]);

  return (
    <div 
      className={`cursor-pointer transition-all duration-300 ${
        isActive ? 'transform scale-105' : 'hover:transform hover:scale-102'
      }`}
      onClick={onClick}
    >
      <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${cardClasses}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <Circle className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
            <h3 className={`text-lg font-bold ${getTextClasses(isDark, 'primary')}`}>
              {title}
            </h3>
          </div>
          <div className={`flex items-center space-x-1 text-sm ${getTextClasses(isDark, 'secondary')}`}>
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
        <p className={getTextClasses(isDark, 'secondary')}>
          {description}
        </p>
      </div>
    </div>
  );
});

ContentModule.displayName = 'ContentModule';

const CourseDetail: React.FC = memo(() => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleModuleClick = useCallback((index: number) => {
    setActiveModule(index);
  }, []);

  const handlePrevious = useCallback(() => {
    setActiveModule(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveModule(prev => Math.min(courseModules.length - 1, prev + 1));
  }, []);

  const currentModule = useMemo(() => courseModules[activeModule], [activeModule]);
  
  const cardClasses = useMemo(() => getCardClasses(isDark), [isDark]);
  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark]);
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={goBack}
            className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg backdrop-blur-sm ${
              isDark
                ? 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 hover:shadow-purple-500/20'
                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-gray-900 border border-purple-300/30 hover:border-purple-400/60 hover:shadow-purple-300/20'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${titleClasses}`}>
              Sentry Fundamentals
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`text-sm ${subtitleClasses}`}>4.9</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${subtitleClasses}`}>
                <Users className="w-4 h-4" />
                <span>12,500 students</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm ${subtitleClasses}`}>
                <Trophy className="w-4 h-4" />
                <span>Beginner</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Modules Sidebar */}
          <div className="lg:col-span-1">
            <div className={`backdrop-blur-sm border rounded-2xl p-6 ${
              isDark 
                ? 'bg-slate-900/40 border-purple-500/30'
                : 'bg-white/60 border-purple-300/30'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Content Modules
              </h2>
              <div className="space-y-4">
                {courseModules.map((module, index) => (
                  <ContentModule
                    key={index}
                    title={module.title}
                    description={module.description}
                    duration={module.duration}
                    isCompleted={module.isCompleted}
                    isActive={activeModule === index}
                    onClick={() => handleModuleClick(index)}
                  />
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-purple-500/20">
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Progress: 2 of 5 completed
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className={`backdrop-blur-sm border rounded-2xl p-8 ${
              isDark 
                ? 'bg-slate-900/40 border-purple-500/30'
                : 'bg-white/60 border-purple-300/30'
            }`}>
              {/* Video/Content Player */}
              <div className={`aspect-video rounded-xl mb-8 flex items-center justify-center ${
                isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'
              }`}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentModule.title}
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click to start this lesson
                  </p>
                </div>
              </div>

              {/* Module Content */}
              <div className="space-y-6">
                <div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {currentModule.title}
                  </h3>
                  <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentModule.description}
                  </p>
                </div>

                {/* Key Concepts */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-purple-500/30 bg-slate-800/30'
                    : 'border-purple-300/30 bg-purple-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Key Takeaways
                    </h4>
                  </div>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Logs are essential for understanding application behavior</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>They help you debug issues faster and more effectively</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Proper logging strategy prevents error cascading</span>
                    </li>
                  </ul>
                </div>

                {/* Code Example */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-purple-500/30 bg-slate-800/30'
                    : 'border-purple-300/30 bg-gray-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Code Example
                    </h4>
                  </div>
                  <div className={`rounded-lg p-4 font-mono text-sm ${
                    isDark ? 'bg-slate-900/50 text-green-400' : 'bg-white/50 text-green-600'
                  }`}>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>// Your DB queries time out &</div>
                    <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>// prevent error from transcending</div>
                    <br />
                    <div className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>try</div> {'{'}
                    <div className="ml-4">
                      <span className={`${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>await</span> db.query(sql);
                    </div>
                    {'}'} <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>catch</span> (error) {'{'}
                    <div className="ml-4">
                      Sentry.captureException(error);
                    </div>
                    {'}'}
                  </div>
                </div>

                {/* Real World Application */}
                <div className={`border rounded-xl p-6 ${
                  isDark 
                    ? 'border-orange-500/30 bg-orange-900/10'
                    : 'border-orange-300/30 bg-orange-50/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-orange-400" />
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Real World Application
                    </h4>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <strong>Case Study:</strong> Pull quote from high-profile customer about how proper error monitoring 
                    helped them reduce downtime by 80% and improve customer satisfaction scores.
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-purple-500/20">
                <button 
                  disabled={activeModule === 0}
                  onClick={handlePrevious}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeModule === 0
                      ? isDark 
                        ? 'bg-slate-800/30 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100/30 text-gray-400 cursor-not-allowed'
                      : isDark
                        ? 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Previous
                </button>
                <button 
                  disabled={activeModule === courseModules.length - 1}
                  onClick={handleNext}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeModule === courseModules.length - 1
                      ? isDark 
                        ? 'bg-slate-800/30 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100/30 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-400 text-white hover:from-purple-600 hover:to-pink-500 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30'
                  }`}
                >
                  Next Module
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseDetail.displayName = 'CourseDetail';

export default CourseDetail;