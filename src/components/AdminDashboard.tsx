import React, { useState, useEffect } from 'react';
import { 
  AIGeneratedCourse, 
  GenerationStatus
} from '../types/aiGeneration';
import { 
  getGenerationStats, 
  aiGeneratedCoursesStore 
} from '../data/aiGeneratedCourses';
import { ContentGenerationForm } from './ContentGenerationForm';
import { GeneratedContentPreview } from './GeneratedContentPreview';
import { AIContentManager } from './AIContentManager';

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
      console.log('AdminDashboard: loadDashboardData called');
      const dashboardStats = getGenerationStats();
      setStats(dashboardStats);

      const allCourses = aiGeneratedCoursesStore.getAllCourses();
      console.log('AdminDashboard: Found courses:', allCourses.length);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Content Generation</h1>
          <p className="text-gray-600 mt-1">Manage AI-generated course content and workflows</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Refresh clicked');
              refreshData();
            }}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
          >
            ✨ Generate New Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Quality</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.averageQualityScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Generations */}
      {activeGenerations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Generations</h2>
          <div className="space-y-3">
            {activeGenerations.slice(0, 5).map(courseId => {
              const course = aiGeneratedCoursesStore.getCourse(courseId);
              const progress = course ? aiGeneratedCoursesStore.getGenerationProgress(course.generationRequest.id) : null;
              
              if (!course || !progress) return null;

              return (
                <div key={courseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progress.status)}`}>
                        {progress.status}
                      </span>
                      <span className="font-medium text-gray-900">
                        {course.generationRequest.keywords.join(', ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{progress.currentStep}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{progress.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Courses */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Courses</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('View All clicked');
              setCurrentView('manage');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
          >
            View All →
          </button>
        </div>
        
        {recentCourses.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">📚</span>
            <p className="text-gray-600">No courses generated yet</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Generate first course clicked');
                setCurrentView('generate');
              }}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
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
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
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
                      <span className="font-medium text-gray-900">{course.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Quality: {(course.qualityScore * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-400">
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
    <nav className="bg-white border-b border-gray-200 mb-6" style={{ position: 'relative', zIndex: 3 }}>
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
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={{ position: 'relative', zIndex: 4, pointerEvents: 'auto' }}
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
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Generation Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Required for AI content generation. Your key is stored securely.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality Threshold
          </label>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="70"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum quality score for auto-approval (70%)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Concurrent Generations
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
            <option value="1">1</option>
            <option value="3" selected>3</option>
            <option value="5">5</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b" style={{ position: 'relative', zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            {onClose && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                style={{ position: 'relative', zIndex: 10 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ position: 'relative', zIndex: 2 }}>
        {renderNavigation()}
        {renderContent()}
      </div>

      {/* Course Preview Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
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