# Modernization Plan: Migrate to Next.js 15 App Router with Cloud Database

## Overview

The current codebase is a Vite + React SPA with TypeScript, Tailwind CSS, and mock data. This plan outlines the complete modernization to Next.js 15 App Router with modern development standards, cloud database integration, and improved architecture patterns.

## Current State Analysis

- **Framework**: Vite + React 18 (SPA)
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: React Context (ThemeContext, RoleContext)
- **Routing**: React Router DOM 7.8.1
- **Data Layer**: Mock data files in `src/data/`
- **Package Manager**: pnpm (correctly configured)
- **TypeScript**: Basic configuration with separate app/node configs
- **Architecture Issues**:
  - No SSR/SSG capabilities
  - Mock data hardcoded in components
  - No proper data fetching patterns
  - No database persistence
  - Large component files (48KB CourseDetail.tsx)
  - Mixed concerns (UI + data logic)

## Phase 1: Foundation & Data Layer

### 1.1 Next.js 15 App Router Migration

**Files to Create:**

- `next.config.js` - Next.js configuration with TypeScript, Tailwind
- `app/layout.tsx` - Root layout replacing main.tsx
- `app/page.tsx` - Home page replacing App.tsx routing logic
- `app/globals.css` - Global styles replacing src/index.css
- `middleware.ts` - Optional middleware for authentication/redirects

**Files to Update:**

- `package.json` - Replace Vite dependencies with Next.js 15
- `tsconfig.json` - Next.js TypeScript configuration
- `tailwind.config.js` - Update for App Router compatibility

**Files to Remove:**

- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `tsconfig.app.json`, `tsconfig.node.json`
- All Vite-specific dependencies

### 1.2 Database Schema & ORM Setup

**New Files to Create:**

- `drizzle.config.ts` - Drizzle ORM configuration
- `lib/db/schema.ts` - Database schema definitions
- `lib/db/index.ts` - Database connection and client
- `lib/db/migrations/` - Migration files directory
- `.env.local.example` - Environment variables template

**Database Schema Tables:**

- `users` - User profiles and authentication
- `courses` - Course content and metadata
- `learning_paths` - Learning path definitions
- `user_progress` - Track user completion
- `ai_generated_content` - AI-generated course materials
- `course_modules` - Course structure and modules
- `user_roles` - Role-based access control

**Environment Variables to Configure:**

- `DATABASE_URL` - Neon Postgres connection string
- `NEXTAUTH_SECRET` - Authentication secret
- `OPENAI_API_KEY` - AI content generation
- `NEXTAUTH_URL` - Base URL for authentication

### 1.3 Type System Modernization

**Files to Update:**

- `types/roles.ts` - Convert to database entity types
- `types/aiGeneration.ts` - Add API response types
- **New Files:**
  - `types/database.ts` - Drizzle-generated database types
  - `types/api.ts` - API request/response types
  - `types/auth.ts` - Authentication types

## Phase 2: App Router Migration & Component Refactoring

### 2.1 Route Structure Migration

**New App Router Structure:**

```
app/
├── layout.tsx (root layout)
├── page.tsx (home page)
├── courses/
│   ├── page.tsx (courses grid)
│   └── [slug]/page.tsx (course detail)
├── learning-paths/
│   ├── page.tsx (paths overview)
│   └── [pathId]/page.tsx (specific path)
├── admin/
│   └── page.tsx (admin dashboard)
├── api/ (API routes)
│   ├── courses/route.ts
│   ├── ai-content/route.ts
│   └── user-progress/route.ts
└── (auth)/
    ├── signin/page.tsx
    └── signup/page.tsx
```

### 2.2 Component Architecture Refactoring

**Components to Refactor (break down large files):**

**CourseDetail.tsx (48KB) → Multiple Components:**

- `components/course/CourseHeader.tsx`
- `components/course/CourseContent.tsx`
- `components/course/CourseModules.tsx`
- `components/course/CourseProgress.tsx`
- `components/course/RelatedCourses.tsx`

**AIContentManager.tsx (22KB) → Service + Components:**

- `components/ai/ContentGenerator.tsx`
- `components/ai/ContentPreview.tsx`
- `services/aiContentService.ts` (move to lib/)

**ContentGenerationForm.tsx (21KB) → Form Components:**

- `components/forms/ContentTypeSelector.tsx`
- `components/forms/GenerationSettings.tsx`
- `components/forms/PreviewPane.tsx`

### 2.3 Server Components & Client Components

**Server Components (default):**

- Course listings and static content
- Learning path overviews
- Public course details

**Client Components (use 'use client'):**

- Interactive forms
- Theme switching
- Progress tracking
- AI content generation
- User dashboards

## Phase 3: Modern Data Patterns & API Design

### 3.1 Server Actions Implementation

**New Files:**

- `lib/actions/course-actions.ts` - Course CRUD operations
- `lib/actions/user-actions.ts` - User profile and progress
- `lib/actions/ai-actions.ts` - AI content generation
- `lib/actions/auth-actions.ts` - Authentication workflows

### 3.2 Data Fetching Patterns

**Replace Mock Data With:**

- Server Components for initial data loading
- Server Actions for mutations
- React Query/SWR for client-side caching (optional)
- Optimistic updates for better UX

**Migration Strategy:**

- `src/data/courses.ts` → Database queries in server components
- `src/data/roles.ts` → User role queries with proper RBAC
- `src/data/aiGeneratedCourses.ts` → Dynamic AI content API

### 3.3 API Route Design

**RESTful API Structure:**

- `GET /api/courses` - List courses with filtering
- `POST /api/courses` - Create new course (admin)
- `GET /api/courses/[id]` - Get course details
- `PUT /api/courses/[id]` - Update course (admin)
- `POST /api/ai/generate-content` - AI content generation
- `GET /api/user/progress` - User progress tracking
- `POST /api/user/progress` - Update progress

## Phase 4: Authentication & Authorization

### 4.1 NextAuth.js Setup

**New Files:**

- `lib/auth.ts` - NextAuth configuration
- `components/auth/SignInButton.tsx`
- `components/auth/UserProfile.tsx`
- `middleware.ts` - Route protection

**Authentication Providers:**

- Email/Password (with database)
- Google OAuth (optional)
- GitHub OAuth (optional)

### 4.2 Role-Based Access Control

**Update Role System:**

- Migrate `contexts/RoleContext.tsx` to database-backed roles
- Implement middleware for route protection
- Add role checking utilities in `lib/permissions.ts`

## Phase 5: Performance & Modern Practices

### 5.1 Performance Optimizations

**Image Optimization:**

- Convert to Next.js `Image` component
- Add image optimization for course thumbnails
- Implement proper loading states

**Bundle Optimization:**

- Code splitting by route
- Dynamic imports for heavy components
- Optimize Tailwind CSS purging

### 5.2 SEO & Meta Tags

**SEO Implementation:**

- Dynamic meta tags for courses
- Structured data for course content
- Open Graph tags for social sharing
- XML sitemap generation

### 5.3 Modern Development Practices

**Code Quality:**

- Update ESLint config for Next.js App Router
- Add Prettier configuration
- Implement pre-commit hooks with Husky
- Add unit tests with Jest/React Testing Library

**Developer Experience:**

- Add proper TypeScript strict mode
- Implement proper error boundaries
- Add loading and error UI patterns
- Set up proper development/production environments

## Phase 6: Cloud Database Integration

### 6.1 Neon Postgres Setup

**Database Configuration:**

- Set up Neon serverless Postgres database
- Configure connection pooling
- Set up development/staging/production databases

### 6.2 Migration Strategy

**Data Migration:**

- Export existing mock data to SQL seed files
- Create migration scripts for schema changes
- Implement data validation and cleanup

**Deployment Pipeline:**

- Set up database migrations in CI/CD
- Configure proper environment variable management
- Implement database backup strategy

## Implementation Order & Dependencies

### Critical Path:

1. **Phase 1** must be completed first (foundation)
2. **Phase 2A** (routing) and **Phase 2B** (components) can be done in parallel after Phase 1
3. **Phase 3** depends on Phase 2A completion
4. **Phase 4** can be implemented alongside Phase 3
5. **Phase 5** and **Phase 6** are enhancement phases

### Risk Mitigation:

- Keep both old and new systems running during migration
- Implement feature flags for gradual rollout
- Maintain backward compatibility during transition
- Create comprehensive backup of current system

## Success Metrics:

- All existing functionality preserved
- Improved performance (Core Web Vitals)
- Proper SEO implementation
- Modern development workflow
- Cloud database integration
- Maintainable, scalable architecture

## Files That Need Major Changes:

- `package.json` - Complete dependency overhaul
- All routing logic - Convert to App Router
- All data fetching - Convert to Server Components/Actions
- Component architecture - Break down monolithic components
- State management - Reduce Context API usage
- Build system - Complete Vite → Next.js migration

This plan transforms the current LLM-generated Vite SPA into a production-ready Next.js application following modern standards and best practices.
