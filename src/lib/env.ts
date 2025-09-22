/**
 * Environment variable validation and management
 * Ensures all required environment variables are present and properly typed
 */

import { z } from 'zod'

// Define environment variable schema
const envSchema = z.object({
  // App Environment
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  
  // Database Configuration
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  TEST_DATABASE_URL: z.string().url().optional(),
  STAGING_DATABASE_URL: z.string().url().optional(),
  
  // Database Pool Settings
  DB_POOL_MAX: z.coerce.number().min(1).max(50).default(10),
  DB_POOL_MIN: z.coerce.number().min(1).max(10).default(2),
  DB_POOL_IDLE_TIMEOUT: z.coerce.number().min(1000).max(300000).default(30000),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  
  // Migration Settings
  AUTO_MIGRATE: z.enum(['true', 'false']).default('false').transform(val => val === 'true'),
  SEED_DATABASE: z.enum(['true', 'false']).default('false').transform(val => val === 'true'),
  
  // Optional: AI Features
  OPENAI_API_KEY: z.string().optional(),
  
  // Optional: Analytics
  VERCEL_ANALYTICS_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  
  // Optional: Backup Configuration
  BACKUP_ENABLED: z.enum(['true', 'false']).default('false').transform(val => val === 'true'),
  BACKUP_SCHEDULE: z.string().default('0 2 * * *'), // Daily at 2 AM
  BACKUP_RETENTION_DAYS: z.coerce.number().min(1).max(365).default(30),
  
  // Optional: Feature Flags
  ENABLE_AI_FEATURES: z.enum(['true', 'false']).default('false').transform(val => val === 'true'),
  ENABLE_EXPERIMENTAL_FEATURES: z.enum(['true', 'false']).default('false').transform(val => val === 'true'),
  
  // Optional: Rate Limiting
  RATE_LIMIT_ENABLED: z.enum(['true', 'false']).default('true').transform(val => val === 'true'),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).max(1000).default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).max(3600000).default(900000), // 15 minutes
})

// Environment-specific validation
const getEnvironmentSpecificSchema = (nodeEnv: string) => {
  switch (nodeEnv) {
    case 'production':
      return envSchema.extend({
        DATABASE_URL: z.string().url().refine(
          url => url.includes('neon.tech') || url.includes('postgres://'),
          'Production DATABASE_URL should use a managed database service'
        ),
        NEXTAUTH_SECRET: z.string().min(64, 'Production NEXTAUTH_SECRET should be at least 64 characters'),
        AUTO_MIGRATE: z.literal(false, { 
          errorMap: () => ({ message: 'AUTO_MIGRATE should be false in production' })
        }),
      })
    
    case 'staging':
      return envSchema.extend({
        STAGING_DATABASE_URL: z.string().url(),
      })
    
    case 'test':
      return envSchema.extend({
        TEST_DATABASE_URL: z.string().url(),
        DATABASE_URL: z.string().url().optional(),
      }).transform(data => ({
        ...data,
        DATABASE_URL: data.TEST_DATABASE_URL || data.DATABASE_URL,
      }))
    
    default:
      return envSchema
  }
}

/**
 * Validate and parse environment variables
 */
function validateEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const schema = getEnvironmentSpecificSchema(nodeEnv)
  
  try {
    return schema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      )
      
      console.error('❌ Environment validation failed:')
      errorMessages.forEach(msg => console.error(`  - ${msg}`))
      
      // In development, show helpful suggestions
      if (nodeEnv === 'development') {
        console.error('\n💡 Suggestions:')
        if (!process.env.DATABASE_URL) {
          console.error('  - Create a Neon database at https://neon.tech')
          console.error('  - Copy .env.example to .env.local')
          console.error('  - Add your DATABASE_URL to .env.local')
        }
        if (!process.env.NEXTAUTH_SECRET) {
          console.error('  - Generate a secret: openssl rand -base64 32')
          console.error('  - Add NEXTAUTH_SECRET to .env.local')
        }
      }
      
      process.exit(1)
    }
    
    throw error
  }
}

// Lazy validation - only validate when accessed
let _env: ReturnType<typeof validateEnv> | null = null

export const env = new Proxy({} as ReturnType<typeof validateEnv>, {
  get(_target, prop) {
    if (!_env) {
      _env = validateEnv()
    }
    return _env[prop as keyof typeof _env]
  }
})

// Type-safe environment access
export type Environment = typeof env

/**
 * Get database URL for current environment
 */
export function getDatabaseUrl(): string {
  switch (env.NODE_ENV) {
    case 'test':
      return env.TEST_DATABASE_URL || env.DATABASE_URL || ''
    case 'staging':
      return env.STAGING_DATABASE_URL || env.DATABASE_URL || ''
    default:
      return env.DATABASE_URL || ''
  }
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof Pick<Environment, 'ENABLE_AI_FEATURES' | 'ENABLE_EXPERIMENTAL_FEATURES' | 'BACKUP_ENABLED' | 'RATE_LIMIT_ENABLED'>): boolean {
  return env[feature]
}

/**
 * Get rate limiting configuration
 */
export function getRateLimitConfig() {
  return {
    enabled: env.RATE_LIMIT_ENABLED,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  }
}

/**
 * Get database pool configuration
 */
export function getDatabasePoolConfig() {
  return {
    max: env.DB_POOL_MAX,
    min: env.DB_POOL_MIN,
    idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT,
  }
}

/**
 * Development helper: Print current environment configuration
 */
export function printEnvConfig() {
  if (env.NODE_ENV !== 'development') return
  
  console.log('🔧 Environment Configuration:')
  console.log(`   NODE_ENV: ${env.NODE_ENV}`)
  console.log(`   DATABASE_URL: ${env.DATABASE_URL ? env.DATABASE_URL.split('@')[0] + '@[REDACTED]' : 'NOT_SET'}`)
  console.log(`   Auto Migrate: ${env.AUTO_MIGRATE}`)
  console.log(`   Seed Database: ${env.SEED_DATABASE}`)
  console.log(`   AI Features: ${env.ENABLE_AI_FEATURES}`)
  console.log(`   Backup Enabled: ${env.BACKUP_ENABLED}`)
  console.log(`   Pool Config: ${env.DB_POOL_MIN}-${env.DB_POOL_MAX} connections`)
}