import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

console.log('[Firebase] Config:', {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
console.time('[Firebase] Initialization');
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
console.timeEnd('[Firebase] Initialization');

// Only set persistence on client side
// TEMPORARILY DISABLED to test if this is causing the delay
// if (typeof window !== 'undefined') {
//   console.time('[Firebase] Set persistence');
//   setPersistence(auth, browserLocalPersistence)
//     .then(() => {
//       console.timeEnd('[Firebase] Set persistence');
//     })
//     .catch((error) => {
//       console.timeEnd('[Firebase] Set persistence');
//       console.error('Error setting persistence:', error);
//     });
// }

export { app, auth };
