// Compatibility re-export to avoid duplicate initialization.
// All Firebase client access should go through '@/lib/firebase'.
export { app, auth } from './firebase';
