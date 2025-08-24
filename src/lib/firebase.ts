import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration (env-only; no hardcoded defaults)
// Note: Values must be supplied via .env.local / Secret Manager
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase app (singleton pattern across client bundles)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Set session-only persistence on client to reduce risk on shared devices
if (typeof window !== 'undefined') {
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    // Keep silent in production, surface in dev
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Firebase] Error setting auth persistence:', error);
    }
  });

  // Initialize Firebase App Check with reCAPTCHA Enterprise (auto-refresh tokens)
  // NOTE: App Check enforcement mode must be set to "Unenforced" in Firebase Console during development
  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY as string | undefined;
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Firebase] App Check init error:', err);
    }
  }
}

export { app, auth, db };
