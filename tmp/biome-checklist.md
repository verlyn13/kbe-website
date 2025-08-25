# Biome Remaining Findings - Final Sprint

Total: 47 issues across 13 rules

## 1. Fast Wins - CSS (4 issues)

### correctness/noInvalidPositionAtImportRule (4)
- [ ] src/styles/globals.css - Move @import statements to top
- [ ] src/styles/calendar.css - Move @import statements to top  
- [ ] src/styles/theme.css - Move @import statements to top
- [ ] src/app/layout.css - Move @import statements to top

## 2. Keys & IDs (13 issues)

### suspicious/noArrayIndexKey (8)
- [ ] src/components/calendar/event-dialog.tsx - Line ~145 (skills.map with index)
- [ ] src/app/calendar/page.tsx - Line ~280 (events.map with index)
- [ ] src/app/admin/communications/compose/page.tsx - Line ~180 (recipients.map)
- [ ] src/app/profile/page.tsx - Line ~420 (students.map)
- [ ] src/components/portal/student-roster.tsx - Multiple instances
- [ ] src/components/navigation.tsx - Menu items with index
- [ ] src/app/admin/users/page.tsx - Users list with index
- [ ] src/components/dashboard-widgets.tsx - Widget items with index

### correctness/useUniqueElementIds (5)
- [ ] src/components/eula-dialog.tsx - Checkbox IDs
- [ ] src/components/calendar/event-dialog.tsx - Form field IDs
- [ ] src/app/admin/communications/compose/page.tsx - Template selector IDs
- [ ] src/components/dashboard-widgets.tsx - Widget form IDs
- [ ] src/app/register/page.tsx - Multi-step form IDs

## 3. React Hooks (13 issues)

### correctness/useExhaustiveDependencies (13)
- [ ] src/components/announcements.tsx:33 - loadAnnouncements dependency
- [ ] src/app/calendar/page.tsx:73 - loadEvents dependency
- [ ] src/app/admin/waivers/page.tsx:67 - loadStudents dependency
- [ ] src/app/admin/users/page.tsx:74 - loadUsers dependency
- [ ] src/app/admin/reports/page.tsx:49 - loadRegistrationData dependency
- [ ] src/app/admin/registrations/page.tsx:34 - loadRegistrations dependency
- [ ] src/app/admin/communications/page.tsx:43 - loadAnnouncements dependency
- [ ] src/app/admin/activity/page.tsx:28 - loadActivityLogs dependency
- [ ] src/app/profile/page.tsx:95 - loadProfile dependency
- [ ] src/app/dashboard/layout.tsx:42 - checkAdminStatus dependency
- [ ] src/app/announcements/page.tsx:57 - loadAnnouncements dependency
- [ ] src/app/waiver/page.tsx:15 - One-time setup effect
- [ ] src/app/debug-auth/page.tsx:48 - checkIndexedDB dependency

## 4. Accessibility & Best Practices (17 issues)

### a11y/noStaticElementInteractions (2)
- [ ] src/components/announcements.tsx:106 - Clickable div needs keyboard handler
- [ ] src/components/portal/upcoming-competitions.tsx - Clickable cards

### a11y/useKeyWithClickEvents (2)
- [ ] src/components/announcements.tsx:106 - Add onKeyDown handler
- [ ] src/components/portal/upcoming-competitions.tsx - Add keyboard navigation

### a11y/noSvgWithoutTitle (2)
- [ ] src/components/icons.tsx - Add titles to SVG icons
- [ ] src/components/theme-image.tsx - Add title to decorative SVG

### suspicious/noUnknownAtRules (3)
- [ ] src/styles/globals.css - Tailwind directives (@tailwind, @layer)
- [ ] Configure Biome to recognize Tailwind at-rules

### a11y/noLabelWithoutControl (2)
- [ ] src/components/guardian-info-form.tsx - Associate orphaned labels
- [ ] src/app/signup/page.tsx - Fix label associations

### suspicious/noAssignInExpressions (2)
- [ ] src/lib/utils.ts - Refactor assignment in condition
- [ ] src/components/calendar/event-dialog.tsx - Separate assignment from expression

### Other (4)
- [ ] suspicious/noDocumentCookie (1) - Abstract cookie usage
- [ ] correctness/noUnusedFunctionParameters (1) - Remove or prefix with _
- [ ] correctness/noNestedComponentDefinitions (1) - Extract nested component
- [ ] a11y/useValidAnchor (1) - Fix anchor href attribute

## Execution Plan

### Phase 1: CSS Imports (5 min)
Move all @import to top of files

### Phase 2: Array Keys (30 min)
Add stable keys based on data properties

### Phase 3: Unique IDs (20 min)
Add useId() hooks to remaining forms

### Phase 4: Hook Dependencies (45 min)
Fix or annotate with biome-ignore

### Phase 5: A11y & Cleanup (30 min)
Fix keyboard handlers and remaining issues

### Total Time: ~2 hours