const firebase = require('firebase/auth');
console.log('Firebase Auth version:', firebase.SDK_VERSION || 'version not found');
console.log('Firebase Auth exports:', Object.keys(firebase).slice(0, 20));

// Try to find any /n/ references in the Firebase code
const authCode = firebase.signInWithRedirect.toString();
console.log('signInWithRedirect function code length:', authCode.length);
if (authCode.includes('/n/')) {
  console.log('FOUND /n/ in signInWithRedirect!');
} else {
  console.log('No /n/ found in signInWithRedirect function');
}