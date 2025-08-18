# KBE Design System Rules

## Color Palette

### Primary Colors

- **Teal**: `#008080` - Primary brand color for headers, buttons, links
- **Gold**: `#B8860B` - Secondary accent color for highlights, success states

### Usage Guidelines

- Use teal for primary actions and navigation elements
- Use gold sparingly for emphasis and call-to-action elements
- Maintain sufficient contrast ratios (minimum 4.5:1 for text)
- Test colors in both light and dark mode scenarios

## Typography

### Font Stack

```css
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
  sans-serif;
```

### Scale (Tailwind CSS)

- `text-xs`: 12px - Small labels, captions
- `text-sm`: 14px - Body text, form labels
- `text-base`: 16px - Default body text
- `text-lg`: 18px - Large body text
- `text-xl`: 20px - Small headings
- `text-2xl`: 24px - Section headings
- `text-3xl`: 30px - Page headings
- `text-4xl`: 36px - Hero headings

## Spacing

### Consistent Scale (Tailwind)

- `gap-2`: 8px - Tight spacing
- `gap-4`: 16px - Standard spacing
- `gap-6`: 24px - Loose spacing
- `gap-8`: 32px - Section spacing
- `gap-12`: 48px - Large section spacing

### Component Padding

- Buttons: `px-4 py-2` (standard), `px-6 py-3` (large)
- Cards: `p-6` (standard), `p-8` (large)
- Forms: `p-4` (inputs), `gap-4` (between fields)

## Component Patterns

### Buttons

```tsx
// Primary button
<Button className="bg-teal-600 hover:bg-teal-700 text-white">

// Secondary button
<Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">

// Accent button
<Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
```

### Cards

```tsx
<Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
  <CardHeader className="border-b border-slate-100">
    <CardTitle className="text-slate-800">
  </CardHeader>
  <CardContent className="p-6">
```

### Forms

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field" className="text-sm font-medium text-slate-700">
    <Input id="field" className="border-slate-300 focus:border-teal-500 focus:ring-teal-500">
  </div>
</div>
```

## Responsive Design

### Breakpoints (Tailwind)

- `sm`: 640px - Small devices
- `md`: 768px - Medium devices
- `lg`: 1024px - Large devices
- `xl`: 1280px - Extra large devices

### Mobile-First Approach

- Design for mobile first (320px+)
- Progressive enhancement for larger screens
- Touch-friendly targets (minimum 44px)
- Readable text sizes (minimum 16px on mobile)

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

- Color contrast minimum 4.5:1 for normal text
- Color contrast minimum 3:1 for large text
- All interactive elements keyboard accessible
- Proper heading hierarchy (h1, h2, h3...)
- Alt text for all meaningful images
- Proper form labels and error messages

### Focus Management

```tsx
// Visible focus indicators
className="focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"

// Skip links for keyboard navigation
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to main content
</a>
```

## Animation & Motion

### Subtle Transitions

```css
/* Standard transitions */
transition: all 150ms ease-in-out;

/* Hover states */
hover: scale-105 transition-transform /* Loading states */ animate-pulse animate-spin
  (for loading spinners);
```

### Motion Preferences

- Respect `prefers-reduced-motion`
- Keep animations under 500ms
- Use easing functions (`ease-in-out`)
- Avoid auto-playing videos or carousels

## Educational Context

### Content Hierarchy

- Clear visual hierarchy for learning materials
- Consistent spacing between content sections
- Readable line heights (`leading-relaxed`)
- Sufficient white space for cognitive rest

### Student-Friendly Design

- Large, clear interactive elements
- High contrast for readability
- Consistent navigation patterns
- Progress indicators for multi-step processes

### Parent Dashboard

- Clean, professional aesthetic
- Data visualization with clear labels
- Easy-to-scan progress summaries
- Prominent call-to-action buttons
