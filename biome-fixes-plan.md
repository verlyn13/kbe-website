# Biome Error Fixes Plan

## Current Status
- **Total Errors in src/**: 119
- **Total Warnings**: 19

## Error Categories & Fix Strategy

### 1. Duplicate Element IDs (41 errors)
**Issue**: `lint/correctness/useUniqueElementIds`
**Files**: Forms with multiple inputs using same IDs
**Fix Strategy**: 
- Add unique suffixes to IDs based on field context
- Use React's useId() hook for generating unique IDs
- Ensure label `htmlFor` matches updated IDs

### 2. Label Without Control (33 errors)
**Issue**: `lint/a11y/noLabelWithoutControl`
**Files**: Forms where labels aren't properly associated
**Fix Strategy**:
- Wrap inputs inside labels OR
- Use htmlFor attribute pointing to input ID
- For custom components, use aria-labelledby

### 3. Array Index as Key (17 errors)
**Issue**: `lint/suspicious/noArrayIndexKey`
**Files**: Lists using index as React key
**Fix Strategy**:
- Use unique item properties (id, email, etc.) as keys
- For static lists, create stable IDs
- Only use index if list never reorders

### 4. Exhaustive Dependencies (14 errors)
**Issue**: `lint/correctness/useExhaustiveDependencies`
**Files**: React hooks with missing dependencies
**Fix Strategy**:
- Wrap functions in useCallback
- Add missing dependencies to arrays
- Use refs for values that shouldn't trigger re-renders

### 5. CSS Import Order (4 errors)
**Issue**: `lint/correctness/noInvalidPositionAtImportRule`
**Files**: CSS files with imports after other rules
**Fix Strategy**:
- Move all @import statements to top of CSS files
- Ensure imports come before any other CSS rules

### 6. SVG Accessibility (4 errors)
**Issue**: `lint/a11y/noSvgWithoutTitle`
**Files**: SVG icons without titles
**Fix Strategy**:
- Add `<title>` element inside SVGs
- OR add `role="img"` and `aria-label`
- For decorative SVGs, use `aria-hidden="true"`

### 7. Unknown CSS At-Rules (3 errors)
**Issue**: `lint/suspicious/noUnknownAtRules`
**Files**: Tailwind CSS files
**Fix Strategy**:
- Add Tailwind directives to known at-rules in Biome config
- Or disable rule for Tailwind files

### 8. Click Without Keyboard (3 errors)
**Issue**: `lint/a11y/useKeyWithClickEvents`
**Files**: Clickable divs without keyboard handlers
**Fix Strategy**:
- Add onKeyDown/onKeyUp handlers
- OR use button elements instead
- Add proper ARIA roles

### 9. Static Element Interactions (3 errors)
**Issue**: `lint/a11y/noStaticElementInteractions`
**Files**: Divs with onClick handlers
**Fix Strategy**:
- Use semantic elements (button, a)
- OR add role="button" and tabIndex
- Include keyboard event handlers

### 10. Other Issues (9 errors)
- Document.cookie usage (2) - Use abstraction layer
- Control characters in regex (2) - Escape properly
- Assignments in expressions (2) - Refactor logic
- Nested components (2) - Move outside parent
- Semantic elements (2) - Use proper HTML5 elements
- DangerouslySetInnerHTML (1) - Sanitize or refactor
- Unused parameters (1) - Remove or prefix with _
- Invalid anchor (1) - Fix href attribute

## Execution Order

1. **Quick Wins** (30 min)
   - Fix CSS import order
   - Fix array index keys
   - Fix unused parameters

2. **Form Fixes** (1 hour)
   - Fix duplicate IDs
   - Fix label associations

3. **Accessibility** (45 min)
   - Fix SVG titles
   - Fix keyboard handlers
   - Fix static interactions

4. **React Patterns** (45 min)
   - Fix useEffect dependencies
   - Fix nested components
   - Fix key props

5. **Security & Best Practices** (30 min)
   - Fix cookie usage
   - Fix dangerous HTML
   - Fix regex patterns

## Commands to Run

```bash
# Check specific error type
npx biome check src --only correctness/useUniqueElementIds

# Auto-fix where possible
npx biome check --write --unsafe src

# Verify fixes
npx biome check src

# Final validation
npm run typecheck
npm run build
```

## Success Criteria
- [ ] 0 errors in `npx biome check src`
- [ ] TypeScript compilation passes
- [ ] Build succeeds
- [ ] No regression in functionality