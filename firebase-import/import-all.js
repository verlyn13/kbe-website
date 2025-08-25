const admin = require('firebase-admin');
const fs = require('node:fs');

// IMPORTANT: You need to download your service account key from Firebase Console
// Place it in this directory and name it serviceAccountKey.json
// NEVER commit this file to git!

// Check if service account key exists
if (!fs.existsSync('./serviceAccountKey.json')) {
  console.error('❌ ERROR: serviceAccountKey.json not found!');
  console.log('\nTo get your service account key:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save the downloaded file as serviceAccountKey.json in this directory');
  console.log('4. Add serviceAccountKey.json to .gitignore!');
  process.exit(1);
}

const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to get your admin UID
async function getAdminUID() {
  try {
    const user = await admin.auth().getUserByEmail('jeffreyverlynjohnson@gmail.com');
    return user.uid;
  } catch (error) {
    console.error('Could not find admin user:', error.message);
    return null;
  }
}

// Import function with proper Firestore timestamps
async function importCollection(collectionName, dataFile) {
  console.log(`\n📁 Importing ${collectionName}...`);

  try {
    const rawData = fs.readFileSync(dataFile);
    const documents = JSON.parse(rawData);

    // Get admin UID for announcements
    const adminUID = await getAdminUID();

    for (const doc of documents) {
      // Convert timestamp objects to Firestore Timestamps
      const processedDoc = Object.entries(doc).reduce((acc, [key, value]) => {
        if (value && typeof value === 'object' && '_seconds' in value) {
          // Convert to Firestore Timestamp
          acc[key] = admin.firestore.Timestamp.fromMillis(value._seconds * 1000);
        } else if (key === 'createdBy' && value === 'ADMIN_UID_PLACEHOLDER' && adminUID) {
          // Replace placeholder with actual admin UID
          acc[key] = adminUID;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Determine document ID
      let docId;
      if (collectionName === 'admins' && adminUID) {
        docId = adminUID; // Use Firebase Auth UID for admin document
      } else if (doc.id) {
        docId = doc.id; // Use provided ID (e.g., for programs)
      } else if (doc.email) {
        docId = doc.email; // Use email as ID (fallback for admins)
      } else {
        // Let Firestore auto-generate ID
        await db.collection(collectionName).add(processedDoc);
        console.log(`  ✅ Added document to ${collectionName}`);
        continue;
      }

      // Set document with specific ID
      await db.collection(collectionName).doc(docId).set(processedDoc);
      console.log(`  ✅ Added document: ${docId}`);
    }

    console.log(`✨ ${collectionName} import complete!`);
  } catch (error) {
    console.error(`❌ Error importing ${collectionName}:`, error.message);
  }
}

// Main import function
async function importAll() {
  console.log('🚀 Starting Firebase data import...\n');

  // Import collections in order
  await importCollection('admins', './admins-data.json');
  await importCollection('programs', './programs-data.json');
  await importCollection('announcements', './announcements-data.json');

  console.log('\n🎉 All imports complete!');
  console.log('\n📌 Next steps:');
  console.log('1. Visit your app and sign in with jeffreyverlynjohnson@gmail.com');
  console.log('2. Click your avatar → Admin Panel');
  console.log('3. Test creating a registration from the parent portal');

  process.exit(0);
}

// Run the import
importAll().catch(console.error);
