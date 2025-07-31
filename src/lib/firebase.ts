
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhTEs3Uxq_KBLBzbzIL2VB4Ao_DBw9faM",
  authDomain: "kbe-website.firebaseapp.com",
  projectId: "kbe-website",
  storageBucket: "kbe-website.firebasestorage.app",
  messagingSenderId: "886214990861",
  appId: "1:886214990861:web:69d21293a494f323e94944"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
