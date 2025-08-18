# Coding Standards

## 1. File Organization

- Group by feature in `app/` directory
- Shared components in `src/components/`
- Utilities in `src/lib/`
- Custom hooks in `src/hooks/`
- AI integration in `src/ai/`
- Type definitions co-located with components

## 2. Component Patterns

- Use server components by default
- Client components only when needed ('use client')
- Implement loading.tsx and error.tsx boundaries
- Use compound component patterns for complex UI
- Prefer composition over inheritance
- Export components as default from their files

## 3. TypeScript Standards

- No `any` types - use `unknown` when needed
- Explicit return types for functions
- Use Zod schemas for runtime validation
- Define interfaces for component props
- Use strict mode configuration
- Leverage type inference where appropriate

## 4. Performance Optimization

- Lazy load heavy components with dynamic imports
- Use Next.js Image component for all images
- Implement proper caching strategies
- Minimize client-side JavaScript bundle
- Use Suspense boundaries for async operations
- Optimize Core Web Vitals metrics

## 5. Styling Guidelines

- Mobile-first responsive design approach
- Use Tailwind CSS utility classes
- Follow KBE design system colors (teal #008080, gold #B8860B)
- Implement consistent spacing using Tailwind scale
- Use CSS Grid and Flexbox for layouts
- Maintain WCAG 2.1 AA accessibility standards

## 6. State Management

- Use React Server Components for data fetching
- Client state with useState/useReducer hooks
- Form state with React Hook Form + Zod validation
- Global state only when necessary
- Prefer URL state for navigation

## 7. Error Handling

- Implement error boundaries at route level
- Use try-catch blocks in async operations
- Provide meaningful error messages to users
- Log errors for debugging purposes
- Graceful degradation for non-critical features

## 8. Testing Standards

- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for user workflows
- E2E tests for critical paths
- Maintain minimum 80% code coverage
- Mock external dependencies appropriately

## 9. Documentation Requirements

- JSDoc comments for complex functions
- README files for major features
- Component documentation with examples
- API endpoint documentation
- Architecture decision records (ADRs)

## 10. Git Workflow

- Use conventional commit messages
- Feature branches from main
- Pull request reviews required
- Squash commits on merge
- Keep commit history clean and meaningful
