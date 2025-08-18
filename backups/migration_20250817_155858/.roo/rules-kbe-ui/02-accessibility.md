# KBE Accessibility Guidelines

## WCAG 2.1 AA Compliance Requirements

### Color and Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio (18pt+ or 14pt+ bold)
- **UI components**: Minimum 3:1 contrast ratio for borders and states
- **Never rely on color alone** to convey information

### Color Testing Tools
```bash
# Use these tools to verify contrast ratios
- WebAIM Contrast Checker
- Colour Contrast Analyser
- Chrome DevTools contrast ratio tool
```

## Keyboard Navigation

### Focus Management
```tsx
// All interactive elements must be keyboard accessible
<button 
  className="focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
```

### Tab Order
- Logical tab sequence through content
- Skip links for main navigation
- Focus trapping in modals/dialogs
- No keyboard traps (users can always escape)

### Skip Navigation
```tsx
// Required skip link at top of page
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-white px-4 py-2 border border-slate-300 rounded"
>
  Skip to main content
</a>
```

## Screen Reader Support

### Semantic HTML
```tsx
// Use proper heading hierarchy
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>

// Use semantic elements
<main id="main-content">
<nav aria-label="Main navigation">
<article>
<section>
<aside>
```

### ARIA Labels and Descriptions
```tsx
// Form controls
<Label htmlFor="email" className="required">
  Email Address
  <span className="sr-only">required</span>
</Label>
<Input 
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
  required
/>
{hasError && (
  <div id="email-error" role="alert" className="text-red-600">
    Please enter a valid email address
  </div>
)}

// Buttons with icons
<Button aria-label="Close dialog">
  <X className="h-4 w-4" aria-hidden="true" />
</Button>

// Loading states
<Button disabled aria-live="polite">
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Live Regions
```tsx
// Status announcements
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>

// Error announcements (urgent)
<div aria-live="assertive" aria-atomic="true" className="sr-only">
  {errorMessage}
</div>
```

## Form Accessibility

### Labels and Instructions
```tsx
// Always associate labels with form controls
<div className="space-y-2">
  <Label htmlFor="password" className="text-sm font-medium">
    Password
    <span className="text-red-500 ml-1" aria-label="required">*</span>
  </Label>
  <Input 
    id="password"
    type="password"
    aria-describedby="password-help password-error"
    aria-invalid={!!errors.password}
    required
  />
  <div id="password-help" className="text-sm text-slate-600">
    Must be at least 8 characters long
  </div>
  {errors.password && (
    <div id="password-error" role="alert" className="text-sm text-red-600">
      {errors.password.message}
    </div>
  )}
</div>
```

### Error Handling
```tsx
// Form validation summary
{errors && Object.keys(errors).length > 0 && (
  <div role="alert" className="mb-4 p-4 border border-red-300 bg-red-50 rounded">
    <h3 className="text-lg font-medium text-red-800 mb-2">
      Please correct the following errors:
    </h3>
    <ul className="list-disc list-inside text-red-700">
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>
          <a href={`#${field}`} className="underline hover:no-underline">
            {error.message}
          </a>
        </li>
      ))}
    </ul>
  </div>
)}
```

## Interactive Components

### Buttons and Links
```tsx
// Descriptive button text
<Button>Save Changes</Button> // Good
<Button>Click Here</Button>   // Bad

// External links
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1"
>
  External Resource
  <ExternalLink className="h-4 w-4" aria-hidden="true" />
  <span className="sr-only">(opens in new window)</span>
</a>
```

### Modal Dialogs
```tsx
// Proper dialog implementation
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure you want to continue?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="gap-2">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tables
```tsx
// Accessible data tables
<table className="w-full">
  <caption className="text-lg font-medium mb-4">
    Student Progress Report
  </caption>
  <thead>
    <tr>
      <th scope="col" className="text-left p-2">Student Name</th>
      <th scope="col" className="text-left p-2">Subject</th>
      <th scope="col" className="text-left p-2">Grade</th>
      <th scope="col" className="text-left p-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" className="p-2 font-medium">John Doe</th>
      <td className="p-2">Mathematics</td>
      <td className="p-2">A-</td>
      <td className="p-2">
        <Button size="sm" aria-label="View details for John Doe's Mathematics grade">
          View Details
        </Button>
      </td>
    </tr>
  </tbody>
</table>
```

## Images and Media

### Alt Text Guidelines
```tsx
// Informative images
<img 
  src="/student-progress-chart.png" 
  alt="Bar chart showing student progress: Math 85%, Science 92%, Reading 78%" 
/>

// Decorative images
<img 
  src="/decorative-pattern.png" 
  alt="" 
  role="presentation"
/>

// Complex images with longer descriptions
<figure>
  <img 
    src="/complex-diagram.png" 
    alt="Student learning pathway flowchart" 
    aria-describedby="diagram-description"
  />
  <figcaption id="diagram-description">
    Detailed description: The flowchart shows three main learning paths...
  </figcaption>
</figure>
```

### Video Content
```tsx
// Video with captions and transcripts
<video controls aria-describedby="video-description">
  <source src="/lesson.mp4" type="video/mp4" />
  <track kind="captions" src="/lesson-captions.vtt" srcLang="en" label="English" />
  <p>Your browser doesn't support video. <a href="/lesson-transcript.html">Read the transcript</a></p>
</video>
<div id="video-description">
  <p>This 5-minute lesson covers basic algebra concepts.</p>
  <a href="/lesson-transcript.html">View full transcript</a>
</div>
```

## Educational Context Considerations

### Student Accessibility Needs
- **Dyslexia-friendly**: High contrast, clear fonts, adequate spacing
- **ADHD considerations**: Minimal distractions, clear focus indicators
- **Motor impairments**: Large click targets (minimum 44px), adequate spacing
- **Visual impairments**: Screen reader compatibility, keyboard navigation

### Parent Dashboard Accessibility
- **Quick scanning**: Clear headings, consistent layout patterns
- **Data comprehension**: Plain language summaries, visual hierarchy
- **Mobile accessibility**: Touch-friendly targets, readable text sizes

### Progress Indicators
```tsx
// Accessible progress bar
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>{percentage}% complete</span>
  </div>
  <div 
    role="progressbar" 
    aria-valuenow={percentage} 
    aria-valuemin={0} 
    aria-valuemax={100}
    aria-label={`Course progress: ${percentage}% complete`}
    className="w-full bg-slate-200 rounded-full h-2"
  >
    <div 
      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    />
  </div>
</div>
```

## Testing Checklist

### Automated Testing
- Run axe-core accessibility tests
- Use ESLint accessibility plugins
- Implement accessibility unit tests

### Manual Testing
- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast ratios
- [ ] Test with 200% zoom level
- [ ] Verify focus indicators are visible
- [ ] Test forms with various input methods

### User Testing
- Include users with disabilities in testing process
- Test with assistive technologies in real-world scenarios
- Gather feedback on cognitive load and usability