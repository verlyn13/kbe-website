# Firebase Admin Setup Guide

## Current Implementation

The app uses a hybrid approach:

1. **Temporary email whitelist** in `/src/hooks/use-admin.tsx` for quick development
2. **Firestore admins collection** for production

## Database is Now Created!

With your Firestore database now set up, here's how to configure admin access:

## Step 1: Create Your Admin Record in Firestore

1. **Get your User UID:**
   - Go to Firebase Console → Authentication
   - Find `jeffreyverlynjohnson@gmail.com`
   - Copy the User UID (looks like: `AbCdEfGhIjKlMnOpQrStUvWxYz`)

2. **Create admin document:**
   - Go to Firestore Database
   - Click "+ Start collection"
   - Collection ID: `admins`
   - Document ID: [paste your User UID]
   - Add fields:
     ```
     email: "jeffreyverlynjohnson@gmail.com" (string)
     role: "superAdmin" (string)
     permissions: ["all"] (array)
     createdAt: (click clock icon for server timestamp)
     name: "Jeffrey Johnson" (string)
     ```
   - Click "Save"

## Step 2: Verify Admin Access

1. Sign out and sign back in
2. You should see "Admin Panel" in your user dropdown
3. The app will check both the temporary email list AND Firestore

## Production Setup Options

### Option 1: Custom Claims (Advanced)

1. **Create a Cloud Function to set admin claims:**

```typescript
// functions/src/admin.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const setAdminRole = functions.https.onCall(async (data, context) => {
  // Check if request is made by an existing admin
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can create other admins'
    );
  }

  const { userId, role } = data;

  // Set custom claims
  await admin.auth().setCustomUserClaims(userId, {
    admin: true,
    role: role || 'admin',
  });

  // Also create Firestore record for additional data
  await admin
    .firestore()
    .collection('admins')
    .doc(userId)
    .set({
      email: (await admin.auth().getUser(userId)).email,
      role: role || 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid,
    });

  return { success: true };
});
```

2. **Initial admin setup (run once locally):**

```typescript
// scripts/setup-first-admin.js
const admin = require('firebase-admin');
admin.initializeApp();

async function setupFirstAdmin() {
  const email = 'jeffreyverlynjohnson@gmail.com';
  const user = await admin.auth().getUserByEmail(email);

  await admin.auth().setCustomUserClaims(user.uid, {
    admin: true,
    role: 'superAdmin',
  });

  console.log(`Admin role set for ${email}`);
}

setupFirstAdmin();
```

### Option 2: Firestore Collection

1. **Create admins collection in Firestore Console:**
   - Go to Firestore Database
   - Create collection: `admins`
   - Add document with ID = user's UID
   - Fields:
     ```
     email: "jeffreyverlynjohnson@gmail.com"
     role: "superAdmin"
     permissions: ["all"]
     createdAt: [timestamp]
     ```

2. **Update Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin collection - read own record only
    match /admins/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Server-side only
    }

    // Check if user is admin
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.admin == true ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    // Protected collections
    match /registrations/{document} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }

    match /announcements/{document} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```

### Option 3: Using Firebase Console UI

For simple admin management:

1. **Firebase Authentication > Users**
   - Find user by email
   - Copy their UID

2. **Firestore Database**
   - Create `admins` collection
   - Add document:
     - Document ID: [paste UID]
     - Fields: email, role, permissions

3. **Update the app code:**

```typescript
// src/lib/firebase-admin.ts
export const adminService = {
  async checkAdminRole(userId: string): Promise<AdminUser | null> {
    try {
      const doc = await getDoc(doc(db, 'admins', userId));
      if (doc.exists()) {
        return { id: doc.id, ...doc.data() } as AdminUser;
      }
      return null;
    } catch (error) {
      console.error('Error checking admin role:', error);
      return null;
    }
  },
};
```

## Security Best Practices

1. **Never expose admin creation to client-side code**
2. **Use Security Rules to protect admin-only operations**
3. **Log all admin actions for audit trail**
4. **Implement role-based permissions (superAdmin, admin, viewer)**
5. **Regular security audits of admin list**

## Migration Steps

1. Choose your approach (Custom Claims recommended)
2. Set up initial admin(s) via server-side script
3. Remove TEMP_ADMIN_EMAILS from code
4. Update `use-admin.tsx` to only check Firebase
5. Test thoroughly before deploying
