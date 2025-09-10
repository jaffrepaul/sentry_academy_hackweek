import React, { useState, useEffect } from 'react';
import { 
  AIGeneratedCourse, 
  GenerationStatus
} from '@/types/aiGeneration';
import { 
  getGenerationStats, 
  aiGeneratedCoursesStore 
} from '@/data/aiGeneratedCourses';
import { ContentGenerationForm } from '@/components/ContentGenerationForm';
import { GeneratedContentPreview } from '@/components/GeneratedContentPreview';
import { AIContentManager } from '@/components/AIContentManager';
import { useTheme } from '@/contexts/ThemeContext';
import { getBackgroundStyle, getCardClasses, getTextClasses, getButtonClasses } from '@/utils/styles';
import Header from '@/components/Header';

interface AdminDashboardProps {
  onClose?: () => void;
}

type DashboardView = 'overview' | 'generate' | 'manage' | 'settings';

interface DashboardStats {
  totalRequests: number;
  totalCourses: number;
  approvedCourses: number;
  pendingApprovals: number;
  statusCounts: Record<string, number>;
  roleDistribution: Record<string, number>;
  averageQualityScore: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCourses, setRecentCourses] = useState<AIGeneratedCourse[]>([]);
  const [activeGenerations, setActiveGenerations] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<AIGeneratedCourse | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [refreshTrigger]);

  const loadDashboardData = () => {
    try {
      const dashboardStats = getGenerationStats();
      setStats(dashboardStats);

      const allCourses = aiGeneratedCoursesStore.getAllCourses();
      const sortedCourses = allCourses
        .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
        .slice(0, 10);
      setRecentCourses(sortedCourses);

      // Get active generations (courses with pending/in-progress status)
      const activeIds = allCourses
        .filter(course => {
          const progress = aiGeneratedCoursesStore.getGenerationProgress(course.generationRequest.id);
          return progress && ['pending', 'researching', 'generating'].includes(progress.status);
        })
        .map(course => course.id);
      setActiveGenerations(activeIds);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const refreshData = () => {
    console.log('AdminDashboard: refreshData called');
    setRefreshTrigger(prev => prev + 1);
  };

  const getStatusColor = (status: GenerationStatus): string => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'researching': 'bg-blue-100 text-blue-800',
      'generating': 'bg-purple-100 text-purple-800',
      'review-needed': 'bg-orange-100 text-orange-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'published': 'bg-emerald-100 text-emerald-800',
      'error': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${getTextClasses(isDark, 'primary')}`}>AI Content Generation</h1>
          <p className={`mt-1 ${getTextClasses(isDark, 'secondary')}`}>Manage AI-generated course content and workflows</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Refresh clicked');
              refreshData();
            }}
            className={`px-4 py-2 text-sm rounded-lg font-medium ${getButtonClasses(isDark, 'secondary')}`}
          >
            🔄 Refresh
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Generate clicked');
              setCurrentView('generate');
            }}
            className={`px-4 py-2 rounded-lg font-medium ${getButtonClasses(isDark, 'primary')}`}
          >
            ✨ Generate New Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${getCardClasses(isDark)} p-6`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses(isDark, 'secondary')}`}>Total Requests</p>
                <p className={`text-2xl font-bold ${getTextClasses(isDark, 'primary')}`}>{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className={`${getCardClasses(isDark)} p-6`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses(isDark, 'secondary')}`}>Approved Courses</p>
                <p className={`text-2xl font-bold ${getTextClasses(isDark, 'primary')}`}>{stats.approvedCourses}</p>
              </div>
            </div>
          </div>

          <div className={`${getCardClasses(isDark)} p-6`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses(isDark, 'secondary')}`}>Pending Review</p>
                <p className={`text-2xl font-bold ${getTextClasses(isDark, 'primary')}`}>{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>

          <div className={`${getCardClasses(isDark)} p-6`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${getTextClasses(isDark, 'secondary')}`}>Avg Quality</p>
                <p className={`text-2xl font-bold ${getTextClasses(isDark, 'primary')}`}>
                  {(stats.averageQualityScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Generations */}
      {activeGenerations.length > 0 && (
        <div className={`${getCardClasses(isDark, false)} p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${getTextClasses(isDark, 'primary')}`}>Active Generations</h2>
          <div className="space-y-3">
            {activeGenerations.slice(0, 5).map(courseId => {
              const course = aiGeneratedCoursesStore.getCourse(courseId);
              const progress = course ? aiGeneratedCoursesStore.getGenerationProgress(course.generationRequest.id) : null;
              
              if (!course || !progress) return null;

              return (
                <div key={courseId} className={`flex items-center justify-between p-3 rounded-lg border ${
                  isDark 
                    ? 'border-slate-700/50 bg-slate-800/30' 
                    : 'border-gray-200 bg-gray-50/50'
                }`}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progress.status)}`}>
                        {progress.status}
                      </span>
                      <span className={`font-medium ${getTextClasses(isDark, 'primary')}`}>
                        {course.generationRequest.keywords.join(', ')}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${getTextClasses(isDark, 'secondary')}`}>{progress.currentStep}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-32 rounded-full h-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${isDark ? 'bg-purple-500' : 'bg-blue-600'}`}
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm w-12 ${getTextClasses(isDark, 'secondary')}`}>{progress.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Courses */}
      <div className={`${getCardClasses(isDark, false)} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${getTextClasses(isDark, 'primary')}`}>Recent Courses</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('View All clicked');
              setCurrentView('manage');
            }}
            className={`text-sm font-medium transition-colors ${
              isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            View All →
          </button>
        </div>
        
        {recentCourses.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">📚</span>
            <p className={getTextClasses(isDark, 'secondary')}>No courses generated yet</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Generate first course clicked');
                setCurrentView('generate');
              }}
              className={`mt-2 font-medium transition-colors ${
                isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              Generate your first course
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCourses.slice(0, 5).map(course => {
              const progress = aiGeneratedCoursesStore.getGenerationProgress(course.generationRequest.id);
              
              return (
                <div 
                  key={course.id} 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border ${
                    isDark 
                      ? 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/30' 
                      : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCourse(course);
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        progress ? getStatusColor(progress.status) : 'bg-gray-100 text-gray-600'
                      }`}>
                        {progress?.status || 'unknown'}
                      </span>
                      <span className={`font-medium ${getTextClasses(isDark, 'primary')}`}>{course.title}</span>
                    </div>
                    <p className={`text-sm mt-1 ${getTextClasses(isDark, 'secondary')}`}>{course.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${getTextClasses(isDark, 'secondary')}`}>
                      Quality: {(course.qualityScore * 100).toFixed(0)}%
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
                      {course.generatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderNavigation = () => (
    <nav className={`border-b mb-6 ${
      isDark 
        ? 'border-purple-500/30 bg-slate-950/50' 
        : 'border-purple-300/30 bg-white/50'
    } backdrop-blur-sm`}>
      <div className="flex space-x-8">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'generate', label: 'Generate', icon: '✨' },
          { id: 'manage', label: 'Manage', icon: '📚' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Navigation clicked:', tab.id);
              setCurrentView(tab.id as DashboardView);
            }}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === tab.id
                ? `${isDark ? 'border-purple-400 text-purple-400' : 'border-purple-500 text-purple-600'}`
                : `border-transparent ${getTextClasses(isDark, 'secondary')} hover:${getTextClasses(isDark, 'primary')} ${
                    isDark ? 'hover:border-purple-500/50' : 'hover:border-purple-300'
                  }`
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'generate':
        return (
          <ContentGenerationForm
            onGenerationStarted={refreshData}
            onBack={() => setCurrentView('overview')}
          />
        );
      case 'manage':
        return (
          <AIContentManager
            onCourseSelect={setSelectedCourse}
            onDataChange={refreshData}
          />
        );
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  const renderSettings = () => (
    <div className={`${getCardClasses(isDark, false)} p-6`}>
      <h2 className={`text-lg font-semibold mb-4 ${getTextClasses(isDark, 'primary')}`}>AI Generation Settings</h2>
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${getTextClasses(isDark, 'primary')}`}>
            OpenAI API Key
          </label>
          <input
            type="password"
            placeholder="sk-..."
            className={`w-full px-3 py-2 border rounded-lg transition-colors ${
              isDark
                ? 'border-slate-600 bg-slate-800/50 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
            }`}
          />
          <p className={`text-xs mt-1 ${getTextClasses(isDark, 'secondary')}`}>
            Required for AI content generation. Your key is stored securely.
          </p>
        </div>
        
        <div className={`text-sm ${getTextClasses(isDark, 'secondary')}`}>
          <p>Settings panel for future configuration options.</p>
          <p className="mt-2">Currently all course approvals require manual review.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen"
      style={getBackgroundStyle(isDark)}
    >
      <Header />
      
      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderNavigation()}
          {renderContent()}
        </div>
      </main>

      {/* Course Preview Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
          <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col ${
            isDark ? 'bg-slate-900' : 'bg-white'
          }`}>
            <GeneratedContentPreview
              course={selectedCourse}
              onClose={() => setSelectedCourse(null)}
              onApprove={() => {
                // Handle approval
                setSelectedCourse(null);
                refreshData();
              }}
              onReject={() => {
                // Handle rejection
                setSelectedCourse(null);
                refreshData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};