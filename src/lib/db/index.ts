import { drizzle } from 'drizzle-orm/neon-http'
import { neon, neonConfig } from '@neondatabase/serverless'
import * as schema from './schema'

// Configure connection pooling for production
neonConfig.fetchConnectionCache = true

// Validate database URL
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required in production')
  }
  console.warn('⚠️  DATABASE_URL not found - using dummy connection for development')
}

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
