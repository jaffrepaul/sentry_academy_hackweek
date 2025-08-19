# Interactive Sentry UI Demo Feature Plan

## Description

Add a new content section after the code example in CourseDetail.tsx that displays an interactive demo of the Sentry UI using Arcade.software. This section will allow users to experience the implemented logging feature directly within the Sentry interface, providing hands-on learning beyond just code examples.

## Technical Requirements

### Files to be Modified

- `src/components/CourseDetail.tsx` - Add new interactive demo section after the existing code example section (after line 354)

### New Section Placement

The new Arcade demo section should be inserted after the current Real World Scenario section and before the code example section, maintaining the existing visual flow and spacing.

### Component Structure

The new section will follow the existing design pattern used in CourseDetail.tsx:

- Consistent styling with other content sections using the same border, background, and spacing classes
- Dark/light theme support using the existing `isDark` theme context
- Responsive design matching the current grid layout
- Similar visual hierarchy with icon, title, and content area

### Interactive Demo Integration

- Embed Arcade.software interactive demo iframe showing Sentry logging interface
- Demo should showcase the logging feature implemented in the code example
- Include fallback content or loading state for the embedded demo
- Ensure iframe is responsive and accessible

### Content Focus

The interactive demo should demonstrate:

- Sentry's logging interface and how structured logs appear in the UI
- How to navigate and filter logs in the Sentry dashboard
- Real-time log visualization and search capabilities
- Connection between the code example above and the actual Sentry UI experience

### Styling Requirements

- Use existing utility classes and theme context for consistency
- Match the visual style of other content sections (Key Takeaways, Real World Scenario, Code Example)
- Include appropriate icon (e.g., Monitor, Play, or Interactive icon from lucide-react)
- Maintain responsive aspect ratio for the embedded demo
- Apply backdrop blur and border styling consistent with the design system

### Integration Details

- Configure Arcade.software embed with appropriate iframe attributes
- Handle iframe loading states and potential errors gracefully
- Ensure the demo is accessible and works across different devices
- Maintain performance by lazy-loading the iframe if needed

## Implementation Approach

1. Insert new section div after the code example section
2. Add Arcade.software iframe embed with proper configuration
3. Style the section to match existing design patterns
4. Test responsiveness and theme switching
5. Verify accessibility and cross-browser compatibility

The feature enhances the learning experience by bridging the gap between code implementation and real UI interaction, making the course more engaging and practical.
