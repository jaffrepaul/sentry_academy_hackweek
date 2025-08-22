import React, { useState, useEffect } from 'react';
import { 
  AIGeneratedCourse, 
  GenerationStatus,
  BulkOperation
} from '../types/aiGeneration';
import { EngineerRole } from '../types/roles';
import { aiGeneratedCoursesStore, getGenerationProgress } from '../data/aiGeneratedCourses';

interface AIContentManagerProps {
  onCourseSelect: (course: AIGeneratedCourse) => void;
  onDataChange: () => void;
}

type FilterStatus = 'all' | GenerationStatus;
type SortBy = 'date' | 'quality' | 'title' | 'status';
type ViewMode = 'grid' | 'list';

interface FilterOptions {
  status: FilterStatus;
  role: EngineerRole | 'all';
  search: string;
  sortBy: SortBy;
  sortOrder: 'asc' | 'desc';
}

export const AIContentManager: React.FC<AIContentManagerProps> = ({
  onCourseSelect,
  onDataChange
}) => {
  const [courses, setCourses] = useState<AIGeneratedCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<AIGeneratedCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkOperationInProgress, setBulkOperationInProgress] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    role: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);



  // Apply filters and sorting
  useEffect(() => {
    applyFiltersAndSort();
  }, [courses, filters]);

  const loadCourses = () => {
    const allCourses = aiGeneratedCoursesStore.getAllCourses();

    setCourses(allCourses);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...courses];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(course => {
        const progress = getGenerationProgress(course.generationRequest.id);
        return progress?.status === filters.status;
      });
    }

    // Role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(course =>
        course.generationRequest.targetRoles.includes(filters.role as EngineerRole)
      );
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.generationRequest.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchLower)
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = a.generatedAt.getTime() - b.generatedAt.getTime();
          break;
        case 'quality':
          comparison = a.qualityScore - b.qualityScore;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status': {
          const statusA = getGenerationProgress(a.generationRequest.id)?.status || '';
          const statusB = getGenerationProgress(b.generationRequest.id)?.status || '';
          comparison = statusA.localeCompare(statusB);
          break;
        }
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredCourses(filtered);
  };

  const getStatusInfo = (course: AIGeneratedCourse) => {
    const progress = getGenerationProgress(course.generationRequest.id);
    if (!progress) return { status: 'unknown', color: 'bg-gray-100 text-gray-600' };

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

    return {
      status: progress.status,
      color: colors[progress.status] || 'bg-gray-100 text-gray-600'
    };
  };

  const handleCourseSelection = (courseId: string, selected: boolean) => {
    const newSelection = new Set(selectedCourses);
    if (selected) {
      newSelection.add(courseId);
    } else {
      newSelection.delete(courseId);
    }
    setSelectedCourses(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCourses(new Set(filteredCourses.map(c => c.id)));
    } else {
      setSelectedCourses(new Set());
    }
    setShowBulkActions(selected && filteredCourses.length > 0);
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete' | 'archive') => {
    if (selectedCourses.size === 0) return;

    setBulkOperationInProgress(true);

    try {
      const selectedIds = Array.from(selectedCourses);
      
      // Create bulk operation record
      const bulkOp: BulkOperation = {
        id: `bulk-${Date.now()}`,
        type: action,
        courseIds: selectedIds,
        status: 'processing',
        progress: 0,
        results: [],
        createdAt: new Date()
      };

      aiGeneratedCoursesStore.addBulkOperation(bulkOp);

      // Process each course
      for (let i = 0; i < selectedIds.length; i++) {
        const courseId = selectedIds[i];
        const course = aiGeneratedCoursesStore.getCourse(courseId);
        
        if (course) {
          try {
            switch (action) {
              case 'approve':
                aiGeneratedCoursesStore.updateCourse(courseId, {
                  approvedAt: new Date(),
                  approvedBy: 'admin'
                });
                break;
              case 'reject':
                aiGeneratedCoursesStore.updateCourse(courseId, {
                  reviewNotes: `Bulk rejected at ${new Date().toISOString()}`
                });
                break;
              case 'delete':
                aiGeneratedCoursesStore.deleteCourse(courseId);
                break;
              case 'archive':
                // In a real implementation, this would set an archived flag
                aiGeneratedCoursesStore.updateCourse(courseId, {
                  reviewNotes: 'Archived'
                });
                break;
            }

            bulkOp.results.push({ courseId, success: true });
          } catch (error) {
            bulkOp.results.push({ 
              courseId, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
          }
        }

        // Update progress
        const progress = ((i + 1) / selectedIds.length) * 100;
        aiGeneratedCoursesStore.updateBulkOperation(bulkOp.id, { progress });
      }

      // Complete operation
      aiGeneratedCoursesStore.updateBulkOperation(bulkOp.id, {
        status: 'completed',
        completedAt: new Date()
      });

      // Refresh data
      loadCourses();
      onDataChange();
      setSelectedCourses(new Set());
      setShowBulkActions(false);

    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setBulkOperationInProgress(false);
    }
  };

  const renderFilters = () => (
    <div className="bg-white p-4 border-b">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as FilterStatus }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="researching">Researching</option>
          <option value="generating">Generating</option>
          <option value="review-needed">Review Needed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="published">Published</option>
          <option value="error">Error</option>
        </select>

        {/* Role Filter */}
        <select
          value={filters.role}
          onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as EngineerRole | 'all' }))}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="fullstack">Full-stack</option>
          <option value="sre">SRE/DevOps</option>
          <option value="ai-ml">AI/ML</option>
          <option value="pm-manager">PM/Manager</option>
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilters(prev => ({ 
              ...prev, 
              sortBy: sortBy as SortBy, 
              sortOrder: sortOrder as 'asc' | 'desc' 
            }));
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="quality-desc">Highest Quality</option>
          <option value="quality-asc">Lowest Quality</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="status-asc">Status A-Z</option>
        </select>

        {/* View Mode */}
        <div className="flex border rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            🔲 Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm border-l transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            📋 List
          </button>
        </div>
      </div>
    </div>
  );

  const renderBulkActions = () => (
    showBulkActions && (
      <div className="bg-blue-50 border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-800">
              {selectedCourses.size} course{selectedCourses.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => handleSelectAll(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkAction('approve')}
              disabled={bulkOperationInProgress}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              disabled={bulkOperationInProgress}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              ❌ Reject
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              disabled={bulkOperationInProgress}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50"
            >
              📦 Archive
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={bulkOperationInProgress}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    )
  );

  const renderCourseCard = (course: AIGeneratedCourse) => {
    const statusInfo = getStatusInfo(course);
    const isSelected = selectedCourses.has(course.id);

    return (
      <div
        key={course.id}
        className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-400'
        }`}
        onClick={(e) => {
          e.preventDefault();
          onCourseSelect(course);
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                handleCourseSelection(course.id, e.target.checked);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            course.qualityScore >= 0.8 ? 'bg-green-100 text-green-700' :
            course.qualityScore >= 0.6 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {(course.qualityScore * 100).toFixed(0)}%
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{course.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {course.generationRequest.keywords.slice(0, 3).map(keyword => (
            <span key={keyword} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {keyword}
            </span>
          ))}
          {course.generationRequest.keywords.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{course.generationRequest.keywords.length - 3}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex space-x-3">
            <span>⏱️ {course.duration}</span>
            <span>📚 {course.generatedModules.length} modules</span>
          </div>
          <span>{course.generatedAt.toLocaleDateString()}</span>
        </div>

        <div className="flex space-x-2 mt-3">
          {course.generationRequest.targetRoles.map(role => (
            <span key={role} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {role}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderCourseRow = (course: AIGeneratedCourse) => {
    const statusInfo = getStatusInfo(course);
    const isSelected = selectedCourses.has(course.id);

    return (
      <tr
        key={course.id}
        className={`cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={(e) => {
          e.preventDefault();
          onCourseSelect(course);
        }}
      >
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              handleCourseSelection(course.id, e.target.checked);
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="font-medium text-gray-900">{course.title}</p>
            <p className="text-sm text-gray-600 truncate max-w-96">{course.description}</p>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.status}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className={`px-2 py-1 rounded text-xs font-medium text-center ${
            course.qualityScore >= 0.8 ? 'bg-green-100 text-green-700' :
            course.qualityScore >= 0.6 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {(course.qualityScore * 100).toFixed(0)}%
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{course.duration}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{course.generatedModules.length}</td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {course.generatedAt.toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {course.generationRequest.targetRoles.slice(0, 2).map(role => (
              <span key={role} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {role}
              </span>
            ))}
            {course.generationRequest.targetRoles.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{course.generationRequest.targetRoles.length - 2}
              </span>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    if (filteredCourses.length === 0) {
      return (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📚</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            {courses.length === 0 
              ? 'No AI-generated courses yet. Create your first course to get started.'
              : 'Try adjusting your filters to see more results.'
            }
          </p>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredCourses.map(renderCourseCard)}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedCourses.size === filteredCourses.length && filteredCourses.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Course</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quality</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modules</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Roles</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map(renderCourseRow)}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Content Manager</h2>
            <p className="text-gray-600 mt-1">
              {filteredCourses.length} of {courses.length} courses
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {renderFilters()}

      {/* Bulk Actions */}
      {renderBulkActions()}

      {/* Content */}
      {renderContent()}

      {/* Bulk Operation Progress */}
      {bulkOperationInProgress && (
        <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-4 max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Processing bulk operation...</p>
              <p className="text-xs text-gray-600">This may take a few moments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};