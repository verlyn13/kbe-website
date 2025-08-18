# Firebase Setup Guide

## Initial Setup

### 1. Firebase Console Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (kbe-website)
3. Enable the following services:
   - **Authentication** (Settings > Sign-in method)
     - Email/Password
     - Google (optional)
   - **Firestore Database**
     - Create database in production mode
     - Choose your preferred location

### 2. Firestore Security Rules

In Firebase Console > Firestore Database > Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to create registrations
    match /registrations/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.token.admin == true || request.auth.uid == resource.data.parentId);
    }
    
    // Admin-only collections
    match /admins/{document=**} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if false; // Only through Admin SDK
    }
    
    match /announcements/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /programs/{document=**} {
      allow read: if true; // Public can view programs
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /attendance/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### 3. Create Initial Collections

In Firestore, create these collections (you can add a dummy document to create them):

1. `users` - Parent user profiles
2. `registrations` - Student registrations
3. `admins` - Admin user records
4. `announcements` - Communication records
5. `programs` - Program information
6. `attendance` - Attendance records

### 4. Set Up Admin Users

#### Method 1: Using Firebase Console (Easiest)

1. **Create Admin Users in Auth**:
   - Go to Authentication > Users
   - Click "Add user"
   - Enter admin email and password
   - Note the User UID

2. **Add Admin Records in Firestore**:
   - Go to Firestore Database
   - Navigate to `admins` collection
   - Click "Add document"
   - Document ID: Use the User UID from step 1
   - Add fields:
     ```json
     {
       "email": "admin@example.com",
       "name": "Admin Name",
       "role": "superAdmin",
       "permissions": ["all"],
       "createdAt": [timestamp]
     }
     ```

#### Method 2: Using Admin SDK Script

1. **Get Service Account Key**:
   - Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely (don't commit it!)

2. **Run Setup Script**:
   ```bash
   # Set environment variable
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
   
   # Install firebase-admin
   npm install -g firebase-admin
   
   # Update the admin emails in scripts/setup-admin.js
   # Then run:
   node scripts/setup-admin.js
   ```

### 5. Configure MathCounts Program

In Firestore, add a document to the `programs` collection:

Document ID: `mathcounts-2025`

```json
{
  "name": "MathCounts 2025",
  "description": "National mathematics competition program for middle school students",
  "schedule": {
    "regularMeeting": {
      "day": "Tuesday",
      "time": "4:00-5:30 PM",
      "location": "Homer Middle School, Room 203"
    },
    "startDate": "2025-09-09T00:00:00.000Z",
    "endDate": "2025-03-31T00:00:00.000Z",
    "exceptions": []
  },
  "capacity": {
    "max": 30,
    "current": 0,
    "waitlistEnabled": true
  },
  "status": "registration-open",
  "grades": "4-8"
}
```

## Environment Variables

Create `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## API Key Restrictions

In Google Cloud Console:
1. Go to APIs & Services > Credentials
2. Find your Firebase API key
3. Click to edit
4. Under "API restrictions", select "Restrict key"
5. Add these APIs:
   - Identity Toolkit API
   - Token Service API
   - Firebase Installations API
   - Cloud Firestore API

## Testing Admin Access

1. Register/login with your admin email
2. Navigate to `/admin`
3. You should see the admin dashboard

## Troubleshooting

### "Permission Denied" Errors
- Check Firestore security rules
- Ensure admin record exists in `admins` collection
- Verify the user UID matches between Auth and Firestore

### Can't Access Admin Panel
- Check browser console for errors
- Verify admin record has correct structure
- Try logging out and back in

### Registration Not Working
- Check Firestore rules allow authenticated users to write
- Verify all required fields are being sent
- Check browser console for specific errors