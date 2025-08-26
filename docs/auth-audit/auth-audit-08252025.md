# Firebase Authentication Implementation - Source of Truth Document
## Project: KBE Website | Next.js on Firebase App Hosting

---

## Project Authentication Requirements

### Supported Authentication Methods
1. **Email/Password**: Traditional authentication
2. **Google OAuth**: Social sign-in via Google accounts  
3. **Email Link (Magic Link)**: Passwordless authentication via email

### Deployment Configuration
- **Platform**: Web application only (PWA-capable)
- **Framework**: Next.js
- **Hosting**: Firebase App Hosting (Blaze plan)
- **No native mobile apps** (iOS/Android configuration not required)

---

## Section 1: Firebase Project Configuration

### 1.1 Firebase Console Settings

#### Authentication Providers
**Location**: Firebase Console → Authentication → Sign-in method

| Provider | Status | Configuration |
|----------|--------|---------------|
| Email/Password | ✅ Enabled | Standard email/password enabled |
| Email link | ✅ Enabled | Passwordless sign-in enabled |
| Google | ✅ Enabled | Auto-configured for project |

#### Authorized Domains
**Location**: Firebase Console → Authentication → Settings → Authorized domains

```
localhost
kbe-website.firebaseapp.com
kbe-website.web.app  
homerenrichment.com
www.homerenrichment.com
kbe-website--kbe-website.us-central1.hosted.app
kbe.homerenrichment.com
```

### 1.2 Google Cloud Console OAuth Configuration

#### OAuth 2.0 Client Configuration
**Location**: Google Cloud Console → APIs & Services → Credentials → Web client

**Authorized JavaScript origins** (must include all):
```
http://localhost
http://localhost:3000
http://localhost:5000
http://localhost:9000
http://localhost:9001
http://localhost:9002
http://localhost:9003
http://localhost:9200
https://kbe-website.firebaseapp.com
https://kbe-website.web.app
https://homerenrichment.com
https://www.homerenrichment.com
https://kbe-website--kbe-website.us-central1.hosted.app
https://kbe.homerenrichment.com
```

**Authorized redirect URIs** (must include all):
```
https://kbe-website.firebaseapp.com/__/auth/handler
https://kbe-website.web.app/__/auth/handler
https://homerenrichment.com/__/auth/handler
https://www.homerenrichment.com/__/auth/handler
https://kbe-website--kbe-website.us-central1.hosted.app/__/auth/handler
https://kbe.homerenrichment.com/__/auth/handler
http://localhost:3000/__/auth/handler
http://localhost:9000/__/auth/handler
http://localhost:9001/__/auth/handler
http://localhost:9002/__/auth/handler
http://localhost:9003/__/auth/handler
```

### 1.3 App Check Configuration

**Current Status**: MONITORING MODE (Unenforced)
- **Authentication**: Unenforced ✅ (MUST remain unenforced for OAuth)
- **Cloud Firestore**: Unenforced
- **Provider**: reCAPTCHA Enterprise
- **TTL**: 1 hour

**Critical**: Never enable enforcement for Authentication service while using OAuth providers.

---

## Section 2: Environment Configuration

### 2.1 Environment Variables

#### File: `.env.local` (Development)
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kbe-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kbe-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kbe-website.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=[your-sender-id]
NEXT_PUBLIC_FIREBASE_APP_ID=[your-app-id]
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=[your-measurement-id]

# App Check
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### File: `apphosting.yaml` (Production)
```yaml
runConfig:
  minInstances: 1
  maxInstances: 100
  concurrency: 80
  cpu: 1
  memoryMiB: 512

env:
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    secret: firebaseApiKey
    availability: [BUILD, RUNTIME]
    
  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    value: "kbe-website.firebaseapp.com"
    availability: [BUILD, RUNTIME]
    
  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: "kbe-website"
    availability: [BUILD, RUNTIME]
    
  - variable: NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY
    secret: recaptchaEnterpriseSiteKey
    availability: [BUILD, RUNTIME]
    
  - variable: NEXT_PUBLIC_APP_URL
    value: "https://homerenrichment.com"
    availability: [BUILD, RUNTIME]
```

---

## Section 3: Code Implementation

### 3.1 Firebase Initialization

#### File: `lib/firebase.ts`
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
export const auth = getAuth(app);

// Initialize App Check (client-side only)
if (typeof window !== 'undefined') {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;
  if (siteKey) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (error) {
      console.error('App Check initialization error:', error);
    }
  }
}

export default app;
```

### 3.2 Authentication Service

#### File: `lib/auth-service.ts`
```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

// Email/Password Authentication
export const signUpWithEmail = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Google OAuth Authentication
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  
  // Detect mobile for redirect vs popup
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    return signInWithRedirect(auth, provider);
  } else {
    return signInWithPopup(auth, provider);
  }
};

// Magic Link Authentication
export const sendMagicLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`,
    handleCodeInApp: true,
  };
  
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  
  // Store email for same-device sign-in
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('emailForSignIn', email);
  }
};

export const verifyMagicLink = async (email: string, link: string) => {
  return signInWithEmailLink(auth, email, link);
};

export const isMagicLinkValid = (link: string) => {
  return isSignInWithEmailLink(auth, link);
};

// Sign Out
export const signOut = async () => {
  return firebaseSignOut(auth);
};

// Auth State Observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

### 3.3 Authentication Context

#### File: `contexts/auth-context.tsx`
```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth-service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 3.4 Authentication Pages

#### File: `app/auth/signin/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle, sendMagicLink } from '@/lib/auth-service';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleMagicLink = async () => {
    try {
      await sendMagicLink(email);
      setMagicLinkSent(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (magicLinkSent) {
    return (
      <div>
        <h2>Check Your Email</h2>
        <p>We've sent a sign-in link to {email}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign In</h1>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleEmailSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      
      <button onClick={handleMagicLink} disabled={!email}>
        Send Magic Link
      </button>
      
      <button onClick={handleGoogleSignIn}>
        Sign In with Google
      </button>
    </div>
  );
}
```

#### File: `app/auth/verify-email/page.tsx`
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isMagicLinkValid, verifyMagicLink } from '@/lib/auth-service';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'error' | 'success'>('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      const link = window.location.href;
      
      if (!isMagicLinkValid(link)) {
        setStatus('error');
        return;
      }

      let email = window.localStorage.getItem('emailForSignIn');
      
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
        if (!email) {
          setStatus('error');
          return;
        }
      }

      try {
        await verifyMagicLink(email, link);
        window.localStorage.removeItem('emailForSignIn');
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 2000);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div>
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>Success! Redirecting...</p>}
      {status === 'error' && (
        <div>
          <p>Invalid or expired link</p>
          <button onClick={() => router.push('/auth/signin')}>
            Return to Sign In
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Section 4: Testing & Validation

### 4.1 Authentication Testing Checklist

#### Email/Password
- [ ] User can create account with email/password
- [ ] User can sign in with existing credentials
- [ ] Invalid credentials show appropriate error
- [ ] Password reset flow works

#### Google OAuth
- [ ] Desktop: Popup flow works
- [ ] Mobile: Redirect flow works
- [ ] OAuth completes without `auth/internal-error`
- [ ] User profile information retrieved

#### Magic Link
- [ ] Email sent successfully
- [ ] Link format: `https://[domain]/__/auth/action?mode=signIn&oobCode=...`
- [ ] Same-device sign-in completes
- [ ] Cross-device sign-in prompts for email
- [ ] Expired links show appropriate error

### 4.2 Security Validation

- [ ] App Check in monitoring mode only
- [ ] No email parameters in URLs
- [ ] HTTPS enforced in production
- [ ] Magic links expire after use
- [ ] Auth state persists on refresh

### 4.3 Error Codes Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/invalid-email` | Email format invalid | Validate email format |
| `auth/user-not-found` | Account doesn't exist | Direct to sign-up |
| `auth/wrong-password` | Incorrect password | Show password reset option |
| `auth/internal-error` | OAuth/App Check conflict | Ensure App Check unenforced |
| `auth/unauthorized-domain` | Domain not authorized | Add to Firebase settings |
| `auth/invalid-action-code` | Magic link expired/used | Request new link |

---

## Section 5: Deployment Checklist

### Pre-Deployment
1. [ ] Environment variables set in `.env.local`
2. [ ] `apphosting.yaml` configured with secrets
3. [ ] OAuth redirect URIs include production domains
4. [ ] App Check in monitoring mode

### Deployment Commands
```bash
# Set secrets for Firebase App Hosting
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase apphosting:secrets:set NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY

# Deploy to Firebase App Hosting
git push origin main  # Triggers automatic deployment
```

### Post-Deployment
1. [ ] Test all auth methods on production domain
2. [ ] Monitor App Check metrics
3. [ ] Check error logs for auth failures
4. [ ] Verify SSL certificates active

---

## Section 6: Maintenance & Monitoring

### Weekly Checks
- Review App Check metrics (% verified requests)
- Monitor authentication success rates
- Check for unusual error patterns

### Monthly Reviews
- Rotate API keys if needed
- Review authorized domains
- Update OAuth consent screen if changed
- Check for Firebase SDK updates

### Critical Warnings
1. **Never enable App Check enforcement** while using OAuth
2. **Never remove** `kbe-website.firebaseapp.com` from authorized domains
3. **Always test** auth flows after domain changes
4. **Keep** the reCAPTCHA key synchronized

---

## Document Version
- **Last Updated**: August 25, 2025
- **Version**: 1.0.0
- **Status**: Production Ready
- **Next Review**: September 25, 2025

This document is the authoritative source for all Firebase Authentication configuration and implementation details for the KBE Website project.
