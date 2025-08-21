import React, { memo, useMemo } from 'react';
import { ArrowRight, User, Code, Server, Settings, Trophy, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useRole } from '../contexts/RoleContext';
import { getTextClasses } from '../utils/styles';

const UserInputForm: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedRole, setSelectedRole] = React.useState('');
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([]);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const { setUserRole } = useRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      setUserRole(selectedRole as any, selectedFeatures);
      console.log('Selected role:', selectedRole);
      console.log('Selected features:', selectedFeatures);
    }
  };

  const roleOptions = [
    {
      value: 'frontend',
      label: 'Frontend Developer',
      icon: <Code className="w-5 h-5" />,
      description: 'Build amazing user experiences'
    },
    {
      value: 'backend',
      label: 'Backend Engineer',
      icon: <Server className="w-5 h-5" />,
      description: 'Power the server-side magic'
    },
    {
      value: 'sre',
      label: 'SRE / DevOps / Infra',
      icon: <Settings className="w-5 h-5" />,
      description: 'Keep systems running smoothly'
    }
  ];

  const sentryFeatures = [
    { value: 'error-tracking', label: 'Error Tracking' },
    { value: 'performance-monitoring', label: 'Performance Monitoring' },
    { value: 'session-replay', label: 'Session Replay' },
    { value: 'profiling', label: 'Profiling' },
    { value: 'logging', label: 'Logging' },
    { value: 'user-feedback', label: 'User Feedback' },
    { value: 'cron-monitoring', label: 'Uptime Monitoring' },
    { value: 'ai-agent-monitoring', label: 'AI Agent Monitoring' },
    { value: 'mcp-monitoring', label: 'MCP monitoring' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3">
          <User className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-700'}`} />
          <span className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>I am a...</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {roleOptions.map((option) => (
            <div key={option.value} className="group cursor-pointer">
              <input
                type="radio"
                id={option.value}
                name="role"
                value={option.value}
                checked={selectedRole === option.value}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="sr-only"
              />
              <label
                htmlFor={option.value}
                className={`block backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                  selectedRole === option.value
                    ? isDark 
                      ? 'border-purple-400/80 bg-slate-900/80 shadow-lg shadow-purple-500/25'
                      : 'border-purple-500/80 bg-white/85 shadow-lg shadow-purple-400/25'  // Improved border and shadow contrast
                    : isDark
                      ? 'border-purple-500/30 bg-slate-900/40 hover:border-purple-400/60 hover:bg-slate-900/60 hover:shadow-purple-500/20'
                      : 'border-purple-400/40 bg-white/75 hover:border-purple-500/60 hover:bg-white/85 hover:shadow-purple-400/20'  // Improved border and background opacity
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${
                    selectedRole === option.value
                      ? 'bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30'
                      : 'bg-gradient-to-r from-purple-400/20 to-violet-500/20 group-hover:from-purple-400/30 group-hover:to-violet-500/30'
                  }`}>
                    <div className={`transition-colors duration-300 ${
                      selectedRole === option.value ? 'text-white' : 'text-purple-400 group-hover:text-purple-300'
                    }`}>
                      {option.icon}
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                    selectedRole === option.value 
                      ? isDark ? 'text-purple-300' : 'text-purple-700'  // Improved from purple-600 to purple-700
                      : isDark 
                        ? 'text-white group-hover:text-purple-300' 
                        : 'text-gray-900 group-hover:text-purple-700'   // Improved from purple-600 to purple-700
                  }`}>
                    {option.label}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    {option.description}
                  </p>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h3 className={`text-xl font-bold mb-6 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            I currently use these Sentry features...
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sentryFeatures.map((feature) => (
              <div key={feature.value} className="group">
                <label className={`flex items-center space-x-3 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900/40 border-purple-500/30 hover:border-purple-400/60 hover:bg-slate-900/60'
                    : 'bg-white/75 border-purple-400/40 hover:border-purple-500/60 hover:bg-white/85'  // Improved opacity and border contrast
                }`}>
                  <input
                    type="checkbox"
                    value={feature.value}
                    checked={selectedFeatures.includes(feature.value)}
                    onChange={() => handleFeatureChange(feature.value)}
                    className={`w-4 h-4 text-purple-500 rounded focus:ring-purple-400 focus:ring-2 focus:ring-offset-0 accent-purple-500 ${
                      isDark 
                        ? 'bg-slate-900/60 border-purple-500/50' 
                        : 'bg-white border-purple-400/60'  // Improved border contrast from purple-300/50 to purple-400/60
                    }`}
                  />
                  <span className={`transition-colors duration-300 ${
                    isDark 
                      ? 'text-gray-300 group-hover:text-purple-300' 
                      : 'text-gray-800 group-hover:text-purple-700'  // Improved from gray-700 to gray-800 and purple-600 to purple-700
                  }`}>
                    {feature.label}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={!selectedRole}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-purple-500 disabled:hover:to-violet-600 inline-flex items-center space-x-2"
          >
            <span>Get My Personalized Path</span>
            <ArrowRight className={`w-5 h-5 transition-transform duration-200 ${isHovered && selectedRole ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </form>
    </div>
  );
};

const NextStepsDisplay: React.FC = () => {
  const { isDark } = useTheme();
  const { getNextRecommendation, userProgress, resetProgress } = useRole();
  const navigate = useNavigate();
  
  const nextRecommendation = getNextRecommendation();
  
  const handleStartCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleReset = () => {
    resetProgress();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {nextRecommendation ? (
        <div className={`backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 ${
          isDark 
            ? 'bg-slate-900/60 border-emerald-500/40'
            : 'bg-white/60 border-emerald-300/40'
        }`}>
          <div className="text-center">
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🎯 Start Here: {nextRecommendation.moduleId}
            </h3>
            <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {nextRecommendation.reasoning}
            </p>
            <div className="mb-6">
              <span className="inline-block bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-sm px-4 py-2 rounded-full">
                ⏱️ {nextRecommendation.timeEstimate}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={() => handleStartCourse(nextRecommendation.moduleId)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/30 inline-flex items-center space-x-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleReset}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2 ${
                  isDark
                    ? 'bg-slate-700/60 text-gray-300 hover:bg-slate-600/80 border border-slate-600/50'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/90 border border-gray-300/50'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`backdrop-blur-sm border rounded-2xl p-8 text-center ${
          isDark 
            ? 'bg-slate-900/60 border-green-500/40'
            : 'bg-white/60 border-green-300/40'
        }`}>
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🎉 All Caught Up!
          </h3>
          <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            You've completed your {userProgress.role} learning path. Great job!
          </p>
          <button
            onClick={handleReset}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 inline-flex items-center space-x-2 ${
              isDark
                ? 'bg-slate-700/60 text-gray-300 hover:bg-slate-600/80 border border-slate-600/50'
                : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/90 border border-gray-300/50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Another Path</span>
          </button>
        </div>
      )}
    </div>
  );
};

const LearningPaths: React.FC = memo(() => {
  const { isDark } = useTheme();
  const { userProgress, getNextRecommendation } = useRole();

  const titleClasses = useMemo(() => getTextClasses(isDark, 'primary'), [isDark]);
  const subtitleClasses = useMemo(() => getTextClasses(isDark, 'secondary'), [isDark]);

  return (
    <section id="paths" className="py-20 lg:py-32 relative">
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-transparent via-purple-900/10 to-transparent' 
          : 'bg-gradient-to-b from-transparent via-purple-200/20 to-transparent'
      }`}></div>
      <div className={`absolute top-1/2 left-0 w-72 h-72 rounded-full blur-3xl ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-300/20'
      }`}></div>
      <div className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl ${
        isDark ? 'bg-violet-500/10' : 'bg-pink-300/20'
      }`}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${titleClasses}`}>
            {userProgress.role ? 'Your' : 'Choose Your'}{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learning Path
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${subtitleClasses}`}>
            {userProgress.role 
              ? `Great! You're set up as a ${userProgress.role} engineer. Here's what we recommend next.`
              : 'Every expert started somewhere. Pick the path that matches your current experience and let us guide you to Sentry mastery.'
            }
          </p>
        </div>

        {userProgress.role ? <NextStepsDisplay /> : <UserInputForm />}
      </div>
    </section>
  );
});

LearningPaths.displayName = 'LearningPaths';

export default LearningPaths;