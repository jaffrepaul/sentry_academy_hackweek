#!/usr/bin/env node

import { execSync } from 'child_process'

// Check if we're in a CI environment
if (process.env.CI || process.env.VERCEL) {
  console.log(
    '🏗️  Skipping db:generate in CI environment (no database connection needed for build)'
  )
  process.exit(0)
}

try {
  console.log('🔧 Running drizzle-kit generate...')
  execSync('pnpm exec drizzle-kit generate', { stdio: 'inherit' })
  console.log('✅ Database schema generation completed')
} catch (error) {
  console.error('❌ Database schema generation failed:', error.message)
  process.exit(1)
}
