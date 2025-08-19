# GitHub Repository Callout Feature Plan

## Description
Add a new callout section in CourseDetail.tsx that displays a link to a GitHub repository, positioned right before the "People Like Us!" section. The callout should say "If you'd like to code along and implement this yourself, fork this repo" and provide a link to fork the repository.

## Technical Requirements

### Files to be Modified
- `src/components/CourseDetail.tsx` - Add new GitHub callout section before the "People Like Us!" section (before line 386)

### New Section Placement
The new GitHub callout section should be inserted after the Interactive Demo section and before the "People Like Us!" section, maintaining the existing visual flow and spacing.

### Component Structure
The new section will follow the existing design pattern used in CourseDetail.tsx:
- Consistent styling with other content sections using the same border, background, and spacing classes
- Dark/light theme support using the existing `isDark` theme context
- Responsive design matching the current layout
- Similar visual hierarchy with icon, title, and content area

### GitHub Integration
- Use Github icon from lucide-react for the section header
- Include a prominent call-to-action button/link to fork the repository
- Display the repository URL or name for reference
- Ensure the link opens in a new tab for better user experience

### Content Focus
The GitHub callout should include:
- Clear messaging: "If you'd like to code along and implement this yourself, fork this repo"
- Prominent fork button/link with GitHub branding
- Brief explanation of what the repository contains (the course implementation)
- Visual styling that encourages action while maintaining design consistency

### Styling Requirements
- Use existing utility classes and theme context for consistency
- Apply green color scheme (e.g., `border-green-500/30 bg-green-900/10`) to differentiate from other sections and suggest positive action
- Include Github icon from lucide-react with appropriate color (text-green-400)
- Style the fork button with hover effects and proper contrast
- Maintain responsive design and proper spacing

### Implementation Details
- Import Github icon from lucide-react
- Add repository URL as a constant or prop for easy configuration
- Style the fork button with appropriate GitHub-style colors and hover effects
- Ensure accessibility with proper ARIA labels and semantic HTML
- Handle external link security (rel="noopener noreferrer")

## Implementation Approach
1. Import Github icon from lucide-react
2. Insert new section div after Interactive Demo section (after line 384)
3. Add GitHub repository URL and fork functionality
4. Style the section to match existing design patterns with green accent color
5. Test responsiveness and theme switching
6. Verify external link behavior and accessibility