import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'kbe-website.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'kbe-website',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'kbe-website.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '886214990861',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:886214990861:web:69d21293a494f323e94944',
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
