#!/usr/bin/env node

/**
 * Debug script for Firebase Magic Link Authentication
 * Run with: node scripts/debug-magic-link.js
 */

import { initializeApp } from 'firebase/app';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔍 Firebase Configuration:');
console.log('   Auth Domain:', firebaseConfig.authDomain);
console.log('   Project ID:', firebaseConfig.projectId);
console.log('   App ID:', firebaseConfig.appId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testMagicLink() {
  const testEmail = 'test@example.com'; // Change this to your test email

  console.log('\n📧 Testing Magic Link Authentication...');
  console.log('   Email:', testEmail);

  // Test different action code settings
  const configurations = [
    {
      name: 'Local Development',
      settings: {
        url: 'http://localhost:9002/',
        handleCodeInApp: true,
      },
    },
    {
      name: 'Firebase Hosting',
      settings: {
        url: 'https://kbe-website.firebaseapp.com/',
        handleCodeInApp: true,
      },
    },
    {
      name: 'Custom Domain from .env',
      settings: {
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://homerconnect.com/',
        handleCodeInApp: true,
      },
    },
  ];

  for (const config of configurations) {
    console.log(`\n🧪 Testing with ${config.name}:`);
    console.log('   URL:', config.settings.url);

    try {
      await sendSignInLinkToEmail(auth, testEmail, config.settings);
      console.log('   ✅ Success! Magic link sent.');
      console.log('   Check your email and inspect the link format.');
      break; // Stop after first success
    } catch (error) {
      console.error('   ❌ Failed:', error.code);
      console.error('   Message:', error.message);

      // Provide specific guidance based on error
      if (error.code === 'auth/operation-not-allowed') {
        console.log('\n   💡 Fix: Enable Email Link sign-in in Firebase Console:');
        console.log(
          '      1. Go to https://console.firebase.google.com/project/kbe-website/authentication/providers'
        );
        console.log('      2. Click on Email/Password');
        console.log('      3. Enable "Email link (passwordless sign-in)"');
      } else if (
        error.code === 'auth/invalid-continue-uri' ||
        error.code === 'auth/unauthorized-continue-uri'
      ) {
        console.log('\n   💡 Fix: Add this domain to authorized domains:');
        console.log(
          '      1. Go to https://console.firebase.google.com/project/kbe-website/authentication/settings'
        );
        console.log('      2. Add domain:', new URL(config.settings.url).hostname);
      }
    }
  }
}

// Check current auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('\n👤 Currently signed in as:', user.email);
  } else {
    console.log('\n👤 Not currently signed in');
  }
});

// Run the test
testMagicLink().catch(console.error);
