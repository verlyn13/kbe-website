# Mobile OAuth Redirect Issue - Diagnosis & Fix

## Problem Identified

The mobile OAuth redirect is failing because of **session persistence** and **timing issues**:

1. **Session Persistence Issue**: The app uses `browserSessionPersistence` (line 24 in firebase.ts) which doesn't persist across the redirect flow on mobile browsers
2. **Race Condition**: The redirect handler runs AFTER other useEffects, potentially missing the auth state

## Root Causes

### 1. Session Persistence Problem
```javascript
// Current in firebase.ts:
setPersistence(auth, browserSessionPersistence)
```
- `browserSessionPersistence` only persists within the same browser tab/session
- Mobile OAuth redirect opens a new tab/webview for Google auth
- When returning, it's treated as a new session, losing auth state

### 2. Timing Issue in login-form.tsx
- `completeGoogleRedirectIfPresent()` is called at line 196
- It runs AFTER `completeMagicLinkSignIn()` at line 195
- Both functions are async but not awaited
- The auth state might not be ready when redirect completes

### 3. Missing Diagnostic Logging
- No console logs to track the redirect flow on mobile
- Can't see if `getRedirectResult` is actually receiving the user

## IMMEDIATE FIX REQUIRED

### Fix 1: Change Session Persistence (CRITICAL)
```javascript
// In src/lib/firebase.ts, change line 24 from:
setPersistence(auth, browserSessionPersistence)

// To:
setPersistence(auth, browserLocalPersistence)
```

This ensures auth state persists across the redirect flow on mobile.

### Fix 2: Add Diagnostic Logging & Priority Handling
```javascript
// In src/components/login-form.tsx, update the useEffect (line 103):

useEffect(() => {
  // PRIORITY 1: Handle OAuth redirect FIRST
  const handleOAuthRedirect = async () => {
    console.log('[AUTH DEBUG] Checking for OAuth redirect result...');
    try {
      const result = await getRedirectResult(auth);
      console.log('[AUTH DEBUG] Redirect result:', result ? 'User found' : 'No result');
      
      if (result?.user) {
        console.log('[AUTH DEBUG] User from redirect:', result.user.email);
        const isNewUser = 
          result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
        
        // Helper function defined inside useEffect
        const routeAfterGoogleSignIn = async (uid: string, isNewUser: boolean) => {
          if (isNewUser) {
            const { doc, getDoc } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase');
            const profileDoc = await getDoc(doc(db, 'profiles', uid));
            if (!profileDoc.exists() || !profileDoc.data()?.profileCompleted) {
              router.push('/welcome');
              return;
            }
          }
          router.push('/dashboard');
        };
        
        await routeAfterGoogleSignIn(result.user.uid, isNewUser);
        return; // Exit early, don't check magic links
      }
    } catch (error) {
      console.error('[AUTH DEBUG] OAuth redirect error:', error);
      logger.error('Google redirect sign in failed', error as any);
      toast({
        variant: 'destructive',
        title: 'Google sign in failed',
        description: getErrorMessage(error),
      });
    }
  };

  // PRIORITY 2: Then check for magic links
  const completeMagicLinkSignIn = async () => {
    // ... existing magic link code ...
  };

  // Execute in priority order
  (async () => {
    await handleOAuthRedirect(); // Wait for OAuth check first
    await completeMagicLinkSignIn(); // Then check magic links
  })();
}, [router, toast]);
```

### Fix 3: Emergency Fallback (If Above Doesn't Work)
```javascript
// Add this at the TOP of LoginForm component, before any other hooks:
useEffect(() => {
  // Emergency redirect handler - runs IMMEDIATELY
  const emergencyRedirectHandler = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        // Force redirect using window.location for reliability
        console.log('[EMERGENCY] OAuth success, forcing redirect');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('[EMERGENCY] Redirect failed:', error);
    }
  };
  
  emergencyRedirectHandler();
}, []); // No dependencies, runs once immediately
```

## Testing Steps

1. **Deploy the persistence fix first** (most critical)
2. **Test on actual Android device**:
   - Clear all browser data
   - Visit site
   - Click Google sign-in
   - Complete OAuth
   - Should redirect to /dashboard

3. **Check console logs** on mobile:
   - Connect via chrome://inspect
   - Look for [AUTH DEBUG] messages
   - Verify redirect result is captured

## Why This Happens

The Firebase OAuth redirect flow on mobile:
1. User clicks "Sign in with Google"
2. `signInWithRedirect` is called
3. Browser redirects to Google's OAuth page
4. User completes authentication
5. Google redirects back to your app
6. **CRITICAL**: App must call `getRedirectResult` to complete the flow
7. **PROBLEM**: With `browserSessionPersistence`, the auth state is lost between steps 5-6

## Alternative Solution (If Persistence Change Causes Issues)

Use a hybrid approach:
```javascript
// Detect mobile and use different persistence
const persistence = isMobile ? browserLocalPersistence : browserSessionPersistence;
setPersistence(auth, persistence);
```

## Verification

After implementing, verify:
1. Mobile OAuth completes successfully
2. User is redirected to /dashboard (or /welcome for new users)
3. Auth state persists after redirect
4. Desktop behavior unchanged