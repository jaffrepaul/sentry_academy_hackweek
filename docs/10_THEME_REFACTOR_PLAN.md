# Theme Refactor Plan

## Feature Description
Replace the current custom theme implementation with the industry-standard `next-themes` package to eliminate code bloat, improve DRY principles, and standardize theming while maintaining all existing functionality. The current implementation uses manual `isDark` boolean propagation across 28 files with 432 theme references, custom utility functions, and JavaScript-based conditional styling that needs to be modernized to use Tailwind's `dark:` classes and next-themes.

## Technical Requirements

### Dependencies
- Install `next-themes` package via `pnpm add next-themes`

### Phase 1: Core Theme System Migration

#### 1. `src/components/providers.tsx`
- Remove import of custom `ThemeProvider` from `@/contexts/ThemeContext`
- Import `ThemeProvider` from `next-themes`  
- Replace custom ThemeProvider with next-themes ThemeProvider
- Configure with `attribute="class"`, `defaultTheme="system"`, and `enableSystem={true}`
- Remove error boundary wrapping around ThemeProvider

#### 2. `tailwind.config.js`
- Add `darkMode: 'class'` configuration to enable class-based dark mode
- Ensure this works with next-themes' automatic class management

#### 3. Create compatibility adapter: `src/hooks/useTheme.ts`
- Create adapter hook that wraps next-themes `useTheme`
- Export `isDark` boolean derived from `theme === 'dark'`  
- Export `toggleTheme` function that switches between light/dark
- Maintain backward compatibility with existing 28 components during migration

### Phase 2A: Component Migration (28 files)

#### Files requiring `useTheme` import changes:
- `src/components/ui/ThemeToggle.tsx` - Update to use adapter hook initially
- `src/components/ui/Logo.tsx` - Replace ThemeContext import with adapter
- `src/components/ui/LoadingSpinner.tsx` - Replace ThemeContext import 
- `src/components/ui/LoadingCard.tsx` - Replace ThemeContext import
- `src/components/navigation/NavigationLinks.tsx` - Replace ThemeContext import
- `src/components/navigation/MobileMenu.tsx` - Replace ThemeContext import
- `src/components/navigation/DesktopNavigation.tsx` - Replace ThemeContext import
- `src/components/home-content.tsx` - Replace ThemeContext import
- `src/components/auth/UserProfile.tsx` - Replace ThemeContext import
- `src/components/auth/SignInButton.tsx` - Replace ThemeContext import
- `src/components/SuspenseBoundary.tsx` - Replace ThemeContext import
- `src/components/StatsSection.tsx` - Replace ThemeContext import
- `src/components/PersonaPathDisplay.tsx` - Replace ThemeContext import
- `src/components/LearningPaths.tsx` - Replace ThemeContext import
- `src/components/Hero.tsx` - Replace ThemeContext import
- `src/components/Header.tsx` - Replace ThemeContext import
- `src/components/Footer.tsx` - Replace ThemeContext import
- `src/components/CourseGrid.tsx` - Replace ThemeContext import
- `src/components/Concepts101.tsx` - Replace ThemeContext import
- `src/components/ApiErrorBoundary.tsx` - Replace ThemeContext import
- `src/components/AdminDashboard.tsx` - Replace ThemeContext import
- `src/app/courses/[slug]/CourseDetailClient.tsx` - Replace ThemeContext import
- `src/app/auth/signin/page.tsx` - Replace ThemeContext import

### Phase 2B: Utility Functions Modernization

#### 1. `src/utils/styles.ts` - Complete rewrite to eliminate `isDark` parameters
- `getCardClasses(isDark, isHover)` → `getCardClasses(isHover)` using Tailwind `dark:` classes
- `getTextClasses(isDark, variant)` → `getTextClasses(variant)` using Tailwind `dark:` classes  
- `getButtonClasses(isDark, variant)` → `getButtonClasses(variant)` using Tailwind `dark:` classes
- `getNavLinkClasses(isDark)` → `getNavLinkClasses()` using Tailwind `dark:` classes
- Remove all `isDark` conditional logic and replace with Tailwind class strings

#### 2. `src/utils/utils/styles.ts` - Update utility functions
- Remove `isDark` parameters from all functions
- Convert JavaScript conditional styling to Tailwind `dark:` classes

#### 3. `src/utils/backgroundOptions.ts` and `src/utils/utils/backgroundOptions.ts`
- Remove `isDark` parameters from background style functions  
- Convert to Tailwind `dark:` classes for background styling

### Phase 3: Component Updates (Remove isDark Usage)

#### Update all 28 components to:
1. Remove `const { isDark } = useTheme()` destructuring
2. Remove `isDark` parameters from utility function calls:
   - `getCardClasses(isDark, hover)` → `getCardClasses(hover)`
   - `getTextClasses(isDark, variant)` → `getTextClasses(variant)`  
   - `getButtonClasses(isDark, variant)` → `getButtonClasses(variant)`
3. Remove manual `isDark` conditional styling in JSX
4. Replace with Tailwind `dark:` classes where appropriate
5. Remove memoization based on `isDark` (no longer needed)

#### Specific component updates:
- **ThemeToggle.tsx**: Use next-themes `theme` and `setTheme` directly, remove adapter
- **Hero.tsx**: Remove titleClasses/subtitleClasses/accentClasses memos based on isDark
- **All navigation components**: Remove isDark-based conditional styling
- **All UI components**: Simplify by removing theme-dependent logic

### Files to Delete

#### 1. `src/contexts/ThemeContext.tsx` (entire file - 106 lines)
- Remove custom ThemeContext interface
- Remove custom useTheme hook with localStorage/system detection
- Remove custom ThemeProvider with loading states and DOM manipulation
- Remove requestAnimationFrame batching logic
- Remove error boundaries and memoization optimizations

#### 2. `src/hooks/useTheme.ts` (after migration complete)
- Delete compatibility adapter hook once all components updated

### Implementation Strategy

#### Migration Approach:
1. **Phase 1**: Install next-themes, update core providers, create adapter hook
2. **Phase 2A**: Update all component imports to use adapter (non-breaking)
3. **Phase 2B**: Rewrite utility functions to use Tailwind classes (breaking)  
4. **Phase 3**: Update all components to remove isDark usage, test thoroughly
5. **Cleanup**: Delete ThemeContext.tsx and adapter hook

#### Backward Compatibility:
- Use adapter hook initially to maintain existing component interface
- Gradual migration allows testing at each stage
- All functionality preserved during transition

### Expected Code Reduction
- **ThemeContext.tsx**: 106 lines eliminated
- **Utility functions**: ~50% reduction by removing isDark parameters
- **Component files**: ~10-30% reduction per file by removing theme conditionals
- **Total estimated reduction**: 300-500 lines of theme-related code
- **Maintenance burden**: Significantly reduced with industry standard approach

### Benefits
- **Industry standard**: Battle-tested next-themes package
- **DRY principles**: Eliminate repetitive isDark parameter passing  
- **Better performance**: Remove unnecessary re-renders from theme context
- **Improved hydration**: Automatic flash prevention
- **Maintainability**: Standard Tailwind dark: classes instead of JavaScript conditionals
- **Type safety**: Better TypeScript support with next-themes