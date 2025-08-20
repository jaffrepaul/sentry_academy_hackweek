# Role-Based Adoption Path Feature Plan

## Brief Description

Implement a role-based onboarding and content recommendation system where users select their engineering role (Backend, Frontend, SRE/DevOps, Full-Stack) and receive personalized learning paths with "next best" content recommendations. The system will use pre-baked adoption paths as a DAG of features tailored to each role, with AI-generated role-specific content explanations and nudges.

## Core Principle Implementation

**Current State**: Users browse generic Sentry content without personalization
**Target State**: Role-driven learning paths with personalized content explanations and dynamic next-step recommendations

Example flows:
- Backend Engineer: Error Tracking → Tracing → Performance Monitoring → Dashboards/Alerts  
- Frontend Engineer: Error Tracking → Performance Monitoring → Session Replay → Release Health
- SRE/DevOps: Error Tracking → Tracing → Dashboards/Alerts → Performance/Capacity
- Full-Stack: Error Tracking → Cross-Service Performance → Release Monitoring

## Files and Functions to Modify/Create

### Phase 1: Data Layer and Types (Foundation)
**Already exists but needs enhancement:**
- `src/types/roles.ts` - Add new interfaces for next content recommendations
- `src/data/roles.ts` - Enhance with next-step recommendation logic
- `src/contexts/RoleContext.tsx` - Add recommendation methods

### Phase 2A: Onboarding Flow (UI)
**New files to create:**
- `src/components/RoleOnboarding.tsx` - Role selection onboarding component
- `src/components/RoleSelector.tsx` - Individual role selection cards
- `src/components/OnboardingModal.tsx` - Modal wrapper for role selection

**Files to modify:**
- `src/App.tsx` - Add onboarding route and logic for first-time users
- `src/main.tsx` - Wrap with RoleProvider

### Phase 2B: Next Content Recommendations (Logic)
**New files to create:**
- `src/utils/recommendations.ts` - Algorithm for determining next-best content
- `src/hooks/useNextContent.ts` - Hook for getting personalized recommendations

**Files to modify:**
- `src/contexts/RoleContext.tsx` - Add getNextRecommendations method
- `src/data/roles.ts` - Add recommendation mappings

### Phase 2C: Path UI and Navigation (UI)
**New files to create:**
- `src/components/PersonalizedPath.tsx` - Shows user's current path with progress
- `src/components/NextContentCard.tsx` - Displays recommended next content
- `src/components/PathProgress.tsx` - Visual progress indicator
- `src/components/RoleSpecificExplanation.tsx` - AI-generated content adaptations

**Files to modify:**
- `src/components/Hero.tsx` - Replace generic cards with role-aware content
- `src/components/LearningPaths.tsx` - Show personalized path instead of all paths
- `src/components/CourseDetail.tsx` - Add role-specific explanations and next-step nudges

## Algorithm Implementation

### Role-Based Recommendation Engine
1. **Input**: User's role, completed modules, current step in path
2. **Logic**: 
   - If no role selected → trigger onboarding
   - If role selected → get pre-baked path for role
   - Filter completed modules from path
   - Return next unlocked step + reasoning
3. **Output**: Next recommended content with role-specific explanation

### Content Personalization Algorithm
1. **Input**: Module ID, user role, current context
2. **Logic**:
   - Lookup role personalization data
   - Generate role-specific explanation ("Why this matters for your role")
   - Create contextual next-step nudge
3. **Output**: Personalized content object with explanation, relevance, and nudge

### Progress Tracking Algorithm  
1. **Input**: Completed module/step, user progress state
2. **Logic**:
   - Mark current step complete
   - Check if all modules in step are done
   - Unlock next step in learning path
   - Update localStorage persistence
3. **Output**: Updated progress state

## Data Structure Extensions

### New interfaces to add to `src/types/roles.ts`:
```typescript
interface NextContentRecommendation {
  moduleId: string;
  stepId: string;
  priority: number;
  reasoning: string;
  timeEstimate: string;
}

interface PersonalizedContent {
  roleSpecificExplanation: string;
  whyRelevantToRole: string;
  nextStepNudge: string;
  difficultyForRole: 'beginner' | 'intermediate' | 'advanced';
}
```

### Enhanced UserProgress interface:
```typescript
interface UserProgress {
  // existing fields...
  lastActiveDate: Date;
  preferredContentType: 'hands-on' | 'conceptual' | 'mixed';
  hasSeenOnboarding: boolean;
}
```

## Integration Points

### Onboarding Trigger Logic
- Check `userProgress.hasSeenOnboarding` on app load
- Show role selection modal if false
- Persist selection and mark onboarding complete

### Dynamic Content Loading
- `CourseDetail` component calls `getRoleSpecificContent()` from context
- Display personalized explanations alongside standard content
- Show "Why this matters for [role]" sections

### Navigation Enhancement  
- `Header` component shows role indicator
- `LearningPaths` filters to show only user's path
- Add "Recommended for You" section in main navigation

### Progress Persistence
- All progress stored in localStorage with `STORAGE_KEY`
- Sync between tabs using storage events
- Export/import functionality for user data portability

## Verbatim User Requirements Addressed

- ✅ **"when a user visits the site, they tell us their role"** → Role onboarding flow
- ✅ **"we provide the path of 'next' content"** → Next content recommendation engine  
- ✅ **"Each path is essentially a DAG of features"** → Pre-baked learning paths with step dependencies
- ✅ **"Personalizes content explanations to the role"** → Role-specific content adaptations
- ✅ **"Adapts the path dynamically if the product signals a feature is already enabled"** → Progress tracking skips completed modules
- ✅ **"Acts as a conversational coach explaining why this next step is valuable"** → Role-specific nudges and explanations
- ✅ **"Show a path UI with checkmarks as they enable features"** → Path progress visualization
- ✅ **"Use AI to generate role-specific content"** → Personalized explanations in rolePersonalizations data

## Technical Dependencies

- Existing React Router setup for navigation
- Current ThemeContext pattern for new RoleContext integration  
- localStorage for persistence (already implemented)
- Existing component patterns for consistent UI
- Current TypeScript setup supports new interfaces