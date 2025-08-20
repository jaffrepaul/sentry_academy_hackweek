import React, { memo, useMemo } from 'react';
import { ArrowRight, User, UserCog, Code, Globe, Rocket, Target, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useRole } from '../contexts/RoleContext';
import { useNextContent } from '../hooks/useNextContent';
import { getRoleById } from '../data/roles';
import { getTextClasses, scrollToSection } from '../utils/styles';

const Hero: React.FC = memo(() => {
  const { isDark } = useTheme();
  const { userProgress, currentLearningPath } = useRole();
  const { nextRecommendation, progressPercentage } = useNextContent();
  const navigate = useNavigate();

  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark]);
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark]);
  const accentClasses = useMemo(() => getTextClasses(isDark, 'accent'), [isDark]);

  const roleInfo = userProgress.role ? getRoleById(userProgress.role) : null;
  const hasRole = !!userProgress.role;

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-500/15 to-violet-500/15' 
          : 'bg-gradient-to-r from-purple-200/30 to-pink-200/30'
      }`}></div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse ${
        isDark ? 'bg-purple-500/30' : 'bg-purple-300/40'
      }`}></div>
      <div className={`absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-2xl animate-pulse delay-500 ${
        isDark ? 'bg-violet-500/20' : 'bg-pink-300/30'
      }`}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${titleClasses}`}>
            {hasRole ? (
              <>
                Master{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {roleInfo?.title}
                </span>
                <br />
                Observability
              </>
            ) : (
              <>
                Master{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Application Observability
                </span>
                <br />
                with Sentry
              </>
            )}
          </h1>
          
          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${subtitleClasses}`}>
            {hasRole ? (
              `Personalized learning path for ${roleInfo?.title}s. Master Sentry's observability tools with content tailored specifically to your role and responsibilities.`
            ) : (
              'Interactive learning platform designed to help developers master Sentry\'s powerful observability tools through hands-on experience and personalized learning paths.'
            )}
          </p>

          {/* Role-Aware Content */}
          {hasRole ? (
            /* Personalized Path Cards */
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {/* Current Progress Card */}
              <div className="group cursor-pointer" onClick={() => navigate('/my-path')}>
                <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-slate-900/60 border-purple-500/40 hover:border-purple-400/70 hover:bg-slate-900/80 hover:shadow-purple-500/30'
                    : 'bg-white/60 border-purple-300/40 hover:border-purple-400/70 hover:bg-white/80 hover:shadow-purple-300/30'
                }`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${titleClasses}`}>
                    Your {roleInfo?.title} Path
                  </h3>
                  <p className={`mb-4 leading-relaxed ${subtitleClasses}`}>
                    {currentLearningPath?.description}
                  </p>
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={subtitleClasses}>Progress</span>
                      <span className={accentClasses}>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                    Continue Path <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Next Recommendation Card */}
              {nextRecommendation ? (
                <div className="group cursor-pointer" onClick={() => navigate(`/course/${nextRecommendation.moduleId}`)}>
                  <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    isDark 
                      ? 'bg-slate-900/60 border-emerald-500/40 hover:border-emerald-400/70 hover:bg-slate-900/80 hover:shadow-emerald-500/30'
                      : 'bg-white/60 border-emerald-300/40 hover:border-emerald-400/70 hover:bg-white/80 hover:shadow-emerald-300/30'
                  }`}>
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${titleClasses}`}>
                      Recommended Next
                    </h3>
                    <p className={`mb-4 leading-relaxed ${subtitleClasses}`}>
                      {nextRecommendation.reasoning}
                    </p>
                    <div className="mb-6">
                      <span className="inline-block bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-xs px-3 py-1 rounded-full">
                        {nextRecommendation.timeEstimate}
                      </span>
                    </div>
                    <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                      Start Learning <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="group">
                  <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-900/60 border-green-500/40'
                      : 'bg-white/60 border-green-300/40'
                  }`}>
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${titleClasses}`}>
                      Path Complete! 🎉
                    </h3>
                    <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
                      Congratulations! You've mastered the {roleInfo?.title} fundamentals. Explore advanced topics or help others learn.
                    </p>
                    <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                      Explore More <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Generic Path Selection Cards for users without roles */
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              <div className="group cursor-pointer" onClick={() => scrollToSection('courses')}>
                <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-slate-900/60 border-purple-500/40 hover:border-purple-400/70 hover:bg-slate-900/80 hover:shadow-purple-500/30'
                    : 'bg-white/60 border-purple-300/40 hover:border-purple-400/70 hover:bg-white/80 hover:shadow-purple-300/30'
                }`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${titleClasses}`}>
                    New to Sentry
                  </h3>
                  <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
                    Start from the basics. Learn what Sentry is, how to set it up, and why error monitoring matters for your applications.
                  </p>
                  <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                    Start Learning <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer" onClick={() => scrollToSection('paths')}>
                <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                  isDark 
                    ? 'bg-slate-900/60 border-purple-500/40 hover:border-purple-400/70 hover:bg-slate-900/80 hover:shadow-purple-500/30'
                    : 'bg-white/60 border-purple-300/40 hover:border-purple-400/70 hover:bg-white/80 hover:shadow-purple-300/30'
                }`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                    <UserCog className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${titleClasses}`}>
                    Sentry Pro
                  </h3>
                  <p className={`mb-6 leading-relaxed ${subtitleClasses}`}>
                    Already using Sentry? Level up with advanced features, performance monitoring, and enterprise-grade workflows.
                  </p>
                  <div className={`inline-flex items-center transition-colors ${accentClasses}`}>
                    Advanced Courses <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Highlights */}
          <div className={`flex flex-wrap justify-center items-center gap-8 ${subtitleClasses}`}>
            <div className="flex items-center space-x-2">
              <Code className={`w-5 h-5 ${accentClasses}`} />
              <span>Hands-on Labs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className={`w-5 h-5 ${accentClasses}`} />
              <span>Real-world Scenarios</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className={`w-5 h-5 ${accentClasses}`} />
              <span>Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;