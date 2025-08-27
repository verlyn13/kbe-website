# Type Migration Guide - Fixing 'any' Types

## Quick Replacements (91 occurrences found)

### 1. Error Handling (Most Common)

```typescript
// ❌ Before:
catch (error: any) {
  console.error(error.message);
}

// ✅ After:
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
}

// Or with type guard:
import { FirebaseError } from '@/types/firebase';
catch (error) {
  if (error instanceof Error) {
    // Handle as Error
  }
}
```

### 2. Event Handlers

```typescript
// ❌ Before:
const handleClick = (e: any) => {
  e.preventDefault();
};

// ✅ After:
import { ButtonClickEvent } from '@/types/events';
const handleClick = (e: ButtonClickEvent) => {
  e.preventDefault();
};
```

### 3. Firebase Data

```typescript
// ❌ Before:
const userData: any = doc.data();

// ✅ After:
import { UserProfile } from '@/types/firebase';
const userData = doc.data() as UserProfile;
```

### 4. Component Props

```typescript
// ❌ Before:
interface Props {
  data: any;
  onChange: (value: any) => void;
}

// ✅ After:
interface Props<T = unknown> {
  data: T;
  onChange: (value: T) => void;
}
```

## Files to Update (Top Priority)

Based on Stage 2 audit, focus on:

1. `src/lib/firebase-admin.ts` (666 lines - has many 'any')
2. `src/components/ui/sidebar.tsx` (748 lines)
3. API route handlers in `app/api/`
4. Form components with event handlers

## Safe Update Strategy

1. Start with type definition files (this task)
2. Update one file at a time
3. Use TypeScript's strict mode locally to find issues
4. Run `npx tsc --noEmit` after each file
5. Commit after each successful file update
