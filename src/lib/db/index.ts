import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// For development/testing without actual database
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy'

const sql = neon(DATABASE_URL)
export const db = drizzle(sql, { schema })
