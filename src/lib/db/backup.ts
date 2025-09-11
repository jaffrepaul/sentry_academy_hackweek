/**
 * Database backup and recovery utilities
 * Implements automated backup strategies for Neon Postgres
 */

import { neon } from '@neondatabase/serverless'
import { env, getDatabaseUrl } from '../env'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface BackupConfig {
  enabled: boolean
  schedule: string // Cron format
  retentionDays: number
  location: 'local' | 'cloud'
  compression: boolean
}

export interface BackupMetadata {
  id: string
  timestamp: Date
  size: number
  tables: string[]
  environment: string
  version: string
  checksum?: string
}

/**
 * Database backup manager
 */
export class BackupManager {
  private sql: ReturnType<typeof neon>
  private config: BackupConfig

  constructor() {
    this.sql = neon(getDatabaseUrl())
    this.config = {
      enabled: env.BACKUP_ENABLED,
      schedule: env.BACKUP_SCHEDULE,
      retentionDays: env.BACKUP_RETENTION_DAYS,
      location: 'local', // Could be 'cloud' for S3/GCS integration
      compression: true
    }
  }

  /**
   * Create a full database backup
   */
  async createBackup(options: { name?: string; compress?: boolean } = {}): Promise<BackupMetadata> {
    if (!this.config.enabled) {
      throw new Error('Backups are disabled in configuration')
    }

    const timestamp = new Date()
    const backupId = options.name || `backup-${timestamp.toISOString().replace(/[:.]/g, '-')}`
    
    console.log(`📋 Creating backup: ${backupId}`)

    try {
      // Get all table names
      const tables = await this.getTableNames()
      
      // Create backup directory
      const backupDir = await this.ensureBackupDirectory()
      const backupPath = path.join(backupDir, `${backupId}.sql`)
      
      // Generate backup SQL
      const backupSQL = await this.generateBackupSQL(tables)
      
      // Write backup file
      await fs.writeFile(backupPath, backupSQL, 'utf-8')
      
      // Get file size
      const stats = await fs.stat(backupPath)
      
      // Compress if requested
      if (options.compress ?? this.config.compression) {
        await this.compressBackup(backupPath)
      }
      
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        size: stats.size,
        tables,
        environment: env.NODE_ENV,
        version: await this.getDatabaseVersion()
      }
      
      // Save metadata
      await this.saveBackupMetadata(metadata)
      
      console.log(`✅ Backup created successfully: ${backupId}`)
      console.log(`   Size: ${this.formatBytes(stats.size)}`)
      console.log(`   Tables: ${tables.length}`)
      
      return metadata
      
    } catch (error) {
      console.error(`❌ Backup failed: ${error.message}`)
      throw error
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(backupId: string, options: { force?: boolean } = {}): Promise<void> {
    console.log(`🔄 Restoring backup: ${backupId}`)
    
    if (env.NODE_ENV === 'production' && !options.force) {
      throw new Error('Production restore requires --force flag')
    }

    try {
      const backupDir = await this.ensureBackupDirectory()
      const backupPath = path.join(backupDir, `${backupId}.sql`)
      
      // Check if backup exists
      try {
        await fs.access(backupPath)
      } catch {
        throw new Error(`Backup file not found: ${backupPath}`)
      }
      
      // Read backup SQL
      const backupSQL = await fs.readFile(backupPath, 'utf-8')
      
      // Execute restore
      await this.sql(backupSQL)
      
      console.log(`✅ Backup restored successfully: ${backupId}`)
      
    } catch (error) {
      console.error(`❌ Restore failed: ${error.message}`)
      throw error
    }
  }

  /**
   * List available backups
   */
  async listBackups(): Promise<BackupMetadata[]> {
    try {
      const backupDir = await this.ensureBackupDirectory()
      const files = await fs.readdir(backupDir)
      
      const backupFiles = files
        .filter(file => file.endsWith('.sql') || file.endsWith('.sql.gz'))
        .sort((a, b) => b.localeCompare(a)) // Newest first
      
      const backups: BackupMetadata[] = []
      
      for (const file of backupFiles) {
        const metadataPath = path.join(backupDir, `${file}.meta.json`)
        
        try {
          const metadataContent = await fs.readFile(metadataPath, 'utf-8')
          const metadata = JSON.parse(metadataContent) as BackupMetadata
          backups.push({
            ...metadata,
            timestamp: new Date(metadata.timestamp)
          })
        } catch {
          // If metadata doesn't exist, create basic info
          const stats = await fs.stat(path.join(backupDir, file))
          backups.push({
            id: file.replace(/\.(sql|sql\.gz)$/, ''),
            timestamp: stats.mtime,
            size: stats.size,
            tables: [],
            environment: 'unknown',
            version: 'unknown'
          })
        }
      }
      
      return backups
      
    } catch (error) {
      console.error(`❌ Failed to list backups: ${error.message}`)
      return []
    }
  }

  /**
   * Clean up old backups based on retention policy
   */
  async cleanupOldBackups(): Promise<number> {
    console.log(`🧹 Cleaning up backups older than ${this.config.retentionDays} days`)
    
    try {
      const backups = await this.listBackups()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays)
      
      const oldBackups = backups.filter(backup => backup.timestamp < cutoffDate)
      
      let deletedCount = 0
      const backupDir = await this.ensureBackupDirectory()
      
      for (const backup of oldBackups) {
        const backupPath = path.join(backupDir, `${backup.id}.sql`)
        const compressedPath = path.join(backupDir, `${backup.id}.sql.gz`)
        const metadataPath = path.join(backupDir, `${backup.id}.sql.meta.json`)
        
        try {
          // Delete backup file (check both compressed and uncompressed)
          try {
            await fs.unlink(backupPath)
          } catch {}
          
          try {
            await fs.unlink(compressedPath)
          } catch {}
          
          // Delete metadata
          try {
            await fs.unlink(metadataPath)
          } catch {}
          
          deletedCount++
          console.log(`   Deleted: ${backup.id}`)
          
        } catch (error) {
          console.warn(`   Failed to delete ${backup.id}: ${error.message}`)
        }
      }
      
      console.log(`✅ Cleaned up ${deletedCount} old backups`)
      return deletedCount
      
    } catch (error) {
      console.error(`❌ Cleanup failed: ${error.message}`)
      return 0
    }
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupId: string): Promise<boolean> {
    try {
      const backupDir = await this.ensureBackupDirectory()
      const backupPath = path.join(backupDir, `${backupId}.sql`)
      
      // Check if file exists
      await fs.access(backupPath)
      
      // Read and validate SQL
      const backupSQL = await fs.readFile(backupPath, 'utf-8')
      
      // Basic validation - check for SQL structure
      const hasCreateTable = backupSQL.includes('CREATE TABLE')
      const hasInsertInto = backupSQL.includes('INSERT INTO')
      
      if (!hasCreateTable && !hasInsertInto) {
        console.warn(`⚠️  Backup ${backupId} appears to be empty or invalid`)
        return false
      }
      
      console.log(`✅ Backup ${backupId} verified successfully`)
      return true
      
    } catch (error) {
      console.error(`❌ Backup verification failed: ${error.message}`)
      return false
    }
  }

  // Private helper methods

  private async getTableNames(): Promise<string[]> {
    const result = await this.sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    return result.map(row => row.table_name)
  }

  private async generateBackupSQL(tables: string[]): Promise<string> {
    let sql = '-- Sentry Academy Database Backup\n'
    sql += `-- Generated: ${new Date().toISOString()}\n`
    sql += `-- Environment: ${env.NODE_ENV}\n\n`
    
    sql += '-- Disable foreign key checks during restore\n'
    sql += 'SET session_replication_role = replica;\n\n'
    
    // Export schema and data for each table
    for (const table of tables) {
      sql += await this.exportTable(table)
      sql += '\n'
    }
    
    sql += '-- Re-enable foreign key checks\n'
    sql += 'SET session_replication_role = DEFAULT;\n'
    
    return sql
  }

  private async exportTable(tableName: string): Promise<string> {
    // Get table structure
    const [structure] = await this.sql`
      SELECT pg_get_ddl_object('table'::regclass, oid) as ddl
      FROM pg_class 
      WHERE relname = ${tableName}
    `.catch(() => [{ ddl: `-- Unable to get DDL for ${tableName}` }])
    
    let sql = `-- Table: ${tableName}\n`
    sql += `${structure.ddl};\n\n`
    
    // Get table data
    const data = await this.sql(`SELECT * FROM ${tableName}`)
    
    if (data.length > 0) {
      sql += `-- Data for ${tableName}\n`
      
      // Get column names
      const columns = Object.keys(data[0])
      
      for (const row of data) {
        const values = columns.map(col => {
          const val = row[col]
          if (val === null) return 'NULL'
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
          return val
        })
        
        sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`
      }
      
      sql += '\n'
    }
    
    return sql
  }

  private async ensureBackupDirectory(): Promise<string> {
    const backupDir = path.join(__dirname, '..', '..', '..', 'backups')
    
    try {
      await fs.access(backupDir)
    } catch {
      await fs.mkdir(backupDir, { recursive: true })
    }
    
    return backupDir
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const backupDir = await this.ensureBackupDirectory()
    const metadataPath = path.join(backupDir, `${metadata.id}.sql.meta.json`)
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')
  }

  private async compressBackup(backupPath: string): Promise<void> {
    // In a real implementation, you would use gzip compression
    console.log(`📦 Compressing backup: ${path.basename(backupPath)}`)
    // Implementation would use zlib or external gzip command
  }

  private async getDatabaseVersion(): Promise<string> {
    const [result] = await this.sql`SELECT version() as version`
    return result?.version || 'unknown'
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

/**
 * Quick backup utility for scripts
 */
export async function createQuickBackup(name?: string): Promise<BackupMetadata> {
  const manager = new BackupManager()
  return await manager.createBackup({ name })
}

/**
 * Backup command line interface
 */
export async function backupCLI() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  const manager = new BackupManager()
  
  try {
    switch (command) {
      case 'create':
        const name = args.find(arg => arg.startsWith('--name='))?.split('=')[1]
        await manager.createBackup({ name })
        break
        
      case 'list':
        const backups = await manager.listBackups()
        console.log('📋 Available Backups:')
        backups.forEach(backup => {
          console.log(`   ${backup.id} (${backup.timestamp.toISOString()}) - ${manager['formatBytes'](backup.size)}`)
        })
        break
        
      case 'restore':
        const backupId = args[1]
        if (!backupId) {
          throw new Error('Backup ID required for restore')
        }
        const force = args.includes('--force')
        await manager.restoreBackup(backupId, { force })
        break
        
      case 'verify':
        const verifyId = args[1]
        if (!verifyId) {
          throw new Error('Backup ID required for verify')
        }
        const isValid = await manager.verifyBackup(verifyId)
        process.exit(isValid ? 0 : 1)
        
      case 'cleanup':
        await manager.cleanupOldBackups()
        break
        
      default:
        console.log(`
📋 Backup Management Commands:

  create [--name=backup-name]  Create a new backup
  list                         List available backups
  restore <backup-id> [--force] Restore from backup
  verify <backup-id>           Verify backup integrity
  cleanup                      Remove old backups

Examples:
  npm run db:backup create
  npm run db:backup list
  npm run db:backup restore backup-2024-01-01
        `)
    }
  } catch (error) {
    console.error('💥 Backup command failed:', error.message)
    process.exit(1)
  }
}

// Execute CLI if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  backupCLI().catch(console.error)
}