import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'
import { loadEnvironmentIfNeeded, getOptionalEnv } from '../env-loader'

// Load environment variables if we're in a CLI context
loadEnvironmentIfNeeded()

// Get database URL with better error handling
const DATABASE_URL = getOptionalEnv('DATABASE_URL', '', (url) => {
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is required in production')
    }
    return 'postgresql://dummy:dummy@localhost:5432/dummy'
  }
  
  // Validate URL format
  try {
    new URL(url)
  } catch {
    throw new Error(`Invalid DATABASE_URL format: ${url}`)
  }
  
  return url
})

// Create Neon connection with pooling
const sql = neon(DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy', {
  // Connection pool configuration
  arrayMode: false,
  fullResults: false,
})

// Create Drizzle instance with schema
export const db = drizzle(sql, { 
  schema,
  logger: process.env.NODE_ENV === 'development' ? true : false
})

// Export types for easier imports
export type Database = typeof db
export * from './schema'

// Connection health check utility
export async function healthCheck(): Promise<{ status: string; timestamp: Date; database?: string }> {
  try {
    // Check if we have a valid DATABASE_URL first
    if (!DATABASE_URL || DATABASE_URL.includes('dummy')) {
      return {
        status: 'unhealthy',
        timestamp: new Date()
      }
    }
    
    const result = await sql`SELECT current_database() as db, now() as timestamp`
    return {
      status: 'healthy',
      timestamp: new Date(),
      database: result[0]?.db
    }
  } catch (error) {
    console.error('Database health check failed:', error)
    return {
      status: 'unhealthy',
      timestamp: new Date()
    }
  }
}
