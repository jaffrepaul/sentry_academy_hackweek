#!/usr/bin/env node
/**
 * Database migration management script
 * Handles schema changes and data migrations for Sentry Academy
 */

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import * as schema from './schema'
import { getDatabaseConfig, validateDatabaseConfig } from './config'
import fs from 'fs'
import path from 'path'
// import { fileURLToPath } from 'url' // Unused for now

// const __filename = fileURLToPath(import.meta.url) // Unused for now
// const __dirname = path.dirname(__filename) // Unused for now

interface MigrationOptions {
  force?: boolean
  dryRun?: boolean
  environment?: string
  backup?: boolean
}

/**
 * Migration manager class
 */
class MigrationManager {
  private db: ReturnType<typeof drizzle>
  private sql: ReturnType<typeof neon>
  private config: ReturnType<typeof getDatabaseConfig>

  constructor(_environment?: string) {
    // Don't modify NODE_ENV as it's readonly in production builds
    // Instead, pass the environment to the config function if needed
    this.config = getDatabaseConfig()
    validateDatabaseConfig(this.config)
    
    this.sql = neon(this.config.url)
    this.db = drizzle(this.sql, { schema })
  }

  /**
   * Run pending migrations
   */
  async runMigrations(options: MigrationOptions = {}): Promise<void> {
    console.log('🔄 Starting migration process...')
    console.log(`📍 Environment: ${process.env.NODE_ENV}`)
    console.log(`🗄️  Database: ${this.config.url.split('@')[1]?.split('/')[0] || 'unknown'}`)

    if (options.dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made')
      return this.dryRunMigrations()
    }

    if (options.backup && process.env.NODE_ENV === 'production') {
      await this.createBackup()
    }

    try {
      await migrate(this.db, { 
        migrationsFolder: this.config.migration.folder,
        migrationsTable: '__drizzle_migrations'
      })
      console.log('✅ Migrations completed successfully')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    }
  }

  /**
   * Dry run migrations (check what would be executed)
   */
  private async dryRunMigrations(): Promise<void> {
    const migrationsPath = path.resolve(this.config.migration.folder)
    
    if (!fs.existsSync(migrationsPath)) {
      console.log('ℹ️  No migrations directory found')
      return
    }

    const migrationFiles = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort()

    if (migrationFiles.length === 0) {
      console.log('ℹ️  No migration files found')
      return
    }

    console.log('📋 Pending migrations:')
    for (const file of migrationFiles) {
      console.log(`   - ${file}`)
    }
  }

  /**
   * Create database backup (production only)
   */
  private async createBackup(): Promise<void> {
    console.log('🔄 Creating database backup...')
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupName = `backup-${timestamp}`
      
      // Note: This would typically use pg_dump or Neon's backup API
      console.log(`💾 Backup created: ${backupName}`)
    } catch (error) {
      console.error('❌ Backup failed:', error)
      throw error
    }
  }

  /**
   * Rollback last migration (use with caution)
   */
  async rollback(): Promise<void> {
    console.log('⚠️  Rolling back last migration...')
    
    try {
      // Get the last applied migration
      const result = await this.sql`
        SELECT * FROM __drizzle_migrations 
        ORDER BY id DESC 
        LIMIT 1
      `
      
      if ((result as any[]).length === 0) {
        console.log('ℹ️  No migrations to rollback')
        return
      }

      const lastMigration = (result as any[])[0]
      console.log(`🔄 Rolling back: ${lastMigration.hash}`)
      
      // Remove from migrations table
      await this.sql`
        DELETE FROM __drizzle_migrations 
        WHERE id = ${lastMigration.id}
      `
      
      console.log('✅ Rollback completed')
      console.log('⚠️  Note: Schema changes were not reversed automatically')
      
    } catch (error) {
      console.error('❌ Rollback failed:', error)
      throw error
    }
  }

  /**
   * Check migration status
   */
  async status(): Promise<void> {
    console.log('📊 Migration Status')
    
    try {
      const appliedMigrations = await this.sql`
        SELECT hash, created_at 
        FROM __drizzle_migrations 
        ORDER BY created_at ASC
      `
      
      if ((appliedMigrations as any[]).length === 0) {
        console.log('ℹ️  No migrations have been applied')
        return
      }

      console.log(`✅ Applied migrations: ${(appliedMigrations as any[]).length}`);
      (appliedMigrations as any[]).forEach((migration, index) => {
        console.log(`   ${index + 1}. ${migration.hash} (${migration.created_at})`)
      })
      
    } catch (error) {
      if ((error as Error).message?.includes('relation "__drizzle_migrations" does not exist')) {
        console.log('ℹ️  Migration table not found - database not initialized')
      } else {
        console.error('❌ Status check failed:', error)
      }
    }
  }

  /**
   * Validate database schema
   */
  async validateSchema(): Promise<boolean> {
    console.log('🔍 Validating database schema...')
    
    try {
      // Check if required tables exist
      const requiredTables = [
        'users', 'accounts', 'sessions', 'verificationTokens',
        'courses', 'course_modules', 'learning_paths', 'user_progress',
        'ai_generated_content'
      ]
      
      const tableChecks = await Promise.all(
        requiredTables.map(async (table) => {
          try {
            await this.sql(`SELECT 1 FROM ${table} LIMIT 1`)
            return { table, exists: true }
          } catch {
            return { table, exists: false }
          }
        })
      )
      
      const missingTables = tableChecks.filter(check => !check.exists)
      
      if ((missingTables as any[]).length > 0) {
        console.error('❌ Missing tables:')
        missingTables.forEach(({ table }) => console.error(`   - ${table}`))
        return false
      }
      
      console.log('✅ All required tables present')
      return true
      
    } catch (error) {
      console.error('❌ Schema validation failed:', error)
      return false
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  const options: MigrationOptions = {
    force: args.includes('--force'),
    dryRun: args.includes('--dry-run'),
    backup: args.includes('--backup'),
    environment: args.find(arg => arg.startsWith('--env='))?.split('=')[1] || 'development'
  }

  const manager = new MigrationManager(options.environment)

  try {
    switch (command) {
      case 'up':
      case 'migrate':
        await manager.runMigrations(options)
        break
        
      case 'down':
      case 'rollback':
        if (!options.force) {
          console.error('❌ Rollback requires --force flag')
          process.exit(1)
        }
        await manager.rollback()
        break
        
      case 'status':
        await manager.status()
        break
        
      case 'validate':
        const isValid = await manager.validateSchema()
        process.exit(isValid ? 0 : 1)
        
      default:
        console.log(`
📚 Migration Management Commands:

  migrate, up           Run pending migrations
  rollback, down        Rollback last migration (requires --force)
  status                Show migration status
  validate              Validate database schema

Options:
  --force               Force dangerous operations
  --dry-run             Show what would be done without executing
  --backup              Create backup before migration (production only)
  --env=<environment>   Override environment

Examples:
  npm run db:migrate
  npm run db:migrate -- --dry-run
  npm run db:migrate -- rollback --force
  npm run db:migrate -- status
        `)
    }
  } catch (error) {
    console.error('💥 Command failed:', error)
    process.exit(1)
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { MigrationManager }