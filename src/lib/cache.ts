/**
 * Cache configuration and utilities for App Router
 * 
 * This file contains cache configuration and utilities
 * to optimize data fetching and revalidation strategies.
 */

// Cache tags for selective revalidation
export const CACHE_TAGS = {
  courses: 'courses',
  course: 'course',
  modules: 'modules',
  learningPaths: 'learning-paths',
  stats: 'stats',
  concepts: 'concepts',
} as const

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  // Static content that rarely changes
  courses: 3600, // 1 hour
  learningPaths: 3600, // 1 hour
  concepts: 7200, // 2 hours
  
  // Dynamic content
  userProgress: 300, // 5 minutes
  stats: 1800, // 30 minutes
  
  // Admin content (no cache)
  admin: 0,
} as const

// Revalidation utilities
export function getCacheConfig(type: keyof typeof CACHE_DURATIONS) {
  return {
    revalidate: CACHE_DURATIONS[type],
    tags: [CACHE_TAGS[type as keyof typeof CACHE_TAGS]].filter(Boolean),
  }
}

// Helper for creating cache keys
export function createCacheKey(prefix: string, params: Record<string, any> = {}) {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return paramString ? `${prefix}?${paramString}` : prefix
}