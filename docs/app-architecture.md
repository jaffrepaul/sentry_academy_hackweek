# Sentry Academy: Complete Application Architecture Guide

## Overview

Sentry Academy is a modern learning platform built with Next.js 15 App Router that strategically guides current Sentry users beyond basic error tracking to discover advanced features. This document provides a comprehensive understanding of how the application works from top to bottom, covering user journeys, technical architecture, and data flow.

## High-Level Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, API Routes
- **Database**: Neon Postgres (serverless) with Drizzle ORM
- **Authentication**: NextAuth.js with multiple providers
- **Deployment**: Vercel
- **Package Manager**: pnpm

### Application Structure

```
sentry_academy/
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   ├── contexts/              # React contexts
│   ├── data/                  # Static data & mock content
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Core libraries & utilities
│   │   ├── actions/           # Server Actions
│   │   ├── db/                # Database schema & migrations
│   │   └── auth.ts            # Authentication setup
│   ├── services/              # Business logic SERVICES
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── docs/                      # Documentation
```

## User Journey & Data Flow

### 1. Initial Page Load

**User Action**: User visits the homepage (`/`)

**Technical Flow**:

1. **Server-Side Rendering** (`src/app/page.tsx`):

   ```typescript
   // Server component that fetches data
   async function CoursesData() {
     const courses = await getCourses({ limit: 12 }) // Cached server action
     return <HomeContent courses={courses} />
   }
   ```

2. **Data Fetching** (`src/lib/actions/course-actions.ts`):
   - Executes cached server action `getCourses()`
   - Queries Neon Postgres via Drizzle ORM
   - Falls back to mock data if database unavailable
   - Returns structured course data

3. **Component Rendering**:
   - Server renders initial HTML with course data
   - Client hydrates with interactive functionality
   - Progressive loading via React Suspense boundaries

### 2. Authentication Flow

**User Action**: User clicks "Sign In" in header

**Technical Flow**:

1. **Route Navigation**: User navigates to `/auth/signin`
2. **NextAuth.js Processing** (`src/lib/auth.ts`):
   ```typescript
   export const authOptions: NextAuthOptions = {
     adapter: DrizzleAdapter(db, { usersTable: users, ... }),
     providers: [CredentialsProvider, GoogleProvider, GitHubProvider],
     session: { strategy: 'jwt' },
     callbacks: { jwt, session, signIn }
   }
   ```
3. **Database Integration**:
   - User data stored in `users` table
   - Session management via `sessions` table
   - OAuth account linking in `accounts` table
4. **Session Management**:
   - JWT tokens for session persistence
   - Role-based access control
   - Automatic user progress loading

### 3. Course Interaction & Progress Tracking

**User Action**: User clicks on a course card

**Technical Flow**:

1. **Client-Side Navigation** (`src/components/CourseGrid.tsx`):

   ```typescript
   const handleCardClick = useCallback(() => {
     router.push(`/courses/${slug}`)
   }, [slug, router])
   ```

2. **Dynamic Route Loading** (`src/app/courses/[slug]/page.tsx`):
   - Static generation for popular courses
   - Server-side data fetching with `getCourseBySlug()`
   - Dynamic metadata generation for SEO

3. **Progress Management** (`src/hooks/useUserProgress.ts`):
   - Optimistic updates for immediate UI feedback
   - Server actions for persistent storage
   - Automatic synchronization with database

### 4. Learning Path Personalization

**User Action**: User selects role and features in onboarding

**Technical Flow**:

1. **Context Management** (`src/contexts/RoleContext.tsx`):

   ```typescript
   const setUserRole = useCallback(
     async (role: EngineerRole, selectedFeatures: string[]) => {
       const result = await updateUserRole(role, selectedFeatures)
       // Optimistic updates + server persistence
     },
     [updateProgress]
   )
   ```

2. **Server Action Processing** (`src/lib/actions/user-progress-actions.ts`):
   - Validates user authentication
   - Updates user profile in database
   - Calculates personalized learning path
   - Revalidates cached data

3. **Database Updates**:
   ```sql
   UPDATE users SET
     engineer_role = $1,
     completed_features = $2,
     onboarding_completed = $3
   WHERE id = $4
   ```

## Database Architecture

### Schema Design

The database uses a role-based learning system with the following key tables:

#### Users Table

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('student'), // Access control
  engineer_role: text('engineer_role'), // Learning path
  current_step: integer('current_step').default(0),
  completed_steps: jsonb('completed_steps').$type<string[]>(),
  completed_modules: jsonb('completed_modules').$type<string[]>(),
  completed_features: jsonb('completed_features').$type<string[]>(),
  onboarding_completed: boolean('onboarding_completed').default(false),
  // ... timestamps and other fields
})
```

#### Courses Table

```typescript
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  content: text('content'),
  difficulty: text('difficulty'),
  category: text('category'),
  is_published: boolean('is_published').default(false),
  // ... metadata fields
})
```

### Data Relationships

1. **Users ↔ UserProgress**: Tracks individual course completion
2. **LearningPaths ↔ Courses**: Defines role-based course sequences
3. **Courses ↔ CourseModules**: Hierarchical content structure
4. **Users ↔ AIGeneratedContent**: Personalized content recommendations

## State Management Architecture

### Client-Side State

1. **React Context Providers** (`src/components/Providers.tsx`):
   - `SessionProvider`: Authentication state
   - `ThemeProvider`: Dark/light mode
   - `RoleProvider`: Learning progress and personalization

2. **Custom Hooks**:
   - `useUserProgress`: Progress tracking with optimistic updates
   - `useLearningPath`: Dynamic path generation
   - `usePermissions`: Role-based access control

### Server-Side State

1. **Next.js Caching**:
   - Automatic caching for server actions
   - ISR (Incremental Static Regeneration) for course pages
   - Request deduplication for repeated queries

2. **Database Connection Pooling**:
   - Neon serverless connection management
   - Connection health monitoring
   - Fallback mechanisms for resilience

## API Architecture

### Server Actions Pattern

Server Actions provide type-safe, server-side functions callable from client components:

```typescript
// src/lib/actions/course-actions.ts
export const getCourses = cache(async (filters: CourseFilters) => {
  try {
    const dbCourses = await db
      .select()
      .from(courses)
      .where(and(...filterConditions))

    // Fallback to mock data if needed
    return dbCourses.length > 0 ? dbCourses : await getMockCourses(filters)
  } catch (error) {
    console.error('Database error:', error)
    return await getMockCourses(filters)
  }
})
```

### REST API Routes

Traditional API routes for external integrations:

- `/api/courses` - Course CRUD operations
- `/api/user-progress` - Progress tracking
- `/api/ai-content` - AI-generated content management
- `/api/auth` - Authentication endpoints

## Performance Optimizations

### 1. Server-Side Optimizations

- **Static Generation**: Course pages pre-built at build time
- **ISR**: Automatic revalidation every hour
- **Server Components**: Reduced client-side bundle size
- **Database Caching**: React's `cache()` function for request deduplication

### 2. Client-Side Optimizations

- **Code Splitting**: Dynamic imports for heavy components
- **Optimistic Updates**: Immediate UI feedback
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Lazy Loading**: Suspense boundaries for progressive loading

### 3. Bundle Optimization

```typescript
// Dynamic imports reduce initial bundle size
const LearningPaths = dynamic(() => import('@/components/LearningPaths'), {
  loading: () => <LoadingSkeleton />,
  ssr: true
})
```

## Security Architecture

### Authentication & Authorization

1. **NextAuth.js Configuration**:
   - Multiple provider support (Google, GitHub, Credentials)
   - JWT-based session management
   - Database session storage for security
   - CSRF protection built-in

2. **Role-Based Access Control**:

   ```typescript
   // Permission checking in server actions
   const canCreate = await checkUserPermission('create_course')
   if (!canCreate) {
     return { success: false, error: 'Permission denied' }
   }
   ```

3. **Database Security**:
   - Parameterized queries via Drizzle ORM
   - Connection string encryption
   - Row-level security policies

### Data Protection

- **Input Validation**: Zod schemas for type safety
- **SQL Injection Prevention**: ORM-based queries
- **XSS Protection**: React's built-in escaping
- **Environment Variables**: Secure credential storage

## Error Handling & Resilience

### 1. Error Boundaries

```typescript
// src/components/ErrorBoundary.tsx
export default function ErrorBoundary({ children, onError }: Props) {
  return (
    <ErrorBoundaryComponent
      fallback={<ErrorFallback />}
      onError={onError}
    >
      {children}
    </ErrorBoundaryComponent>
  )
}
```

### 2. Graceful Degradation

- **Database Fallbacks**: Mock data when database unavailable
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Network Resilience**: Retry logic for failed requests

### 3. Monitoring & Logging

- **Server-side Logging**: Comprehensive error tracking
- **Client-side Error Reporting**: User-friendly error messages
- **Performance Monitoring**: Core Web Vitals tracking

## Deployment Architecture

### Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Environment Management

- **Development**: Local SQLite fallback
- **Staging**: Neon branch database
- **Production**: Main Neon database with pooling

### Build Process

1. **Static Analysis**: TypeScript compilation
2. **Bundle Generation**: Next.js optimization
3. **Asset Optimization**: Image compression and format conversion
4. **Database Migrations**: Automated schema updates

## Development Workflow

### Database Management

```bash
# Schema generation
pnpm db:generate

# Migration execution
pnpm db:migrate

# Data seeding
pnpm db:seed

# Development tools
pnpm db:studio    # Visual database browser
pnpm db:health    # Connection health check
```

### Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js and TypeScript rules
- **Prettier**: Code formatting with Tailwind plugin
- **Pre-commit Hooks**: Automated quality checks

## Key Features Deep Dive

### 1. Personalized Learning Paths

The app creates dynamic learning paths based on user roles and selected Sentry features:

```typescript
// src/utils/roleProgressMapper.ts
export function mapFeaturesToProgress(role: EngineerRole, features: string[]) {
  return {
    completedModules: features.map(f => `${role}-${f}-intro`),
    completedFeatures: features,
    completedStepIds: calculateStepProgression(role, features),
  }
}
```

### 2. AI-Powered Content Generation

Integration with AI services for dynamic content creation:

```typescript
// src/services/aiContentService.ts
export class AIContentService {
  async generateCourse(prompt: string, context: ContentContext) {
    // AI integration for course generation
    // Template matching and validation
    // Content quality assurance
  }
}
```

### 3. Progressive Course Loading

Optimized loading strategy for course content:

```typescript
// Suspense boundaries for smooth UX
<Suspense fallback={<CourseGridSkeleton />}>
  <CoursesData />
</Suspense>
```

## Future Architecture Considerations

### Scalability Enhancements

1. **Microservices**: Split AI/content services
2. **CDN Integration**: Global content delivery
3. **Edge Computing**: Regional data processing
4. **Caching Layer**: Redis for session management

### Feature Expansions

1. **Real-time Collaboration**: WebSocket integration
2. **Video Content**: Streaming infrastructure
3. **Mobile App**: React Native with shared backend
4. **Analytics Dashboard**: Advanced user insights

---

## Conclusion

Sentry Academy represents a modern, scalable learning platform architecture that prioritizes performance, user experience, and maintainability. The combination of Next.js App Router, server actions, and thoughtful state management creates a robust foundation for continued growth and feature development.

The architecture successfully balances server-side performance with client-side interactivity, providing users with immediate feedback while ensuring data consistency and reliability. The modular design allows for easy feature additions and modifications while maintaining code quality and type safety throughout the application.
