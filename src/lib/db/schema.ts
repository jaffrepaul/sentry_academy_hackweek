import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(), // NextAuth uses string IDs
  email: text('email').notNull().unique(),
  email_verified: timestamp('email_verified', { mode: 'date' }),
  name: text('name'),
  image: text('image'),
  role: text('role').default('student'), // 'student', 'instructor', 'admin', 'super_admin'
  
  // Learning role and progress
  engineer_role: text('engineer_role'), // 'backend', 'frontend', 'sre', 'fullstack', 'ai-ml', 'pm-manager'
  current_step: integer('current_step').default(0),
  completed_steps: jsonb('completed_steps').$type<string[]>().default([]),
  completed_modules: jsonb('completed_modules').$type<string[]>().default([]),
  completed_features: jsonb('completed_features').$type<string[]>().default([]),
  onboarding_completed: boolean('onboarding_completed').default(false),
  preferred_content_type: text('preferred_content_type').default('mixed'),
  has_seen_onboarding: boolean('has_seen_onboarding').default(false),
  
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// NextAuth required tables
export const accounts = pgTable('accounts', {
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  provider_account_id: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: { columns: [account.provider, account.provider_account_id] }
}))

export const sessions = pgTable('sessions', {
  session_token: text('session_token').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verification_tokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  compoundKey: { columns: [vt.identifier, vt.token] }
}))

// Courses table
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  difficulty: text('difficulty'),
  duration: text('duration'),
  category: text('category'),
  level: text('level'),
  rating: integer('rating').default(45), // Rating out of 50 (4.5 stars average), will display as rating/10
  students: integer('students').default(0),
  image_url: text('image_url'),
  is_published: boolean('is_published').default(false),
  is_popular: boolean('is_popular').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Learning paths table
export const learning_paths = pgTable('learning_paths', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  role: text('role'),
  courses: jsonb('courses').$type<number[]>(), // Array of course IDs
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// User progress table
export const user_progress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  course_id: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  completed: boolean('completed').default(false),
  progress: integer('progress').default(0), // Percentage 0-100
  last_accessed_at: timestamp('last_accessed_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
})

// AI generated content table
export const ai_generated_content = pgTable('ai_generated_content', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'course', 'module', 'quiz', etc.
  prompt: text('prompt').notNull(),
  content: jsonb('content'),
  status: text('status').default('pending'), // 'pending', 'generated', 'approved'
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Course modules table
export const course_modules = pgTable('course_modules', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').references(() => courses.id),
  title: text('title').notNull(),
  content: text('content'),
  order: integer('order').default(0),
  duration: text('duration'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect
export type VerificationToken = typeof verification_tokens.$inferSelect
export type Course = typeof courses.$inferSelect
export type LearningPath = typeof learning_paths.$inferSelect
export type UserProgress = typeof user_progress.$inferSelect
export type AIGeneratedContent = typeof ai_generated_content.$inferSelect
export type CourseModule = typeof course_modules.$inferSelect
