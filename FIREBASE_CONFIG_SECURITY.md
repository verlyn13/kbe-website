# Firebase Configuration Security Notes

## Current Issue
The file `src/lib/firebase-config.ts` contains hardcoded Firebase configuration as fallbacks.

## Recommended Fix
Remove the hardcoded values and require environment variables:

```typescript
// Instead of:
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBhTEs3...',

// Use:
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
```

## Why This Matters
- Prevents accidental use of wrong project config
- Forces proper environment setup
- Reduces git diff noise
- Follows security best practices

## Note
NEXT_PUBLIC_* variables are safe to expose (they're client-side).
However, hardcoding them reduces configuration flexibility.
