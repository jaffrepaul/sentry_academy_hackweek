# Concepts 101 Feature Plan

## Brief Description

Create a comprehensive Concepts 101 page that presents core Sentry concepts in a structured list format. Each concept includes a title, 2-3 descriptive paragraphs explaining the concept, and visual demonstrations. Content is derived exclusively from https://docs.sentry.io/concepts/key-terms/ and https://docs.sentry.io/concepts/key-terms/tracing/. The tracing section will use images from the documentation instead of Arcade demos.

## Files and Functions to be Changed/Created

### Existing Files to Modify

- `src/components/Concepts101.tsx` - Already exists with basic structure, needs content updates
- `src/data/concepts.ts` - Already exists with concept data, needs content refinement based on Sentry docs

### Files to Reference for Design Patterns

- `src/components/CourseDetail.tsx` - Reference for Arcade component integration and responsive design patterns
- `src/components/Arcade.tsx` - Reuse existing component for interactive demos
- `src/contexts/ThemeContext.tsx` - For consistent dark/light theme support
- `src/utils/styles.ts` - For consistent styling utilities

## Technical Implementation Details

### Content Structure

Each concept will follow this structure:

- **Title**: Clear, descriptive concept name from official documentation
- **Description**: 2-3 paragraphs explaining:
  1. Official definition from Sentry documentation
  2. How it works in practice within Sentry
  3. Key benefits or use cases
- **Visual Demo**:
  - Standard concepts: Arcade component with placeholder URL
  - Tracing concepts: Documentation images showing trace visualization and span relationships

### Design Requirements

- **Responsive Layout**: Grid system that works on mobile, tablet, and desktop
- **Theme Consistency**: Full dark/light theme support matching existing site design
- **Visual Hierarchy**: Clear section separation with consistent spacing
- **Interactive Elements**: Hover effects and smooth transitions
- **Accessibility**: Proper semantic HTML and ARIA labels

### Concept Content Areas (Derived from Sentry Key Terms Documentation)

The following concepts are derived exclusively from https://docs.sentry.io/concepts/key-terms/ and https://docs.sentry.io/concepts/key-terms/tracing/:

**From Key Terms Documentation:**

1. **Event** - An individual occurrence captured by Sentry (error, exception, message, or transaction)
2. **Issue** - A group of similar events, created by Sentry's grouping algorithm
3. **Alert** - A notification triggered when certain conditions are met
4. **Release** - A version of your code deployed to an environment
5. **Environment** - A deployment stage (production, staging, development)
6. **Project** - A container for your application's events and settings
7. **Organization** - The top-level container for projects and teams
8. **Breadcrumbs** - A trail of events leading up to an issue
9. **Tags** - Key-value pairs that provide searchable metadata
10. **Context** - Additional data attached to events
11. **Sampling & Quotas** - Rate limiting and data management controls to optimize performance and costs

**From Tracing Documentation (with images):** 11. **Distributed Tracing** - Following a request across multiple services and systems 12. **Transactions and Spans** - Operations and their nested sub-operations with timing data

**Special Tracing Section Requirements:**

- Use documentation images instead of Arcade demos
- Include comprehensive explanation of trace structure
- Show parent-child span relationships
- Explain timing and performance data visualization

### Layout Structure

```
Header Section
├── Page Title: "Concepts 101"
├── Subtitle/Description
└── Introduction paragraph

Concepts List (Responsive Grid)
├── For each concept:
│   ├── Section Container (rounded, bordered)
│   ├── Concept Title (numbered, large font)
│   ├── Two-column layout (desktop) / Single column (mobile):
│   │   ├── Left: Description paragraphs
│   │   └── Right: Arcade demo in styled container
│   └── Hover effects and transitions

Call to Action Section
├── "Ready to dive deeper?" heading
├── Description text
└── Navigation buttons to courses and learning paths
```

### Styling Approach

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Cards**: Rounded corners, subtle borders, backdrop blur effects
- **Color Scheme**: Purple/violet gradient accents matching existing design
- **Typography**: Consistent with existing site hierarchy
- **Spacing**: `space-y-16` between sections for clear separation

### Visual Demo Integration

- **Standard Concepts**: Reuse existing `Arcade` component with placeholder URL
- **Tracing Concepts**: Use `<img>` elements with documentation images
- **Tracing Images to Include**:
  - Trace waterfall view showing parent-child relationships
  - Span details and timing information
  - Distributed trace across multiple services
- Wrap all visuals in styled container with appropriate headers
- Ensure responsive behavior for both Arcade and image content

### Navigation Integration

- Call-to-action section links to existing course grid and learning paths
- Uses React Router navigation with proper state management
- Maintains existing scroll behavior patterns

## Content Requirements

### Writing Style

- **Technical but Accessible**: Explain concepts clearly without overwhelming beginners
- **Practical Focus**: Emphasize real-world applications and benefits
- **Consistent Voice**: Match existing site content tone
- **Scannable Format**: Use clear paragraph breaks and logical flow

### Content Sources

- **Exclusive Source**: https://docs.sentry.io/concepts/key-terms/ and https://docs.sentry.io/concepts/key-terms/tracing/
- **No Secondary Sources**: Content derived only from these official documentation pages
- **Image Sources**: Tracing visualization images from the tracing documentation page
- **Terminology**: Use exact definitions and explanations from official documentation

### Visual Demo Strategy

- **Standard Concepts**: Use placeholder Arcade URL `https://demo.arcade.software/PalOCHofpcO3DqvA4Rzr?embed&hidechrome=true`
- **Tracing Concepts**: Use images from https://docs.sentry.io/concepts/key-terms/tracing/
- **Image Sources**: Reference documentation images showing:
  - Trace timeline and waterfall views
  - Span hierarchy and relationships
  - Performance metrics and timing data
- Consistent presentation styling across both Arcade and image content

## Implementation Phases

### Phase 1: Content Research and Data Updates

- Extract content exclusively from the two specified documentation pages
- Update `src/data/concepts.ts` with official definitions and explanations
- Identify and reference specific tracing images from documentation
- Ensure all concepts use exact terminology from source documentation

### Phase 2: Component Enhancement

- Refine `src/components/Concepts101.tsx` to handle both Arcade and image content
- Implement conditional rendering for tracing concepts with images
- Ensure responsive design works for both content types
- Add proper image loading, alt text, and accessibility features

### Phase 3: Integration and Polish

- Test navigation flows and responsive behavior
- Verify Arcade component integration works properly
- Ensure consistent styling with rest of site

## Success Criteria

- Page displays 12 core Sentry concepts derived exclusively from specified documentation
- Each concept uses official definitions and explanations from source material
- Tracing concepts include comprehensive explanations with documentation images
- Mixed content types (Arcade + images) render consistently across devices
- All terminology and explanations match official Sentry documentation exactly
- Navigation flows integrate properly with existing site sections
- Images from tracing documentation display properly with appropriate styling
