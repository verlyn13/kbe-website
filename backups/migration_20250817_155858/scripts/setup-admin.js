// Script to set up admin users in Firebase
// Run this script locally to create admin accounts
// Usage: node scripts/setup-admin.js

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download a service account key from Firebase Console
// and set the path to it in the GOOGLE_APPLICATION_CREDENTIALS environment variable
// OR provide it directly here (but don't commit it!)

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS environment variable');
  console.error('Download from: Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

admin.initializeApp({
  projectId: 'kbe-website',
});

const db = admin.firestore();

async function createAdminUser(email, name, role = 'superAdmin') {
  try {
    // First, get the user by email (they need to have registered first)
    const user = await admin.auth().getUserByEmail(email);
    
    // Create admin record in Firestore
    await db.collection('admins').doc(user.uid).set({
      email: email,
      name: name,
      role: role,
      permissions: role === 'superAdmin' ? ['all'] : [
        'view_dashboard',
        'manage_registrations',
        'send_announcements',
        'manage_programs',
        'view_reports'
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Also set custom claims for Firebase Auth
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      role: role
    });
    
    console.log(`✅ Admin user created: ${email} (${role})`);
  } catch (error) {
    console.error(`❌ Error creating admin for ${email}:`, error.message);
  }
}

async function main() {
  // Add your admin users here
  const admins = [
    { email: 'admin1@example.com', name: 'Admin One', role: 'superAdmin' },
    { email: 'admin2@example.com', name: 'Admin Two', role: 'superAdmin' },
  ];
  
  console.log('Setting up admin users...\n');
  
  for (const admin of admins) {
    await createAdminUser(admin.email, admin.name, admin.role);
  }
  
  console.log('\n✅ Admin setup complete!');
  console.log('Note: Users must register with these email addresses first before running this script.');
  process.exit(0);
}

main().catch(console.error);