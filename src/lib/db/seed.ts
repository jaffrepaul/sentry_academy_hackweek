#!/usr/bin/env node
/**
 * Database seeding script for Sentry Academy
 * Populates the database with initial course data, learning paths, and sample users
 */

import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import * as schema from './schema'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = neon(DATABASE_URL)
const db = drizzle(sql, { schema })

/**
 * Run database migrations
 */
async function runMigrations() {
  console.log('🔄 Running database migrations...')
  try {
    await migrate(db, { migrationsFolder: './src/lib/db/migrations' })
    console.log('✅ Migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

/**
 * Execute SQL seed files
 */
async function runSeedFiles() {
  console.log('🔄 Running seed files...')
  
  const seedsDir = path.join(__dirname, 'seeds')
  const seedFiles = fs.readdirSync(seedsDir)
    .filter(file => file.endsWith('.sql'))
    .sort()

  for (const file of seedFiles) {
    console.log(`📄 Executing ${file}...`)
    const seedPath = path.join(seedsDir, file)
    const seedSQL = fs.readFileSync(seedPath, 'utf-8')
    
    try {
      await sql(seedSQL)
      console.log(`✅ ${file} executed successfully`)
    } catch (error) {
      console.error(`❌ Error executing ${file}:`, error)
      throw error
    }
  }
}

/**
 * Seed additional data programmatically
 */
async function seedAdditionalData() {
  console.log('🔄 Seeding additional data...')
  
  // Example: Create a sample admin user
  try {
    await db.insert(schema.users).values({
      id: 'admin-user-001',
      email: 'admin@sentry-academy.dev',
      name: 'Academy Admin',
      role: 'admin',
      engineerRole: 'fullstack',
      onboardingCompleted: true,
      hasSeenOnboarding: true,
      preferredContentType: 'mixed'
    }).onConflictDoNothing()
    
    // Create sample student users for different roles
    const sampleUsers = [
      {
        id: 'frontend-user-001',
        email: 'frontend@example.com',
        name: 'Frontend Developer',
        role: 'student',
        engineerRole: 'frontend'
      },
      {
        id: 'backend-user-001', 
        email: 'backend@example.com',
        name: 'Backend Engineer',
        role: 'student',
        engineerRole: 'backend'
      },
      {
        id: 'sre-user-001',
        email: 'sre@example.com', 
        name: 'SRE Engineer',
        role: 'student',
        engineerRole: 'sre'
      },
      {
        id: 'pm-user-001',
        email: 'pm@example.com',
        name: 'Product Manager', 
        role: 'student',
        engineerRole: 'pm-manager'
      }
    ]

    for (const user of sampleUsers) {
      await db.insert(schema.users).values({
        ...user,
        onboardingCompleted: false,
        hasSeenOnboarding: false,
        preferredContentType: 'mixed',
        currentStep: 0,
        completedSteps: [],
        completedModules: [],
        completedFeatures: []
      }).onConflictDoNothing()
    }
    
    console.log('✅ Additional data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding additional data:', error)
    throw error
  }
}

/**
 * Verify seed data
 */
async function verifySeedData() {
  console.log('🔄 Verifying seed data...')
  
  try {
    const coursesCount = await db.select().from(schema.courses)
    const learningPathsCount = await db.select().from(schema.learningPaths) 
    const usersCount = await db.select().from(schema.users)
    const modulesCount = await db.select().from(schema.courseModules)
    
    console.log(`✅ Verification complete:`)
    console.log(`   - Courses: ${coursesCount.length}`)
    console.log(`   - Learning Paths: ${learningPathsCount.length}`)
    console.log(`   - Users: ${usersCount.length}`)
    console.log(`   - Course Modules: ${modulesCount.length}`)
    
    if (coursesCount.length === 0) {
      throw new Error('No courses found - seeding may have failed')
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error)
    throw error
  }
}

/**
 * Main seeding function
 */
async function main() {
  console.log('🚀 Starting database seeding process...')
  
  try {
    await runMigrations()
    await runSeedFiles()
    await seedAdditionalData()
    await verifySeedData()
    
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('💥 Seeding process failed:', error)
    process.exit(1)
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { main as seedDatabase }