# Unit Testing Infrastructure Plan

## Description

Add comprehensive unit testing infrastructure to the Sentry Academy project using Vitest and React Testing Library. This will provide fast, reliable testing capabilities for React components, custom hooks, utility functions, server actions, database operations, and API routes. The testing setup will include proper TypeScript support, Next.js integration, and coverage reporting.

## Testing Strategy

### Testing Framework Stack
- **Vitest**: Primary test runner for fast execution and excellent TypeScript support
- **React Testing Library**: Component and hook testing with user-centric approach
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **@vitejs/plugin-react**: React support for Vitest
- **happy-dom**: Fast JSDOM alternative for better performance
- **MSW (Mock Service Worker)**: API mocking for integration tests

### Coverage Goals
- **Components**: Focus on user interactions, state management, and conditional rendering
- **Hooks**: Test state updates, side effects, and error handling
- **Utilities**: Test pure functions, style calculations, and data transformations
- **Server Actions**: Test data validation, database operations, and error handling
- **API Routes**: Test request/response handling and business logic

## Files and Functions to Modify/Create

### Configuration Files

#### `vitest.config.ts` (New)
- Configure Vitest with Next.js path aliases (@/* mappings)
- Set up React plugin and environment settings
- Configure test coverage reporting
- Set up global test setup file

#### `vitest.setup.ts` (New) 
- Configure @testing-library/jest-dom matchers
- Set up MSW server for API mocking
- Configure global test utilities and mocks

#### `package.json` (Modify)
- Add testing dependencies:
  - vitest
  - @vitest/ui
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
  - @vitejs/plugin-react
  - happy-dom
  - msw
- Add test scripts:
  - `test`: Run tests once
  - `test:watch`: Run tests in watch mode
  - `test:ui`: Open Vitest UI
  - `test:coverage`: Run tests with coverage report

#### `.gitignore` (Modify)
- Add coverage output directory
- Add test result files

### Test Files to Create

#### Component Tests

#### `src/components/__tests__/CourseGrid.test.tsx` (New)
- Test course rendering with different data sets
- Test empty state handling
- Test click navigation to course details
- Test theme-based styling
- Test popular course badge display
- Mock `useTheme` and `useRouter` hooks

#### `src/components/__tests__/CourseCard.test.tsx` (New)
- Test individual course card rendering
- Test course metadata display (duration, level, rating)
- Test click handlers and navigation
- Test conditional rendering of popular badge
- Test accessibility attributes

#### `src/components/auth/__tests__/SignInButton.test.tsx` (New)
- Test authentication states (signed in/out)
- Test button text and appearance changes
- Test click handlers for sign in/out actions
- Mock NextAuth session

#### `src/components/auth/__tests__/UserProfile.test.tsx` (New)
- Test user profile display
- Test role-based information rendering
- Test progress display
- Mock user session data

#### Hook Tests

#### `src/hooks/__tests__/useUserProgress.test.tsx` (New)
- Test progress loading from database/local storage
- Test optimistic updates for authenticated/unauthenticated users
- Test module completion tracking
- Test progress reset functionality
- Test error handling and fallbacks
- Mock database actions and session

#### `src/hooks/__tests__/usePermissions.test.tsx` (New)
- Test permission calculations based on user roles
- Test admin/instructor/student permission checks
- Test role hierarchy enforcement
- Mock user sessions with different roles

#### `src/hooks/__tests__/useLearningPath.test.tsx` (New)
- Test learning path data fetching
- Test role-based path filtering
- Test progress tracking integration
- Mock API calls and user progress

#### Utility Function Tests

#### `src/utils/__tests__/styles.test.ts` (New)
- Test theme-based class generation
- Test card, text, button, and navigation link styling
- Test background style application
- Test scroll utilities and hash navigation
- Cover all branches of conditional styling

#### `src/utils/__tests__/roleProgressMapper.test.ts` (New)
- Test role to progress mapping logic
- Test progress percentage calculations
- Test completion status determination
- Test edge cases and invalid inputs

#### Server Action Tests

#### `src/lib/actions/__tests__/course-actions.test.ts` (New)
- Test `getCourses` with various filters
- Test `getCourseBySlug` lookup
- Test database fallback to mock data
- Test error handling and caching behavior
- Mock database queries and responses

#### `src/lib/actions/__tests__/user-progress-actions.test.ts` (New)
- Test progress updates and persistence
- Test module completion tracking
- Test progress reset functionality
- Test user authentication requirements
- Mock database operations

#### `src/lib/actions/__tests__/user-actions.test.ts` (New)
- Test user creation and updates
- Test role assignments
- Test user data validation
- Mock database and authentication

#### API Route Tests

#### `src/app/api/__tests__/courses.test.ts` (New)
- Test GET /api/courses with different query parameters
- Test filtering by category, difficulty, search
- Test pagination and limits
- Test error responses
- Mock database and request contexts

#### `src/app/api/__tests__/user-progress.test.ts` (New)
- Test GET/POST/PUT progress endpoints
- Test authentication requirements
- Test data validation
- Test error handling
- Mock NextAuth and database

#### Database and Service Tests

#### `src/lib/db/__tests__/validation.test.ts` (New)
- Test DataValidator quality report generation
- Test cleanup operations
- Test data integrity checks
- Mock database connections

#### `src/services/__tests__/aiContentService.test.ts` (New)
- Test AI content generation workflows
- Test content validation and approval
- Test error handling and retries
- Mock external API calls

#### Type and Schema Tests

#### `src/types/__tests__/api.test.ts` (New)
- Test API request/response type validation
- Test schema compliance
- Test type guard functions

### Test Utilities and Helpers

#### `src/test-utils/__tests__/index.ts` (New)
- Custom render function with providers (Theme, Auth, etc.)
- Mock data factories for courses, users, progress
- Helper functions for common test patterns
- Test database setup and teardown utilities

#### `src/test-utils/mocks/` (New Directory)
- `handlers.ts`: MSW request handlers
- `server.ts`: MSW server setup
- `data.ts`: Mock data generators
- `providers.tsx`: Test provider wrappers

### Test Coverage Configuration

Target coverage thresholds:
- **Statements**: 80%
- **Branches**: 75% 
- **Functions**: 80%
- **Lines**: 80%

Focus areas for high coverage:
- Core business logic (course management, progress tracking)
- User interactions and state management
- Error handling and edge cases
- Authentication and permission systems

### Integration with Existing CI/CD

The test suite will integrate with existing development workflow:
- Pre-commit hooks to run affected tests
- GitHub Actions integration for PR validation
- Coverage reporting and trend tracking
- Integration with existing linting and formatting tools

### Mocking Strategy

#### External Dependencies
- **NextAuth**: Mock session and authentication state
- **Database**: Mock Drizzle ORM queries and responses  
- **Router**: Mock Next.js navigation
- **Theme Context**: Mock theme provider state

#### Test Data Management
- Factory functions for generating consistent test data
- Realistic mock data that matches production schemas
- Separate mock data sets for different test scenarios

This comprehensive testing infrastructure will ensure code quality, prevent regressions, and provide confidence in refactoring and feature development while maintaining fast test execution and developer productivity.