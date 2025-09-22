import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

// Drizzle Kit runs as a CLI tool, so we need to manually load environment variables
// This is different from Next.js runtime which loads them automatically
config({ path: '.env.local' })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL not found. Please ensure .env.local exists with a valid DATABASE_URL'
  )
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
})
