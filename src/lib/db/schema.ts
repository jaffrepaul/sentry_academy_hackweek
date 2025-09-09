import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('student'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

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
  userId: integer('user_id').references(() => users.id),
  courseId: integer('course_id').references(() => courses.id),
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
export type Course = typeof courses.$inferSelect
export type LearningPath = typeof learningPaths.$inferSelect
export type UserProgress = typeof userProgress.$inferSelect
export type AIGeneratedContent = typeof aiGeneratedContent.$inferSelect
export type CourseModule = typeof courseModules.$inferSelect
