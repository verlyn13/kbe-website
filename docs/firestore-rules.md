# Firestore Security Rules

## Instructions

Copy and paste these rules into your Firebase Console:

1. Go to Firebase Console → Firestore Database
2. Click on "Rules" tab
3. Replace the existing rules with the content below
4. Click "Publish"

## Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    // Admins collection - only admins can read/write
    match /admins/{adminId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Announcements collection
    match /announcements/{announcementId} {
      allow read: if request.auth != null;
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Hidden announcements collection
    match /hiddenAnnouncements/{userId}/userHidden/{announcementId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }

    // User profiles collection
    match /profiles/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId) || isAdmin();
    }

    // Activity logs collection
    match /activityLogs/{logId} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update: if false; // Logs should never be updated
      allow delete: if false; // Logs should never be deleted
    }

    // Default deny all
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Rule Explanations

- **Admins**: Only admins can read/write admin documents
- **Announcements**: All authenticated users can read, only admins can create/update/delete
- **Hidden Announcements**: Users can only access their own hidden announcements
- **Profiles**: Users can read/write their own profile, admins can read all profiles
- **Activity Logs**: Only admins can read, any authenticated user can create (for tracking), no updates/deletes allowed
- **Default**: Deny all access to any unmatched paths

## Testing Rules

After publishing, test the rules:

1. Sign in as a regular user and try to access your profile
2. Sign in as an admin and verify you can create announcements
3. Check that hidden announcements are properly isolated per user
