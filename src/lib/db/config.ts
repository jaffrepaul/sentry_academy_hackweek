/**
 * Environment-specific database configurations
 */

export interface DatabaseConfig {
  url: string
  pooling: {
    max: number
    min: number
    idleTimeoutMillis: number
  }
  ssl: boolean
  logging: boolean
  migration: {
    autoRun: boolean
    folder: string
  }
}

/**
 * Get database configuration based on environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  const environment = process.env.NODE_ENV || 'development'
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl && environment === 'production') {
    throw new Error('DATABASE_URL is required in production environment')
  }

  const baseConfig: DatabaseConfig = {
    url: databaseUrl || 'postgresql://dummy:dummy@localhost:5432/dummy',
    pooling: {
      max: 10,
      min: 2, 
      idleTimeoutMillis: 30000
    },
    ssl: true,
    logging: false,
    migration: {
      autoRun: false,
      folder: './src/lib/db/migrations'
    }
  }

  // Environment-specific overrides
  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        pooling: {
          max: 5,
          min: 1,
          idleTimeoutMillis: 10000
        },
        logging: true,
        ssl: false,
        migration: {
          autoRun: true,
          folder: './src/lib/db/migrations'
        }
      }

    case 'test':
      return {
        ...baseConfig,
        url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db',
        pooling: {
          max: 3,
          min: 1,
          idleTimeoutMillis: 5000
        },
        logging: false,
        ssl: false,
        migration: {
          autoRun: true,
          folder: './src/lib/db/migrations'
        }
      }

    case 'staging':
      return {
        ...baseConfig,
        pooling: {
          max: 8,
          min: 2,
          idleTimeoutMillis: 20000
        },
        logging: true,
        ssl: true,
        migration: {
          autoRun: false,
          folder: './src/lib/db/migrations'
        }
      }

    case 'production':
      return {
        ...baseConfig,
        pooling: {
          max: 20,
          min: 5,
          idleTimeoutMillis: 30000
        },
        logging: false,
        ssl: true,
        migration: {
          autoRun: false,
          folder: './src/lib/db/migrations'
        }
      }

    default:
      return baseConfig
  }
}

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(config: DatabaseConfig): void {
  if (!config.url) {
    throw new Error('Database URL is required')
  }

  if (config.pooling.max < config.pooling.min) {
    throw new Error('Pool max connections must be greater than min connections')
  }

  if (config.pooling.idleTimeoutMillis < 1000) {
    throw new Error('Idle timeout must be at least 1000ms')
  }
}

/**
 * Get connection string with appropriate options
 */
export function getConnectionString(config: DatabaseConfig): string {
  const url = new URL(config.url)
  
  // Add SSL mode if required
  if (config.ssl && !url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require')
  }
  
  // Add connection pooling parameters
  url.searchParams.set('pool_max_conns', config.pooling.max.toString())
  url.searchParams.set('pool_min_conns', config.pooling.min.toString())
  url.searchParams.set('pool_timeout', (config.pooling.idleTimeoutMillis / 1000).toString())
  
  return url.toString()
}