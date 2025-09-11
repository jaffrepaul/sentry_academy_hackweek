import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(), // NextAuth uses string IDs
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  name: text('name'),
  image: text('image'),
  role: text('role').default('student'), // 'student', 'instructor', 'admin', 'super_admin'
  
  // Learning role and progress
  engineerRole: text('engineer_role'), // 'backend', 'frontend', 'sre', 'fullstack', 'ai-ml', 'pm-manager'
  currentStep: integer('current_step').default(0),
  completedSteps: jsonb('completed_steps').$type<string[]>().default([]),
  completedModules: jsonb('completed_modules').$type<string[]>().default([]),
  completedFeatures: jsonb('completed_features').$type<string[]>().default([]),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  preferredContentType: text('preferred_content_type').default('mixed'),
  hasSeenOnboarding: boolean('has_seen_onboarding').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// NextAuth required tables
export const accounts = pgTable('accounts', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: { columns: [account.provider, account.providerAccountId] }
}))

export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable('verificationTokens', {
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
  imageUrl: text('image_url'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Learning paths table
export const learningPaths = pgTable('learning_paths', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  role: text('role'),
  courses: jsonb('courses').$type<number[]>(), // Array of course IDs
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// User progress table
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  completed: boolean('completed').default(false),
  progress: integer('progress').default(0), // Percentage 0-100
  lastAccessedAt: timestamp('last_accessed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
})

// AI generated content table
export const aiGeneratedContent = pgTable('ai_generated_content', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'course', 'module', 'quiz', etc.
  prompt: text('prompt').notNull(),
  content: jsonb('content'),
  status: text('status').default('pending'), // 'pending', 'generated', 'approved'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Course modules table
export const courseModules = pgTable('course_modules', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id),
  title: text('title').notNull(),
  content: text('content'),
  order: integer('order').default(0),
  duration: text('duration'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Account = typeof accounts.$inferSelect
export type Session = typeof sessions.$inferSelect
export type VerificationToken = typeof verificationTokens.$inferSelect
export type Course = typeof courses.$inferSelect
export type LearningPath = typeof learningPaths.$inferSelect
export type UserProgress = typeof userProgress.$inferSelect
export type AIGeneratedContent = typeof aiGeneratedContent.$inferSelect
export type CourseModule = typeof courseModules.$inferSelect
